---
id: 4915-topic-cgroups-qos-classes
title: cgroups + QoS classes
pillar: tech
priority: high
chapter: Mod10D
source: "Mod10D; materials/labs/Lab10.pdf; materials/past-exams/comp4915_quiz4.md"
tags:
  - kubernetes
related: [4915-topic-linux-namespaces-8-types, 4915-topic-pod-architecture-pause-container, 4915-topic-control-plane-node-components]
---

cgroups (Control Groups) = kernel feature to LIMIT and ACCOUNT resource usage (CPU, memory, I/O, pids). Namespaces isolate; cgroups meter.

v1: separate hierarchy per subsystem under `/sys/fs/cgroup/<subsystem>/`.  
v2: unified hierarchy — single tree at `/sys/fs/cgroup/`.

#### K8s QoS classes (from Pod YAML)

| Class | Condition | Eviction order |
| --- | --- | --- |
| **Guaranteed** | requests == limits for CPU AND memory, every container | LAST evicted |
| **Burstable** | some requests/limits set, but not Guaranteed | middle |
| **BestEffort** | NO requests AND NO limits on anything | FIRST evicted |

```yaml
resources:
  requests: {cpu: 500m, memory: 256Mi}
  limits:   {cpu: 500m, memory: 256Mi}   # Guaranteed
```

Under memory pressure, kubelet evicts BestEffort pods first to protect Guaranteed.

flowchart TB START\["Pod spec resources  
requests / limits set?"\] Q1{"Q1: Any requests OR limits set?  
check all containers, any resource"} Q2{"Q2: For EVERY container,  
does requests == limits  
(CPU AND memory)?"} BE\["BestEffort  
No resources specified  
Eviction: FIRST under memory pressure  
spec.containers\[\].resources: {}"\] BU\["Burstable  
Some requests/limits, not Guaranteed  
Eviction: MIDDLE"\] GU\["Guaranteed  
req == lim for all (CPU & mem)  
Eviction: LAST"\] START --> Q1 Q1 -->|NO| BE Q1 -->|YES| Q2 Q2 -->|NO| BU Q2 -->|YES| GU classDef start fill:#181822,stroke:#7aa2f7,color:#e5e5e5; classDef decide fill:#1a1a1a,stroke:#e0af68,color:#e0af68; classDef bad fill:#201818,stroke:#f7768e,color:#f7768e; classDef warn fill:#201c15,stroke:#e0af68,color:#e0af68; classDef good fill:#181a18,stroke:#9ece6a,color:#9ece6a; class START start; class Q1,Q2 decide; class BE bad; class BU warn; class GU good;

Lower QoS = lower priority under pressure. kubelet evicts BestEffort FIRST to protect Guaranteed pods.  
Sources: Mod10D · K8s docs · Quiz 4 context

> **Pitfall**
>
> QoS class is derived from the pod spec, not declared. Guaranteed requires `limits == requests` on **every** container and **every** resource (cpu + memory). Omit one limit on one container and the whole pod falls to Burstable. Omit all requests/limits → BestEffort (first evicted).

> **Example** — classify three pod specs
>
> 1. **Spec A**: single container, `requests: {cpu: 500m, memory: 256Mi}` AND `limits: {cpu: 500m, memory: 256Mi}`. Every resource has requests == limits → **Guaranteed** (evicted last).
> 2. **Spec B**: container1 has `requests: {cpu: 100m}, limits: {cpu: 500m}` (requests ≠ limits); container2 has no resources block. Some values set but not all equal → **Burstable** (evicted middle).
> 3. **Spec C**: `resources: {}` (or absent) on every container. Nothing set anywhere → **BestEffort** (evicted FIRST under memory pressure).
> 4. Verify with `kubectl describe pod <name> | grep QoS` — kubelet prints the computed class.
> 5. Gotcha: a pod with *only memory* requests=limits (no CPU fields) is still Burstable, not Guaranteed — Guaranteed needs both resources pinned.

> **Takeaway**: cgroups are the kernel's resource-limit primitive; Kubernetes QoS classes are just how pod specs map to cgroup settings. Guaranteed requires limits == requests on every resource; miss one and you fall to Burstable; specify nothing and you're BestEffort and first to be evicted.
