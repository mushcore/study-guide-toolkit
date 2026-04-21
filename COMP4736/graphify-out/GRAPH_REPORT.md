# Graph Report - ./materials  (2026-04-07)

## Corpus Check
- Corpus is ~1,593 words - fits in a single context window. You may not need a graph.

## Summary
- 185 nodes · 165 edges · 44 communities detected
- Extraction: 85% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `IPC 2 - Linux IPC Mechanisms` - 9 edges
2. `Memory Management with Linked List` - 7 edges
3. `Paging` - 7 edges
4. `Process` - 7 edges
5. `Lab 5 - Threads (Kernel vs User Level)` - 6 edges
6. `Semaphores (Named and Unnamed)` - 6 edges
7. `System Calls` - 6 edges
8. `Virtual Memory` - 6 edges
9. `Semaphore` - 6 edges
10. `System V Message Queues` - 5 edges

## Surprising Connections (you probably didn't know these)
- `IPC 2 (Part 8)` --references--> `IPC 2 - Linux IPC Mechanisms`  [EXTRACTED]
  materials/notes/Final Exam Details.md → materials/slides/Part_8_IPC_2.pdf
- `Memory (Part 10)` --references--> `Memory Management`  [EXTRACTED]
  materials/notes/Final Exam Details.md → materials/slides/Part_10_memory.pdf
- `Process States (Running, Ready, Blocked)` --semantically_similar_to--> `Thread`  [INFERRED] [semantically similar]
  materials/slides/Part_3_Processes.pdf → materials/slides/Part_4_Threads.pdf
- `Spin Lock (Busy Waiting)` --semantically_similar_to--> `TSL (Test-and-Set Lock)`  [INFERRED] [semantically similar]
  materials/labs/Set_A_COMP-4736_Lab7.pdf → materials/labs/Lab08.pdf
- `Peterson's Solution` --semantically_similar_to--> `TSL (Test-and-Set Lock)`  [INFERRED] [semantically similar]
  materials/labs/Set_A_COMP-4736_Lab7.pdf → materials/labs/Lab08.pdf

## Hyperedges (group relationships)
- **IPC Mechanism Taxonomy** — part8_pipes, part8_named_pipes, part8_shared_memory, part8_message_queues, part8_semaphores, part8_signals, part8_sockets, part8_memory_mapping [EXTRACTED 1.00]
- **Mutual Exclusion Solutions** — lab07_spin_lock, lab07_peterson_solution, lab08_tsl, lab08_semaphore, lab08_java_monitor [INFERRED 0.85]
- **Virtual Memory Address Translation Pipeline** — part10_mmu, part10_page_table, part10_tlb, part10_page_fault, part10_page_replacement [EXTRACTED 1.00]
- **Producer-Consumer Synchronization Ecosystem** — part67_producer_consumer, part67_semaphore, part67_mutex, part67_condition_variable, part67_monitor, semaphore_producer_consumer [EXTRACTED 0.90]
- **Mutual Exclusion Solution Spectrum** — part67_busy_waiting, part67_peterson, part67_tsl, part67_semaphore, part67_mutex, part67_monitor [EXTRACTED 0.95]
- **Thread Implementation Models** — part4_user_level_threads, part4_kernel_level_threads, part4_hybrid_threads, part4_pthreads, part4_java_threads [EXTRACTED 0.90]
- **Lab Assignment Grading Matrix** — att_lab_assignment_policy, att_attendance_policy, att_due_date_submission, att_late_penalty, att_valid_documents, att_email_submission, att_attendance_with_docs, att_attendance_without_docs [EXTRACTED 1.00]

## Communities

### Community 0 - "IPC 2 & Named Mechanisms"
Cohesion: 0.13
Nodes (19): IPC 2 (Part 8), Semaphore (sem_wait/sem_post), Named Semaphore (sem_open), Shared Memory IPC, mknod Command, Named Pipe (FIFO), IPC 2 - Linux IPC Mechanisms, Memory Mapping (mmap) (+11 more)

### Community 1 - "Synchronization & Threads"
Cohesion: 0.12
Nodes (19): Deadlock Detection Matrices (C, R, E), Hybrid Thread Implementations, Java Platform and Virtual Threads, Kernel-Level Threads, User-Level Threads, Busy Waiting (Spin Lock), Condition Variable, Critical Region / Critical Section (+11 more)

### Community 2 - "Process Management Labs"
Cohesion: 0.13
Nodes (17): fork System Call, getpid Function, Process Address Space (text/data/heap/stack), Process States (S, Z, R, T, D), Zombie Process State (Z), execve System Call, execvp - PATH Search, wait System Call (+9 more)

