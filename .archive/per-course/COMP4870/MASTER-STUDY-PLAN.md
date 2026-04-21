# TERM 4 — Master Study Plan (Foundation-First, 7 days)

**Generated**: 2026-04-17 (Fri)
**Window**: 7 days, 4 exams
**Student state**: Barely knows any of the 4 courses. Foundation-building required before drill work.

---

## Exam schedule

| # | Date | Time | Course | Scope |
|---|------|------|--------|-------|
| 1 | Mon Apr 20 | 10:30–12:30 | **COMP 4911** | COMPREHENSIVE — RUP + EJB 3.1 (all 18 chapters) |
| 2 | Tue Apr 21 | 15:30–17:30 | **COMP 4736** | IPC / Deadlock / Memory + earlier topics |
| 3 | Thu Apr 23 | 13:30–15:30 | **COMP 4915** | COMPREHENSIVE — Mod01-Mod10E |
| 4 | Fri Apr 24 | 10:30–12:30 | **COMP 4870** | Weeks 7-13, 60 min, 80 marks |

### 4870 exam structure (updated)
- **60 MCQ** (60 marks) + **10 match** (10 marks) + **1 coding** (10 marks) = **80 total**, 60 min
- **Cheat sheet**: 8.5×11, both sides, **HAND-WRITTEN** (not printed)
- **Topic weights (MCQ + match = 70 marks)**:

| Topic | Marks | Priority |
|-------|-------|----------|
| AI (SK/Ollama/MAF/MCP) | 13 | **CRITICAL** |
| ML.NET | 12 | **CRITICAL** |
| Cache / Redis | 8 | High |
| File-based apps | 8 | High |
| gRPC | 7 | High |
| TDD / xUnit | 6 | High |
| Aspire | 5 | Medium |
| Localization | 4 | Medium |
| Tag Helpers | 3 | Low-Med |
| Blazor | 2 | Low |
| Excel/PDF/Chart | 2 | Low |

AI + ML.NET = 25 of 70 marks (36%). Novel tech — needs ramp time. Started early on Fri.

---

## Strategy

**Foundation → Drill → Skim.** Because you barely know the material:
1. **Foundation day(s)**: read slides, build mental model, write notes
2. **Drill day**: flashcards, past quizzes, mock exams under timed conditions
3. **Skim morning-of**: re-read your own notes, no new material

**Per-exam allocation (asymmetric by complexity)**:
- 4911 (comprehensive, novel): **2 days** — Sat foundation + Sun drill
- 4736 (4 topics, pattern-heavy): **~1 day** — Mon PM foundation + Tue AM drill
- 4915 (comprehensive, 10 modules): **~1.5 days** — Wed full + Thu AM drill
- 4870 (breadth, cheat sheet, 2 novel topics): **1.5 days split** — Fri evening AI/ML.NET seed + Thu PM + Fri AM

**Hard rules**:
- 7+ h sleep each night, 23:00 cutoff
- Morning-of = notes re-read only, no new material
- After each exam: 1-2 h decompress before pivoting
- Active recall > re-reading. Quizzes > slides. Mocks > notes.

---

## Day-by-day

### **Fri Apr 17 (today)** — 4870 AI/ML.NET seed + 4911 orientation
*Novel 4870 topics (25 pts) need days to soak in. Start now.*

`cd COMP4870`

| Time | Block | Activity |
|------|-------|----------|
| 18:00–19:30 | 4870 ML.NET | Open `materials/slides/ML.NET.pptx`. Skim `notes/ML.NET_VSCODE_SCRIPT.docx`. Goal: understand what ML.NET is, typical workflow (load data → train → predict). Start bullet list in raw text for cheat sheet. |
| 19:30–19:45 | break | — |
| 19:45–21:00 | 4870 AI/SLM | Open `materials/slides/CSharp_Meets_AI.pptx` + `SLM.pptx`. Skim `notes/AI-Models_MAF_SCRIPT.docx` + `SLM.docx`. Semantic Kernel kernel/plugins/functions concept. Ollama local model. MCP basics. Add to cheat sheet draft. |
| 21:00–22:00 | 4911 orient | `cd ../COMP4911`. Read `generated/diagnosis.md`. Scroll `materials/past-exams/Comp4911ReviewProcess.pdf` + `Comp4911ReviewTechnical.pdf`. Don't study — just scout. |
| 22:30 | sleep | — |

