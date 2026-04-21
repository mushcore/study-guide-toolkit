---
id: 4915-topic-ssh-keys-tunneling
title: SSH keys + tunneling
pillar: tech
priority: high
chapter: Mod06 Ch18
tags:
  - networking
  - sysadmin
---

#### Keys

```bash
ssh-keygen -t rsa -b 4096
# creates ~/.ssh/id_rsa (600) and id_rsa.pub
ssh-copy-id user@remote
# appends pubkey to remote ~/.ssh/authorized_keys (600)
```

Perm rules (ssh refuses if too loose): `~/.ssh`\=700, private key=600, `authorized_keys`\=600.

#### Tunneling

| Flag | Meaning |
| --- | --- |
| `-L local:host:rport` | LOCAL port forward — access remote svc through local port |
| `-R rport:host:lport` | REMOTE port forward — expose local svc on remote |
| `-D port` | dynamic SOCKS5 proxy |
| `-X` / `-Y` | X11 forward (untrusted / trusted) |
| `-N` / `-f` | no command / background |

```bash
# Access remote Postgres via local port
ssh -L 5432:db.internal:5432 user@bastion
# Expose local 3000 as remote 8080
ssh -R 8080:localhost:3000 user@public
```

sshd\_config key settings: `Port`, `PermitRootLogin`, `PasswordAuthentication`, `PubkeyAuthentication`, `AllowUsers`, `X11Forwarding`.