### Community 3 - "Paging & Virtual Memory"
Cohesion: 0.13
Nodes (15): Cache Memory (L1/L2/L3), Direct Mapping Cache, LRU Replacement Policy, TLB Hard Miss, Internal Fragmentation, Inverted Page Tables, Multilevel Page Tables, Page Fault (+7 more)

### Community 4 - "OS Fundamentals & Processes"
Cohesion: 0.15
Nodes (14): Operating System, Pipe, Process Address Space (Text, Data, Stack), Multiprogramming, Orphan Process, Process, Process States (Running, Ready, Blocked), Zombie Process (+6 more)

### Community 5 - "Memory Management Foundations"
Cohesion: 0.24
Nodes (10): Memory (Part 10), MAP_SHARED Flag, mmap System Call, Base and Limit Registers, Memory Management, Memory Management Unit (MMU), No Memory Abstraction, Overlay (+2 more)

### Community 6 - "Memory Allocation Algorithms"
Cohesion: 0.22
Nodes (9): Best Fit Algorithm, Memory Management with Bitmaps, Buddy System, First Fit Algorithm, Memory Management with Linked List, Next Fit Algorithm, Quick Fit Algorithm, Swapping (+1 more)

### Community 7 - "Thread Programming Lab"
Cohesion: 0.25
Nodes (8): Fork Does Not Share Global Variables, Threads Share PID but Have Different TIDs, pthread_create, Threads Share File Descriptors, Threads Share Global Variables, swapcontext, Lab 5 - Threads (Kernel vs User Level), User-Level Threads (ucontext)

### Community 8 - "Attendance & Grading Policy"
Cohesion: 0.39
Nodes (8): Attendance Policy, Attendance With Valid Documents (1), Attendance Without Valid Documents (0), Due Date Submission (Full Marks), Email Submission Policy, Lab Assignment Submission Policy, Late Submission Penalty (30%), Valid Documents Requirement

### Community 9 - "Synchronization Primitives Lab"
Cohesion: 0.4
Nodes (6): Critical Section, Peterson's Solution, Race Condition, Spin Lock (Busy Waiting), atomic_exchange, TSL (Test-and-Set Lock)

### Community 10 - "Pipes & I/O Redirection"
Cohesion: 0.33
Nodes (6): File Descriptors (0, 1, 2), dup2 System Call, execlp - Process Image Replacement, Pipe IPC (Parent-Child), Standard Streams (stdin/stdout/stderr), Pipes (Unidirectional)

### Community 11 - "Message Queues (IPC)"
Cohesion: 0.4
Nodes (5): ipcs Command, System V Message Queues, msgget, msgrcv, msgsnd

### Community 12 - "Signal Handling"
Cohesion: 0.4
Nodes (5): Signal Handler (user_handler), Signals (SIGUSR1, raise), SIG_DFL (Default Signal Action), SIG_IGN (Ignore Signal), Signals

### Community 13 - "Exam Memory Topics"
Cohesion: 0.4
Nodes (5): Memory Allocation Algorithms (First/Best/Worst/Next Fit), Paging (Exam Topic), Two-Level Page Table, Cache Memory, Memory Hierarchy

### Community 14 - "File System Links"
Cohesion: 0.67
Nodes (3): Hard Link, Soft (Symbolic) Link, link System Call

### Community 15 - "I/O & Interrupts"
Cohesion: 0.67
Nodes (3): Direct Memory Access (DMA), Interrupt, I/O Devices

### Community 16 - "Protection & Kernel Mode"
Cohesion: 1.0
Nodes (2): Kernel Mode vs User Mode, CPU Protection Rings

### Community 17 - "System Call Tracing"
Cohesion: 1.0
Nodes (2): strace - Trace System Calls, strace Tool

### Community 18 - "Context Switching"
Cohesion: 1.0
Nodes (2): Context Switch, Process Table (PCB)

### Community 19 - "Process Creation"
Cohesion: 1.0
Nodes (2): fork() System Call, Process Creation

### Community 20 - "Practice Exams"
Cohesion: 1.0
Nodes (2): Final Exam Practice Problems, Final Exam Practice Solutions

### Community 21 - "IPC 1 Exam Topic"
Cohesion: 1.0
Nodes (1): IPC 1 (Part 6/7)

### Community 22 - "Deadlock Exam Topic"
Cohesion: 1.0
Nodes (1): Deadlock (Part 9)

### Community 23 - "EFLAGS Register"
Cohesion: 1.0
Nodes (1): EFLAGS Register

### Community 24 - "Process Identification"
Cohesion: 1.0
Nodes (1): Process ID (PID)

### Community 25 - "Process Tree"
Cohesion: 1.0
Nodes (1): pstree Command

### Community 26 - "Background Processes"
Cohesion: 1.0
Nodes (1): Background Process (&)

### Community 27 - "CPU Architecture"
Cohesion: 1.0
Nodes (1): lscpu Command