**Goal**: AI + ML.NET no longer cold. 4911 scope understood.

---

### **Sat Apr 18** — 4911 Foundation Day
*Comprehensive, novel, Mon exam = 2 prep days needed.*

`cd COMP4911`

| Time | Block | Activity |
|------|-------|----------|
| 09:00–10:30 | EJB basics | `slides/EJB01 02Introduction and Architecture.pdf`. What is an EJB, container services. Ch 3-4. |
| 10:30–10:45 | break | — |
| 10:45–12:30 | 3 session beans | Ch 5 Stateless, Ch 6 Stateful, Ch 7 Singleton. **Bruce flagged as high priority.** Container-managed concurrency lock types from Ch 7 (@Lock(READ/WRITE), concurrent access timeout). |
| 12:30–13:30 | lunch | — |
| 13:30–15:00 | JPA / Entities | Ch 9 EntityManager (persist/merge/remove/find/flush). Ch 10 mapping persistent objects (@Entity, @Id, @Column, @Table). |
| 15:00–15:15 | break | — |
| 15:15–16:45 | Entity relationships | Ch 11 — **seven types**, Bruce's high-priority technical area. One-to-one, one-to-many, many-to-one, many-to-many (uni + bi). Cascade options. Fetch strategies. Composite keys (embedded vs id-class). |
| 16:45–17:00 | break | — |
| 17:00–18:30 | JPQL | Ch 13 — students struggle here, fair game on final. Practice writing SELECT, JOIN, WHERE queries. Named queries. Criteria API basics. |
| 18:30–19:30 | dinner | — |
| 19:30–21:00 | RUP Process I | `Comp4911ReviewProcess.pdf`. Phases: Inception/Elaboration/Construction/Transition. Milestones: LCO/LCA/IOC/PR. SW best practices (6). |
| 21:00–22:00 | Quiz cold | Work `past-exams/comp4911_quiz3.md` cold. Don't worry about low score — diagnostic. |
| 22:30 | sleep | — |

**Goal**: Mental model of EJB stack + RUP phases. Quiz3 graded, gaps known.

---

### **Sun Apr 19** — 4911 Drill Day (exam tomorrow)

`cd COMP4911`

