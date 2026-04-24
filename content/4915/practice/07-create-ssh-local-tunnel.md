---
"n": 7
id: 4915-code-create-ssh-local-tunnel
title: Create SSH local tunnel
lang: bash
variant: starter-solution
tags:
  - networking
source: "Mod06 Ch18; materials/labs/Lab6.pdf"
kind: code
---

## Prompt

You need to access postgres on db.internal:5432, but only bastion.example.com is reachable from outside. Write the ssh command to forward local port 5432 through bastion.

## Starter

```bash
# your ssh command
```

## Solution

```bash
ssh -L 5432:db.internal:5432 user@bastion.example.com
```

## Why

**Source**: Mod06 Ch18 + Lab 6. `-L local_port:remote_host:remote_port`. psql then connects to `localhost:5432` which traverses the SSH tunnel to db.internal:5432 via bastion. Add `-N -f` to background without shell. Common wrong: swapping `-L` for `-R` — `-R` makes the *bastion* listen and forwards back to your laptop, which is the opposite direction and exposes your host instead of reaching the DB.
