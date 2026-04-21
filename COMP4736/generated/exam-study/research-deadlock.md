# COMP 4736 OS Final Exam: Deadlock Study Guide

**Source:** Part_9_Deadlock.pdf slides + Final_exam_practice_Sol.pdf

---

## 1. FOUR COFFMAN CONDITIONS FOR DEADLOCK

All four conditions must be present simultaneously for deadlock to occur:

1. **Mutual Exclusion**
   - Each resource is either currently assigned to exactly one process or is available
   - Resources cannot be shared among multiple processes simultaneously

2. **Hold and Wait**
   - Processes currently holding resources that were granted earlier can request new resources
   - A process may hold one resource while waiting for another

3. **No Preemption**
   - Resources previously granted cannot be forcibly taken away from a process
   - Resources must be explicitly released by the process holding them

4. **Circular Wait**
   - There must be a circular list of two or more processes, each of which is waiting for a resource held by the next member of the chain
   - Process P1 waits for resource held by P2, P2 waits for resource held by P3, ..., Pn waits for resource held by P1

---

## 2. RESOURCE ALLOCATION GRAPHS

### Single Instance Resources

**Structure:**
- Circles represent processes
- Squares represent resources
- Arrow from process → resource = request edge (process requesting resource)
- Arrow from resource → process = assignment edge (resource allocated to process)

**Example from slides:**
- Process A holds R, wants S
- Process B holds nothing, wants T
- Process C holds nothing, wants S
- Deadlock exists when there is a cycle in the graph
- Cycle detection = deadlock detection for single-instance systems

### Multiple Instance Resources

**Structure:**
- Resources have multiple instances available
- Cannot use simple cycle detection
- Must use matrix-based algorithm with C, R, E, A matrices

---

## 3. DEADLOCK DETECTION ALGORITHMS

### Detection with Single Instance (Cycle Detection)

**Algorithm Steps:**
1. Initialize L to empty list, mark all arcs as unmarked
2. Add current node to end of L, check if node appears in L twice
   - If yes, graph contains a cycle (deadlock), terminate
   - If no, continue
3. From given node, see if there are any unmarked outgoing arcs
   - If yes, go to step 4
   - If not, go to step 5
4. Pick unmarked outgoing arc at random, mark it, follow to new node, go to step 2
5. If this is initial node, graph contains no cycles (no deadlock), terminate
   - Otherwise, remove dead end, backtrack to previous node

**Key Concept:** A cycle in the resource allocation graph indicates deadlock when each resource has only one instance.

---

### Detection with Multiple Instances (Matrix Algorithm)

**Four Data Structures Required:**

1. **E (Existing Resources Vector)**
   - Total instances of each resource type in the system
   - Example: E = [4, 2, 3, 1] means 4 tape drives, 2 plotters, 3 scanners, 1 Blu-ray drive

2. **A (Available Resources Vector)**
   - Number of instances of each resource currently available (unassigned)
   - Ai = number of unassigned instances of resource i
   - Example: A = [2, 1, 0, 0]

3. **C (Current Allocation Matrix)**
   - Cij = number of instances of resource j held by process i
   - Row i = current allocation to process i
   - Row n × Column m (n processes, m resource types)

4. **R (Request Matrix)**
   - Rij = number of instances of resource j that process Pi wants
   - Row i = what process i still needs
   - Row n × Column m

**Fundamental Relationship:**
```
For each resource j: Σ(i=1 to n) Cij + Aj = Ej
(allocated + available = total existing)
```

**Algorithm Steps:**

1. Look for unmarked process Pi for which i-th row of R is less than or equal to A
   - If no such process exists, system will eventually deadlock
   
2. If such a process is found, assume it requests all resources needed and finishes
   - Mark the process
   - Add i-th row of C to A (release its resources)
   - Go back to step 1

3. Repeat until either:
   - All processes are marked (safe state - no deadlock)
   - No process can be found whose needs can be met (deadlock detected)

