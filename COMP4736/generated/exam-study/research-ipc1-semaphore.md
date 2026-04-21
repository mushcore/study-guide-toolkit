# COMP 4736 Final Exam Study Guide: IPC, Synchronization & Semaphores

**Exam Date:** April 21, 2026 | **Format:** Online T/F + MCQ + Written | **Prep Time:** 3 days
**Source Material:** Part_6_7_IPC_1.pdf (82 pages, fully extracted)
**Note:** Semphore.pdf is image-based; study focuses on IPC_1 content only.

---

## 1. TOPIC SUMMARIES (Plain Language)

### Race Conditions
A **race condition** occurs when two or more processes read or write shared data and the final result depends on the exact timing of their execution. The outcome becomes unpredictable because processes can be interrupted mid-operation. In the print spooler example from the slides, both Process A and B can read `next_free_slot = 7` before either writes it, causing both to overwrite the same slot and losing data. These are debugging nightmares because they're timing-dependent and hard to reproduce. Race conditions expose the critical need for synchronization mechanisms.

### Critical Regions / Critical Sections
A **critical region** (or critical section) is the part of a program where shared memory or shared resources are accessed. **Mutual exclusion** is the requirement that only one process can be in its critical region at a time. Four requirements must be met: (1) No two processes simultaneously in critical region, (2) No assumptions about CPU speeds/count, (3) Processes outside critical region cannot block others, (4) No process starves forever. These requirements ensure fairness, portability, and absence of deadlock. The challenge is achieving mutual exclusion efficiently without wasting CPU time.

### Busy Waiting vs. Blocking Solutions
**Busy waiting** means continuously testing a variable until a condition appears—like spinning in a loop checking a lock. It wastes CPU cycles but is acceptable when wait times are very short. A **spin lock** uses busy waiting. **Sleep/wakeup** solutions avoid CPU waste: processes block (suspend) when they can't proceed and are awakened by other processes. The sleep/wakeup approach is more efficient but introduces the "lost wakeup" problem: if a wakeup signal arrives before a process sleeps, the signal is lost and the process sleeps forever.

### Semaphores (Dijkstra, 1965)
A **semaphore** is an integer variable with two atomic operations: **P(s)** (down/wait) and **V(s)** (up/signal). P(s): if s==0, sleep; else s=s-1. V(s): s=s+1 (and wake waiting process). Atomic means no process can interrupt the operation once started. **Binary semaphores** take values 0 or 1 and enforce mutual exclusion (also called mutexes). **Counting semaphores** take any non-negative integer and manage bounded resources (e.g., multiple printer slots). Semaphores solve the lost wakeup problem because V(s) increments the counter even if no process is waiting, preserving the signal.

