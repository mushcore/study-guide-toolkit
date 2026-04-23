---
id: modern-web-arch
title: "Modern web architecture trends reference"
pillar: tech
priority: low
source: "Slide 8"
bloom_levels: [remember, understand]
related: [web-arch-patterns, restful-url-design]
---

## Concrete anchor: Netflix's architectural history in one sentence

Netflix started as a monolith; today it runs microservices for streaming, event-driven patterns for telemetry, and CQRS for analytics. That progression — monolith → MSA → layered specialization — traces the same path most large-scale systems eventually follow.

The pressures that forced Netflix's migration (scale, fault isolation, deployment velocity, AI workloads) are exactly the pressures that produced the seven modern architectural patterns below.

---

## Seven modern patterns at a glance

| Pattern | One-line purpose | Real-world trigger |
|---------|-----------------|-------------------|
| **Microservices (MSA)** | Break the application into independent, single-responsibility services that communicate via API | Application has grown large enough that one team's deploy blocks every other team |
| **Serverless (FaaS)** | Run function logic in the cloud without managing server infrastructure | Traffic is spiky or unpredictable; paying for idle servers is wasteful |
| **API-first development** | Design the backend API as the primary product before any frontend exists | Multiple frontend clients (web, mobile, IoT) must share one backend without diverging |
| **Edge computing** | Process data close to the user rather than in a centralized data center | Latency-sensitive applications (real-time video, IoT telemetry, low-latency gaming) |
| **Headless architecture** | Decouple the frontend presentation layer from the backend data and logic layers | Same content must render on web, mobile, and IoT with different UI frameworks |
| **Domain-Driven Design (DDD)** | Organize code around business domains using bounded contexts | Large codebase where cross-domain changes cause unexpected side effects |
| **DOMA** | Group related microservices into domain clusters with clear ownership and API boundaries | MSA has scaled to hundreds of services with overlapping responsibilities (Uber's problem) |

---

## Factors driving adoption

### Scale and user expectations
- Users expect fast, reliable, always-available applications
- Any downtime or latency is now a competitive disadvantage

### Mobile and IoT proliferation
- Billions of devices with varying screen sizes and capabilities
- API-first backends serve all device types without modification

### AI and ML integration
- Applications need real-time analytics and inference
- AIaaS (Google Cloud AI, AWS AI Services, Azure Cognitive Services) exposes pre-trained models via API — no in-house ML infrastructure required
- AutoML platforms (Google AutoML, HuggingFace, Kaggle) enable model customization without deep ML expertise

### Deployment speed
- CI/CD pipelines require independently deployable services
- Updating one MSA service does not require shutting down the entire application
- Containers and orchestration (Kubernetes) automate scaling and management

### Infrastructure cost
- Serverless converts server cost from fixed (hourly) to variable (per invocation)
- Pay-per-use aligns cost with actual demand

### Resilience and fault isolation
- In MSA, one failing service does not bring down others
- Edge computing reduces blast radius by distributing processing across nodes

### Security
- Modern architectures isolate components — a breach in one service is contained
- API-first design enforces explicit, auditable interfaces between components

---

## AI web architecture in detail

**AI-as-a-Service (AIaaS):**
- Cloud providers expose pre-trained models as API endpoints
- Developers call the API and receive AI results (vision classification, sentiment score, speech transcript) without building models
- Examples: Google Cloud Vision API, AWS Rekognition, Azure Computer Vision

**Microservices for AI:**
- Each AI capability maps to a dedicated microservice (image processing service, NLP service, speech service)
- Services call the relevant AIaaS endpoint and return results through the API gateway

**AutoML and no-code AI:**
- Google AutoML, HuggingFace, and Kaggle reduce the ML expertise barrier
- Teams can fine-tune models for their domain without an ML engineering team

---

> **Pitfall**
> Headless architecture and serverless architecture are often confused but are orthogonal. Headless decouples the frontend presentation layer from the backend — it is an API contract decision. Serverless eliminates server management — it is an infrastructure decision. A headless CMS can run on a traditional managed server. A serverless function can return HTML to a coupled frontend. Choosing one does not imply choosing the other.

---

**Takeaway:** Modern architectural patterns each solve one dominant pressure: serverless addresses infrastructure cost, API-first enables multi-client flexibility, edge computing attacks latency, headless frees frontend teams, DDD/DOMA tames large-scale MSA complexity, and AIaaS opens AI workloads to any team with an API key. They are not mutually exclusive — production systems combine them based on which trade-offs matter most.
