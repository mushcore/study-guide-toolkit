---
n: 13
id: 4915-code-ssh-tunnel-local-vs-remote-forward
title: "SSH tunneling — local vs remote forward"
lang: bash
tags: [ssh, networking, tunneling]
source: "materials/past-exams/midterm.md Q34; materials/labs/Lab6.pdf; Mod06 Ch18"
pedagogy: worked-example-first
---

## Prompt

A PostgreSQL database runs on `db.internal:5432` inside a private network. You cannot reach `db.internal` directly from your laptop, but you can SSH to `bastion.example.com` (on the same private network as db.internal). Write the SSH command that makes `localhost:5432` on your laptop transparently tunnel to `db.internal:5432` through the bastion.

Sketch the packet path so you can see which side of the tunnel evaluates the destination hostname.

## Starter

```bash
# Topology:
#
#   Laptop (you)            Bastion (gateway)          Private network
#   ─────────────           ─────────────────          ────────────────
#   localhost:5432          ??? encrypted tunnel ???   db.internal:5432
#
# Your task: write the ssh -L command, then describe which
# host resolves "db.internal".

ssh ___:___:___ ___@___
```

## Solution

```bash
# ssh -L <local_port>:<remote_host>:<remote_port> <user>@<gateway>
ssh -L 5432:db.internal:5432 user@bastion.example.com

# Packet path:
#   app → laptop:5432 (local listener) --encrypted--> bastion
#                                                     │
#                                                     └─> db.internal:5432
#
# The "db.internal" in the -L argument is resolved by the bastion,
# not by your laptop. That's why the tunnel works even though your
# laptop's DNS cannot resolve db.internal.
```

## Why

**Source**: `materials/past-exams/midterm.md Q34`, `materials/labs/Lab6.pdf`, `Mod06 Ch18`.

**Mechanism**. `-L local_port:remote_host:remote_port` creates a *local* forward. Your laptop binds `local_port` on 127.0.0.1 and accepts connections. Anything the laptop receives on that port is wrapped in the SSH session and unwrapped at the bastion, which then opens a plain TCP connection to `remote_host:remote_port` *from the bastion's perspective*. That last detail is why you can tunnel to hosts only the bastion can reach.

Contrast with `-R` (remote forward): bastion listens, laptop forwards. Use `-L` when you need to *reach* an inside service from outside; use `-R` when you need to *expose* a local service to the inside.

**Common wrong approach**. Writing `ssh -L db.internal:5432:5432 user@bastion` — the argument order is `local_port:remote_host:remote_port`, not `remote_host:local_port:remote_port`. The parser accepts the first field as a port number; a hostname there is a syntax error. Another common mistake: assuming your laptop resolves `db.internal` via its own DNS. It does not — the bastion does.