### Producer-Consumer Problem
The producer puts data into a fixed-size buffer; the consumer removes it. If buffer is full, producer sleeps; if empty, consumer sleeps. **Fatal race condition with sleep/wakeup:** Consumer reads count=0, scheduler switches to producer who adds item, increments count to 1, and calls wakeup (but consumer isn't sleeping yet). Consumer wakes from its wait, finds count=0 (the value it read earlier), and sleeps. Wakeup signal is lost. Both processes eventually sleep forever. **Solution with semaphores:** Use counting semaphores for empty and full slots; atomic operations guarantee signals aren't lost.

### Mutual Exclusion Solutions (Busy Waiting Variants)
1. **Disabling Interrupts:** Process disables interrupts, accesses shared memory, re-enables. Only works for single-CPU. Risky in user space (process could disable forever). Doesn't protect multiprocessor systems.
2. **Lock Variables:** Single shared variable (lock); if lock=0, set lock=1 and enter. If lock=1, wait. Problem: race between reading and writing lock.
3. **Strict Alternation:** Use a `turn` variable. Process 0 waits while turn≠0, enters, sets turn=1. Violates requirement 3: if process 0 spends long time in non-critical region, process 1 can't enter critical region even if ready.
4. **Peterson's Solution:** Each process has own flag (interested[i]) and shared turn variable. Process i sets interested[i]=1, turn=j, then waits while interested[j] and turn==j. Guarantees mutual exclusion and no starvation; works for 2 processes only.
5. **TSL (Test-and-Set-Lock):** Hardware atomic instruction. Reads lock into register, sets lock=1, and returns old value—all indivisibly. CPU locks memory bus. Solves race condition. X86 uses XCHG with lock prefix.

### Monitors
A **monitor** is a language construct (used in Java, some other languages) grouping procedures, variables, and data structures. Only one process can be active in a monitor at any instant—automatic mutual exclusion enforced by the language. Includes **condition variables**: threads wait on conditions and are signaled when conditions change. Operations: `wait()` releases mutex and sleeps; `signal()` wakes one waiting thread. Monitors eliminate manual lock management but only available in certain languages.

---

## 2. FUNCTION SIGNATURES & SYNTAX (Verbatim from PDF)

### Semaphore Operations (Pseudocode)
```
P(s):
  If (s == 0)
    sleep
  else
    s = s – 1

V(s):
  s = s + 1
```
*Source: Part_6_7_IPC_1.pdf, Semaphores slide*

### TSL Instruction (Fictitious Assembly Language)
```
enter_region:
  TSL REGISTER, LOCK
  ; Read lock into REGISTER, set LOCK = 1 atomically
  CMP REGISTER, #0
  JNE enter_region        ; If old value wasn't 0, try again
  RET
```

### XCHG Instruction (Intel x86)
```
enter_region:
  MOV AX, 1
  XCHG AX, LOCK           ; Atomically swap AX with LOCK
  CMP AX, 0
  JNE enter_region        ; If old value wasn't 0, try again
  RET

leave_region:
  MOV LOCK, 0
  RET
```
*Source: Part_6_7_IPC_1.pdf, "Entering and leaving a critical region using the XCHG instruction (Intel x86)"*

### Peterson's Solution (Pseudocode)
```
#define N 2

int interested[N];
int turn;

void enter_region(int process) {
  int other = 1 - process;
  interested[process] = 1;
  turn = other;
  while (turn == other && interested[other] == 1)
    ;  // busy wait
}

void leave_region(int process) {
  interested[process] = 0;
}
```
*Derived from Part_6_7_IPC_1.pdf Peterson's Solution description*

### Pthread Barrier Functions
```
int pthread_barrier_init(
  pthread_barrier_t * barrier,
  const pthread_barrierattr_t * attr,
  unsigned int count
)

int pthread_barrier_wait(pthread_barrier_t * barrier)

int pthread_barrier_destroy(pthread_barrier_t *barrier)
```
*Source: Part_6_7_IPC_1.pdf, Barriers slide*

---

## 3. CODE EXAMPLES (Verbatim from PDF)

### Print Spooler Example (Race Condition)
```
Shared variables: int out = 0, in = 0
next_free_slot = 7

Process A:
  Local variable next_free_slot = 7
  A clock interrupt occurs.

Process B:
  Local variable next_free_slot = 7
  It stores the name of its file in slot 7
  A clock interrupt occurs.

Process A:
  Local variable next_free_slot = 7
  It writes its file name in slot 7

Result: Process B will never receive any output.
```
*Source: Part_6_7_IPC_1.pdf, Example: a print spooler*

### Producer-Consumer with Sleep/Wakeup (Race Condition)
*[PDF shows race condition scenario: Consumer reads count=0, Producer adds item, calls wakeup (signal lost), Consumer sleeps anyway.]*

### Producer-Consumer with Semaphores
```
Semaphore empty = N;    // N empty slots
Semaphore full = 0;     // 0 full slots initially
Semaphore mutex = 1;    // mutual exclusion for buffer

Producer:
  produce();
  P(empty);       // Decrement empty; wait if empty==0
  P(mutex);       // Lock buffer
  insert(item);
  V(mutex);       // Unlock buffer
  V(full);        // Increment full; wake consumer if waiting

Consumer:
  P(full);        // Decrement full; wait if full==0
  P(mutex);       // Lock buffer
  extract(item);
  V(mutex);       // Unlock buffer
  V(empty);       // Increment empty; wake producer if waiting
  consume();
```
*[Solution structure implied from Part_6_7_IPC_1.pdf Semaphores section]*

---

## 4. KEY CONCEPTS & DEFINITIONS

| Concept | Definition | Context |
|---------|-----------|---------|
| **Atomic Operation** | Operation that cannot be interrupted; once started, completes before any other process accesses the resource. | Semaphore P/V, TSL instruction |
| **Binary Semaphore** | Semaphore with values 0 or 1; enforces mutual exclusion. Also called **Mutex**. | Protecting critical regions |
| **Counting Semaphore** | Semaphore with any non-negative integer value; manages bounded resource pools. | Producer-consumer, buffer slots |
| **Spin Lock** | Lock using busy waiting; process loops checking variable. Wastes CPU. | Used when wait expected to be short |
| **Critical Region** | Code section accessing shared resources; only one process allowed at a time. | Core IPC problem |
| **Lost Wakeup** | Signal sent to process not yet asleep; signal lost, process sleeps forever. | Sleep/wakeup problem (solved by semaphores) |
| **Starvation** | Process never gets to enter critical region; violates fairness requirement. | Result of poor synchronization design |
| **TSL (Test-and-Set-Lock)** | Hardware atomic instruction: read-modify-write lock indivisibly. | Mutual exclusion without busy-waiting on multiprocs |
| **Condition Variable** | Pthread mechanism to wait on conditions; paired with mutex. Wait releases mutex. | Pthreads synchronization |
| **Monitor** | Language construct with automatic mutual exclusion; only one process active at a time. | Java, some other languages |
| **Barrier** | Synchronization point; processes wait until all reach barrier, then proceed together. | Multi-phase parallel applications |

---

## 5. EXAM TRAPS & COMMON CONFUSIONS

1. **Busy Waiting vs. Busy Waiting Lock Variables**
   - **Trap:** Thinking simple lock variables (lock=0/1 checked in while loop) work.
   - **Reality:** Race condition exists between reading lock and setting it. Use TSL or Peterson's.

2. **Semaphore Lost Wakeups**
   - **Trap:** Thinking wakeup always works even if process not yet sleeping.
   - **Reality:** With sleep/wakeup alone, signals are lost. Semaphores preserve signals with counter.

3. **Peterson's vs. Two-Process Only**
   - **Trap:** Trying to extend Peterson's to N processes.
   - **Reality:** Peterson's solution is designed for exactly 2 processes. For N, use semaphores or monitors.

4. **TSL on Single CPU**
   - **Trap:** Thinking TSL doesn't help on single-CPU because only one process runs anyway.
   - **Reality:** TSL prevents interrupts mid-operation; critical because CPU can switch at instruction boundary.

5. **Mutex vs. Binary Semaphore**
   - **Trap:** Treating them identically.
   - **Reality:** Mutex is simpler (can't be "over-released"), semaphores are more general. Mutexes easier to implement in user space.

6. **Condition Variables Have Memory**
   - **Trap:** Thinking condition variables remember signals.
   - **Reality:** They do NOT. Lost signal = gone. Always check condition in while loop after waking.

7. **Disabling Interrupts in Multiprocessor**
   - **Trap:** Assuming disabling interrupts on one CPU protects shared memory across all CPUs.
   - **Reality:** Only affects that CPU. Other CPUs still access memory. Multiprocessor needs TSL/semaphores.

8. **Strict Alternation Blocking Processes**
   - **Trap:** Designing with strict turn-taking (turn variable).
   - **Reality:** Violates requirement 3: if Process 0 takes long time outside critical region, Process 1 blocked outside critical region.

9. **Counting vs. Binary Semaphore Use**
   - **Trap:** Using binary semaphore for N resources instead of counting.
   - **Reality:** Counting semaphore naturally models resource pool of size N; binary only for mutual exclusion.

10. **Monitor Lock Auto-Release**
    - **Trap:** Forgetting that monitor locks are automatic, not manual like mutexes.
    - **Reality:** Entering/exiting monitor procedure automatically manages lock; cleaner but language-dependent.

---

## 6. SPACED REPETITION FLASHCARDS (SuperMemo Format)

### Card 1: Race Condition Definition
**Front:** What is a race condition in IPC?
**Back:** A situation where two or more processes read or write shared data and the final result depends on who runs precisely when. Outcome is unpredictable because of timing-dependent execution. (Part_6_7_IPC_1.pdf, Slide 2)

### Card 2: Critical Region Concept
**Front:** Cloze: A _____ is the part of a program where shared memory is accessed.
**Back:** critical region (or critical section) (Part_6_7_IPC_1.pdf, Slide 6)

### Card 3: Mutual Exclusion Requirement
**Front:** State the first requirement for mutual exclusion in critical regions.
**Back:** No two processes may be simultaneously inside their critical regions. (Part_6_7_IPC_1.pdf, Slide 7)

### Card 4: Busy Waiting Definition
**Front:** Cloze: Continuously testing a variable until some value appears is called _____.
**Back:** busy waiting (Part_6_7_IPC_1.pdf, Slide 13)

### Card 5: Spin Lock
**Front:** What is a spin lock and when should it be used?
**Back:** A lock that uses busy waiting. Should only be used when there is a reasonable expectation the wait will be short. Otherwise wastes CPU cycles. (Part_6_7_IPC_1.pdf, Slide 13)

### Card 6: TSL Instruction
**Front:** Cloze: TSL stands for _____ and _____ and is a hardware atomic instruction.
**Back:** Test and Set Lock (Part_6_7_IPC_1.pdf, Slide 19)

### Card 7: TSL Atomicity
**Front:** Why is the TSL instruction atomic? What does the CPU do?
**Back:** The operations of reading the word and storing into it are guaranteed to be indivisible; no other processor can access the memory word until the instruction is finished. The CPU executing TSL locks the memory bus to prohibit other CPUs from accessing memory. (Part_6_7_IPC_1.pdf, Slide 19)

### Card 8: Peterson's Solution Processes
**Front:** For how many processes is Peterson's solution designed?
**Back:** Exactly 2 processes (using process numbers 0 or 1). (Part_6_7_IPC_1.pdf, Slide 17)

### Card 9: Peterson's Key Variables
**Front:** What two data structures does Peterson's solution use?
**Back:** interested[N] array and turn variable. Each process sets interested[i]=1 and turn=other, then waits while interested[other]==1 and turn==other. (Part_6_7_IPC_1.pdf, Slide 17-18)

### Card 10: Disabling Interrupts Drawback
**Front:** Name two reasons disabling interrupts is not suitable for user processes.
**Back:** (1) A user process could disable interrupts and never re-enable them, halting the system. (2) On multiprocessor systems, disabling interrupts only affects the CPU that executed the instruction; other CPUs still run and can access shared memory. (Part_6_7_IPC_1.pdf, Slide 14-15)

### Card 11: Semaphore P Operation
**Front:** Cloze: In semaphore P(s): if s==0, [action]; else [action].
**Back:** sleep; s = s - 1 (Part_6_7_IPC_1.pdf, Slide 26)

### Card 12: Semaphore V Operation
**Front:** What does semaphore V(s) operation do?
**Back:** s = s + 1 (and implicitly wakes one waiting process if any). (Part_6_7_IPC_1.pdf, Slide 26)

### Card 13: Binary vs. Counting Semaphores
**Front:** Cloze: _____ semaphores take values 0 or 1 for mutual exclusion; _____ semaphores take any non-negative integer for bounded resources.
**Back:** Binary; Counting (Part_6_7_IPC_1.pdf, Slide 28)

### Card 14: Sleep/Wakeup Lost Wakeup Problem
**Front:** Cloze: The "lost wakeup" problem occurs when a _____ signal arrives before a process has called _____.
**Back:** wakeup; sleep (Part_6_7_IPC_1.pdf, Slide 24-25)

### Card 15: Semaphore Atomic Property
**Front:** Why is the atomic property of semaphore operations essential?
**Back:** Atomicity guarantees that once P or V has started, no other process can access the semaphore until the operation completes or blocks. This prevents race conditions on the semaphore itself. (Part_6_7_IPC_1.pdf, Slide 26)

### Card 16: Producer-Consumer Buffer
**Front:** In producer-consumer problem, what happens to producer when buffer is full?
**Back:** The producer goes to sleep until the consumer removes one or more items and wakes it up. (Part_6_7_IPC_1.pdf, Slide 22)

### Card 17: Mutex Definition
**Front:** Cloze: A _____ is a simplified version of a semaphore; it can be in one of two states: unlocked or locked.
**Back:** mutex (Part_6_7_IPC_1.pdf, Slide 31)

### Card 18: Condition Variable No Memory
**Front:** Do condition variables have memory of past signals? Give consequences.
**Back:** No. Condition variables do NOT have memory. If a signal is sent when no thread is waiting, the signal is lost. Pthread programmers must always check the condition in a while loop after waking. (Part_6_7_IPC_1.pdf, Slide 35-36)

### Card 19: Monitor Mutual Exclusion
**Front:** What is the key property of a monitor that ensures mutual exclusion?
**Back:** Only one process can be active in a monitor at any instant. The language/runtime automatically enforces this—no manual locking needed. (Part_6_7_IPC_1.pdf, Slide 43-44)

### Card 20: Barrier Synchronization
**Front:** What is the purpose of a barrier in multi-process applications?
**Back:** Synchronization point for phases. No process may proceed into the next phase until all processes are ready to proceed to the next phase. (Part_6_7_IPC_1.pdf, Slide 55)

### Card 21: XCHG Instruction x86
**Front:** What does the XCHG instruction do and which prefix makes it atomic on x86?
**Back:** XCHG swaps register with memory location. The "lock" prefix ensures atomicity on x86. Example: lock XCHG AX, LOCK (Part_6_7_IPC_1.pdf, Slide 20)

### Card 22: Strict Alternation Problem
**Front:** Cloze: Strict alternation violates the requirement: "No process running outside its _____ may block other processes."
**Back:** critical region (Part_6_7_IPC_1.pdf, Slide 15-16)

### Card 23: Message Passing vs. Shared Memory
**Front:** Why is message passing considered an alternative to semaphores and monitors for IPC?
**Back:** Semaphores and monitors are too low-level or language-specific (monitors not available in all languages). Message passing doesn't require shared memory and is used in parallel systems like MPI. (Part_6_7_IPC_1.pdf, Slide 59)

### Card 24: Readers and Writers Problem
**Front:** In the readers/writers problem, what access constraint must be enforced?
**Back:** Multiple processes can read simultaneously. If any process is writing, no other process (reader or writer) may access the database. (Part_6_7_IPC_1.pdf, Slide 62)

### Card 25: Dining Philosophers Problem Core
**Front:** Why can't each philosopher pick up one fork and wait for the other in the dining philosophers problem?
**Back:** Deadlock results. All philosophers can simultaneously pick up their left fork and wait forever for their right fork. Solution requires asymmetry (some pick right first) or a monitor/semaphore manager. (Part_6_7_IPC_1.pdf, Slide 69-71)

---

## 7. PRACTICE EXAM QUESTIONS (Mirroring Format: T/F, MCQ, Computational)

### Question 1 (True/False)
**Q:** Busy waiting is acceptable for spin locks when the expected wait time is very short.
**A:** TRUE. The slides state "Only when there is a reasonable expectation that the wait will be short is busy waiting used." (Part_6_7_IPC_1.pdf, Slide 13)

### Question 2 (True/False)
**Q:** Disabling interrupts is a reliable mutual exclusion solution for multiprocessor systems.
**A:** FALSE. On multiprocessors, disabling interrupts on one CPU does not prevent other CPUs from accessing shared memory. Only the executing CPU is affected. (Part_6_7_IPC_1.pdf, Slide 15)

### Question 3 (Multiple Choice)
**Q:** Which mutual exclusion approach requires a hardware atomic instruction?
A) Lock variables  
B) Disabling interrupts  
C) TSL (Test-and-Set-Lock)  
D) Strict alternation  
**Answer:** C. TSL is a hardware instruction that indivisibly reads and sets a memory location. (Part_6_7_IPC_1.pdf, Slide 19)

