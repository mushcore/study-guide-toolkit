---
"n": 5
id: 4736-lesson-ipc-2-named-pipes-message-queues-sockets-mmap
title: IPC 2 — named pipes, message queues, sockets, mmap
hook: When you need cross-machine or unrelated-process comms, go here.
tags:
  - ipc
module: IPC & Synchronization
---

#### Named pipes (FIFO)

```c
mkfifo("myfifo", 0666);      // or: mknod myfifo p
// Process A:  fd = open("myfifo", O_WRONLY); write(fd, ...);
// Process B:  fd = open("myfifo", O_RDONLY); read(fd, ...);
```

Like pipes but have a **name in the filesystem** → usable by unrelated processes.

#### Message queues (System V)

```c
int q = msgget(key, IPC_CREAT | 0666);
msgsnd(q, &msg, size, 0);
msgrcv(q, &msg, size, msgtype, 0);
// ipcs -q    // list queues
```

Discrete **messages** (not a stream). Each has a type; receiver can filter by type. Persists in kernel until removed.

#### Sockets

```c
int s = socket(AF_INET, SOCK_STREAM, 0);   // TCP
bind(s, ...);  listen(s, 5);  accept(s, ...);
connect(s, ...);                           // client
send(s, buf, n, 0);  recv(s, buf, n, 0);
```

Cross-machine. `socketpair()` gives bidirectional local sockets. UDP (`SOCK_DGRAM`) = `sendto`/`recvfrom`.

<svg viewBox="0 0 720 320" preserveAspectRatio="xMidYMid meet"><defs><marker id="arrSOCK" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#a3a3a3"></path></marker></defs><text x="20" y="22" class="label-accent">Local (AF_UNIX or socketpair) vs cross-machine (AF_INET)</text><rect x="20" y="40" width="320" height="160" class="box" rx="6"></rect><text x="180" y="60" text-anchor="middle" class="label">Same host — AF_UNIX</text><rect x="40" y="78" width="120" height="50" class="box-accent" rx="3"></rect><text x="100" y="100" text-anchor="middle" class="sub">Process A</text><text x="100" y="116" text-anchor="middle" class="sub">socketpair / UDS</text><rect x="200" y="78" width="120" height="50" class="box-accent" rx="3"></rect><text x="260" y="100" text-anchor="middle" class="sub">Process B</text><text x="260" y="116" text-anchor="middle" class="sub">socketpair / UDS</text><path d="M160 95 L200 95" class="arrow-line" marker-end="url(#arrSOCK)"></path><path d="M200 110 L160 110" class="arrow-line" marker-end="url(#arrSOCK)"></path><text x="180" y="160" text-anchor="middle" class="sub">kernel-only — no TCP/IP stack</text><text x="180" y="186" text-anchor="middle" class="sub">socketpair() = bidirectional local pair</text><rect x="380" y="40" width="320" height="240" class="box" rx="6"></rect><text x="540" y="60" text-anchor="middle" class="label">Cross host — AF_INET / SOCK_STREAM (TCP)</text><rect x="400" y="78" width="120" height="50" class="box-accent" rx="3"></rect><text x="460" y="100" text-anchor="middle" class="sub">Client (machine 1)</text><text x="460" y="116" text-anchor="middle" class="sub">connect(ip, port)</text><rect x="560" y="78" width="120" height="50" class="box-accent" rx="3"></rect><text x="620" y="100" text-anchor="middle" class="sub">Server (machine 2)</text><text x="620" y="116" text-anchor="middle" class="sub">bind/listen/accept</text><rect x="400" y="150" width="280" height="50" class="box-warn" rx="6"></rect><text x="540" y="170" text-anchor="middle" class="label">TCP/IP stack — kernel</text><text x="540" y="186" text-anchor="middle" class="sub">syn · ack · seq · retransmit</text><rect x="400" y="220" width="280" height="40" class="box" rx="6"></rect><text x="540" y="244" text-anchor="middle" class="sub">network — Ethernet / Wi-Fi / Internet</text><path d="M460 128 L460 150" class="arrow-line" marker-end="url(#arrSOCK)"></path><path d="M620 128 L620 150" class="arrow-line" marker-end="url(#arrSOCK)"></path><path d="M460 200 L460 220" class="arrow-line" marker-end="url(#arrSOCK)"></path><path d="M620 200 L620 220" class="arrow-line" marker-end="url(#arrSOCK)"></path><text x="540" y="295" text-anchor="middle" class="sub">UDP (SOCK_DGRAM) skips connect — sendto/recvfrom directly</text></svg>

#### mmap — map file into memory

```c
void *p = mmap(NULL, length, PROT_READ|PROT_WRITE,
               MAP_SHARED, fd, 0);
// access *p as if it were memory; changes flush to file
```

`MAP_SHARED` = changes visible to other mappers + written to disk. `MAP_PRIVATE` = copy-on-write, changes not persisted.

> **Takeaway**
> FIFO = named, filesystem-visible pipe. MsgQ = typed messages, kernel-persistent. Sockets = cross-machine. mmap = file-as-memory, with MAP\_SHARED for IPC.

> **Q:** Persistence: do System V message queues survive after the creating process dies?
> **A:** **Yes.** Kernel-lifetime. They persist until explicitly removed (`msgctl(..., IPC_RMID, ...)`) or system reboot. `ipcs -q` lists them.
