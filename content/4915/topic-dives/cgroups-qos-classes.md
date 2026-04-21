---
id: 4915-topic-cgroups-qos-classes
title: cgroups + QoS classes
pillar: tech
priority: high
chapter: Mod10D
tags:
  - kubernetes
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