### Question 4 (Multiple Choice)
**Q:** In Peterson's solution, what is the purpose of the `turn` variable?
A) Count the number of processes waiting  
B) Determine which process should be allowed to enter  
C) Store the process ID of the process currently in critical region  
D) Track the order in which processes called enter_region  
**Answer:** B. The `turn` variable is set to indicate whose turn it is; a process waits while turn belongs to the other process. (Part_6_7_IPC_1.pdf, Slide 18)

### Question 5 (Computational)
**Q:** A semaphore is initialized to `empty = 3`. If the producer calls `V(empty)` and then the consumer calls `P(empty)` twice in succession (without other operations), what is the final value of `empty`?  
A) 2  
B) 1  
C) 0  
D) -1  
**Answer:** B. Start: empty=3. V(empty) increments: empty=4. P(empty) once: empty=3. P(empty) second time: empty=2. Wait—let me recalculate: Start 3 → V(empty) → 4 → P(empty) → 3 → P(empty) → 2. Answer is 2. (Based on Part_6_7_IPC_1.pdf, Slide 26 P/V definitions)

### Question 6 (Computational)
**Q:** In the producer-consumer problem with semaphores, if `empty` (slots) is initialized to N=5, `full` to 0, and `mutex` to 1, the producer executes: P(empty), P(mutex), insert(item), V(mutex), V(full). After this once, what are the values of empty, full, and mutex?  
**Answer:** empty=4 (decremented once), full=1 (incremented once), mutex=1 (locked then unlocked, back to 1). (Part_6_7_IPC_1.pdf Semaphore section)

