---
"n": 1
id: 4911-lesson-what-is-java-ee-ejb-the-foundation
title: What is Java EE / EJB? (the foundation)
hook: Before any annotation — why does EJB even exist?
tags:
  - ejb
module: EJB — session beans
---

Forget EJB for a moment. You write a Java program with `main()`. You run it. Simple.

Now imagine you're building a **banking website**. Thousands of users. Concurrent transactions. Security. Database connections. User sessions. Crashes. Backups. Your laptop's `main()` won't cut it.

> **Analogy**
> **Analogy:** You want to open a restaurant. You could build your own building, install plumbing, hire security, handle taxes — OR you rent a spot in a mall that already has those. The mall = the app server.

#### The application server

An **application server** is a piece of software that runs your business code and handles the boring infrastructure for you: threads, transactions, database connections, security, remote invocation, crash recovery, lifecycle.

You write the business logic. The server wraps it.

#### EJB = the contract

**Enterprise JavaBeans (EJB)** is the contract between your code and the server. You write a class. You put annotations on it (`@Stateless`, `@Entity`). The server reads those and wires everything up.

-   The class you write = a **bean**
-   The server = the **container**

EJB ecosystem — big picture

<svg viewBox="0 0 680 260" preserveAspectRatio="xMidYMid meet"><defs><marker id="arrEJB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#a3a3a3"></path></marker></defs><rect x="20" y="100" width="100" height="60" class="box" rx="5"></rect><text x="70" y="130" text-anchor="middle" class="label">Client</text> <text x="70" y="146" text-anchor="middle" class="sub">web / CLI / another EJB</text> <rect x="170" y="20" width="490" height="220" class="box-accent" rx="8"></rect><text x="415" y="40" text-anchor="middle" class="label-accent">EJB Container (application server)</text> <rect x="190" y="60" width="220" height="70" class="box" rx="5"></rect><text x="300" y="82" text-anchor="middle" class="label">Session Beans</text> <text x="300" y="100" text-anchor="middle" class="sub">@Stateless · @Stateful · @Singleton</text> <text x="300" y="116" text-anchor="middle" class="sub">(business logic)</text> <rect x="440" y="60" width="200" height="70" class="box" rx="5"></rect><text x="540" y="82" text-anchor="middle" class="label">Message-Driven Beans</text> <text x="540" y="100" text-anchor="middle" class="sub">@MessageDriven</text> <text x="540" y="116" text-anchor="middle" class="sub">(async JMS consumers)</text> <rect x="190" y="150" width="450" height="70" class="box" rx="5"></rect><text x="415" y="172" text-anchor="middle" class="label">JPA Entities + EntityManager</text> <text x="415" y="190" text-anchor="middle" class="sub">@Entity · @Id · @OneToMany · @PersistenceContext</text> <text x="415" y="206" text-anchor="middle" class="sub">(persistent data layer)</text> <path d="M120 130 L190 90" class="arrow-line" marker-end="url(#arrEJB)"></path><path d="M300 130 L400 150" class="arrow-line"></path><path d="M540 130 L440 150" class="arrow-line"></path><path d="M680 180 L680 220" class="arrow-line"></path><text x="668" y="238" text-anchor="end" class="sub">→ Database</text></svg>

**Container provides:** threading · transactions · security · pooling · JNDI · lifecycle callbacks · resource injection.  
**You write:** annotated classes. The container wires everything together. Three bean types solve three different problems: business logic, async messages, persistent data.

#### Three flavors of bean (three different problems)

-   **Session beans** — business logic ("place an order", "charge credit card")
-   **Message-Driven beans** — async message consumers ("a message arrived, process it")
-   **Entities (JPA)** — persistent data ("this is a row in the Customer table")

> **Takeaway**
> **Takeaway:** EJB is Java's way of saying "I'll focus on business logic, you (container) handle the hard stuff." Everything else in this course is details on top of this one idea.

> **Q:** What job does the EJB container do that makes your life easier?
> **A:** It handles threading, transactions, security, DB connection pooling, lifecycle, crash recovery, remote calls — so you can focus only on business logic.
