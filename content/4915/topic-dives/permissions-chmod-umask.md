---
id: 4915-topic-permissions-chmod-umask
title: Permissions + chmod + umask
pillar: tech
priority: high
chapter: Mod02 Ch6-7
source: "Mod02 Ch6-7; materials/past-exams/midterm.md Q16, Q32"
tags:
  - permissions
  - fundamentals
related: [4915-topic-inode-hard-vs-soft-links, 4915-topic-etc-passwd-etc-shadow-user-mgmt]
---

10-char ls display: `[type][u][g][o]`. Each rwx triplet = 3 bits. Read=4, write=2, exec=1.

For files: r=view, w=modify, x=run. For dirs: r=list, w=create/delete, x=enter/traverse.

Special bits: 4000 setuid, 2000 setgid, 1000 sticky.

```bash
chmod 755 file       # numeric
chmod u+rwx,g-w file # symbolic
chmod -R 644 dir     # recursive
chown user:group file
chown -R u /path     # capital -R (NOT -r); midterm Q16 trap
```

umask subtracts from defaults. `umask 022` → files 644 (666 & ~022), dirs 755 (777 & ~022).

Symlink permissions *always* show `lrwxrwxrwx`. Permissions of target apply. (Midterm Q32.)

> **Pitfall**
>
> `chmod 755 file` sets permissions absolutely — any previous bits for group/other write are wiped. `chmod +x file` adds only the execute bit, leaving everything else as-is. They're not interchangeable: pick `775` / `+x` based on whether you want to start fresh or tweak.

> **Example** — umask 027 → what are new file and directory perms?
>
> 1. File default mode: **666** (rw-rw-rw-). Directory default: **777** (rwxrwxrwx).
> 2. umask 027 in binary: `000 010 111` — masks write for group, all three bits for other.
> 3. File perms = 666 AND NOT 027 = 666 & ~027 = **640** (rw-r-----).
> 4. Dir perms  = 777 AND NOT 027 = 777 & ~027 = **750** (rwxr-x---).
> 5. Verify the file: `umask 027; touch t.txt; ls -l t.txt` → `-rw-r----- 1 user user ... t.txt`.
> 6. Verify the dir: `mkdir td; ls -ld td` → `drwxr-x--- 2 user user ... td`.
> 7. Why it matters: umask is subtractive — there is no way to *add* an execute bit with umask, so new files never start out executable (you always need a `chmod +x` after).

> **Takeaway**: Three bits × three roles = 9 permission bits, plus the type char. `chmod` sets absolute (`755`) or relative (`+x`). Umask subtracts from defaults (file 666, dir 777). setuid/setgid run the program as the *file's* owner/group, not the caller's — which is why `/usr/bin/passwd` can touch `/etc/shadow`.