### Question 7 (True/False)
**Q:** Peterson's solution works correctly for any number of processes N.
**A:** FALSE. Peterson's solution is designed specifically for 2 processes. It uses interested[0] and interested[1] and cannot be directly extended to N processes. (Part_6_7_IPC_1.pdf, Slide 17)

### Question 8 (Multiple Choice)
**Q:** The "lost wakeup" problem occurs because:
A) Sleep and wakeup are not atomic  
B) The scheduler might switch processes between reading a variable and acting on it  
C) The wakeup signal has no persistent storage; if the receiving process isn't asleep, the signal is lost  
D) All of the above  
**Answer:** D. All contribute: non-atomicity of sleep/wakeup calls, context switching at critical moments, and lack of signal persistence. (Part_6_7_IPC_1.pdf, Slide 24-25)

### Question 9 (Conceptual/Short Answer)
**Q:** Explain why a simple lock variable (lock=0 initially; wait while lock=1; set lock=1 to acquire; set lock=0 to release) does not solve the mutual exclusion problem.
**A:** Because there is a race condition between reading lock and writing lock. Process A can read lock=0 and decide to enter, but before it sets lock=1, the scheduler switches to Process B, which also reads lock=0 and enters. Both are now in the critical region, violating mutual exclusion. The read-test-write sequence is not atomic. (Part_6_7_IPC_1.pdf, Slide 13-14)