| Time | Block | Activity |
|------|-------|----------|
| 09:00–10:30 | Quizzes hard | Re-do Quiz3 (should improve). Work Quiz4 cold. **Bruce: quiz questions reappear on final verbatim.** Memorize every missed answer. |
| 10:30–10:45 | break | — |
| 10:45–12:15 | RUP Process II | Use-case driven dev. Architecture-centric (know lightly — **Bruce: 4+1 NOT on final**). Requirements capture. BCE classes (Boundary/Control/Entity). |
| 12:15–13:15 | lunch | — |
| 13:15–14:30 | More technical | Ch 12 Entity inheritance (SINGLE_TABLE, TABLE_PER_CLASS, JOINED). Ch 14 Entity callbacks/listeners. Ch 17 Transactions (CMT, @TransactionAttribute, isolation). |
| 14:30–14:45 | break | — |
| 14:45–16:00 | Earned Value + Testing | EVMS (PV, EV, AC, CV, SV, CPI, SPI) — 5 midterm questions on this. Ch 15 EJB security skim. |
| 16:00–16:15 | break | — |
| 16:15–17:30 | `/mockexam 1` | Timed. `/mockexam` in COMP4911. Don't peek. |
| 17:30–18:30 | dinner + grade | Mark mock, identify gaps. |
| 18:30–20:00 | Gap drill | Re-skim weak slides. Re-do quizzes 3+4 one more time. Big-picture: connect RUP → EJB. Bruce: "students fail because stuck in details." Teach-back out loud. |
| 20:00–21:00 | Code annotation | Practice: given a class, annotate `@Entity` first, THEN members (Bruce warning). Write a relationship annotation from scratch. |
| 21:00–22:00 | Light cheat-notes | Make a one-page hand summary of review slide decks (won't bring to exam — check if allowed). Go to bed early. |
| 22:30 | sleep | — |

**Skip**: MDB deep dive (Ch 8 — low question count per Bruce). Java EE Design (Ch 18). 4+1 view.

---

### **Mon Apr 20** — 4911 exam → 4736 Foundation

| Time | Block | Activity |
|------|-------|----------|
| 07:00–09:00 | 4911 skim | Coffee + read your notes + re-skim review decks. No new material. |
| 09:30 | commute | SW05 2875 |
| **10:30–12:30** | **EXAM 4911** | — |
| 12:30–14:00 | lunch + decompress | Walk. Don't start 4736 yet. |
| 14:00–15:30 | 4736 Intel | `cd ../COMP4736`. Read `generated/diagnosis.md`. Open Part 10 (Memory) slides + Part 9 (Deadlock). |
| 15:30–15:45 | break | — |
| 15:45–17:30 | 4736 Paging | Part 10 slides 47-72. Address translation `Y = x + (a - A)`. Page/offset splitting. **Work practice final Q1, Q3, Q4, Q7** — these are 4 of 8 written questions. Binary conversion until automatic. |
| 17:30–18:30 | dinner | — |
| 18:30–20:00 | 4736 Memory alloc | First/Best/Worst/Next Fit. Trace each on a sample request sequence. Buddy System (split, coalesce, tree diagrams). **Work Q2, Q8.** |
| 20:00–20:15 | break | — |
| 20:15–21:45 | 4736 Deadlock | Four Coffman conditions (memorize). C/R/E matrices (Q5). Matrix detection algorithm (Part 9 slides 45-59) — trace step by step. Banker's algorithm (avoidance). |
| 21:45–22:30 | 4736 IPC concepts | Part 1 MCQ/TF fodder. Semaphores basics. Classic problems (Producer-Consumer, Readers-Writers, Dining Philosophers) — names + one-sentence each. |
| 22:30 | sleep | — |

---

### **Tue Apr 21** — 4736 Drill → exam → rest

`cd COMP4736`

| Time | Block | Activity |
|------|-------|----------|
| 08:00–09:30 | 4736 drill | Re-do practice final Q1-Q8 cold. Target: all 8 automatic. |
| 09:30–09:45 | break | — |
| 09:45–11:30 | 4736 Part 1 (MCQ/TF) | Linux IPC: pipes, named pipes, shared memory, message queues, sockets, signals (SIGKILL, SIG_IGN, SIG_DFL). Peterson's algorithm, TSL instruction. |
| 11:30–12:30 | lunch | — |
| 12:30–13:45 | 4736 Memory Part 2 | Virtual memory, MMU, TLB. Page faults. Single-level, two-level, inverted page tables. Optimal page size formula. |
| 13:45–14:15 | 4736 `/mockexam 1` partial | If time — 30 min drill on a mixed set. |
| 14:15–14:45 | 4736 skim | Cheat items on one page: `Y = x + (a - A)`, 4 Coffman conditions, fit algorithms, matrix detection steps. NO NEW MATERIAL. |
| 14:45–15:15 | snack + break | — |
| 15:15–15:20 | commute | SW05 1850 |
| **15:30–17:30** | **EXAM 4736** | — |
| 17:30+ | REST | 2 exams down. No 4915 tonight. Recovery sleep. |
| 21:30 | sleep | Early bedtime to reset. |

---

### **Wed Apr 22** — 4915 Foundation (comprehensive, 10 modules)

`cd COMP4915`

Full day because comprehensive + unfamiliar material. Ruthless about breadth.

| Time | Block | Activity |
|------|-------|----------|
| 08:30–09:30 | Intel + quizzes | Read `generated/diagnosis.md`. Open `past-exams/Comp4915 Review.pdf`. Work `comp4915_quiz3.md` + `comp4915_quiz4.md` cold. **Bruce: may reappear.** |
| 09:30–09:45 | break | — |
| 09:45–11:15 | Mod01-02 (Linux basics) | `Mod01` + `Mod02`. Filesystem hierarchy. Permissions (symbolic + octal). grep, find, tar, wc, tr. **grep with `*` — glob vs regex trap (Bruce).** |
| 11:15–11:30 | break | — |
| 11:30–12:30 | Mod03-04 (networking + bash) | SSH, FTP, r-commands. Bash variables, quoting, expansions (all 7 types — Bruce: all fair game). **Special parameters**: `$0 $# $@ $* $? $$ $!`. |
| 12:30–13:30 | lunch | — |
| 13:30–14:30 | Mod05-06 (sysadmin) | Boot sequence, **system run levels** (Bruce). systemd basics. User/group mgmt. SSH key auth, tunneling. fstab (basics only per Bruce). |
| 14:30–14:45 | break | — |
| 14:45–16:00 | Mod07 (net services, NOT on midterm) | **HIGH PRIORITY.** NIS (ypinit, ypcat, securenets). LDAP (DN/RDN/CN/DC, ports 389/636). NFS (/etc/exports, 111/2049). Samba (smb.conf sections, smbpasswd, testparm). |
| 16:00–16:15 | break | — |
| 16:15–17:30 | Mod08 (DNS/iptables/Apache, NOT on midterm) | **HIGH PRIORITY.** iptables: 3 tables (Filter/NAT/Mangle), 5 chains (INPUT/OUTPUT/FORWARD/PRE/POST), rule syntax. DNAT vs SNAT vs MASQUERADE. Apache: httpd.conf 3 sections, `<Directory>`, .htaccess. DNS basics (BIND). |
| 17:30–18:30 | dinner | — |
| 18:30–19:45 | Mod09 (shell prog, NOT on midterm) | **HIGHEST PRIORITY.** if/elif/fi, for/while/until, case/esac, test/`[ ]`, here docs. **C vs bash function** — Bruce: will ask you to write a C function. Function precedence (alias > builtin > function > path). |
| 19:45–20:00 | break | — |
| 20:00–21:15 | Mod10 (Kubernetes, NOT on midterm) | **HIGHEST PRIORITY.** Pod. 8 Linux namespace types (mnt, pid, net, ipc, uts, user, cgroup, time). Pause container. kube-apiserver/scheduler/controller-manager. QoS classes. cgroups v1 vs v2. CNI: Calico (BGP/L3), Antrea (OVS/L2), Cilium (eBPF). |
| 21:15–22:00 | Mock | `/mockexam 1` partial or weak-area drill. |
| 22:30 | sleep | — |

**Goal**: Every module has been touched at least once. Mod07-10 (uncovered by midterm) prioritized last in order of weight.

---

### **Thu Apr 23** — 4915 Drill → exam → 4870 Drill

`cd COMP4915` → exam → `cd ../COMP4870`

| Time | Block | Activity |
|------|-------|----------|
| 08:00–09:30 | 4915 quiz redo | Re-do quizzes 3+4 — should score higher. Drill missed areas. |
| 09:30–09:45 | break | — |
| 09:45–11:15 | 4915 essay practice | Essay-level: "Define Pod", "Write iptables rule to drop port 80 from IP X", "Explain 8 namespace types", "Compare QoS classes from YAML". Write answers out. |
| 11:15–11:30 | break | — |
| 11:30–12:30 | 4915 skim | Special parameters table. QoS classification cheatsheet. C vs bash function distinction. Function precedence. No new material. |
| 12:30–13:00 | snack + commute prep | — |
| 13:00–13:20 | commute | SW01 3190 |
| **13:30–15:30** | **EXAM 4915** | — |
| 15:30–16:30 | decompress | Walk + snack. |
| 16:30–18:00 | 4870 Drill I: AI + ML.NET | `cd ../COMP4870`. Revisit Fri's notes. Key items: Semantic Kernel (kernel builder, plugins, kernel functions, prompt templates), Ollama (local LLM, `ollama run`), MCP (client/server, tools/resources/prompts), ML.NET (MLContext, IDataView, train/save/load model, AutoML). Start populating cheat sheet with code skeletons. |
| 18:00–19:00 | dinner | — |
| 19:00–20:30 | 4870 Drill II: Cache/Redis + File-based apps (16 pts combined) | IMemoryCache pattern (`TryGetValue`/`Set` with `MemoryCacheEntryOptions`). `<cache>` tag helper attributes (`expires-after`, `vary-by-*`). Redis CLI (`set`, `get`, `setex`, `ttl`). `AddStackExchangeRedisCache`. File-based apps (new minimal-API file-scoped `.cs` files). |
| 20:30–20:45 | break | — |
| 20:45–22:00 | 4870 Drill III: gRPC + TDD + breadth | gRPC: .proto file, service/method/message, Unary vs ServerStreaming vs ClientStreaming vs Bidirectional, Aspire host integration. TDD: xUnit basics (`[Fact]`, `[Theory]`, `Assert.Equal`). Coding question likely. Then breadth touch: Aspire (AppHost, ServiceDefaults), Localization (.resx, `IStringLocalizer`), TagHelpers custom + built-in, Blazor recap, Excel/PDF/Chart. |
| 22:00–22:30 | Cheat sheet final pass | Hand-write everything onto 8.5×11 paper, both sides. Organize by topic, code patterns + key terms. Hand-written only — this is the pass lifeline. |
| 22:30 | sleep | — |

---

### **Fri Apr 24** — 4870 skim → final exam

| Time | Block | Activity |
|------|-------|----------|
| 06:30–08:30 | 4870 skim | Coffee + re-read cheat sheet. Quiz yourself on topic-by-topic recognition. No new material. |
| 08:30–09:45 | 4870 drill | Practice the coding question target (guess: gRPC service method OR TDD xUnit test OR ML.NET pipeline). Write 2 versions from memory. |
| 09:45–10:00 | cheat sheet review | Final read-through. Ensure every topic has something. |
| 10:00–10:20 | commute | SE12-327 |
| **10:30–12:30** | **EXAM 4870** (60 min test in 2-hr window) | Cheat sheet in hand. Remember: 60 MCQ + 10 match + 1 coding. |
| 12:30 | 🎉 DONE | Term over. Sleep. Celebrate. |

---

## Per-exam "last 90 min" triage

If a cram block runs short:

- **4911**: quizzes 3+4 verbatim → both review decks headings → 3 session beans + 7 entity relationships + JPQL syntax → Bruce's emphasis list.
- **4736**: practice final Q1-Q8 → `Y = x + (a - A)` formula → Banker's algorithm → 4 Coffman conditions → fit algorithms.
- **4915**: `Comp4915 Review.pdf` → quizzes 3+4 → Pod + 8 namespaces + iptables rule syntax + special parameters + C function syntax.
- **4870**: **cheat sheet FIRST** → ML.NET workflow + Semantic Kernel core pattern + Redis commands + gRPC .proto → every topic name must trigger something in your head for MCQ recognition.

---

## 4870 cheat sheet template (fill over 3 sessions: Fri, Thu, Fri AM)

Organize front/back by topic weight. Suggested layout:

**Front side**:
1. **AI / Semantic Kernel / Ollama / MCP** (13 pts) — kernel builder code, plugins, Ollama commands, MCP client/server skeleton
2. **ML.NET** (12 pts) — MLContext, IDataView, `LoadFromTextFile`, trainer examples (SdcaLogistic, FastTree), `model.Save`, AutoML snippets
3. **Cache / Redis** (8 pts) — IMemoryCache pattern, `<cache>` attributes, Redis CLI, AddStackExchangeRedisCache
4. **File-based apps** (8 pts) — what they are, minimal-API structure, `dotnet run app.cs`

**Back side**:
5. **gRPC** (7 pts) — .proto syntax, 4 service types, .NET client/server setup
6. **TDD/xUnit** (6 pts) — `[Fact]`, `[Theory]`, `Assert.*`, Arrange/Act/Assert
7. **Aspire** (5 pts) — AppHost, ServiceDefaults, `builder.AddProject`
8. **Localization** (4 pts) — resx, IStringLocalizer, RequestLocalizationOptions
9. **TagHelpers** (3 pts) — custom vs built-in
10. **Blazor** (2 pts) — Server vs WASM one-liner
11. **Excel/PDF/Chart** (2 pts) — library names + one-line usage

---

## Sleep + well-being

- 7+ h sleep every night. No exceptions. 40% encoding deficit if you skip (Yoo et al. 2007).
- 23:00 cutoff (earlier on Tue + Thu post-exam days).
- Breakfast before each exam.
- Arrive 10 min early to each room.
- Walk 15 min between study blocks.

---

## Commands

```
/diagnose              # already done per course
/flashcards [topic]    # atomic cards
/explain [concept]     # Socratic breakdown
/mockexam [N]          # timed practice
/weakspots             # blind-spot surfacer
```

Run from inside each course folder.
