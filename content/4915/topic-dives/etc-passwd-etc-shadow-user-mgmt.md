---
id: 4915-topic-etc-passwd-etc-shadow-user-mgmt
title: /etc/passwd + /etc/shadow + user mgmt
pillar: tech
priority: med
chapter: Mod05 Ch11
source: "Mod05 Ch11; materials/labs/Lab5.doc"
tags:
  - sysadmin
related: [4915-topic-permissions-chmod-umask, 4915-topic-boot-sequence-run-levels-memorize, 4915-topic-nis-ldap]
---

Lab-5 scenario: you SSH into the lab VM, run `useradd -m alice`, then `passwd alice` and set a password. Now check what actually happened on disk: `grep alice /etc/passwd` shows `alice:x:1001:1001::/home/alice:/bin/bash` — metadata only, with `x` in the password slot. `sudo grep alice /etc/shadow` shows `alice:$6$...sha512hash...:19834:0:99999:7:::` — the real hashed password, in a root-only (0600) file. That two-file split is what this dive explains.

`/etc/passwd` (world-readable) — 7 colon fields:

`username:x:UID:GID:GECOS:home:shell`

`/etc/shadow` (root only, 600) — 9 fields:

`user:hash:last_change:min:max:warn:inactive:expire:reserved`

Password hash prefix: `$1$`\=MD5, `$5$`\=SHA256, `$6$`\=SHA512. `!` or `*` = locked.

```bash
useradd -m alice          # create with home dir
usermod -aG wheel alice   # add to supplementary group
userdel -r alice          # remove user + home
passwd alice              # change pw
passwd -l alice           # lock
chage -M 90 alice         # max pw age 90 days
chage -d 0 alice          # force change on next login
groupadd dev; groupdel dev
```

umask 022 default: files 644, dirs 755.

> **Pitfall**
>
> `/etc/passwd` used to hold hashed passwords (the second field). It still exists for compatibility, but on modern systems the field contains `x` — the real hash lives in `/etc/shadow` at mode 0600. Forgetting the `x` convention leads to `passwd` commands appearing to succeed while auth silently breaks.

> **Example** — create user `bob`, set password, lock, inspect on disk
>
> 1. `sudo useradd -m -s /bin/bash bob` — creates UID/GID (next free, say 1002), makes `/home/bob`, sets login shell. Adds `bob:x:1002:1002::/home/bob:/bin/bash` to `/etc/passwd`.
> 2. `sudo passwd bob` → enter password. libpam/libcrypt hash with SHA-512 and write `bob:$6$<salt>$<hash>:...` into `/etc/shadow`. `/etc/passwd` is unchanged (the `x` stays).
> 3. Verify world-readable split: `ls -l /etc/passwd /etc/shadow` → `-rw-r--r-- root root ... /etc/passwd` (mode 644) and `-rw------- root root ... /etc/shadow` (mode 600). Only root can read the hash.
> 4. Lock the account: `sudo passwd -l bob`. Inspect: `sudo grep bob /etc/shadow` now starts with `bob:!$6$...` — the leading `!` disables password-based auth without deleting the hash.
> 5. Unlock: `sudo passwd -u bob` — strips the `!`. Login works again.
> 6. Force next-login password change: `sudo chage -d 0 bob` — sets last-change field to 0, so PAM demands a change on next login.
> 7. Delete: `sudo userdel -r bob` — removes the `/etc/passwd` + `/etc/shadow` entries AND `/home/bob`. Without `-r`, home stays.

> **Q:** Which file holds the hashed password?
>
> **A:** `/etc/shadow` — mode 0600, root-only. `/etc/passwd` keeps a literal `x` in the password field so legacy tools still parse it, but the real hash (prefixed `$6$` for SHA-512) lives in `/etc/shadow`. Separating the two lets the world read account metadata (uid, home, shell) without leaking password hashes to every user.

> **Takeaway**: `/etc/passwd` is world-readable and holds the account metadata; `/etc/shadow` is 0600 root-only and holds the hashed password. That split is a security boundary — programs that need to look up a name use passwd; only authentication code ever touches shadow.