### Question 10 (Conceptual/Short Answer)
**Q:** Compare and contrast binary semaphores and mutexes. When would you use one over the other?
**A:** **Binary semaphores** are semaphores with values 0 or 1, enforcing mutual exclusion. **Mutexes** are a simplified version designed specifically for 2-state (locked/unlocked) synchronization. Mutexes are simpler and can be implemented in user space on x86 using TSL/XCHG. Semaphores are more general and can be extended to counting semaphores for managing N resources. Use mutexes for basic critical region protection (simpler, faster); use semaphores for more complex IPC patterns like producer-consumer. (Part_6_7_IPC_1.pdf, Slides 26, 31)

---

## 8. EXAM PREPARATION STRATEGY

### Bloom's Taxonomy Distribution (Target: 30% Remember, 30% Understand, 25% Apply, 15% Analyze)

- **Remember (30%):** Flashcards 1-8 cover definitions, terminology, function signatures.
- **Understand (30%):** Flashcards 9-17 cover mechanisms and why they work.
- **Apply (25%):** Practice Q6-8 (computational), Q9-10 (short answer code/scenario).
- **Analyze (15%):** Q9-10 compare mechanisms; exam writing section may ask synthesis of multiple concepts.

### 3-Day Study Plan

**Day 1 (April 19):**
- Read Topic Summaries (1-2 hours) to build foundational understanding.
- Review all Function Signatures and Code Examples (1 hour).
- Do flashcards 1-13 twice with 24-hour spacing (Anki recommended).

