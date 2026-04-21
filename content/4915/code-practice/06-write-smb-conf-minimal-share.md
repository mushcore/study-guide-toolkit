---
"n": 6
id: 4915-code-write-smb-conf-minimal-share
title: Write smb.conf minimal share
lang: bash
variant: starter-solution
tags:
  - linux
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

Section header in \[brackets\]. Required: path, writable. browseable makes it visible in network browser. guest ok=no forces user auth. Test with `testparm`.
