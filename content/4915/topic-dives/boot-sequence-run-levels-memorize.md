---
id: 4915-topic-boot-sequence-run-levels-memorize
title: Boot sequence + run levels (MEMORIZE)
pillar: tech
priority: high
chapter: Mod05 Ch10-11
source: "Mod05 Ch10-11; materials/past-exams/midterm.md Q35"
tags:
  - boot
  - sysadmin
related: [4915-topic-permissions-chmod-umask, 4915-topic-etc-passwd-etc-shadow-user-mgmt]
---

BIOS POST → MBR/GRUB → kernel → init/systemd (PID 1) → `/etc/rc.d/rc.sysinit` (mount /proc, swap on, fsck+mount fstab) → `rc N` (execute /etc/rc.d/rcN.d/Kxx\* stop scripts, then Sxx\* start) → login.

The boot chain is linear — each stage hands off to the next, and the final runlevel target determines what services come up (Source: Mod05 Ch10-11 + midterm Q35).

```mermaid
graph LR
  BIOS["BIOS POST"] --> GRUB["GRUB<br/>(MBR bootloader)"]
  GRUB --> Kernel["kernel<br/>+ initramfs"]
  Kernel --> Init["init / systemd<br/>(PID 1)"]
  Init --> RC["rc scripts<br/>/etc/rc.d/rcN.d"]
  RC --> Target["runlevel target<br/>3 = multi-user<br/>5 = graphical"]
  Target --> Login["login prompt"]
```

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

> **Pitfall**
>
> `systemctl set-default multi-user.target` changes what the system boots into next time. `systemctl isolate multi-user.target` switches *now* but does not persist across reboot. Mixing these up is the most common exam trap on runlevels.

> **Example** — switch a desktop to text-only boot, verify, roll back
>
> 1. Start state: `systemctl get-default` → `graphical.target` (runlevel 5, GUI).
> 2. Persist the switch: `sudo systemctl set-default multi-user.target` — updates the symlink `/etc/systemd/system/default.target` → `/usr/lib/systemd/system/multi-user.target`.
> 3. Verify the change: `systemctl get-default` → `multi-user.target`. No reboot yet — we've only changed the *next boot* target.
> 4. Switch NOW without reboot: `sudo systemctl isolate multi-user.target` — stops `graphical.target`'s extras (gdm, X), leaves multi-user services running. Console drops to text login.
> 5. Roll back the live session only: `sudo systemctl isolate graphical.target` — GUI returns, but `set-default` is still `multi-user.target` so next reboot is text.
> 6. Make GUI permanent again: `sudo systemctl set-default graphical.target`.
> 7. Midterm Q35 tests this split: `isolate` = now, `set-default` = next boot. Confuse them and the runlevel question is wrong.

> **Takeaway**: Boot chain: BIOS → bootloader → kernel → init/systemd → rc scripts → login. Runlevel 3 = text multi-user (servers), runlevel 5 = graphical (desktops). `systemctl get-default` / `set-default` are the modern way to read and switch.
