# Topic map — 3522 (COMP 3522 Object-Oriented Programming 2, Python)

Date: 2026-04-20
Exam: 2026-04-21 (tomorrow, 1pm-3pm, SW05-1840, 90 min, paper)

## Sources scanned
- `Course Outline Object Oriented Programming.pdf` — syllabus, schedule, learning outcomes
- `COMP3522_Final_Exam_Info BBY4.pdf` — final format, study strategy
- `3522 Midterm Info BBY6.pdf` — midterm format (past)
- `DesignPatternsTable (1).pdf` — 14 patterns with UML + examples (god artifact)
- `finalexamsmerge.pdf` — 51p past final (Dec 2024) + practice exams w/ solutions
- `practiceGuidedQuestion-sol.pdf` — SOLID → Strategy refactor guided question
- `COMP3522_Week14_Review_Slides2.pdf` — review slides (DIP, OCP, Law of Demeter, cProfile) + quiz items
- 13× weekly slide PDFs (W1–W14), 146 lecture transcripts, 5 quizzes, mock midterms, sample code dirs (skimmed index)

## Exam meta (from syllabus + exam-info)
- Code: COMP 3522
- Name: Object Oriented Programming 2
- Date: 2026-04-21T13:00:00-07:00
- Format: 90 min paper exam · T/F (5 × 1 mk = 5) · MCQ (15 × 2 mk = 30) · UML Draw (4 mk) · What's the Output (4 mk) · Guided Coding (2 parts, 8 mk) · Total 51 mk → 30% of grade
- Room: SW05-1840
- Allowed: 2 double-sided 8.5×11" cheat sheets (4 sides total), Arial ≥10pt
- Instructor: Jeffrey Yim
- Cumulative but more focus on post-midterm (design patterns). Pre-midterm material indirectly tested (e.g. writing a pattern needs classes/polymorphism/ABC).

## Modules (6)

### Module 1: Python Advanced Language Features — python-advanced
- Topic: Slicing & ranges — slicing-ranges
  - Weight: ~3% of final
  - Difficulty: low
  - God-node: no
  - Tags: [python, sequences, ranges]
  - Source: Week 4 Slides, Quiz 4
  - Notes: T/F on `range()` laziness (false — returns range obj, not generator). `range(0)` + `range(5,0)` empty.
- Topic: Exceptions & `with` — exceptions-with
  - Weight: ~5%
  - Difficulty: mid
  - God-node: no
  - Tags: [exceptions, context-manager, error-handling]
  - Source: Week 4 Slides, Quiz 4, past finals T/F on args attribute
  - Notes: Custom exception classes, `try/except/finally/else`, `__enter__/__exit__`, `args` tuple, `raise from`.
- Topic: Unit testing (unittest) — unit-testing
  - Weight: ~3%
  - Difficulty: mid
  - God-node: no
  - Tags: [testing, assertions]
  - Source: Week 4 Slides, Dec 2024 final Q4-5 (assertRaises / assertIsNone nuance)
  - Notes: Past final pitfall: `assertIsNone(result)` fails when `result != None` — both test_divide_by_zero + test_safe_division can fail if intent doesn't match return.
- Topic: Function overloading & args — function-overloading-args
  - Weight: ~3%
  - Difficulty: mid
  - Tags: [functions, args, kwargs, overloading]
  - Source: Week 4 Slides, Quiz 4
  - Notes: Python has no true overloading — simulate with default args, `*args`, `**kwargs`, `@singledispatch`. Packing/unpacking.
- Topic: Comprehensions — comprehensions
  - Weight: ~4%
  - Difficulty: mid
  - Tags: [comprehensions, list, dict, set, generator-expr]
  - Source: Week 5 Slides, past exams
  - Notes: Past final short Q: generate `[(len(w), w) for w in words]`. Nested comprehension output tricks.