**Worked Example from Slides:**

**Initial State:**
```
E = [4, 2, 3, 1]  (Tape drives, Plotters, Scanners, Blu-rays)
A = [2, 1, 0, 0]

C (Allocation):        R (Request):
       T P S B               T P S B
P1  [  0 0 1 0 ]        P1 [  2 0 0 1 ]
P2  [  2 0 0 1 ]        P2 [  1 0 1 0 ]
P3  [  0 1 2 0 ]        P3 [  2 1 0 0 ]
```

**Detection Process:**

1. Check P1: R1=[2,0,0,1] ≤ A=[2,1,0,0]? NO (need 1 Blu-ray, have 0)
2. Check P2: R2=[1,0,1,0] ≤ A=[2,1,0,0]? NO (need 1 scanner, have 0)
3. Check P3: R3=[2,1,0,0] ≤ A=[2,1,0,0]? YES ✓

Mark P3, release: Anew = C3 + Aold = [0,1,2,0] + [2,1,0,0] = [2,2,2,0]

4. Check P1: R1=[2,0,0,1] ≤ A=[2,2,2,0]? NO (need 1 Blu-ray, have 0)
5. Check P2: R2=[1,0,1,0] ≤ A=[2,2,2,0]? YES ✓

Mark P2, release: Anew = C2 + Aold = [2,0,0,1] + [2,2,2,0] = [4,2,2,1]

6. Check P1: R1=[2,0,0,1] ≤ A=[4,2,2,1]? YES ✓

Mark P1, release: Anew = C1 + Aold = [0,0,1,0] + [4,2,2,1] = [4,2,3,1]

**Result: All processes marked → NO DEADLOCK**

---

## 4. BANKER'S ALGORITHM FOR DEADLOCK AVOIDANCE

### Safe vs Unsafe States

**Safe State:**
- There is some scheduling order in which every process can run to completion
- Even if all processes suddenly request their maximum number of resources, system can guarantee all will finish
- System is in a safe state if safe sequence exists

**Unsafe State:**
- No such guarantee can be given
- May lead to deadlock (but not guaranteed)
- System must deny resource requests that lead to unsafe states

**Key Principle:**
- A safe state the system can guarantee that all processes will finish
- From an unsafe state, no such guarantee can be given

### Banker's Algorithm for Single Resource

**Setup:**
- Customers = processes
- Units = resources
- Banker = operating system

**Algorithm:**
- Considers each request as it occurs
- Checks if granting it leads to a safe state
- If yes, request is granted
- If no, request is postponed until later

**Example: Total resources = 10**

| Process | Has | Max | Need |
|---------|-----|-----|------|
| A       | 0   | 6   | 6    |
| B       | 0   | 5   | 5    |
| C       | 0   | 4   | 4    |
| D       | 0   | 7   | 7    |

Free: 10

**Step 1: Check C (max=4)**
- C can finish: has 0, needs 4, free=10 ✓
- After C finishes: Free = 0 + 4 = 4

**Step 2: Check B (max=5)**
- B needs 5, free=4 ✗ (not satisfied at this point in sequence C,B)
- But can we find safe sequence? No - goes UNSAFE

**Result: Granting to C is safe, but granting sequentially A→C→... requires banker to analyze**

### Banker's Algorithm for Multiple Resources

**Algorithm Steps:**

1. Look for a row R in Request matrix whose unmet resource needs are all smaller than or equal to A (available)
   - If no such row exists, system will eventually deadlock

2. Assume the process of that row requests all needed resources and finishes
   - Mark that process as terminated
   - Add its row from C (allocation) to A (available vector)

3. Repeat steps 1 and 2 until either:
   - All processes are marked terminated (safe state)
   - No process can be found whose needs can be met (deadlock/unsafe)

**Worked Example: Multiple Resources**

