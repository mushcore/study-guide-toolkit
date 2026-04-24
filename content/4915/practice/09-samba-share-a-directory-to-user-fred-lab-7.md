---
"n": 9
id: 4915-code-samba-share-a-directory-to-user-fred-lab-7
title: "Samba: share a directory to user fred (Lab 7)"
lang: bash
variant: starter-solution
tags:
  - networking
source: "Mod07 Ch23; materials/labs/Lab7.pdf"
kind: code
---

## Prompt

Write a minimal `smb.conf` exposing `/srv/public` as a share `[public]`, writable, only user `fred` allowed. Then list the exact commands to create fred as a Samba user.

## Starter

```bash
# /etc/samba/smb.conf:

# user creation commands:
```

## Solution

```bash
# /etc/samba/smb.conf
[global]
  workgroup = WORKGROUP
  security  = user

[public]
  path = /srv/public
  browseable = yes
  writable = yes
  guest ok = no
  valid users = fred

# user creation
sudo useradd fred
sudo smbpasswd -a fred
sudo testparm
sudo systemctl enable --now smb nmb
```

## Why

Grading: global section present with security=user (1), share section name in brackets (1), path + writable + guest ok=no (1), useradd AND smbpasswd -a (2 — common trap: one without the other), testparm before restart (1).
