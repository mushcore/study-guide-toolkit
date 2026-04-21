---
"n": 7
id: 4915-lesson-networking-ssh-ftp
title: Networking + SSH + FTP
hook: The instructor's networking questions repeat. Learn the three patterns.
tags:
  - networking
module: Networking
---

### Name resolution order

`/etc/hosts` first, then DNS (via `/etc/resolv.conf`). DNS = distributed DB, client asks resolver, resolver asks `named` daemon (BIND), cached ~1hr TTL.

### FQDN

`odyssey.scas.bcit.ca` is a fully-qualified hostname. (Midterm Q30.)

### SSH replaces insecure R-commands

rlogin / rsh / rcp / telnet = cleartext. Use ssh / scp / sftp instead (port 22, encrypted).

### SSH tunneling

-   `-L local:host:rport` = **local** forward (access remote svc locally)
-   `-R rport:host:lport` = **remote** forward (expose local on remote)
-   `-D port` = dynamic SOCKS5
-   `-X` = X11 forward

### SSH keys

`ssh-keygen -t rsa -b 4096` → `~/.ssh/id_rsa` (600) + `id_rsa.pub`. `ssh-copy-id user@host` appends pubkey to remote `~/.ssh/authorized_keys` (600). `~/.ssh` itself = 700.

### FTP active vs passive

Active: server connects to client for data (breaks NAT). Passive: client connects to server (firewall-friendly, default modern).

Check: Which tool forwards a port through an encrypted connection?ssh. (Midterm Q3.)