**Initial State:**
```
C (Allocated):           R (Still Need):
    P T Sc Pr CD              P T Sc Pr CD
A [  3 0 1 1 ]          A [  0 1 0 0 ]
B [  0 1 0 0 ]          B [  0 1 1 2 ]
C [  1 1 1 0 ]          C [  3 1 0 0 ]
D [  1 1 0 1 ]          D [  0 0 1 0 ]
E [  0 0 0 0 ]          E [  2 1 1 0 ]

E = (6, 3, 4, 2)  (Resources in Existence)
A = (1, 0, 2, 0)  (Available)
```

**Check Each Process Against A=[1,0,2,0]:**

- A: [0,1,0,0] ≤ [1,0,2,0]? NO (need 1 Plotter, have 0)
- B: [0,1,1,2] ≤ [1,0,2,0]? NO (need 1 Plotter, have 0)
- C: [3,1,0,0] ≤ [1,0,2,0]? NO (need 3 Process slots, have 1)
- D: [0,0,1,0] ≤ [1,0,2,0]? YES ✓

Mark D, release: Anew = CD + Aold = [0,0,1,0] + [1,0,2,0] = [1,0,3,0]

Continue until all marked or deadlock detected.

**Result indicates if state is SAFE or UNSAFE based on whether all processes can be scheduled to completion.**

---

## 5. DEADLOCK PREVENTION (Attack Coffman Conditions)

### Attacking Mutual Exclusion

**Condition Definition:**
"Each resource is either currently assigned to exactly one process or is available"

**Solution: Spooling**
- By spooling printer output, several processes can generate output at the same time
- The spooler is the only process that actually uses the physical printer resource
- Reduces exclusive resource requirement

**Limitation:**
- Not all resources can be spooled
- Read-only data can be shared without spooling
- Cannot allow two processes to write to printer simultaneously (chaos)

### Attacking Hold-and-Wait

**Condition Definition:**
"Processes currently holding resources that were granted earlier can request new resources"

**Solution 1: Request All Resources Initially**
- Require processes to request all their resources before starting execution
- If everything is available, process will be allocated whatever it needs and can run to completion
- If one or more resources are busy, nothing will be allocated and the process will just wait

**Problems:**
- Many processes do not know how many resources they will need until they have started running
- Resources will not be used optimally (ties up resources that other processes could be using)

**Solution 2: Release-Then-Reacquire**
- A slightly different way to break hold-and-wait condition
- Require a process requesting a resource to first temporarily release all the resources it currently holds
- Then it tries to get everything it needs all at once

### Attacking No-Preemption

**Condition Definition:**
"Resources previously granted cannot be forcibly taken away from a process. They must be explicitly released by the process holding them."

**Solution: Take Resources Away**
- Forcibly preempt resources from processes

**Not Attractive Option Example:**
- Let process go halfway through its job
- Then forcibly take away printer
- Results can be unpredictable

**Key Point:**
"It is best to kill a process that can be rerun from the beginning with no ill effects."

Example: A compilation can always be rerun because all it does is read a source file and produce an object file. If it is killed partway through, the first run has no influence on the second run.

Counter-example: A process that updates a database cannot always be run a second time safely.

### Attacking Circular Wait

**Condition Definition:**
"There must be a circular list of two or more processes, each of which is waiting for a resource held by the next member of the chain."

**Solution: Global Numbering of Resources**

- Assign a unique number to every resource in the system
- Processes can request resources whenever they want, BUT all requests must be made in numerical order

**Result:**
- The resulting resource graph is cycle-free
- Prevents circular wait condition

**Example Resource Ordering:**
1. Imagesetter (2)
2. Printer (2)
3. Plotter (4)
4. Tape drive (4)
5. CD-ROM drive (5)

"A process is entitled only to a single resource at any moment. If it needs a second one, it must release the first one."

**Problem:** For a process that needs to copy a huge file from a tape to a printer, this restriction is unacceptable.

