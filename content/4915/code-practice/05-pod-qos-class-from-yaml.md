---
"n": 5
id: 4915-code-pod-qos-class-from-yaml
title: Pod QoS class from YAML
lang: bash
variant: starter-solution
tags:
  - kubernetes
---

## Prompt

Given this pod spec, identify the QoS class and explain why:

```yaml
resources:
  requests: {cpu: 250m, memory: 128Mi}
  limits:   {cpu: 500m, memory: 512Mi}
```

## Starter

```bash
QoS class: ?
Reasoning:
```

## Solution

```bash
QoS class: Burstable
Reasoning: Has BOTH requests and limits set for CPU and memory → not BestEffort. requests != limits for either resource → not Guaranteed. Therefore Burstable.
```

## Why

Decision tree: NO requests+NO limits=BestEffort. All requests==limits=Guaranteed. Anything else=Burstable. Eviction order under memory pressure: BestEffort first, then Burstable, then Guaranteed.
