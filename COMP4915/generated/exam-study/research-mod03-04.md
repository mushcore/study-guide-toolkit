# Mod03-04 Research (Networking + Bash)

## Summaries
- **Networking**: TCP/IP, DNS, NFS/NIS/SMB, remote tools (ssh/scp/sftp replacing insecure rlogin/rsh/rcp/telnet)
- **Bash**: command interpreter + programming language. Based on Bourne sh, with ksh and csh features
- **Startup files**: login shell reads /etc/profile → ~/.bash_profile → ~/.bash_login → ~/.profile; non-login reads ~/.bashrc only
- **Processes**: program on disk; process in memory with PID. fork() creates child.

## Special parameters (INSTRUCTOR EMPHASIS)
| Param | Meaning |
|---|---|
| `$0` | Name of script/shell |
| `$1`-`$9` | Positional args 1-9 |
| `${10}+` | Args 10+, need braces |
| `$#` | Count of positional args |
| `$@` | All args, quoted "$@" → "$1" "$2" separate |
| `$*` | All args, quoted "$*" → "$1 $2" single string |
| `$?` | Exit status of last command (0=success) |
| `$$` | PID of current shell |
| `$!` | PID of last background process |
| `$_` | Last arg of previous command |
| `$-` | Current shell options |

Cloze drill: `$# = {{arg count}}`, `$? = {{exit status}}`, `$$ = {{shell PID}}`, `$! = {{bg PID}}`, `$@ = {{all args (quoted: each separate)}}`, `$* = {{all args (quoted: one string)}}`

## Expansion order (8 steps) — INSTRUCTOR: "all fair game"
1. Brace `{a,b}` → a b
2. Tilde `~`, `~user`
3. Parameter `$var`, `${var:-default}`
4. Arithmetic `$((expr))` `$[expr]`
5. Command `$(cmd)` or backticks
6. Word splitting (IFS, only on unquoted results)
7. Pathname/glob `*`, `?`, `[]`
8. Process substitution `<(cmd)` `>(cmd)` (bash)

