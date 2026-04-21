# Glossary — 3522

Read this before writing any content. Use the canonical form verbatim; never substitute a synonym.

| Canonical | Variants to avoid | One-line definition | Source |
|---|---|---|---|
| abstract base class | ABC, ABC class, abstractclass | Python class inheriting from `abc.ABC` that cannot be instantiated; defines `@abstractmethod`s subclasses must implement. | Week 2 Slides |
| abstract method | abstract function, pure virtual | Method decorated with `@abstractmethod` in an ABC; subclasses MUST override. | Week 2 Slides |
| duck typing | duck-typing, structural typing | Python's "if it walks like a duck" — objects are compatible if they expose the required methods, without formal inheritance. | Week 2 Slides |
| Method Resolution Order | MRO, class resolution order | The order Python searches base classes for method lookups (C3 linearization); view via `ClassName.__mro__`. | Week 5 Slides |
| Design pattern | pattern, DP | Reusable solution to a common object-oriented design problem. | DesignPatternsTable |
| Observer pattern | subject-observer, pub-sub pattern | Subject maintains observer list and notifies each on state change. | DesignPatternsTable |
| State pattern | state machine pattern | Object's behavior changes via a state object the context delegates to. | DesignPatternsTable |
| Strategy pattern | swappable algorithm pattern | Family of interchangeable algorithms; context holds strategy ref and delegates. | DesignPatternsTable |
| Chain of Responsibility | chain pattern, CoR | Request passes along a chain of handlers; each decides to process or forward. | DesignPatternsTable |
| Observer | observer object, subscriber | Object that registers with a subject and receives notifications on state changes. | DesignPatternsTable |
| Subject | observable, publisher | Object that maintains an observer list and calls `notify()`. | DesignPatternsTable |
| Context (State/Strategy) | owner, container | Object that holds the current state/strategy reference and delegates to it. | DesignPatternsTable |
| Decorator pattern | wrapper pattern | Wraps object in same interface to add behavior via composition. | DesignPatternsTable |
| Proxy pattern | indirection pattern | Same interface as real subject, controls access (auth/cache/log/lazy). | DesignPatternsTable |
| Bridge pattern | abstraction-implementation pattern | Decouple abstraction from implementation so both vary independently. | DesignPatternsTable |
| Facade pattern | gateway pattern | Simplified interface to a complex subsystem. | DesignPatternsTable |
| Mediator pattern | coordinator pattern | Central object routes messages between peer components. | DesignPatternsTable |
| Factory pattern | factory method pattern | Encapsulates object creation behind a method; client depends on abstraction. | DesignPatternsTable |
| Abstract Factory | factory of factories | Factory interface producing families of related products. | DesignPatternsTable |
| Singleton pattern | single-instance pattern | Class with one instance and a global access point. | DesignPatternsTable |
| Builder pattern | step-by-step construction pattern | Builder class constructs complex object via named steps; optional Director encodes recipes. | DesignPatternsTable |
| Lazy Initialization | deferred init, lazy-load | Construct an object only when first accessed, then cache. | DesignPatternsTable |
| Iterator pattern | traversal pattern | Sequential access to elements without exposing underlying structure; in Python, `__iter__` + `__next__` dunder protocol. | Week 5 Slides |
| Iterator protocol | iteration protocol | The two-dunder-method contract (`__iter__`, `__next__`) Python uses for `for x in obj:` loops. | Week 5 Slides |
| StopIteration | iteration-stop signal | Exception an iterator raises to signal end of sequence. | Week 5 Slides |
| SOLID | SOLID principles | Acronym for Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion. | Week 3 Slides |
| Single Responsibility Principle | SRP | A class should have one reason to change. | Week 3 Slides |
| Open/Closed Principle | OCP | Software entities should be open for extension, closed for modification. | Week 3 Slides |
| Liskov Substitution Principle | LSP | Subclasses must be substitutable for their base without breaking calling code. | Week 3 Slides |
| Interface Segregation Principle | ISP | Clients should not depend on methods they do not use; split fat interfaces. | Week 3 Slides |
| Dependency Inversion Principle | DIP | High-level + low-level modules both depend on abstractions; abstractions don't depend on details. | Week 3 Slides |
| Law of Demeter | LoD, Demeter's Law, Suggestion of Demeter | A method should only call methods on self, parameters, locally-created objects, and direct member attributes. | Week 3 Slides |
| coupling | inter-class dependency | Degree to which one class depends on another's details; low coupling = easy to change. | Week 3 Slides |
| cohesion | intra-class unity | Degree to which a class's members belong together; high cohesion = easy to understand. | Week 3 Slides |
| dependency injection | DI | Passing dependencies into a class (usually via constructor) rather than constructing them internally. | Week 3 Slides |
| generator | generator function | Function containing `yield`; produces values lazily, one at a time. | Week 6 Slides |
| generator expression | gen-expr | `(expr for x in iterable)` — like a list comprehension but lazy. | Week 6 Slides |
| yield | — | Keyword that turns a function into a generator; pauses execution and returns a value. | Week 6 Slides |
| list comprehension | list-comp | `[expr for x in iterable if cond]` — concise list construction. | Week 5 Slides |
| lambda | anonymous function | Single-expression function defined inline via `lambda args: expr`. | Week 6 Slides |
| `@staticmethod` | static method | Decorator marking a method that takes no `self` or `cls` — just a function namespaced on the class. | Week 2 Slides |
| `@classmethod` | class method | Decorator marking a method whose first arg is `cls`, not `self`; operates on the class itself. | Week 2 Slides |
| `@property` | property decorator | Decorator that exposes a method as if it were an attribute, enabling getter/setter patterns. | Week 2 Slides |
| context manager | `with`-statement object | Object implementing `__enter__` + `__exit__`, used with `with`. | Week 4 Slides |
| multiple inheritance | multi-inheritance | Inheriting from more than one base class; Python resolves via MRO. | Week 5 Slides |
| diamond problem | diamond inheritance | Ambiguity when a class inherits from two classes that share a common ancestor. | Week 5 Slides |
| `cProfile` | Python profiler | Python's built-in deterministic profiler; reports `ncalls`, `tottime`, `cumtime`. | Week 6 Slides |
| primitive calls | non-recursive calls | In `cProfile`, the number of direct (non-recursive) calls to a function. | Week 6 Slides |
| `asyncio` | async library | Python's cooperative concurrency library using `async`/`await`. | Week 12 Slides |
| `asyncio.gather` | gather | Runs multiple coroutines concurrently; awaits all and returns results. | Week 12 Slides |
| coroutine | async function, async coroutine | Function defined with `async def`; returns a coroutine object when called. | Week 12 Slides |
| unit test | unittest | Automated test in the `unittest` module; class inheriting `unittest.TestCase`. | Week 4 Slides |
| `assertRaises` | assertRaises context manager | Test method verifying that a block raises a specific exception. | Week 4 Slides |
| `assertIsNone` | assert-none | Test method verifying the argument is `None`. | Week 4 Slides |
| exception | — | Runtime error signaling object; inherit from `Exception` for custom classes. | Week 4 Slides |
| `args` attribute | exception args | Tuple attribute on exceptions containing the arguments passed at raise time. | Week 4 Slides |
| slicing | slice notation | Python syntax `seq[start:stop:step]` extracting a subsequence. | Week 4 Slides |
| range | range object | Immutable, lazy, indexable sequence of integers; NOT a generator. | Week 4 Slides |
| enum | Enum class | Class inheriting from `enum.Enum` defining a set of named constants. | Week 5 Slides |
| Protocol (typing) | structural type | `typing.Protocol` for static duck-typing — structural type checking. | Week 5 Slides |
| packing / unpacking | splat / star-args | `*args` / `**kwargs` — collect variadic args into tuple/dict or expand them. | Week 4 Slides |
