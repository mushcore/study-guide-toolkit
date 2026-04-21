---
id: 4915-topic-etc-passwd-etc-shadow-user-mgmt
title: /etc/passwd + /etc/shadow + user mgmt
pillar: tech
priority: med
chapter: Mod05 Ch11
tags:
  - sysadmin
---

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