### Community 28 - "Java Monitor"
Cohesion: 1.0
Nodes (1): Java Monitor (synchronized)

### Community 29 - "MPI Communication"
Cohesion: 1.0
Nodes (1): MPI (Message Passing Interface)

### Community 30 - "MPI Reduce"
Cohesion: 1.0
Nodes (1): MPI_Reduce

### Community 31 - "Pthread Barrier"
Cohesion: 1.0
Nodes (1): pthread_barrier

### Community 32 - "Sockets IPC"
Cohesion: 1.0
Nodes (1): Sockets for IPC

### Community 33 - "Pipes IPC"
Cohesion: 1.0
Nodes (1): Unnamed Pipes (Related Processes)

### Community 34 - "Blocking vs Non-blocking I/O"
Cohesion: 1.0
Nodes (1): Blocking vs Non-Blocking System Calls

### Community 35 - "POSIX Async I/O"
Cohesion: 1.0
Nodes (1): POSIX Asynchronous I/O

### Community 36 - "Address Space"
Cohesion: 1.0
Nodes (1): Address Space

### Community 37 - "Pop-Up Threads"
Cohesion: 1.0
Nodes (1): Pop-Up Threads

### Community 38 - "Kernel/User Mode"
Cohesion: 1.0
Nodes (1): Kernel and User Mode

### Community 39 - "CPU"
Cohesion: 1.0
Nodes (1): CPU

### Community 40 - "Pipelining"
Cohesion: 1.0
Nodes (1): Instruction-Level Parallelism (Pipelining)

### Community 41 - "Course Outline"
Cohesion: 1.0
Nodes (1): COMP 4736 Course Outline

### Community 42 - "File System"
Cohesion: 1.0
Nodes (1): File System

### Community 43 - "Buddy System"
Cohesion: 1.0
Nodes (1): Buddy System Memory Allocation

## Knowledge Gaps
- **107 isolated node(s):** `IPC 1 (Part 6/7)`, `IPC 2 (Part 8)`, `Deadlock (Part 9)`, `Memory (Part 10)`, `pthread_create` (+102 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Protection & Kernel Mode`** (2 nodes): `Kernel Mode vs User Mode`, `CPU Protection Rings`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `System Call Tracing`** (2 nodes): `strace - Trace System Calls`, `strace Tool`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Context Switching`** (2 nodes): `Context Switch`, `Process Table (PCB)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Process Creation`** (2 nodes): `fork() System Call`, `Process Creation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Practice Exams`** (2 nodes): `Final Exam Practice Problems`, `Final Exam Practice Solutions`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `IPC 1 Exam Topic`** (1 nodes): `IPC 1 (Part 6/7)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Deadlock Exam Topic`** (1 nodes): `Deadlock (Part 9)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `EFLAGS Register`** (1 nodes): `EFLAGS Register`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Process Identification`** (1 nodes): `Process ID (PID)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Process Tree`** (1 nodes): `pstree Command`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Background Processes`** (1 nodes): `Background Process (&)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CPU Architecture`** (1 nodes): `lscpu Command`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Java Monitor`** (1 nodes): `Java Monitor (synchronized)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `MPI Communication`** (1 nodes): `MPI (Message Passing Interface)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `MPI Reduce`** (1 nodes): `MPI_Reduce`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Pthread Barrier`** (1 nodes): `pthread_barrier`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Sockets IPC`** (1 nodes): `Sockets for IPC`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Pipes IPC`** (1 nodes): `Unnamed Pipes (Related Processes)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Blocking vs Non-blocking I/O`** (1 nodes): `Blocking vs Non-Blocking System Calls`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `POSIX Async I/O`** (1 nodes): `POSIX Asynchronous I/O`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Address Space`** (1 nodes): `Address Space`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Pop-Up Threads`** (1 nodes): `Pop-Up Threads`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Kernel/User Mode`** (1 nodes): `Kernel and User Mode`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CPU`** (1 nodes): `CPU`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Pipelining`** (1 nodes): `Instruction-Level Parallelism (Pipelining)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Course Outline`** (1 nodes): `COMP 4736 Course Outline`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `File System`** (1 nodes): `File System`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Buddy System`** (1 nodes): `Buddy System Memory Allocation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `IPC 2 - Linux IPC Mechanisms` connect `IPC 2 & Named Mechanisms` to `Pipes & I/O Redirection`, `Signal Handling`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `Virtual Memory` connect `Memory Management Foundations` to `Paging & Virtual Memory`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `mmap System Call` connect `Memory Management Foundations` to `IPC 2 & Named Mechanisms`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **What connects `IPC 1 (Part 6/7)`, `IPC 2 (Part 8)`, `Deadlock (Part 9)` to the rest of the system?**
  _107 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `IPC 2 & Named Mechanisms` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._
- **Should `Synchronization & Threads` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Process Management Labs` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._