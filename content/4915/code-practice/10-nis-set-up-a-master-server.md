---
"n": 10
id: 4915-code-nis-set-up-a-master-server
title: "NIS: set up a master server"
lang: bash
variant: starter-solution
tags:
  - networking
source: "Mod07 Ch21; materials/labs/Lab7.pdf"
---

## Prompt

Initialize a NIS master for domain `infosec`, restrict clients to `192.168.1.0/24`, and start the daemons. Show the command sequence.

## Starter

```bash
# domain + securenets + init + daemons
```

## Solution

```bash
sudo nisdomainname infosec
echo 'NISDOMAIN=infosec' | sudo tee -a /etc/sysconfig/network
echo '255.255.255.0 192.168.1.0' | sudo tee /var/yp/securenets
sudo systemctl enable --now rpcbind ypserv
sudo /usr/lib64/yp/ypinit -m
```

## Why

Grading: set NIS domain (1), persist in /etc/sysconfig/network (1), /var/yp/securenets with netmask+network (2 — common trap: forgetting or inverting the netmask/network order), start rpcbind + ypserv (1), ypinit -m LAST (1, since it reads the domain set in step 1).
