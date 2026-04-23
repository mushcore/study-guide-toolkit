---
"n": 6
id: 4915-code-write-smb-conf-minimal-share
title: Write smb.conf minimal share
lang: bash
variant: starter-solution
tags:
  - linux
source: "Mod07 Ch23; materials/labs/Lab7.pdf"
---

## Prompt

Write a minimal smb.conf that exposes /srv/public as share name 'public', writable, guest not allowed.

## Starter

```bash
[global]
  workgroup = WORKGROUP
  security  = user

# add share section
```

## Solution

```bash
[global]
  workgroup = WORKGROUP
  security  = user

[public]
  path = /srv/public
  browseable = yes
  writable = yes
  guest ok = no
```

## Why

**Source**: Mod07 Ch23 + Lab 7. Section header in \[brackets\]. Required: path, writable. browseable makes it visible in network browser. guest ok=no forces user auth. Test with `testparm`. Common wrong: omitting the `[public]` section header and dropping share directives under `[global]` — samba silently treats them as global options and the share never appears in `smbclient -L`.
