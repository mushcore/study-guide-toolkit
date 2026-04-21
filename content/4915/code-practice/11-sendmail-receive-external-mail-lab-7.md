---
"n": 11
id: 4915-code-sendmail-receive-external-mail-lab-7
title: "Sendmail: receive external mail (Lab 7)"
lang: bash
variant: starter-solution
tags:
  - networking
---

## Prompt

Sendmail is installed but only accepts loopback. Make it accept mail from external hosts. List every command and config edit needed, in order.

## Starter

```bash
# steps:
```

## Solution

```bash
# 1. edit /etc/mail/sendmail.mc — change:
# DAEMON_OPTIONS(`Port=smtp,Addr=127.0.0.1, Name=MTA')dnl
# to:
# DAEMON_OPTIONS(`Port=smtp, Name=MTA')dnl

# 2. rebuild sendmail.cf from the .mc:
cd /etc/mail
sudo make

# 3. add domain to local-host-names:
echo 'host.example.com' | sudo tee -a /etc/mail/local-host-names

# 4. open firewall:
sudo firewall-cmd --permanent --add-service=smtp
sudo firewall-cmd --reload

# 5. restart:
sudo systemctl restart sendmail

# 6. verify:
ss -tlnp | grep :25   # should show 0.0.0.0:25
```

## Why

Grading: remove `Addr=127.0.0.1` in .mc (2), `cd /etc/mail && sudo make` to regenerate .cf (2 — the #1 skipped step), local-host-names entry (1), firewall service=smtp (1), systemctl restart (1), ss verify (1). Editing .cf directly = zero marks (sendmail regenerates .cf from .mc).