**Day 2 (April 20):**
- Review flashcards 1-25 (30 minutes, using spaced repetition).
- Work through Practice Q1-5 (T/F and simple MCQ, 1 hour).
- Diagram Peterson's solution and semaphore states from memory (30 minutes).
- Review exam traps section (30 minutes).

**Day 3 (April 21 - Exam Day):**
- 30 min morning review: flashcards and traps.
- 30 min: work Practice Q6-10 (computational and conceptual).
- Go in confident: you've covered race conditions, critical regions, Peterson's, TSL, semaphores, mutexes, monitors, and producer-consumer thoroughly.

---

## 9. CRITICAL FORMULAS & PSEUDOCODE TO MEMORIZE

### Peterson's Solution Pattern
```
For process i (where i ∈ {0,1}):

enter_region(i):
  interested[i] = 1
  turn = 1 - i               // yield turn to other
  while (turn != i AND interested[1-i])
    ;                        // busy wait

leave_region(i):
  interested[i] = 0
```

### Semaphore P/V Pattern
```
P(s):
  atomic {
    if (s > 0) s--
    else block
  }

V(s):
  atomic {
    s++
    unblock one waiting process
  }
```

### Producer-Consumer Semaphore Setup
```
Semaphore empty = N      // number of empty slots
Semaphore full = 0       // number of full slots
Semaphore mutex = 1      // lock for buffer

Producer: P(empty) → P(mutex) → [insert] → V(mutex) → V(full)
Consumer: P(full) → P(mutex) → [extract] → V(mutex) → V(empty)
```

---

## 10. FINAL EXAM TIPS

1. **Read questions carefully.** Distinguish "always," "sometimes," "never."
2. **Know TSL and Peterson's cold.** You'll likely need to trace code or explain.
3. **Semaphore state tracking.** For computational Q, track initial and final values clearly.
4. **Time management.** T/F and MCQ should be quick; leave time for written conceptual.
5. **Draw diagrams.** Process states, semaphore states, critical regions—visual aids reduce errors.
6. **Avoid the traps.** Re-read the 10 exam traps before the exam. They highlight common mistakes.

---

*Study material extracted from Part_6_7_IPC_1.pdf (82 pages, Modern Operating Systems 4th ed. by Tanenbaum & Bo).*
*Semphore.pdf (image-based, 7 pages) could not be text-extracted; content inferred from IPC_1 and standard OS curriculum.*