**Proof of Cycle Prevention:**
- Global numbering ensures: if process A holds resource i and requests resource j, then i < j
- Process B holding resource j cannot ask for resource i (since i < j violates ordering)
- Therefore, no cycle is possible: A requests i (already held), B requests j (already held), but B cannot request i

---

## 6. DEADLOCK RECOVERY

Once deadlock is detected, system must recover and get going again.

### Three Possible Methods

#### 1. Preemption
- Take a resource from some other process
- In some cases it may be possible to temporarily take a resource away from its current owner and give it to another process

**Depends on nature of the resource:**
- Can preempt a printer (spool output) - OK
- Cannot preempt a tape drive being used (data corruption) - problematic

#### 2. Rollback (Abort and Restart)
- **Checkpointing:** Periodically save process state (memory image and resource state) to file
- New checkpoints should not overwrite old ones but should be written to new files

**Recovery Process:**
- To recover, process that owns needed resource is rolled back to a point in time before it acquired that resource
- Process is restarted from one of its earlier checkpoints

#### 3. Killing Processes
- **Crude but simplest method:** Kill one or more processes to break deadlock

**Strategies:**
- Kill a process in the cycle
- Kill a process not in the cycle but holding resources needed by cycle members
- With some luck, other processes will be able to continue
- If not, repeat killing processes until cycle is broken

**Best Practice:**
"It is best to kill a process that can be rerun from the beginning with no ill effects."

- Compilation: can be rerun safely
- Database update: cannot always be rerun safely

---

## 7. FOUR DEADLOCK HANDLING STRATEGIES

| Strategy | Approach | When Used |
|----------|----------|-----------|
| **Ignore** | Stick your head in sand, pretend there is no problem | If deadlocks occur rarely (e.g., once every 5 years) |
| **Detection & Recovery** | Let deadlocks occur, detect them, take action | Systems that need to recover from rare deadlocks |
| **Dynamic Avoidance** | Careful resource allocation using safe states/Banker's algorithm | Real-time systems requiring guaranteed completion |
| **Prevention** | Structurally negate one of the four required conditions | Systems designed to prevent deadlocks at design time |

---

## 8. STARVATION VS DEADLOCK VS LIVELOCK

### Deadlock
- Process is blocked waiting for a resource held by another process
- Part of a circular chain where A waits for B, B waits for C, ..., C waits for A
- No forward progress possible for any process in cycle

### Starvation
- Process never gets the resource it needs despite repeatedly requesting it
- Not blocked, but never scheduled or never granted resource
- Unfair scheduling or resource allocation policy

### Livelock
- Similar to deadlock in that it can stop all forward progress
- **Key difference:** Technically different because processes are not actually blocked
- Processes appear active and making progress, but overall system is not making meaningful progress towards desired outcome

**Example:** Two people trying to pass each other on street - both politely step aside, but keep stepping the same way at the same time - no progress but both appear active

---

## 9. TWO-PHASE LOCKING

**Two-phase locking protocol ensures serializability in database transactions:**

1. **Growing Phase (Acquisition Phase)**
   - Transaction acquires locks on resources it needs
   - No locks are released

2. **Shrinking Phase (Release Phase)**
   - Transaction releases locks it has acquired
   - No new locks are acquired

**Key Property:**
- Once a transaction starts releasing locks, it cannot acquire any new locks
- Prevents deadlock in certain scenarios but can still lead to livelock

**Deadlock Potential:**
- If two transactions lock resources in different orders, deadlock can occur
- Example: T1 locks A then B, T2 locks B then A - circular wait possible

---

## 10. COMMUNICATION DEADLOCKS

**Occurs in message-passing systems:**

- Process P1 sends message to P2 and blocks waiting for reply
- Process P2 is blocked waiting for message from P3
- Process P3 is waiting for message from P1
- Circular wait on messages instead of resources

**Common in distributed systems and client-server architectures**

---

## 11. OSTRICH ALGORITHM

**Concept:**
- "Stick your head in the sand and pretend there is no problem."

