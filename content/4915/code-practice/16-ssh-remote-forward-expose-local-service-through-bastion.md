---
n: 16
id: 4915-code-ssh-remote-forward-expose-local-service-through-bastion
title: "SSH remote forward — expose a local service through a bastion"
lang: bash
tags: [ssh, networking, tunneling]
source: "materials/labs/Lab6.pdf; materials/past-exams/midterm.md Q34; Mod06 Ch18"
pedagogy: worked-example-first
---

## Prompt

You are running a small webhook receiver on your laptop at `localhost:5000`. A teammate on the internal network needs to hit it from `bastion.example.com`, but your laptop is behind NAT and has no public address. You already have SSH access *to* the bastion.

Write the SSH command that makes `bastion.example.com:5000` forward back to your laptop's `localhost:5000`. Then describe the direction of the tunnel.

## Starter

```bash
# Topology:
#
#   Laptop (you, behind NAT)    Bastion (public)           Teammate
#   ─────────────────────       ──────────────────         ─────────
#   localhost:5000              bastion:5000 (listens) ←── curl bastion:5000
#
# Your task: write the ssh -R command, then describe
# which side does the listening.

ssh ___:___:___ ___@___
```

## Solution

```bash
# ssh -R <bastion_listen_port>:<laptop_target_host>:<laptop_target_port> <user>@<bastion>
ssh -R 5000:localhost:5000 user@bastion.example.com

# Packet path:
#   teammate → bastion:5000 (bastion's listener)
#           --encrypted back through the existing SSH session-->
#                                                   laptop
#                                                     │
#                                                     └─> localhost:5000 (your webhook)
#
# "localhost" in the -R argument is resolved on the LAPTOP,
# not on the bastion — it refers to the laptop's own loopback.
```

## Why

**Source**: `materials/labs/Lab6.pdf`, `materials/past-exams/midterm.md Q34`, `Mod06 Ch18`.

**Mechanism**. `-R bastion_port:target_host:target_port` creates a *remote* forward. The SSH *server* (bastion) binds `bastion_port` and accepts connections. Anything it receives is pushed back through the already-open SSH session to your laptop, which then opens a plain TCP connection to `target_host:target_port` *from the laptop's perspective*. That last detail — target resolution happens on the originating side — is the mirror of `-L`. In `-L`, the remote (bastion) resolves; in `-R`, the local (laptop) resolves.

This is how you expose a service from behind NAT without opening a port on your router. The outbound SSH session is the only connection your laptop initiates; the bastion reuses it in reverse.

By default OpenSSH binds the `-R` listener to `127.0.0.1` on the bastion, so only the bastion itself can reach the forwarded port. To let the teammate connect from a third machine, either connect *from* the bastion (`ssh user@bastion` then `curl localhost:5000`), or set `GatewayPorts yes` in the bastion's `sshd_config` and use `ssh -R 0.0.0.0:5000:localhost:5000 ...`.

**Common wrong approaches**:

- **Using `-L` instead of `-R`.** `-L` makes *your laptop* listen and forwards connections *out* to a remote host. That is the opposite direction — teammates still cannot reach you.
- **Expecting `bastion:5000` to be reachable from outside the bastion without `GatewayPorts`.** Default OpenSSH binds `-R` to `127.0.0.1` on the server, so `curl bastion.example.com:5000` from a third host fails with connection refused even though the tunnel is "up".
- **Reading the argument as `laptop_port:bastion_host:bastion_port`.** The field order is `remote_listen_port:local_target_host:local_target_port`. The target is resolved on the side that originated the SSH session (the laptop), not on the bastion.
