---
id: 4915-topic-linux-namespaces-8-types
title: Linux namespaces (8 types)
pillar: tech
priority: high
chapter: Mod10C
tags:
  - kubernetes
---

Kernel mechanism to hide resources from processes outside the namespace. K8s pods and containers are built on these.

flowchart TB subgraph POD\["POD-SHARED (via pause container) — amber"\] direction LR NET\["NET  
Network stack  
interfaces, routes  
iptables, sockets"\] IPC\["IPC  
Inter-process comm  
SysV/POSIX msg queues  
semaphores, shm"\] UTS\["UTS  
Hostname + domain  
UNIX Time-sharing  
name/NIS domain"\] end subgraph CON\["PER-CONTAINER isolation — green"\] direction LR PID\["PID  
Process IDs  
own PID 1 tree  
can't see outside"\] MNT\["MNT  
Filesystem mounts  
own rootfs  
mount points"\] USER\["USER  
UID/GID mapping  
unpriv host UID →  
root inside NS"\] CGROUP\["CGROUP  
cgroup FS view  
hides parent groups  
kernel 4.6+"\] TIME\["TIME  
Clock offset  
CLOCK\_MONOTONIC +  
CLOCK\_BOOTTIME  
kernel 5.6+"\] end classDef pod fill:#201c15,stroke:#e0af68,color:#e0af68; classDef con fill:#181a18,stroke:#9ece6a,color:#9ece6a; class NET,IPC,UTS pod; class PID,MNT,USER,CGROUP,TIME con;

**Management tools:** `unshare --pid --net --mount bash` (create + enter new NS) · `nsenter -t PID -p -n -m bash` (join existing target's NS) · `lsns` (list).  
**Remember:** NET/IPC/UTS shared in Pod (pause holds them). PID/MNT/USER/CGROUP/TIME typically per-container.  
Sources: Mod10C · Lab 10 · Quiz 4 Q10

| NS | Isolates |
| --- | --- |
| PID | process IDs (own PID 1) |
| NET | network stack (interfaces, routes, iptables) |
| MNT | filesystem mount points |
| UTS | hostname + NIS domain |
| IPC | SysV/POSIX IPC, shared memory |
| USER | UID/GID mapping (unpriv host UID → root in NS) |
| CGROUP | cgroup filesystem view |
| TIME | system time offset (kernel 5.6+) |

```bash
unshare --pid --net --mount bash      # create + enter new NS
nsenter -t <PID> -p -n -m bash        # enter existing target's NS
lsns                                  # list NS on system
```

> **Example**
> #### Lab 10 recap — build a Pod by hand from kernel primitives
>
> 1.  `sudo unshare --pid --net --mount --uts --ipc --fork bash` — spawn a shell in fresh PID/NET/MNT/UTS/IPC namespaces. Inside, `ps` shows only this shell as PID 1.
> 2.  `hostname mypod` inside — the host's hostname does not change (UTS namespace isolates it).
> 3.  `ip link` inside shows only `lo`. Host has real NICs. That's the NET namespace.
> 4.  From another terminal: `sudo lsns` lists all namespaces, with PIDs inhabiting each.
> 5.  `sudo nsenter -t PID -p -n -u bash` (where PID is the unshared shell) — second process joins the same namespaces, mimicking how a second container in a Pod joins the pause's namespaces.
> 6.  Pair with `cgcreate -g cpu,memory:mypod` + `cgset` to cap resources — now you have a Pod-shaped thing without any K8s installed.
>
> Source: `materials/labs/Lab10.pdf`. This lab is why Quiz 4 Q10 (pause container purpose) is answerable by analogy — the pause is just the first `unshare`'d process that everyone else `nsenter`s into.