**When to Use:**
- Mathematicians find deadlocks unacceptable and say that deadlocks must be prevented at all costs
- Engineers ask how often the problem is expected
- If deadlocks occur on the average once every five years, just ignore it

**Philosophy:**
- Simpler and more pragmatic than complex prevention schemes
- Cost-benefit analysis: prevention overhead vs. rare deadlock occurrence
- Used in many real systems (Windows, Linux for certain scenarios)

---

## 12. SUMMARY TABLE: PREVENTION APPROACHES

| Condition | Definition | Attack Method |
|-----------|-----------|---|
| **Mutual Exclusion** | Each resource assigned to ≤1 process | Spool everything |
| **Hold and Wait** | Processes holding resources request new ones | Request all initially OR Release then reacquire |
| **No Preemption** | Resources cannot be taken away | Preempt resources (process design dependent) |
| **Circular Wait** | Circular chain of processes waiting | Order resources numerically |

---

## EXAM PREPARATION: FLASHCARDS (20-25)

**Note: All source-tagged as "Part 9 Slide N"**

### Card 1: Four Coffman Conditions
Q: Name and briefly define the four conditions for deadlock.
A: 1) Mutual Exclusion - resource assigned to ≤1 process; 2) Hold and Wait - can hold resources and request new ones; 3) No Preemption - cannot forcibly take resources; 4) Circular Wait - circular chain of processes waiting for resources. (Part 9)

### Card 2: Resource Allocation Graph - Single Instance
Q: What does a cycle in a resource allocation graph indicate?
A: A cycle indicates deadlock exists in the system (for single-instance resources). Conversely, if no cycle exists, no deadlock. (Part 9 Deadlock Detection)

### Card 3: Matrix Algorithm - Fundamental Relationship
Q: State the fundamental relationship among C, E, A matrices.
A: For each resource j: Σ(i=1 to n) Cij + Aj = Ej (Sum of allocated + available = total existing) (Part 9)

### Card 4: Safe State Definition
Q: Define a safe state in deadlock avoidance.
A: Safe state - there is some scheduling order in which every process can run to completion even if all suddenly request their maximum resources. (Part 9 Avoidance)

### Card 5: Unsafe State vs Deadlock
Q: Is an unsafe state the same as deadlock?
A: No. Unsafe state may lead to deadlock but is not guaranteed to deadlock. Safe state guarantees no deadlock. (Part 9 Avoidance)

### Card 6: Banker's Algorithm - Core Idea
Q: What is the core idea of Banker's algorithm?
A: System grants resource requests only if resulting state is safe. If granting request leads to unsafe state, postpone request until later. (Part 9 Avoidance)

### Card 7: Single-Instance Cycle Detection Algorithm
Q: In the 5-step cycle detection algorithm for single-instance resources, what happens if a node appears in L twice?
A: Graph contains a cycle indicating deadlock exists. Algorithm terminates. (Part 9 Single Instance Detection)

### Card 8: Multiple-Instance Detection - Step 1
Q: In multi-instance deadlock detection, what must be true about a process's request row Ri?
A: Ri must be ≤ A (available vector) for that process to be considered for marking. If no such process exists, deadlock is detected. (Part 9 Multiple Instance)

### Card 9: Matrix Algorithm Example - When to Mark Process
Q: In the matrix algorithm, when can a process be marked as satisfied?
A: When its request row Ri satisfies: Ri ≤ A (all resource needs ≤ available). Then mark it, add its allocation Ci to A, repeat. (Part 9)

### Card 10: Recovery Method - Preemption
Q: What does recovery through preemption do?
A: Temporarily takes a resource away from its current owner and gives it to another process. Feasibility depends on resource type (spooling OK, tape drive risky). (Part 9 Recovery)

### Card 11: Recovery Method - Rollback
Q: Explain recovery through rollback.
A: Checkpoint process periodically (save memory + resource state). On deadlock, roll process back to earlier checkpoint before it acquired deadlock resource. (Part 9 Recovery)

