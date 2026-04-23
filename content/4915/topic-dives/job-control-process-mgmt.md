---
id: 4915-topic-job-control-process-mgmt
title: Job control + process mgmt
pillar: tech
priority: med
chapter: Mod04
source: "Mod04"
tags:
  - processes
  - shell
related: [4915-topic-special-parameters, 4915-topic-redirection-pipes]
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

> **Pitfall**
>
> `Ctrl+Z` suspends (state `T`); `bg` resumes in the background. If you `exit` the shell with suspended jobs, the shell warns once and on the second exit kills them with SIGHUP. `disown -h` detaches a job from the shell so it survives exit without warning.

> **Example** — fire-and-monitor two background jobs
>
> 1. `sleep 10 & PID1=$!` — launch, capture PID immediately.
> 2. `sleep 8 & PID2=$!` — second job.
> 3. `jobs` → shows `[1]+ Running sleep 10 &` and `[2]- Running sleep 8 &`.
> 4. `wait $PID1 $PID2` — block until both finish; shell returns 0 when both exit 0.
> 5. Suspend-resume: start `top`, `Ctrl+Z` (state T), `bg` to resume in background, `fg` to bring back. `kill %1` kills job 1 by jobspec.
> 6. Exam reflex: `$!` is the *last* bg PID; capture it immediately — launching another bg job overwrites it.

> **Takeaway**: `&` backgrounds; `jobs`, `fg`, `bg` manage. `$!` is the last background PID, `$$` the current shell's PID. Use these for scripts that fire-and-monitor child processes — and to clean up with `kill` / `wait`.