- Topic: File handling / JSON — file-json
  - Weight: ~2%
  - Difficulty: low
  - Tags: [files, json]
  - Source: Week 4 Slides
  - Notes: `json.dumps()` returns a string (doesn't write file — use `json.dump()`). Past T/F pitfall.
- Topic: Enums — enums
  - Weight: ~2%
  - Difficulty: low
  - Tags: [enums]
  - Source: Week 5 Slides
  - Notes: `Enum`, `auto()`, iteration, comparison.

### Module 2: OOP Foundations (Python) — oop-foundations
- Topic: Classes, objects, self, privacy — classes-objects
  - Weight: ~4%
  - Difficulty: low
  - Tags: [class, object, privacy, name-mangling]
  - Source: Week 2 Slides, Quiz 2
  - Notes: `__x` name-mangling, `_x` convention. "Everything in Python is an object" — T (past final T/F).
- Topic: Decorators (language feature — `@staticmethod`, `@classmethod`, `@property`) — decorators-lang
  - Weight: ~4%
  - Difficulty: mid
  - Tags: [decorators, staticmethod, classmethod, property]
  - Source: Week 2 + Week 6 Slides, Quiz 2
  - Notes: Past final T/F: `@staticmethod` does NOT access class-level vars (that's `@classmethod` with `cls`).
- Topic: Inheritance & super() — inheritance-super
  - Weight: ~5%
  - Difficulty: mid
  - God-node: yes (needed for most patterns)
  - Tags: [inheritance, super, override]
  - Source: Week 2 Slides
  - Notes: Past T/F Q: Parent `greet` + Child `greet` calling `super().greet()` composes output.
- Topic: Abstract classes & ABC — abc-abstract
  - Weight: ~5%
  - Difficulty: mid
  - God-node: yes (backbone of every pattern code Q)
  - Tags: [abc, abstractmethod, interface]
  - Source: Week 2 Slides
  - Notes: `from abc import ABC, abstractmethod`. Enforces subclass impl.
- Topic: Polymorphism & duck typing — polymorphism-duck
  - Weight: ~3%
  - Difficulty: mid
  - Tags: [polymorphism, duck-typing]
  - Source: Week 2 Slides
  - Notes: "If it quacks like a duck…" — no formal interface needed if methods exist.
- Topic: Protocols (PEP 544) — protocols
  - Weight: ~2%
  - Difficulty: mid
  - Tags: [protocols, typing, structural-typing]
  - Source: Week 5 Slides
  - Notes: `typing.Protocol` for static duck-typing.
- Topic: Iterators (Iterator protocol) — iterators-proto
  - Weight: ~5%
  - Difficulty: mid
  - God-node: yes
  - Tags: [iterator, iter, next, stopiteration]
  - Source: Week 5 Slides, past final Q13 (SomeIterator squares while ≥1)
  - Notes: `__iter__` returns self, `__next__` raises `StopIteration`. Past Write-Code: DigitSumIterator.
- Topic: Multiple inheritance & MRO — multiple-inheritance
  - Weight: ~4%
  - Difficulty: high
  - Tags: [multiple-inheritance, mro, diamond]
  - Source: Week 5 Slides
  - Notes: C3 linearization, `__mro__`. Diamond problem resolution.

### Module 3: SOLID, Coupling, Design Principles — solid-coupling
- Topic: SOLID — SRP — solid-srp
  - Weight: ~3%
  - Difficulty: mid
  - Tags: [solid, srp]
  - Source: Week 3 Slides, practice guided Q (ShoppingCart), Week 14 review (UIWidget draw-everything)
  - Notes: One class → one reason to change. Direct past-exam MCQ: "Character directly handles all weapon attack logic" violates SRP.
- Topic: SOLID — OCP — solid-ocp
  - Weight: ~3%
  - Difficulty: mid
  - Tags: [solid, ocp]
  - Source: Week 3 Slides, Week 14 review (UIWidget → interface+subclasses), quiz take_damage
  - Notes: Open for extension, closed for modification. If-elif chains on type → refactor via inheritance. Quiz: `take_damage` troll/turtle/underling → apply **OCP**.
- Topic: SOLID — LSP — solid-lsp
  - Weight: ~2%
  - Difficulty: high
  - Tags: [solid, lsp]
  - Source: Week 3 Slides
  - Notes: Subtype substitutable for base. Free-shipping w/o base cost breaks LSP (practice Q example).
- Topic: SOLID — ISP — solid-isp
  - Weight: ~2%
  - Difficulty: mid
  - Tags: [solid, isp]
  - Source: Week 3 Slides, Quiz 3
  - Notes: Clients shouldn't depend on methods they don't use. Split fat interfaces.
- Topic: SOLID — DIP — solid-dip
  - Weight: ~3%
  - Difficulty: mid
  - God-node: yes
  - Tags: [solid, dip, abstraction]
  - Source: Week 3 Slides, Week 14 review (UI→TextFile vs UI→DataSource←TextFile), past final T/F
  - Notes: High-level + low-level both depend on abstractions. "Abstractions depend on details" = FALSE.
- Topic: Law of Demeter — law-of-demeter
  - Weight: ~2%
  - Difficulty: mid
  - Tags: [law-of-demeter, coupling]
  - Source: Week 3 Slides, Week 14 review (Cashier/Customer/Wallet example)
  - Notes: "Talk to friends, not strangers". `a.getB().getC().doX()` = train wreck. Refactor Cashier→Customer→Wallet so Cashier calls `customer.get_money(amt)`.
- Topic: Coupling, cohesion, dependencies — coupling-cohesion
  - Weight: ~2%
  - Difficulty: mid
  - Tags: [coupling, cohesion, dependency-injection]
  - Source: Week 3 Slides, Quiz 3, review_sample_code/coupling_*.py
  - Notes: Two-way coupling bad. High cohesion + low coupling. DI via constructor/setter.
- Topic: UML — class/sequence/collaboration diagrams — uml-diagrams
  - Weight: ~5%
  - Difficulty: mid
  - God-node: yes (final has dedicated 4-mark UML question)
  - Tags: [uml, class-diagram, sequence, collaboration]
  - Source: Week 3 Slides, Quiz 3, Lecture Transcripts (Day 1 - 2.1 collaboration, 2.2 sequence)
  - Notes: Notation: `- private`, `+ public`, `#protected`, `<<interface>>`, hollow triangle = inherit, filled diamond = composition, hollow diamond = aggregation, dashed arrow = dependency. Past exam requires drawing pattern UML.

### Module 4: Functional Python & Profiling — functional-python
- Topic: Functions as first-class objects — functions-first-class
  - Weight: ~2%
  - Difficulty: mid
  - Tags: [first-class-fn, higher-order]
  - Source: Week 6 Slides, Week10SampleCode/callable_object_example.py
  - Notes: Pass fn as arg, return fn, store in var. `__call__` makes object callable.
- Topic: Lambda expressions — lambda
  - Weight: ~2%
  - Difficulty: low
  - Tags: [lambda, anonymous-fn]
  - Source: Week 6 Slides
  - Notes: Single-expr anonymous fn. Common in `map`/`filter`/`sort(key=…)`.
- Topic: Generators & `yield` — generators-yield
  - Weight: ~5%
  - Difficulty: mid
  - God-node: yes
  - Tags: [generators, yield, lazy]
  - Source: Week 6 Slides, past exam Q6 (pipeline yield *2 then filter even)
  - Notes: `yield` makes fn a generator, lazy, one-shot. Generator-expressions `(x for x in …)`. Past exam: output of pipelined generators.
- Topic: Profiling (cProfile) — profiling
  - Weight: ~2%
  - Difficulty: mid
  - Tags: [profiling, cprofile, performance]
  - Source: Week 6 Slides + Lab Optimization Slides + Week 14 review (auction_entities.py:100 call count 70/4 → 70 calls, 4 primitive)
  - Notes: `ncalls` format `70/4` = total/primitive. Non-primitive = recursive. `tottime` vs `cumtime`. T/F: "Profiling is static analysis" → FALSE (it's dynamic, runs code).
- Topic: Async / asyncio basics — asyncio
  - Weight: ~3%
  - Difficulty: high
  - Tags: [async, asyncio, await, gather]
  - Source: Appears in past final Q3 (Subject/Observer with asyncio.gather → 0.6s timing) + Dec 2024 final Q (Observer + asyncio.create_task)
  - Notes: `asyncio.gather()` parallel, `await` sequential, `create_task` schedules. Timing pitfall: sleep inside update = 0.5s, but concurrent so total ≈ 0.5-1s not 1s sequential.
- Topic: Threading basics (ThreadPoolExecutor) — threading-basic
  - Weight: ~1%
  - Difficulty: high
  - Tags: [threading, concurrency]
  - Source: past exam (FakeDatabase race question) — appears as output-prediction MCQ
  - Notes: `concurrent.futures.ThreadPoolExecutor`. Race shown — ending value 1 not 2 because local_copy race.

### Module 5: Creational + Structural Design Patterns — patterns-creational-structural
- Topic: Singleton — singleton
  - Weight: ~3%
  - Difficulty: mid
  - God-node: yes
  - Tags: [pattern, creational, singleton]
  - Source: DesignPatternsTable, Week 9 Slides, Quiz 7, past final definition Q
  - Notes: One instance, global access. Python impl: `__new__` override, metaclass, module-level, decorator. Pitfalls: thread safety, testing harness pollution.
- Topic: Factory — factory
  - Weight: ~3%
  - Difficulty: mid
  - Tags: [pattern, creational, factory]
  - Source: DesignPatternsTable, Week 9 Slides, Quiz 7, Lecture Transcripts (Day 1-2 Factory pattern series)
  - Notes: Creator returns Product, client depends on abstraction. Past MCQ: "factory drawback = classes grow per product" = TRUE.
- Topic: Abstract Factory — abstract-factory
  - Weight: ~3%
  - Difficulty: high
  - Tags: [pattern, creational, abstract-factory]
  - Source: DesignPatternsTable, Week 10 Slides, Quiz 8, Week10SampleCode/game_abstract_factory.py
  - Notes: Families of related products. Each concrete factory produces variant set.
- Topic: Builder — builder
  - Weight: ~3%
  - Difficulty: mid
  - Tags: [pattern, creational, builder]
  - Source: DesignPatternsTable, Week 10 Slides, Lecture Transcripts (Builder demo.txt)
  - Notes: Director + Builder + Product. Step-by-step construction. Past final MCQ: "construct complex objects step by step" → Builder.
- Topic: Lazy Initialization — lazy-init
  - Weight: ~1%
  - Difficulty: low
  - Tags: [pattern, creational, lazy]
  - Source: DesignPatternsTable, Week 10 Slides
  - Notes: Only instantiate when needed. Simple. Often seen in Proxy variants.
- Topic: Decorator pattern — decorator-pattern
  - Weight: ~6%
  - Difficulty: high
  - God-node: yes (heavy past-exam coverage)
  - Tags: [pattern, structural, decorator, composition]
  - Source: DesignPatternsTable, Week 11 Slides, past exam Q: Beverage+Condiment guided Q, Coffee/Milk/Sugar/Caramel MCQ, Notifier refactor
  - Notes: Component+ConcreteComponent+Decorator+ConcreteDecorators. Wrap objects dynamically. Distractor: inheritance-only impl is NOT Decorator — needs composition. Output chain: `Caramel(Sugar(Milk(Coffee())))` = 5+2+1+3=11. Both calls = 11, 11 (option C).
- Topic: Facade — facade
  - Weight: ~2%
  - Difficulty: low
  - Tags: [pattern, structural, facade]
  - Source: DesignPatternsTable, Week 11 Slides
  - Notes: Simplified unified interface to subsystem. Compared to Mediator: Facade = 1-way client→subsystem, Mediator = coordinates peer interactions. T/F past Q: "Facade and Mediator have similar jobs" — TRUE-ish (organize collaboration).
- Topic: Proxy — proxy
  - Weight: ~4%
  - Difficulty: mid
  - God-node: yes
  - Tags: [pattern, structural, proxy, access-control, caching, logging]
  - Source: DesignPatternsTable, Week 11 Slides, past exam Q8 (DatabaseProxy correct = Option B with access check, no ungaurded getter), Q15 (Cached/Protection/Logging variants)
  - Notes: Same interface as real subject. Controls access, cache, log. Pitfall: unguarded `get_database()` getter breaks proxy contract. Decorator vs Proxy: same structure, different intent (Decorator adds behavior, Proxy controls access).
- Topic: Bridge — bridge
  - Weight: ~3%
  - Difficulty: high
  - Tags: [pattern, structural, bridge]
  - Source: DesignPatternsTable, Week 12 Slides, past exam Q9 (Shape+Renderer — Shape=Abstraction, Renderer=Implementation)
  - Notes: Decouple abstraction from impl so both vary independently. TV Remote + Device. Short Q: "Use when multiple implementations / platforms to work with".

### Module 6: Behavioral Design Patterns — patterns-behavioral
- Topic: Observer — observer
  - Weight: ~4%
  - Difficulty: mid
  - God-node: yes
  - Tags: [pattern, behavioral, observer, publish-subscribe]
  - Source: DesignPatternsTable, Week 9 Slides, Quiz 7, past final async-Observer Q
  - Notes: Subject maintains observer list; notifies on change. `attach/detach/notify`. Pitfall: State pattern confusion (T/F: "state objects are independent of each other" — FALSE, that's Observer).
- Topic: Strategy — strategy
  - Weight: ~5%
  - Difficulty: mid
  - God-node: yes (past-exam: Duck simulator MCQ, ShoppingCart refactor guided Q)
  - Tags: [pattern, behavioral, strategy, algorithm-swap]
  - Source: DesignPatternsTable, Week 9-10 Slides, Quiz 8, review_sample_code/strategy_sample_code*.py, practiceGuidedQuestion (SOLID→Strategy refactor)
  - Notes: Swap algorithms at runtime. Context holds strategy ref; delegates via `execute()`. Drawback past MCQ: "client must know and select the appropriate strategy" → true.
- Topic: State — state
  - Weight: ~5%
  - Difficulty: high
  - God-node: yes
  - Tags: [pattern, behavioral, state, traffic-light]
  - Source: DesignPatternsTable, Week 10 Slides, Week10SampleCode/document_state_pattern_example.py, game_state_pattern.py, dog_state.py, past exam Q1 (TrafficLight identification), Q16 (correct impl selection)
  - Notes: Behavior varies by internal state. State transitions update context's state ref. Difference vs Strategy: State allows state-to-state transitions; Strategy isolates different behaviors (past MCQ C).
- Topic: Chain of Responsibility — chain-of-responsibility
  - Weight: ~4%
  - Difficulty: mid
  - God-node: yes
  - Tags: [pattern, behavioral, chain-responsibility, handler]
  - Source: DesignPatternsTable, Week 8 Slides, Quiz 8, Week10SampleCode/chain_of_responsibility.py, past exam Q3 (Level1/2/3 Support output selection — answer A)
  - Notes: Handlers linked; each decides handle-or-pass. Base handler forwards to successor. Output trace: start at level3, cascade down to level1. Q7 Dec 2024 MCQ: base handler's role = "forward to next handler by default" (B).
- Topic: Mediator — mediator
  - Weight: ~3%
  - Difficulty: high
  - Tags: [pattern, behavioral, mediator, coordination]
  - Source: DesignPatternsTable, Week 11 Slides, Lecture Transcripts (Mediator intro/example)
  - Notes: Central object coordinates peer interactions. Components notify mediator blindly. Past MCQ scenario: "dashboard widgets update one another independently" → Mediator. Mediator vs Observer past MCQ: Mediator centralizes communication, Observer reduces mutual deps via broadcast.
- Topic: Iterator pattern — iterator-pattern
  - Weight: ~2%
  - Difficulty: low
  - Tags: [pattern, behavioral, iterator]
  - Source: Week 5 Slides, covered with iterator protocol
  - Notes: Same as Python iterator protocol — `__iter__ + __next__`. Minimal separate coverage at pattern level.

## Ranked priority list (hardest × most-tested → top)

1. **patterns-behavioral/state** — rank 1 (exam-heavy, traffic-light UML & output, two past-exam Qs)
2. **patterns-creational-structural/decorator-pattern** — rank 2 (guided Q probable, Coffee/Notifier/Beverage precedent)
3. **patterns-behavioral/strategy** — rank 3 (Duck simulator MCQ + SOLID→Strategy guided refactor precedent)
4. **patterns-creational-structural/proxy** — rank 4 (Cached/Protection/Logging variants, ungaurded-getter pitfall)
5. **solid-coupling/solid-dip** — rank 5 (heavy quiz + review coverage)
6. **patterns-behavioral/chain-of-responsibility** — rank 6 (Support-level cascade output Q)
7. **patterns-creational-structural/bridge** — rank 7 (Shape/Renderer identification, short Q)
8. **oop-foundations/abc-abstract** — rank 8 (backbone — every pattern Q requires ABC)
9. **oop-foundations/iterators-proto** — rank 9 (Write-Code DigitSumIterator precedent + SomeIterator MCQ)
10. **patterns-behavioral/observer** — rank 10 (async Observer Q + state-vs-observer confusion)
11. **patterns-behavioral/mediator** — rank 11 (MCQ scenario selection)
12. **solid-coupling/solid-ocp** — rank 12 (take_damage quiz pattern)
13. **solid-coupling/solid-srp** — rank 13 (ShoppingCart-style refactor)
14. **patterns-creational-structural/factory** — rank 14 (drawback MCQ)
15. **patterns-creational-structural/singleton** — rank 15 (definition Q)
16. **functional-python/generators-yield** — rank 16 (pipeline-output MCQ)
17. **patterns-creational-structural/abstract-factory** — rank 17
18. **patterns-creational-structural/builder** — rank 18
19. **patterns-creational-structural/facade** — rank 19
20. **oop-foundations/inheritance-super** — rank 20 (needed for patterns)
21. **solid-coupling/uml-diagrams** — rank 21 (dedicated draw Q)
22. **solid-coupling/law-of-demeter** — rank 22 (quiz + review)
23. **functional-python/asyncio** — rank 23 (timing MCQ)
24. **functional-python/profiling** — rank 24 (cProfile read MCQ)
25. **python-advanced/exceptions-with** — rank 25
26. **python-advanced/comprehensions** — rank 26
27. **oop-foundations/multiple-inheritance** — rank 27
28. **oop-foundations/decorators-lang** — rank 28 (@staticmethod T/F)
29. **oop-foundations/polymorphism-duck** — rank 29
30. Remaining low-priority topics (classes-objects, slicing-ranges, enums, file-json, functions-first-class, lambda, threading-basic, unit-testing, function-overloading-args, solid-lsp, solid-isp, coupling-cohesion, protocols, iterator-pattern, lazy-init)

## Diagram inventory (required code-practice targets w/ inline SVG)

Past-exam questions containing diagrams — each → a `code-practice/NN-<slug>.md` with inline SVG:

1. **State pattern TrafficLight UML** (Dec 2024 final Q16 — Red/Yellow/Green states w/ traffic_light.change_state) → state pattern topic
2. **Bridge Shape+Renderer UML** (finalexamsmerge Q9) → bridge topic
3. **Decorator Beverage/Condiment UML** (finalexamsmerge guided question) → decorator-pattern topic
4. **Proxy Cached/Protection/Logging UML** (Dec 2024 final Q15) → proxy topic
5. **Strategy Duck simulator class diagram** (finalexamsmerge Q4) → strategy topic
6. **Chain of Responsibility Level1/2/3 Support class diagram** (finalexamsmerge Q3) → chain-of-responsibility topic
7. **SOLID → Strategy ShoppingCart+ShippingStrategy refactor UML** (practiceGuidedQuestion) → solid-srp + strategy
8. **Dependency Inversion Principle UI→DataSource←TextFile/SQLite/JSONFile** (Week 14 review) → solid-dip
9. **Law of Demeter Cashier→Customer→Wallet** (Week 14 review) → law-of-demeter
10. **Decorator pattern abstract UML** (DesignPatternsTable ref) → decorator-pattern
11. **Observer Subject/Observer notify** (DesignPatternsTable + past final async Q) → observer
12. **Mediator ConcreteMediator+Components UML** (DesignPatternsTable + dashboard-widgets scenario MCQ) → mediator
13. **Singleton UML** (DesignPatternsTable + definition Q) → singleton
14. **Abstract Factory ConcreteFactory1/2 + ProductA/B** (DesignPatternsTable) → abstract-factory

## Top-5 pitfalls (for exam-strategy-and-pitfalls dive)

1. **Decorator pattern without composition = wrong** — just inheritance overriding `send()` is not Decorator. Must wrap an instance and delegate via `super()` or stored ref. [finalexamsmerge Notifier refactor + Dec 2024 coffee MCQ]
2. **Proxy with ungaurded access bypass** — providing `get_database()` or any method that leaks the real subject defeats access control. [finalexamsmerge Q8: Option A and C wrong for this reason]
3. **State vs Observer confusion** — "state objects are independent of each other" is Observer, not State. State objects often hold context ref and trigger transitions. [past final T/F Q7 midterm leakage into final]
4. **range() is not a generator** — returns a range object (lazy sequence-like, indexable). T/F distractor. [finalexamsmerge p1]
5. **`@staticmethod` cannot access class-level variables** — use `@classmethod` with `cls` for that. Dec 2024 final Q1 T/F = FALSE.