### Card 12: Recovery Method - Killing
Q: What is the "crude but simplest" recovery method?
A: Kill one or more processes in the deadlock cycle. Best if killed process can be rerun from beginning safely (compilation OK, database update NO). (Part 9 Recovery)

### Card 13: Attacking Mutual Exclusion
Q: How can you attack the mutual exclusion condition?
A: By spooling - multiple processes can generate output simultaneously. Spooler is only process that accesses physical resource. Cannot work for all resources. (Part 9 Prevention)

### Card 14: Attacking Hold and Wait - Method 1
Q: First method to attack hold-and-wait condition?
A: Require processes to request ALL resources before execution. If available, allocate all at once; if any busy, allocate nothing. Problem: Resource underutilization. (Part 9 Prevention)

### Card 15: Attacking Hold and Wait - Method 2
Q: Alternative method to break hold-and-wait?
A: Release-then-reacquire: Process requesting resource must first release all current resources, then request everything needed at once. (Part 9 Prevention)

### Card 16: Attacking No Preemption
Q: Why is attacking no preemption not attractive?
A: Forcibly preempting resources (e.g., printer) from running process leads to unpredictable results. Only viable for rerunnable processes (compilation, not database update). (Part 9 Prevention)

### Card 17: Attacking Circular Wait
Q: How does global resource numbering prevent circular wait?
A: Assign unique number to each resource. Processes must request in numerical order. If A holds lower number i and requests higher j, B holding j cannot request lower i - no cycles possible. (Part 9 Prevention)

### Card 18: Starvation Definition
Q: How does starvation differ from deadlock?
A: Starvation - process repeatedly requests resource but never gets it (unfair scheduling/allocation). Deadlock - process blocked waiting for resource in circular dependency. (Part 9)

### Card 19: Livelock Definition
Q: What distinguishes livelock from deadlock?
A: Livelock - appears no forward progress but processes are not actually blocked. Like two people stepping aside on street, both appearing active but neither progressing. (Part 9 Other Issues)

### Card 20: Ostrich Algorithm
Q: When should the Ostrich algorithm be used?
A: When deadlocks occur very rarely (e.g., once every 5 years). Simple ignore approach. Cost-benefit: prevention overhead > rare deadlock impact. (Part 9)

### Card 21: Safe Sequence Concept
Q: In Banker's algorithm, what is a safe sequence?
A: Ordering of processes P1, P2, ..., Pn in which each Pi can finish with available resources after each previous process completes. (Part 9 Avoidance)

### Card 22: Matrix Dimensions
Q: What are the dimensions of C and R matrices?
A: Both n × m where n = number of processes, m = number of resource types. C = current allocation, R = still needed. (Part 9 Multiple Instance)

### Card 23: Deadlock Detection Overhead
Q: What is the trade-off in detecting deadlock with multiple instances?
A: Computational overhead to check all processes' requests vs. E, A vectors. More expensive than single-instance cycle detection but necessary for real systems. (Part 9)

### Card 24: Two-Phase Locking
Q: What are the two phases of two-phase locking?
A: 1) Growing phase - acquire locks; 2) Shrinking phase - release locks. Once shrinking starts, no new locks acquired. Ensures serializability but can cause livelock. (Part 9 Two-Phase)

