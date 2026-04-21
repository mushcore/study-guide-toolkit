---
"n": 8
id: 4915-code-nfs-export-a-directory-and-mount-it
title: "NFS: export a directory and mount it"
lang: bash
variant: starter-solution
tags:
  - networking
---

## Prompt

Export `/srv/data` read-write to clients on `10.0.0.0/24`. Show the server-side commands and the client-side mount command.

## Starter

```bash
# server /etc/exports line:

# server apply + firewall:

# client mount command:
```

## Solution

```bash
# /etc/exports:
/srv/data 10.0.0.0/24(rw,sync,no_subtree_check)

# server apply:
sudo exportfs -ra
sudo systemctl enable --now nfs-server
sudo firewall-cmd --permanent --add-service=nfs
sudo firewall-cmd --reload

# client:
showmount -e server.local
sudo mount -t nfs server.local:/srv/data /mnt/data
```

## Why

Grading: exports syntax with client CIDR + options (2), exportfs -ra to apply without bouncing the daemon (1), firewall service=nfs (1), mount syntax server:/path local/path (2). `showmount -e` is the canonical verify step.
