---
n: 18
id: modern-web-arch
title: "Modern Web Architecture Trends"
module: "Web Architecture and Data Exchange"
tags: [modern-architecture, headless, edge-computing, AI-web, serverless, DDD]
priority: low
source: "Slide 8"
bloom_levels: [remember, understand]
related: [web-arch-patterns, restful-url-design, nodejs-basics]
pedagogy: concreteness-fading
hook: "Uber built hundreds of microservices and created chaos — the solution invented a new architecture pattern you can name on an exam."
---

## Uber built hundreds of services — then couldn't manage them

In MSA's early days, Uber decomposed its platform aggressively. The result: hundreds of microservices with overlapping responsibilities and no clear boundaries. Teams couldn't tell which service owned what. Consistency was impossible to maintain. Scaling and collaboration became painful.

This outcome is not an indictment of MSA. It is the motivating problem behind Domain-Oriented Microservice Architecture (DOMA) — and it explains why modern architectural patterns exist: raw MSA at scale creates new coordination problems that require deliberate structural solutions.

---

## Serverless architecture

Serverless removes server management from the developer's workload. You write function logic; a cloud provider handles provisioning, scaling, and patching automatically.

**Examples:** AWS Lambda, Azure Functions, Google Cloud Functions.

**Best for:** event-driven tasks, spiky or unpredictable traffic, short-lived computations (image resize, notification dispatch, data transformation).

> **Pitfall**
> "Serverless" does not mean no server exists. Servers run your code — AWS, Azure, or GCP manages them so you don't have to. The name describes who manages the infrastructure, not whether infrastructure exists.

> **Q:** A startup deploys their image-processing feature as an AWS Lambda function. At 3 a.m. traffic drops to zero. What is the infrastructure cost during that window?
>
> **A:** Near zero. Serverless billing is per invocation. When no function executes, no compute resources are allocated and no cost accrues. A traditional server would still be running and billing the hourly rate.

---

## API-first development

API-first means designing the backend API before — or independently of — the frontend. The API server (backend) is the primary product; frontends are consumers of it.

This approach enforces a clean contract between client and server. Any frontend — web, mobile, IoT device — can consume the same backend without requiring backend changes. Third-party services integrate more easily because the API surface is deliberate and documented.

In this course, the architecture you build is API-centric: every client interaction goes through an API endpoint, and the backend never assumes which kind of client is calling.

---

## Edge computing

Centralized data centers introduce latency: every request travels from the user's device to a distant server and back. Edge computing eliminates most of that round-trip by processing data closer to the source — on devices, regional nodes, or CDN edges near the user.

**Mechanism:** instead of routing to a central server in one geography, requests resolve at a node that is geographically close to the user.

**Result:** lower latency, faster response, better performance for real-time applications.

**Use cases:** content delivery, IoT data processing, real-time video analysis, low-latency gaming.

---

## Headless architecture

Headless decouples the frontend presentation layer from the backend logic and data layers. The backend stores and manages content; it exposes that content via API. Any frontend — web app, mobile app, IoT interface — can consume the same backend without any frontend-specific logic living on the server.

The term originates in CMS (Content Management Systems). A traditional CMS controls both content storage and HTML rendering. A headless CMS handles only content storage and delivers it via API; the frontend team chooses any rendering technology they want.

**Benefit:** multiple frontends sharing one backend. A news organization runs a website, a mobile app, and a smart-TV interface — all pulling the same content from one headless backend.

> **Pitfall**
> Headless and serverless are not the same thing. Headless decouples the frontend from the backend. Serverless eliminates server management. A headless backend can run on traditional managed servers. A serverless function can serve a non-headless frontend. These are independent architectural decisions.

> **Q:** A retail company wants their website, mobile app, and in-store kiosk to all display the same product catalog. What architectural pattern lets one backend serve all three frontends without duplicating content?
>
> **A:** Headless architecture. The backend stores and manages product data and exposes it via API. Each frontend — web, mobile, kiosk — calls the same API and renders the content in whatever format suits its interface.

---

## Domain-Driven Design (DDD) and DOMA

**DDD** addresses complexity in large systems by organizing code around business domains. Each domain is isolated in a bounded context — a boundary within which a model is consistent and a team has clear ownership.

The practical effect: when you change the payment domain, you don't risk breaking the recommendations domain. Bounded contexts enforce the separation of concerns that raw MSA often lacks.

**DOMA** (Domain-Oriented Microservice Architecture) is Uber's response to the coordination failure described at the top of this lesson. DOMA organizes microservices into domain groups. Each domain group owns a cluster of related services, exposes a domain-level API, and enforces clear boundaries. The result: Uber regained consistency, reduced duplication, and made collaboration between teams tractable again.

**DDD → DOMA pattern:** DDD provides the conceptual model (bounded contexts); DOMA applies that model to microservice organization at scale.

---

## AI-as-a-Service (AIaaS) and AI web architecture

Adding AI capabilities to a web application no longer requires building or training models. Cloud providers expose pre-trained models as API-accessible services — this is AI-as-a-Service (AIaaS).

**Examples:**
- Google Cloud AI (Vision API, Natural Language API)
- AWS AI Services (Rekognition, Comprehend, Polly)
- Azure Cognitive Services (Computer Vision, Speech, Language)

**How it connects to MSA:** AI capabilities map cleanly onto microservices. One service handles image processing; another handles natural language processing; a third handles speech-to-text. Each service calls the relevant AIaaS endpoint and returns results through the API gateway.

**AutoML and no-code AI:** platforms like Google AutoML, HuggingFace, and Kaggle allow developers to build and deploy models without deep ML expertise. This lowers the barrier to AI integration further — AIaaS handles inference; AutoML handles model customization.

---

## Why these patterns emerged together

Modern architectures did not emerge arbitrarily. Specific pressures drove adoption:

**Scale and user expectations**
- Users expect fast, always-available applications
- Billions of mobile and IoT devices demand flexible API-first backends

**Deployment velocity**
- MSA enables partial deployment — updating one service without restarting the whole application
- CI/CD pipelines require services that can deploy independently

**Infrastructure cost and flexibility**
- Serverless shifts infrastructure cost from fixed to variable (pay per invocation)
- Containers and orchestration (Kubernetes) simplify scaling and management

**AI and ML integration**
- Applications increasingly need real-time analytics and ML model inference
- AIaaS makes this accessible without specialized ML infrastructure

**Resilience**
- In MSA, one failing service does not cascade to others — fault isolation is structural, not an afterthought
- Edge computing moves compute closer to users, reducing failure blast radius

---

**Takeaway:** Each modern architectural pattern solves a specific pressure: serverless reduces infrastructure cost, API-first enables multi-frontend flexibility, edge computing cuts latency, headless decouples frontend from backend, DDD/DOMA brings order to large-scale MSA, and AIaaS makes AI capabilities accessible via API. These patterns are not alternatives to MSA — they are responses to what MSA produces at scale.
