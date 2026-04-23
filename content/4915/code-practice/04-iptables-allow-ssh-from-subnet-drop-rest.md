---
"n": 4
id: 4915-code-iptables-allow-ssh-from-subnet-drop-rest
title: "iptables: allow SSH from subnet, drop rest"
lang: bash
variant: starter-solution
tags:
  - networking
source: "Mod08 Ch25; materials/labs/Lab8.pdf"
---

## Prompt

Write iptables commands to (1) allow established connections, (2) allow SSH only from 10.0.0.0/8, (3) drop all other inbound.

## Starter

```bash
# INPUT chain rules
iptables -F INPUT
# your rules
```

## Solution

```bash
iptables -F INPUT
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -s 10.0.0.0/8 -j ACCEPT
iptables -A INPUT -j DROP
```

## Why

**Source**: Mod08 Ch25 + Lab 8. Allow loopback, allow ESTABLISHED (so responses work), allow SSH from subnet only, DROP everything else. Order matters — rules evaluated top-down; the SSH allow must *precede* the terminal `-j DROP`. Common wrong: writing `-A` after `-P INPUT DROP` without an explicit allow — the default DROP catches the SSH packet and you lock yourself out.
