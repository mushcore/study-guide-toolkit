---
id: 4736-topic-ipc-1-shared-memory-pipes-signals
title: IPC 1 — shared memory, pipes, signals
pillar: tech
priority: high
chapter: Part 6/7
tags:
  - ipc
  - memory
---

#### Shared memory (System V)

```c
int id = shmget(key, sz, IPC_CREAT | 0666);
void *p = shmat(id, NULL, 0);     // attach
shmdt(p);                         // detach
shmctl(id, IPC_RMID, NULL);       // destroy
```

Fastest. No kernel copy. NEEDS external sync (semaphore).

#### Pipes

```c
int fd[2]; pipe(fd);
// fd[0] = read, fd[1] = write. Unidirectional. Related procs only.
```

#### Signals

```c
signal(SIGUSR1, handler);
raise(SIGUSR1);              // self
kill(pid, SIGTERM);          // another
SIG_DFL = default, SIG_IGN = ignore
```

**Uncatchable:** SIGKILL, SIGSTOP.
