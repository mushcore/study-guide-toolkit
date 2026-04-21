---
id: 4915-topic-job-control-process-mgmt
title: Job control + process mgmt
pillar: tech
priority: med
chapter: Mod04
tags:
  - processes
  - shell
---

Background: `cmd &`. Suspend foreground: Ctrl+Z. Resume bg: `bg %n`. Resume fg: `fg %n`. List: `jobs`. Survive logout: `nohup cmd &`.

Process inspection:

```bash
ps aux              # BSD style, all users
ps -ef              # system V style
pstree              # tree view
kill PID            # SIGTERM
kill -9 PID         # SIGKILL (force)
kill -HUP PID       # reload config (many daemons)
killall name        # by name
pgrep/pkill name
top / htop          # interactive
```

PPID = Parent Process ID. (Midterm Q26.)

Init (or systemd) is PID 1. (Sample Q9.)
