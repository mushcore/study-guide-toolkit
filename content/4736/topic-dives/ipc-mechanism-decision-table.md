---
id: 4736-topic-ipc-mechanism-decision-table
title: IPC mechanism decision table
pillar: tech
priority: low
chapter: Part 8
tags:
  - ipc
---

| Need | Mechanism |
| --- | --- |
| Fastest, same host, any proc | Shared memory / mmap MAP\_SHARED |
| Byte stream, related procs | Pipe |
| Byte stream, unrelated procs | FIFO (named pipe) |
| Discrete typed messages | System V msg queue |
| Cross-machine | Socket (TCP/UDP) |
| Notification (no data) | Signal |
| Bidirectional local | socketpair() |

#### Decision tree

flowchart TD Start(\["Need IPC?"\]) --> Host{"Same host?"} Host -->|"no (cross-machine)"| Sock\["Socket — TCP or UDP"\] Host -->|yes| Kind{"Need what?"} Kind -->|"notification only"| Sig\["Signal — SIGUSR1"\] Kind -->|"large data, fastest"| Shm\["Shared memory · mmap MAP\_SHARED"\] Kind -->|"byte stream, related procs"| Pipe\["pipe()"\] Kind -->|"byte stream, unrelated procs"| Fifo\["FIFO — mkfifo"\] Kind -->|"discrete typed messages"| MQ\["System V msgq — msgget"\] Kind -->|"bidirectional local"| SP\["socketpair()"\]
