---
"n": 4
id: 4736-lesson-ipc-1-shared-memory-pipes-signals
title: IPC 1 — shared memory, pipes, signals
hook: Three classic mechanisms to pass data between processes in one Linux host.
tags:
  - ipc
  - memory
module: Memory & Paging
---

Processes have separate address spaces. To communicate, OS offers IPC mechanisms. Part 6/7 covers three:

#### Shared memory (System V)

```c
int shmid = shmget(key, size, IPC_CREAT | 0666);
void *addr = shmat(shmid, NULL, 0);      // attach
// read/write *addr
shmdt(addr);                             // detach
shmctl(shmid, IPC_RMID, NULL);           // destroy
```

Fastest IPC — no kernel copy. Requires manual synchronization (semaphore!) because OS does NOT coordinate access.

#### Pipes — unidirectional byte stream

```c
int fd[2];
pipe(fd);        // fd[0]=read end, fd[1]=write end
if (fork() == 0) {
  close(fd[1]);  // child reads
  read(fd[0], buf, N);
} else {
  close(fd[0]);  // parent writes
  write(fd[1], "hi", 2);
}
```

**Unidirectional**: use two pipes for bidirectional. Only works between **related processes** (parent-child, siblings).

<svg viewBox="0 0 720 280" preserveAspectRatio="xMidYMid meet"><defs><marker id="arrPIPE" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#a3a3a3"></path></marker></defs><text x="20" y="22" class="label-accent">pipe(fd) before fork() — both ends in BOTH processes; close one in each</text><rect x="20" y="50" width="260" height="180" class="box" rx="6"></rect><text x="150" y="72" text-anchor="middle" class="label">Parent (writer)</text><rect x="40" y="90" width="100" height="40" class="box-bad" rx="3"></rect><text x="90" y="108" text-anchor="middle" class="sub">fd[0] read</text><text x="90" y="122" text-anchor="middle" class="sub">close()</text><rect x="160" y="90" width="100" height="40" class="box-accent" rx="3"></rect><text x="210" y="108" text-anchor="middle" class="sub">fd[1] write</text><text x="210" y="122" text-anchor="middle" class="sub">write("hi", 2)</text><rect x="440" y="50" width="260" height="180" class="box" rx="6"></rect><text x="570" y="72" text-anchor="middle" class="label">Child (reader)</text><rect x="460" y="90" width="100" height="40" class="box-accent" rx="3"></rect><text x="510" y="108" text-anchor="middle" class="sub">fd[0] read</text><text x="510" y="122" text-anchor="middle" class="sub">read(buf, N)</text><rect x="580" y="90" width="100" height="40" class="box-bad" rx="3"></rect><text x="630" y="108" text-anchor="middle" class="sub">fd[1] write</text><text x="630" y="122" text-anchor="middle" class="sub">close()</text><rect x="290" y="130" width="140" height="40" class="box-warn" rx="6"></rect><text x="360" y="150" text-anchor="middle" class="label">kernel pipe</text><text x="360" y="164" text-anchor="middle" class="sub">byte stream buffer</text><path d="M210 130 Q260 160 295 150" class="arrow-line" marker-end="url(#arrPIPE)"></path><path d="M425 150 Q460 160 510 130" class="arrow-line" marker-end="url(#arrPIPE)"></path><text x="150" y="200" text-anchor="middle" class="sub">close(fd[0]) — parent never reads</text><text x="570" y="200" text-anchor="middle" class="sub">close(fd[1]) — child never writes</text><text x="360" y="250" text-anchor="middle" class="sub">Closing the unused end is what makes it unidirectional. fork() copies BOTH fds into the child.</text></svg>

#### Signals

Asynchronous notification. `SIGUSR1`, `SIGKILL`, `SIGTERM`, etc. Install handler:

```c
void handler(int sig) { printf("got %d\n", sig); }
signal(SIGUSR1, handler);
raise(SIGUSR1);          // send to self
kill(pid, SIGUSR1);      // send to other
```

Special handlers: `SIG_DFL` (default), `SIG_IGN` (ignore).

> **Takeaway**
> Shared memory = fast, needs sync. Pipes = stream, related processes, unidirectional. Signals = notification, not data.

> **Q:** You want to send 1 MB of data between unrelated processes. Which mechanism and why?
> **A:** Named pipe (FIFO) or shared memory. Pipes (unnamed) require relatedness. Signals can't carry data. Shared memory is fastest if sync is available.