## Command precedence (INSTRUCTOR EMPHASIS)
When bash resolves a name:
1. **Aliases**
2. **Keywords** (if, while, for, [[, {)
3. **Functions**
4. **Builtins** (echo, cd, test, read)
5. **$PATH search** (external programs)

Use `command name` to skip alias/function; `builtin name` for builtin; absolute path for external.

## Quoting rules
- Single `' '` — LITERAL, no expansion
- Double `" "` — expands $var, $(cmd), `cmd`; NOT globs, NOT word split
- Backtick / $() — command substitution
- `\` — escape single char (continues line at EOL)

## Startup file order
**Login shell** (ssh, `bash -l`, console login):
1. `/etc/profile` (system)
2. First existing of: `~/.bash_profile` → `~/.bash_login` → `~/.profile`

**Non-login interactive**:
- `~/.bashrc`

**Non-login non-interactive**:
- File in `$BASH_ENV`

## Variable types
- Local: `name=value` — current shell only
- Environment: `export name=value` or `declare -x name=value` — inherited by children
- Read-only: `declare -r name`
- Integer: `declare -i x=5`
- Array: `a=(x y z)`, access `${a[0]}`, all `${a[@]}`

## IFS
- Default: space, tab, newline
- Word-splits UNQUOTED variable expansions only
- `IFS=:` then `for x in $PATH; do` splits on colons

## Networking (Mod03)
- TCP = connection, reliable, ordered; UDP = connectionless, best-effort
- `/etc/hosts` — local static name→IP
- `/etc/resolv.conf` — DNS servers
- `/etc/nsswitch.conf` — resolution order (files dns nis)
- DNS: client/server, distributed DB, caching (default 1hr TTL)
- Record types: A (IPv4), AAAA (IPv6), MX (mail), CNAME (alias), NS (nameserver), PTR (reverse), SOA (authority), TXT
- Hostname: `odyssey` short, `odyssey.infosys.bcit.ca` FQDN

## R-commands (INSECURE — replaced by SSH)
- rlogin, rsh, rcp: cleartext, .rhosts spoofable. DO NOT use on internet.
- telnet: cleartext too
- Replacements: ssh, sftp, scp

## Services
- portmap/rpcbind port 111 — maps RPC prog → TCP/UDP port. Required by NFS/NIS
- /etc/services — service name ↔ port/protocol mapping
- inetd/xinetd — super-daemon; spawns service on connect
- TCP wrappers: /etc/hosts.allow checked first (ALLOW if match), else /etc/hosts.deny (DENY if match), else default allow

## Job control
- `cmd &` run in background
- Ctrl+Z suspend foreground
- `jobs` list
- `fg %n` foreground
- `bg %n` background
- `nohup cmd &` survives logout

## Pipes and process sub
- `|` stdout → stdin
- `diff <(sort a) <(sort b)` — process substitution, no temp files

## Flashcards (25)

1. **Q:** `$#` meaning?  **A:** Number of positional parameters. [Mod04 special params]
2. **Q:** `$?` meaning?  **A:** Exit status of last command (0=success, non-zero=error). [Mod04]
3. **Q:** `$$` meaning?  **A:** PID of current shell. [Mod04]
4. **Q:** `$!` meaning?  **A:** PID of most recent background command. [Mod04]
5. **Q:** Difference `$@` vs `$*` quoted?  **A:** `"$@"` expands to separate words per arg; `"$*"` expands to single string with args joined by IFS. [Mod04]
6. **Q:** 8-step expansion order?  **A:** Brace, tilde, parameter, arithmetic, command, word split, pathname, process sub. [Mod04]
7. **Q:** Command precedence order?  **A:** Alias → keyword → function → builtin → $PATH. [instructor emphasis]
8. **Q:** Single vs double quotes?  **A:** Single = literal; double = allows $, $(), but not globs. [Mod04]
9. **Q:** `echo '$HOME'`?  **A:** `$HOME` literal. [midterm Q47]
10. **Q:** What file has login shell env for all users?  **A:** `/etc/profile`. [Mod04]
11. **Q:** Default IFS?  **A:** space, tab, newline. [Mod04]
12. **Q:** How does the shell run a background command?  **A:** Append `&` to command. [midterm Q12]
13. **Q:** `ssh` purpose?  **A:** Connect to remote system and run programs over encrypted channel. [midterm Q13]
14. **Q:** Which is secure for file transfer?  **A:** sftp (not ftp, not rsh). [midterm Q1]
15. **Q:** What service mounts Linux partitions on Linux-only network?  **A:** NFS. [midterm Q19, sample Q6]
16. **Q:** /etc/hosts.deny contains?  **A:** Hosts denied access to network services. [midterm Q11]
17. **Q:** What forwards a port through encrypted connection?  **A:** ssh (with -L/-R). [midterm Q3]
18. **Q:** daemon managing DNS?  **A:** named (BIND). [midterm Q28]
19. **Q:** FQDN example: `odyssey.infosys.bcit.ca` — what's it?  **A:** Fully qualified hostname. [midterm Q30]
20. **Q:** `fg %2` purpose?  **A:** Bring job number 2 to foreground. [sample Q14]
21. **Q:** cloze: pipe connects stdout of one process to {{stdin of another}}.  [Mod01]
22. **Q:** what does `who | sort | lpr` `sort` act as?  **A:** A filter. [sample Q18]
23. **Q:** `export VAR=value` purpose?  **A:** Make VAR visible to child processes. [Mod04]
24. **Q:** Ctrl+D at shell?  **A:** End of input / exit shell. [midterm Q15]
25. **Q:** What command changes login shell?  **A:** `chsh`. [midterm Q33]

## Exam traps
- `$*` vs `$@` quoted — flatten vs preserve
- Alias shadows function shadows builtin — use `command`/`builtin`/full path to bypass
- Subshell `()` doesn't modify parent variables; sourced `. file` does
- `grep *` unquoted — globbing consumes args
- Startup file order: .bash_profile STOPS chain; don't put both .bash_profile and .bash_login
- `export` needed for children; plain assign is local

## Practice questions

**MCQ 1**: Which variable contains number of args to a script?
A) $* B) $& C) $# D) $! E) $$
**Answer**: C. [Quiz 3 Q3]

**MCQ 2**: A pipe connects:
A) stdin to stdout B) stdout of cmd1 to stdin of cmd2 C) stderr to stdout D) two files
**Answer**: B.

**T/F 3**: `echo '$person'` (person=jenny) outputs `jenny`.
**Answer**: F. Single quotes literal → outputs `$person`. [midterm Q47]

**Short 4**: Write command to display value of variable myvar.
**Answer**: `echo $myvar` or `echo "$myvar"`.

**Essay 5**: Explain expansion order with example `echo ~/file_{a,b}.txt` given HOME=/home/u.
**Model**: Brace first → `~/file_a.txt ~/file_b.txt`. Tilde second → `/home/u/file_a.txt /home/u/file_b.txt`. Parameter/arithmetic/command next (none here). Word split/glob last (none match). Final output: `/home/u/file_a.txt /home/u/file_b.txt`.
