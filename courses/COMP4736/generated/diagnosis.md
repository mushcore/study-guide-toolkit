# COMP 4736 -- Exam Diagnosis Report

Generated: 2026-04-07 (updated with full material analysis)

---

## Exam Format Summary

| Attribute | Detail |
|-----------|--------|
| **Part 1** | Online -- True/False, Multiple Choice |
| **Part 2** | Written -- on paper or online (calculation/problem-solving) |
| **Policy** | Closed book |
| **Bring** | Laptop (fully charged), calculator, blank paper, pencil |
| **Makeup exams** | Not available |
| **Exam weight** | 35% of final grade (single largest component) |
| **Exam window** | April 20-24, 2026 (student exam: April 21) |
| **Topics listed** | IPC 1 (Part 6/7), IPC 2 (Part 8), Deadlock (Part 9), Memory (Part 10) |
| **Earlier topics** | May appear -- Intro, OS Structures, Processes, Threads, System Calls |

**Point distribution between Part 1 and Part 2 is not specified** in any available material. Plan for both formats equally.

---

## Topic Inventory

| # | Topic | Source | Est. Weight | Past Exam Qs | Graph God Node? |
|---|-------|--------|-------------|--------------|-----------------|
| 1 | **Paging & Address Translation** | Part 10 | ~20% | Q1, Q3, Q4, Q7 (4 of 8) | Yes (7 edges) |
| 2 | **Memory Allocation Algorithms** (First/Best/Worst/Next Fit, Buddy) | Part 10 | ~12% | Q2, Q8 (2 of 8) | Yes (Linked List: 7 edges) |
| 3 | **Page Tables** (single-level, two-level, inverted) | Part 10 | ~8% | Q1, Q7 (2 of 8) | -- |
| 4 | **Optimal Page Size & Overhead** | Part 10 | ~5% | Q6 (1 of 8) | -- |
| 5 | **Virtual Memory, MMU, TLB, Page Faults** | Part 10 | ~8% | Q4 (1 of 8) | Yes (6 edges) |
| 6 | **Deadlock Detection** (graphs, C/R/E matrices, algorithms) | Part 9 | ~10% | Q5 (1 of 8) | -- |
| 7 | **Deadlock Avoidance** (Banker's Algorithm, safe/unsafe states) | Part 9 | ~8% | 0 (but heavy slide emphasis) | -- |
| 8 | **Deadlock Prevention** (4 Coffman conditions, attack strategies) | Part 9 | ~5% | 0 (but repeatedly emphasized) | -- |
| 9 | **Livelock & Starvation** | Part 9 | ~2% | 0 | -- |
| 10 | **Semaphores & Mutual Exclusion** (busy waiting, Peterson's, TSL, semaphores, mutexes, monitors) | Part 6/7 | ~8% | 0 (likely Part 1 MCQ/TF) | Yes (6 edges x2) |
| 11 | **Classic Problems** (Producer-Consumer, Readers-Writers, Dining Philosophers) | Part 6/7 | ~5% | 0 (likely Part 1) | -- |
| 12 | **Linux IPC Mechanisms** (pipes, named pipes, shared memory, message queues, mmap, signals, sockets) | Part 8 | ~7% | 0 (likely Part 1 MCQ/TF) | Yes (9 edges -- top god node) |
| 13 | **Signals** (signal numbers, handlers, SIG_IGN, SIG_DFL, SIGKILL) | Part 8 | ~2% | 0 | -- |
|  | **Total** | | **100%** | **8 questions** | |

### Weight estimation rationale
- Memory dominates the practice exam (7 of 8 written questions), suggesting Part 2 is Memory-heavy
- IPC has zero practice exam questions but is the top god node in the knowledge graph and occupies ~2 full lecture parts -- it almost certainly dominates Part 1 (MCQ/TF)
- Deadlock has 1 practice exam question but 106 slides of dense material -- expect both Part 1 and Part 2 coverage

---

## High-Leverage Topics (Ranked)

### Tier 1 -- Highest ROI (study first)

**1. Paging & Address Translation** (Part 10, Slides 47-72)
- 4 of 8 past exam questions directly test this
- Must master: virtual-to-physical translation formula Y = x + (a - A), page/offset splitting, reading page tables, identifying page faults from present/absent bit
- Binary-level address conversion (slide 69 example: VA 8196 -> PA 24580)
- Both single-level and two-level page table lookups
- **Practice priority**: Work Q1, Q3, Q4, Q7 from practice exam until automatic

**2. Memory Allocation Algorithms** (Part 10, Slides 19-36)
- 2 past exam questions; First/Best/Worst/Next Fit + Buddy System
- Must master: applying all 4 algorithms to *successive* requests (each allocation modifies the hole list)
- Buddy System: splitting into power-of-2 blocks, coalescing free buddies, drawing memory trees
- Free memory tracking: bitmaps (trade-offs) and linked lists (4 merge cases on process termination)
- **Practice priority**: Work Q2, Q8 until automatic

**3. Deadlock Detection & C/R/E Matrices** (Part 9, Slides 28-59)
- 1 past exam question (Q5: extracting C, R, E from resource allocation graph)
- Two detection algorithms: graph-based DFS (one resource/type) and matrix algorithm (multiple resources/type)
- The matrix algorithm (slides 45-59) is traced over 10 slides -- expect a worked problem
- Key invariant: Sum(C_ij) + A_j = E_j
- **Practice priority**: Work Q5; also work the slide 60 exercise and the slide 47 example independently

### Tier 2 -- High ROI (study second)

**4. Semaphores, Mutexes, and Synchronization** (Part 6/7, Slides 37-58)
- Zero past exam questions BUT: backbone of the entire IPC unit, god node in graph (6 edges x2), and heavily emphasized
- Almost certainly tested in Part 1 (MCQ/TF) with conceptual questions
- Must know: P(down)/V(up) operations, binary vs. counting semaphores, producer-consumer with 3 semaphores (mutex=1, empty=N, full=0), condition variables have no memory, monitor = automatic mutual exclusion
- Key comparison: why sleep/wakeup has a fatal race condition but semaphores fix it
- **Study method**: Make flashcards for definitions + trace the semaphore producer-consumer step by step

**5. Banker's Algorithm** (Part 9, Slides 72-87)
- Zero past exam questions BUT: enormous slide coverage (16 slides with worked examples)
- Single-resource version (slides 79-83) and multiple-resource version (slides 84-87)
- Must master: determining safe vs. unsafe states by finding a completion sequence
- **Practice priority**: Work through slides 80-83 (single) and 85-87 (multiple) independently

**6. IPC Mechanisms Taxonomy** (Part 8, all 61 slides)
- Top god node (9 edges); likely dominates Part 1 MCQ/TF
- Must know for each mechanism: what it is, when to use it, key system calls, directionality, related vs. unrelated processes
- Critical distinctions: pipes (unidirectional, related) vs. named pipes (bidirectional, unrelated), System V vs. POSIX APIs, named vs. unnamed semaphores, TCP vs. UDP socket flows
- Key mappings: down(s) = sem_wait(&s), up(s) = sem_post(&s)
- pipe_fds[0] = read end, pipe_fds[1] = write end (repeated across 6+ slides)
- **Study method**: Comparison table + flashcards

### Tier 3 -- Moderate ROI (study third)

**7. Four Coffman Conditions & Deadlock Prevention** (Part 9, Slides 19, 89-95)
- The four conditions (Mutual Exclusion, Hold-and-Wait, No Preemption, Circular Wait) are stated on slide 19, then each one attacked individually in the prevention section
- Prevention summary table (slide 95) is a direct exam target
- Resource acquisition ordering to prevent circular wait
- Deadlock-free vs. deadlock-prone code comparison (slides 15-16)

**8. Virtual Memory, TLB, Page Faults** (Part 10, Slides 37-81)
- Page fault 10-step handling procedure (slides 62-66)
- TLB: soft miss vs. hard miss, TLB entry fields, software TLB management (RISC)
- Page table entry fields: present/absent, modified (dirty), referenced, protection, caching disabled, page frame number
- Optimal page size: p = sqrt(2se); overhead at optimum = p* (Q6 in practice exam)

**9. Critical Section & Busy-Waiting Solutions** (Part 6/7, Slides 6-30)
- Four requirements for mutual exclusion (each given its own slide)
- Five approaches: disabling interrupts, lock variables, strict alternation, Peterson's solution, TSL/XCHG
- Must know which requirement each approach violates (strict alternation violates #3)
- TSL assembly code: enter_region/leave_region pattern

**10. Classic Synchronization Problems** (Part 6/7, Slides 67-82)
- Producer-Consumer (sleep/wakeup race, semaphore solution, monitor solution, message passing solution)
- Readers-Writers (semaphore solution with rc counter)
- Dining Philosophers (naive deadlock, correct solution with state array)

---

## Question Style Analysis

### Part 2 (Written) -- based on practice exam

| Style | Frequency | Example |
|-------|-----------|---------|
| **Numerical calculation** | 6 of 8 | "Obtain the physical address for VA=20500" |
| **Algorithm application** | 3 of 8 | "Which hole is taken for first fit / best fit / worst fit / next fit?" |
| **Diagram interpretation** | 3 of 8 | "Using the following page table diagram..." / "Using the resource allocation graph..." |
| **Matrix construction** | 1 of 8 | "Obtain C, R, and E matrices" |
| **Formula derivation** | 1 of 8 | "Calculate the overhead for the optimal page size" |
| **Tree/diagram drawing** | 1 of 8 | "Illustrate the memory tree after each operation" (Buddy System) |

**Key pattern**: The professor expects you to show your work step by step. Practice exam solutions include both "direct calculation" AND "formula" methods for address translation. Write both.

### Part 1 (Online MCQ/TF) -- predicted from slide emphasis

Expect conceptual questions on:
- Definitions (what is a semaphore? what is a monitor?)
- True/False on properties (e.g., "Condition variables have memory" -- FALSE)
- Mechanism comparisons (pipes vs. named pipes, TCP vs. UDP)
- Identifying which Coffman condition is violated
- Signal behavior (can SIGKILL be caught? -- NO)
- IPC mechanism identification (which mechanism is bidirectional? unidirectional?)

---

## Bloom's Level Profile

| Bloom's Level | Past Exam % | Expected Final % | Typical Question |
|---------------|-------------|-------------------|------------------|
| **Remember** | 0% | ~25% | Part 1: definitions, T/F, signal numbers |
| **Understand** | 0% | ~15% | Part 1: "Why does strict alternation violate requirement 3?" |
| **Apply** | 75% (6/8) | ~40% | Part 2: address translation, allocation algorithms, Buddy System |
| **Analyze** | 25% (2/8) | ~20% | Part 2: C/R/E matrix construction, optimal page size derivation, safe/unsafe state determination |

**Implication**: Part 2 is heavily Apply/Analyze. Memorizing definitions alone will not help -- you must be able to *execute* algorithms and *calculate* addresses. Part 1 likely covers Remember/Understand.

---

## Coverage Gaps

Everything below is material in the slides that you have not yet studied:

| Gap | Source | Severity |
|-----|--------|----------|
| Paging address translation (formula + binary) | Part 10, Sl. 47-72 | CRITICAL -- 4 past exam Qs |
| Memory allocation algorithms (4 types + successive requests) | Part 10, Sl. 29-33 | CRITICAL -- 2 past exam Qs |
| Buddy System (splitting, coalescing, tree diagrams) | Part 10, Sl. 34-36 | CRITICAL -- 1 past exam Q |
| Deadlock C/R/E matrices from resource graphs | Part 9, Sl. 42-59 | CRITICAL -- 1 past exam Q |
| Two-level page table translation | Part 10, Sl. 90-97 | CRITICAL -- 1 past exam Q |
| Optimal page size formula: p = sqrt(2se) | Part 10, Sl. 57-58 | HIGH -- 1 past exam Q |
| Banker's Algorithm (single + multiple resource) | Part 9, Sl. 72-87 | HIGH -- heavy slide coverage |
| Semaphore producer-consumer (3 semaphores) | Part 6/7, Sl. 39-40 | HIGH -- backbone concept |
| Four Coffman conditions + prevention table | Part 9, Sl. 19, 89-95 | HIGH -- repeatedly emphasized |
| IPC mechanisms taxonomy (pipes, shared mem, signals, sockets) | Part 8, all | HIGH -- top god node |
| Critical section 4 requirements + busy-waiting solutions | Part 6/7, Sl. 6-30 | MEDIUM |
| Classic problems (Producer-Consumer, Readers-Writers, Dining Philosophers) | Part 6/7, Sl. 67-82 | MEDIUM |
| Page fault 10-step procedure | Part 10, Sl. 62-66 | MEDIUM |
| TLB, soft/hard miss | Part 10, Sl. 73-81 | MEDIUM |
| Inverted page tables | Part 10, Sl. 83-88 | MEDIUM |
| Livelock vs. deadlock vs. starvation | Part 9, Sl. 97-106 | LOW |
| Base/limit registers, swapping, bitmaps | Part 10, Sl. 4-21 | LOW |
| MPI, barriers | Part 6/7, Sl. 60-69 | LOW |

---

## Past Exam Patterns

### Topic distribution (practice final -- Part 2 only)
- **Memory Management**: 7 of 8 questions (87.5%)
- **Deadlock**: 1 of 8 questions (12.5%)
- **IPC**: 0 of 8 questions (0%)

### Recurring question types
1. **Address translation with page table diagram** -- appears 3 times (Q3, Q4, Q7) with variations: single-level, MMU with present bits, two-level
2. **"Apply algorithm to successive requests"** -- Q2 (4 allocation algorithms) and Q8 (Buddy System) both require tracking state across multiple operations
3. **Page fault identification** -- tested in Q3 (VA 53448), Q4 (page 6 absent), Q7 (VA 25 not present). Always check the present/absent bit.
4. **Matrix/vector extraction from diagram** -- Q5 requires reading a resource allocation graph and constructing C, R, E matrices

### What the professor emphasizes (slide analysis)
- **Underlined/bold definitions**: race condition, critical section, mutual exclusion, busy waiting, spin lock, TSL locks memory bus, condition variables have no memory, monitor = only one process active
- **Orange/red highlighted text**: strict alternation violates requirement 3, fatal race condition in sleep/wakeup
- **Dedicated multi-slide walkthroughs**: semaphore producer-consumer (7-slide animated supplement), Banker's Algorithm (9 slides), deadlock detection (10+ slides each for graph and matrix versions), address translation (3 worked examples)
- **Comparison tables**: System V vs. POSIX IPC, TCP vs. UDP socket flows, traditional vs. inverted page tables, deadlock prevention summary

---

## Graph Structure Cross-Reference

### God nodes (structural backbone concepts)
| God Node | Edges | Exam Relevance | Diagnosis Weight |
|----------|-------|----------------|------------------|
| IPC 2 - Linux IPC Mechanisms | 9 | Top god node but 0 past exam Qs | **UNDERWEIGHTED by past exam** -- likely dominates Part 1 |
| Memory Mgmt with Linked List | 7 | Moderate (Q2 context) | Appropriately weighted |
| Paging | 7 | Very high (4 past exam Qs) | Appropriately weighted |
| Process | 7 | Background topic | Low priority (context only) |
| Semaphores (Named and Unnamed) | 6 | 0 past exam Qs | **UNDERWEIGHTED** -- backbone of IPC; likely Part 1 |
| Virtual Memory | 6 | High (Q4 context) | Appropriately weighted |
| Semaphore | 6 | 0 past exam Qs | **UNDERWEIGHTED** -- same as above |

### Critical cross-domain bridge
**mmap** connects Memory (Part 10) and IPC 2 (Part 8). It is both a memory management primitive (file mapping, anonymous mapping) and a shared-memory IPC mechanism. High probability of a tricky question that spans both topics.

### Key hyperedges (concept clusters that co-activate)
1. **Virtual Memory Address Translation Pipeline**: MMU -> Page Table -> TLB -> Page Fault -> Page Replacement (confidence 1.0)
2. **Producer-Consumer Synchronization Ecosystem**: sleep/wakeup -> semaphore -> mutex -> condition variable -> monitor (confidence 0.90)
3. **Mutual Exclusion Solution Spectrum**: busy waiting -> Peterson's -> TSL -> semaphore -> mutex -> monitor (confidence 0.95)
4. **IPC Mechanism Taxonomy**: pipes -> named pipes -> shared memory -> message queues -> semaphores -> signals -> sockets -> mmap (confidence 1.0)

---

## Recommended Priority Order

Study these in order. Each session should interleave 2-3 topics.

| Priority | Topic | Time Est. | Why |
|----------|-------|-----------|-----|
| **1** | Paging & Address Translation | 3 hrs | 4 past exam Qs; highest exam density |
| **2** | Memory Allocation Algorithms + Buddy System | 2 hrs | 2 past exam Qs; algorithm execution |
| **3** | Deadlock Detection (graphs + matrices) | 2 hrs | 1 past exam Q; two algorithms to master |
| **4** | Semaphores & Producer-Consumer | 2 hrs | Backbone concept; god node; likely Part 1 |
| **5** | Banker's Algorithm (safe/unsafe states) | 2 hrs | Heavy slide coverage; likely Part 2 |
| **6** | IPC Mechanisms Taxonomy | 2 hrs | Top god node; likely Part 1 MCQ/TF |
| **7** | Four Coffman Conditions + Prevention | 1 hr | Repeatedly emphasized; prevention table |
| **8** | Two-Level + Inverted Page Tables | 1.5 hrs | 1 past exam Q; comparison table |
| **9** | Critical Section + Busy-Waiting Solutions | 1.5 hrs | 4 requirements; 5 approaches |
| **10** | Classic Problems (Readers-Writers, Dining Philosophers) | 1.5 hrs | Conceptual understanding |
| **11** | Signals, Sockets (TCP/UDP flows) | 1 hr | Part 1 MCQ; SIGKILL fact |
| **12** | Virtual Memory, TLB, Page Faults | 1 hr | 10-step procedure; soft/hard miss |
| **13** | Optimal Page Size formula | 0.5 hr | 1 past exam Q; formula memorization |
| **14** | Livelock, Starvation, Deadlock distinctions | 0.5 hr | Low past exam probability |
| **15** | Earlier topics brush-up (processes, threads, syscalls) | 1 hr | Context only; not primary exam focus |
| | **TOTAL** | **~22 hrs** | Fits within 14 days x 2 hrs/day |

### Session interleaving suggestion (first 4 days)
- **Day 1**: Paging (priority 1) + Semaphores intro (priority 4)
- **Day 2**: Memory Algorithms (priority 2) + Deadlock Detection (priority 3)
- **Day 3**: Banker's Algorithm (priority 5) + IPC Taxonomy (priority 6)
- **Day 4**: Practice exam full attempt (timed) -- then review gaps

---

## Key Formulas to Memorize

| Formula | Meaning |
|---------|---------|
| `Y = x + (a - A)` | Physical address from virtual address x, page base A, frame base a |
| `page# = VA / page_size` | Virtual page number |
| `offset = VA mod page_size` | Offset within page |
| `PA = frame# * page_size + offset` | Physical address construction |
| `p* = sqrt(2se)` | Optimal page size (s=avg process size, e=entry size) |
| `overhead = se/p + p/2` | Page table overhead + internal fragmentation |
| `U = 1 - p^n` | CPU utilization (p=I/O fraction, n=processes) |
| `Sum(C_ij) + A_j = E_j` | Deadlock detection invariant |
| Buddy block size = next power of 2 >= request | Buddy system allocation rule |
