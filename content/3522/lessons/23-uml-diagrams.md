---
n: 23
id: uml-diagrams
title: "UML — class, sequence, collaboration diagrams"
hook: "Every pattern in this course has a class diagram you might have to draw. Know the notation cold."
tags: [uml, class-diagram, sequence, collaboration, notation]
module: "SOLID + Coupling + Design Principles"
source: "Week 3 Slides, Quiz 3, Lecture Transcripts (Day 1 - 2.1 collaboration, 2.2 sequence)"
bloom_levels: [remember, understand, apply]
related: [patterns-behavioral, patterns-creational-structural]
---

The final has a 4-mark "Draw UML" question. Know the notation.

## Class diagram notation

- **Class box**: three compartments — name, attributes, methods.
- **Visibility**: `+` public, `-` private, `#` protected, `~` package.
- **Italic name**: abstract class.
- **«interface»** stereotype or italics: interface.
- **Static members**: underlined.

## Relationships

| Symbol | Meaning | When |
|---|---|---|
| Solid arrow, hollow triangle → | Inheritance (is-a) | `Circle` inherits from `Shape` |
| Dashed arrow, hollow triangle → | Interface realization | `Circle` implements `Drawable` |
| Solid line, hollow diamond ← | Aggregation (has-a, shared lifetime) | `Department` has `Employees`, employees survive dept removal |
| Solid line, filled diamond ← | Composition (has-a, shared lifetime) | `Car` has `Engine`, engine dies with car |
| Solid arrow → | Association (general "uses") | Any reference |
| Dashed arrow → | Dependency (transient) | A uses B's method once, doesn't store it |

## Multiplicity

Annotate associations with counts:
- `1` — exactly one
- `0..1` — optional
- `*` — many
- `1..*` — one or more

Example: `Order  1 → *  LineItem` means one Order has many LineItems.

## Sequence diagram

Vertical lifelines, horizontal arrows for messages. Time flows top to bottom. Messages labeled with method name. Useful for visualizing pattern interactions — Observer's notify loop, Chain of Responsibility's cascade.

## Collaboration (communication) diagram

Object nodes connected by labeled links, messages numbered to show order. Same info as sequence, rearranged by space rather than time.

> **Q:** In a class diagram, what's the difference between a hollow diamond and a filled diamond?
> **A:** Hollow = aggregation (weak has-a, parts survive whole). Filled = composition (strong has-a, parts die with whole). A library aggregates books (books outlive the library's closure); a car composes its engine (engine scrapped when car is). Both appear on the owner's end of the line.

## Past-exam drawing targets (from diagram inventory)

- State: Context + State interface + concrete states, one back-reference from state to context.
- Strategy: Context has-a Strategy interface + concrete strategies.
- Decorator: Component interface, Concrete Component, Decorator base (has-a Component), Concrete Decorators.
- Proxy: Service interface, RealSubject, Proxy (has-a RealSubject).
- Bridge: Abstraction has-a Implementation; both hierarchies extend independently.
- Observer: Subject has-many Observer interface; Observer implementations.

## Takeaway

> **Takeaway**
> Memorize the triangle + diamond shapes. The most common exam arrows are: hollow-triangle (inherits), filled-diamond (composition), hollow-diamond (aggregation), dashed arrow (interface / dependency). When drawing a pattern, include the interface + concrete subclasses + the key composition arrow that defines the pattern.