### Card 25: Four Handling Strategies
Q: Name the four main strategies for dealing with deadlocks.
A: 1) Ignore (Ostrich); 2) Detection & Recovery; 3) Dynamic Avoidance (Banker's); 4) Prevention (negate Coffman condition). (Part 9)

---

## PRACTICE QUESTIONS (8-10 Focused on Matrix Computation & Distinguishing Approaches)

### Question 1: Matrix Algorithm - Full Computation

Given the following system state:

```
E = [3, 1, 2]  (Resources in existence: 3 of Type-1, 1 of Type-2, 2 of Type-3)
A = [0, 0, 1]  (Available)

C (Allocation):        R (Still Need):
    T1 T2 T3              T1 T2 T3
P1 [ 2  1  0 ]        P1 [ 1  0  0 ]
P2 [ 1  0  1 ]        P2 [ 0  0  1 ]
P3 [ 0  0  1 ]        P3 [ 2  1  1 ]
```

Determine: Is the system in deadlock? Show your work using the matrix algorithm.

**Answer:** 
1. Check P1: R1=[1,0,0] ≤ A=[0,0,1]? NO
2. Check P2: R2=[0,0,1] ≤ A=[0,0,1]? YES → Mark P2
   - Anew = C2 + Aold = [1,0,1] + [0,0,1] = [1,0,2]
3. Check P1: R1=[1,0,0] ≤ A=[1,0,2]? YES → Mark P1
   - Anew = C1 + Aold = [2,1,0] + [1,0,2] = [3,1,2]
4. Check P3: R3=[2,1,1] ≤ A=[3,1,2]? YES → Mark P3
   - All processes marked → **NO DEADLOCK** (safe state)

---

### Question 2: Distinguish Detection vs. Prevention vs. Avoidance

The system detects a deadlock has occurred. Which approach is being used, and what happens next?

A) Detection and Recovery - The system already detected the deadlock after it occurred and now must recover using preemption, rollback, or process killing.
B) This is NOT prevention (which stops deadlock beforehand) or avoidance (which prevents entry to unsafe states).
C) Next steps: Choose recovery method - preemption (if resource allows), rollback (restore checkpoint), or kill process.

---

### Question 3: Safe vs. Unsafe State Determination

Banker's algorithm examines whether granting a resource request leads to a safe or unsafe state. Given:

```
Process A: has 2, max 5, needs 3 more
Process B: has 1, max 4, needs 3 more
Total resources: 5, Currently free: 2
```

Should the system grant A's request for 1 more resource? Explain.

**Answer:**
After granting (A would have 3, needs 2 more):
- Free would be: 2-1=1
- Check safe sequence: Can B finish? Has 1, needs 3, free=1? NO
- Can A finish next? Has 3, needs 2, free=1? NO
- **UNSAFE STATE** → **DO NOT GRANT** (postpone until more resources free)

---

### Question 4: Coffman Conditions - Which Attack?

Process A holds Printer and wants Tape Drive.
Process B holds Tape Drive and wants Printer.

Deadlock exists. Which Coffman condition is at the root cause, and what is the prevention strategy?

**Answer:**
- **Circular Wait condition** is at root (A→Tape held by B, B→Printer held by A, forms cycle)
- **Prevention strategy:** Assign resource numbers: Printer=1, Tape=2. Both processes must request in order 1,2. A would request Printer(1) first, get it, then Tape(2). B cannot request Printer(1) after Tape(2) without violating order. Prevents cycle.

---

### Question 5: Resource Allocation Graph - Cycle Analysis

Draw or describe the resource allocation graph for:
- Process P1 holds Resource R1, wants R2
- Process P2 holds R2, wants R3
- Process P3 holds R3, wants R1

Does a cycle exist? Is there deadlock?

**Answer:**
Edges: R1→P1→R2→P2→R3→P3→R1
**YES, cycle exists: R1→P1→R2→P2→R3→P3→R1**
**YES, deadlock exists** (for single-instance resources, cycle = deadlock)

---

### Question 6: Banker's Algorithm - Single Resource

Total resources = 20
```
Process | Has | Max | Need to finish
A       | 8   | 15  | 7
B       | 5   | 10  | 5
C       | 2   | 8   | 6
```

Free: 5

Can all processes finish safely? Which process(es) can complete?

**Answer:**
- A needs 7, has free 5 → Cannot finish
- B needs 5, has free 5 → **Can finish** ✓
- C needs 6, has free 5 → Cannot finish

