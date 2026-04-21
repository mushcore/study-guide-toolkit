---
id: 4915-topic-permissions-chmod-umask
title: Permissions + chmod + umask
pillar: tech
priority: high
chapter: Mod02 Ch6-7
tags:
  - permissions
  - fundamentals
---

10-char ls display: `[type][u][g][o]`. Each rwx triplet = 3 bits. Read=4, write=2, exec=1.

For files: r=view, w=modify, x=run. For dirs: r=list, w=create/delete, x=enter/traverse.

Special bits: 4000 setuid, 2000 setgid, 1000 sticky.

```bash
chmod 755 file       # numeric
chmod u+rwx,g-w file # symbolic
chmod -R 644 dir     # recursive
chown user:group file
chown -R u /path     # instructor: -R not -r (midterm Q16)
```

umask subtracts from defaults. `umask 022` → files 644 (666 & ~022), dirs 755 (777 & ~022).

Symlink permissions *always* show `lrwxrwxrwx`. Permissions of target apply. (Midterm Q32.)
