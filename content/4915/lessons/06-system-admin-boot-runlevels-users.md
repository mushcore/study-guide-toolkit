---
"n": 6
id: 4915-lesson-system-admin-boot-runlevels-users
title: "System admin: boot, runlevels, users"
hook: Short lesson, high MCQ density.
tags:
  - boot
module: Package management & boot
---

flowchart LR BIOS\["BIOS  
POST  
find boot dev"\] --> GRUB\["MBR/GRUB  
bootloader  
pick kernel"\] GRUB --> KERNEL\["kernel  
init hardware  
mount root RO"\] KERNEL --> INIT\["init / systemd  
PID 1"\] INIT --> RCSYS\["rc.sysinit  
mount /proc, swap  
fsck, fstab"\] RCSYS --> RCN\["rc N  
/etc/rc.d/rcN.d  
K\* stop → S\* start"\] RCN --> LOGIN\["login  
gdm or tty"\] classDef boot fill:#181822,stroke:#7aa2f7,color:#e5e5e5; classDef sys fill:#181a18,stroke:#9ece6a,color:#e5e5e5; class BIOS,GRUB,KERNEL boot; class INIT,RCSYS,RCN,LOGIN sys;

flowchart LR subgraph RL\["System V run levels — MEMORIZE (instructor)"\] direction LR L0\["0  
halt  
power off"\] L1\["1  
single user  
rescue / root"\] L2\["2  
multi NO net  
minimal"\] L3\["3  
multi TEXT  
full svcs, no GUI"\] L4\["4  
unused  
custom"\] L5\["5  
multi + GUI  
X11 / GDM"\] L6\["6  
reboot  
restart"\] end classDef halt fill:#201818,stroke:#f7768e,color:#f7768e; classDef res fill:#201c15,stroke:#e0af68,color:#e0af68; classDef gray fill:#181818,stroke:#737373,color:#a3a3a3; classDef good fill:#1a2218,stroke:#9ece6a,color:#9ece6a; classDef gui fill:#181822,stroke:#7aa2f7,color:#7aa2f7; class L0,L6 halt; class L1 res; class L2,L4 gray; class L3 good; class L5 gui;

Change: `init N` / `telinit N`. SysV default in `/etc/inittab`. systemd targets: poweroff(0), rescue(1), multi-user(3), graphical(5), reboot(6). `systemctl get-default` / `systemctl set-default graphical.target`.  
**Traps:** RL 2 has NO network · RL 3 = full svcs text · RL 5 = GUI. Midterm Q35 + sample Q5.  
Sources: Mod05 Ch10-11 · Review Apr 17

### Boot sequence

BIOS → MBR/GRUB → kernel → init/systemd (PID 1) → `rc.sysinit` → `rc N` (runs scripts in `/etc/rc.d/rcN.d/`: K\* kill first, S\* start after) → login prompt.

### Run levels (MEMORIZE)

| # | Meaning |
| --- | --- |
| 0 | halt |
| 1 | single user / rescue |
| 2 | multi-user, NO network |
| 3 | multi-user, text — **full services, no GUI** |
| 4 | unused |
| 5 | multi-user + GUI (X) |
| 6 | reboot |

### Users / auth files

`/etc/passwd` (world-readable, 7 fields): `user:x:UID:GID:GECOS:home:shell`.  
`/etc/shadow` (root-only 600, 9 fields): hashes + aging.  
`useradd -m u`, `userdel -r u`, `passwd u`, `chage`.

umask default 022 → files 644, dirs 755. (666 & ~022 = 644.)

### PAM

Pluggable Authentication Modules. Config: `/etc/pam.d/<service>`. Lets you change auth method without recompiling apps.

Check: Runlevel 3 vs 5?3 = text mode with all services (a normal server). 5 = graphical login (X11). (Midterm Q35.)