After B finishes: Free = 5+5 = 10
- A needs 7, has free 10 → **Can finish** ✓
- C needs 6, has free 10 → **Can finish** ✓

**Safe sequence exists: B, A, C → YES, system is safe**

---

### Question 7: Recovery Methods - Choosing Appropriately

Three deadlocked processes:
1. Compilation process (reads source, produces object)
2. Database transaction updating ledger
3. File copy operation

Which is best to kill for recovery, and why?

**Answer:**
**Process 1 (Compilation)** is best to kill because:
- Can be rerun from beginning with no ill effects
- Reading source file again will produce same object file
- Previous partial compilation has no influence on second run

**NOT Process 2** - database update creates state dependencies; rerunning may apply updates twice
**NOT Process 3** - file copy is mid-operation; partial results may be corrupt

---

### Question 8: Hold-and-Wait Prevention Trade-offs

Compare two methods to break hold-and-wait condition:

**Method 1:** Request all resources before execution starts
**Method 2:** Release then reacquire as needed

Which is more resource-efficient and why?

**Answer:**
**Method 2** (release-then-reacquire) is more efficient because:
- Method 1 ties up all resources for entire process duration, even if not all used simultaneously
- Resources sit idle that could be used by other processes
- Method 2 allows releasing unneeded resources, freeing them for others
- Trade-off: Method 1 is simpler/safer; Method 2 is complex but more efficient

---

### Question 9: Ostrich Algorithm Applicability

When is the Ostrich algorithm (ignoring deadlock) appropriate vs. inappropriate?

**Inappropriate (Use Prevention/Avoidance):**
- Real-time systems with hard deadlines (aircraft autopilot, medical devices)
- Critical financial systems
- Systems where rare deadlock is still unacceptable

**Appropriate (Ignore):**
- Desktop/server systems where rare deadlock (every 5 years) can be handled by reboot
- Systems where prevention/avoidance overhead exceeds benefit of eliminating rare deadlock

---

### Question 10: Matrix Algorithm - Detect Deadlock Scenario

```
E = [5, 3, 4]

C = P1 [1, 2, 0]
    P2 [2, 0, 1]
    P3 [1, 1, 0]

R = P1 [0, 0, 2]
    P2 [1, 2, 2]
    P3 [3, 0, 1]
```

Calculate A (Available) and determine if system is deadlocked.

**Answer:**
A = E - (sum of each column in C)
- Column 1: 5 - (1+2+1) = 1
- Column 2: 3 - (2+0+1) = 0
- Column 3: 4 - (0+1+0) = 3

A = [1, 0, 3]

Check:
1. P1: [0,0,2] ≤ [1,0,3]? YES → Mark P1, Anew=[1,0,3]+[1,2,0]=[2,2,3]
2. P2: [1,2,2] ≤ [2,2,3]? YES → Mark P2, Anew=[2,2,3]+[2,0,1]=[4,2,4]
3. P3: [3,0,1] ≤ [4,2,4]? YES → Mark P3

**All processes marked → NO DEADLOCK, system is SAFE**

---

## KEY FORMULAS & DEFINITIONS

**Resource Conservation:**
```
Σ Cij + Aj = Ej    for each resource j
(allocated + available = total)
```

**Safe State Check:**
```
Safe if ∃ sequence where each process Pi: Ri ≤ A
(each process's needs ≤ currently available, considering prior releases)
```

**Available Resources After Process Termination:**
```
Anew = Aold + Ci    (release process i's allocations)
```

**Circular Wait Ordering:**
```
If process A holds resource i and requests j, then i < j (numerical order)
Ensures: No process holding j can request i → prevents cycles
```

---

**Document Source:** Part_9_Deadlock.pdf (106 pages), Final_exam_practice_Sol.pdf
**Last Updated:** 2026-04-18
**Study Focus:** Matrix algorithms, C/R/E/A matrices, safe sequences, Coffman conditions, prevention strategies

