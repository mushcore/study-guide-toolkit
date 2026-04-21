---
id: 4736-topic-ipc-2-fifo-message-queues-sockets-mmap
title: IPC 2 — FIFO, message queues, sockets, mmap
pillar: tech
priority: high
chapter: Part 8
tags:
  - ipc
  - paging
---

#### FIFO (named pipe)

```c
mkfifo("path", 0666);
// or:  mknod path p
// Used like a regular file via open/read/write. Unrelated procs OK.
```

#### Message queues (System V)

```c
int q = msgget(key, IPC_CREAT|0666);
msgsnd(q, &m, sz, 0);
msgrcv(q, &m, sz, mtype, 0);
ipcs -q   // list
```

Discrete typed messages. Kernel persistent.

#### Sockets (TCP)

```text
server: socket → bind → listen → accept → recv/send
client: socket → connect → send/recv
```

#### mmap

```c
void *p = mmap(NULL, len, PROT_RW, MAP_SHARED, fd, 0);
MAP_SHARED  = visible + written to file
MAP_PRIVATE = copy-on-write, no persist
```
