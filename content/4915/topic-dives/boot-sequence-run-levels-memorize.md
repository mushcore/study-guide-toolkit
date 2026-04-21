---
id: 4915-topic-boot-sequence-run-levels-memorize
title: Boot sequence + run levels (MEMORIZE)
pillar: tech
priority: high
chapter: Mod05 Ch10-11
tags:
  - boot
  - sysadmin
---

BIOS POST → MBR/GRUB → kernel → init/systemd (PID 1) → `/etc/rc.d/rc.sysinit` (mount /proc, swap on, fsck+mount fstab) → `rc N` (execute /etc/rc.d/rcN.d/Kxx\* stop scripts, then Sxx\* start) → login.

| Level | Meaning |
| --- | --- |
| 0 | halt / power off |
| 1 | single-user / rescue (root only, no net) |
| 2 | multi-user, no network |
| 3 | multi-user TEXT (full services, no GUI) |
| 4 | unused/custom |
| 5 | multi-user + GUI (X11/GDM) |
| 6 | reboot |

Systemd equivalents: poweroff.target (0), rescue.target (1), multi-user.target (3), graphical.target (5), reboot.target (6).

`systemctl start/stop/enable/disable/status svc`. `systemctl get-default`, `systemctl set-default multi-user.target`.
