---
id: api-security-best-practices
title: "API security vulnerabilities — reference and exam patterns"
pillar: tech
priority: high
source: "Slide 12, ISAQuiz12"
bloom_levels: [understand, apply, analyze]
related: [httponly-cookies, jwt, sql-crud]
---

An API that reaches production with any one of these eight vulnerabilities open is not a question of if it will be exploited, but when. OWASP documents these patterns because they recur across every tech stack. Each vulnerability has a specific mechanism that enables it — knowing the mechanism tells you exactly what the fix must address.

## Vulnerability reference table

| # | Vulnerability | Root cause | Canonical prevention |
|---|---|---|---|
| 1 | Broken User Authentication | Weak passwords, missing session timeouts, improper token handling, no brute force protection | MFA, session timeout, rate limiting + account lockout on login endpoints, bcrypt password storage |
| 2 | Excessive Data Exposure | API returns more data than requested; client-side filtering used instead of server-side filtering | Server-side payload filtering; cherry-pick fields instead of returning raw objects; generic error messages |
| 3 | Lack of Resources / Rate Limiting | No constraints on request volume or payload size per client | Rate limiting at IP, account, and app level (`express-rate-limit`); request payload validation |
| 4 | Broken Function Level Authorization | Server executes privileged functions without checking caller's role | Role check before every privileged operation (`req.user.role !== 'admin'`) |
| 5 | Broken Object-Level Authorization (BOLA) | Server checks authentication but not whether the caller owns the specific object | Object-level ACLs + RBAC; verify ownership at the object level, not just the user level |
| 6 | Mass Assignment | Raw request body passed directly to model update, allowing attacker to set arbitrary properties | Whitelist accepted fields; never pass `req.body` directly to a model |
| 7 | Security Misconfiguration | Default credentials, hardcoded secrets, verbose error messages exposed to clients | Secrets in env vars; disable unused services; generic error responses; no hardcoded keys |
| 8 | Injection (SQL, NoSQL, Command) | User input concatenated directly into a query or command string | Parameterized queries with `?` placeholders; never interpolate user input into queries |

## ISAQuiz12 Q2 — the SQL injection pattern (exam fixture)

> **Example:**
>
> **Vulnerable code (template literal interpolation):**
> ```js
> const query = `UPDATE users SET email='${newEmail}' WHERE id=${userId}`;
> const result = database.query(query);
> ```
> `newEmail` value `' WHERE 1=1; DROP TABLE users; --` becomes literal SQL. The database executes it.
>
> **Fixed code (parameterized query):**
> ```js
> const query = 'UPDATE users SET email=? WHERE id=?';
> const result = database.query(query, [newEmail, userId]);
> ```
> The `?` placeholder tells the MySQL driver to pass `newEmail` and `userId` as bound data values. The driver escapes them — SQL syntax in the values never executes.
>
> ISAQuiz12 Q2 offered `.replace()` as a wrong answer. The `.replace()` approach strips single quotes but fails against hex encodings, multi-byte characters, and other bypass vectors. Only parameterized queries separate SQL structure from data at the protocol level.

## ISAQuiz12 Q7 — the hardcoded owner ID pattern (BOLA)

> **Example:**
>
> ```js
> function getResourceOwner(resourceId) {
>   // BUG: always returns the same hardcoded user, never looks up the real owner
>   return 'user123';
> }
>
> app.put('/update-profile/:userId', (req, res) => {
>   const owner = getResourceOwner(req.params.userId);
>   if (req.cookies.userId === owner) {
>     // allow the update
>   }
> });
> ```
> `getResourceOwner` always returns `'user123'`. A user with cookie `userId=user123` passes the check for every `userId` in the URL — including profiles they do not own. This is Broken Object-Level Authorization: the server authenticates the user but never checks whether that user owns the requested object.
>
> ISAQuiz12 Q7 confirmed the answer is BOLA — not Mass Assignment (which is about arbitrary property injection) and not SQL Injection (which is about query string manipulation).

**Pitfall:** `.replace()` is not a SQL injection fix. It strips specific characters but is bypassable with other encodings. Parameterized queries with `?` placeholders are the only reliable prevention. ISAQuiz12 Q2 and exam-strategy Pitfall 5 both confirm this.

**Pitfall:** ISAQuiz12 Q3 asked which option is NOT an example of Excessive Data Exposure. The correct answer was "filtering out and removing unnecessary details from Error Messages before displaying them to users" — because that is the PREVENTION. Returning detailed error messages with database schema IS an example of the vulnerability. Students who confuse the prevention with an example of the vulnerability lose the point.

**Takeaway:** Match each vulnerability to its mechanism: BOLA is about object ownership checks, not just authentication; mass assignment is about raw body passthrough; injection is about query string construction. On exams, read carefully — the trap is often a correct-sounding prevention offered as an example of the vulnerability, or a bypassed partial fix (`.replace()`) offered as a correct fix.
