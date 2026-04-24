---
"n": 5
id: 4915-code-pod-qos-class-from-yaml
title: Pod QoS class from YAML
lang: bash
variant: starter-solution
tags:
  - kubernetes
source: "Mod10D; materials/labs/Lab10.pdf; materials/past-exams/comp4915_quiz4.md"
kind: code
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

**Source**: Mod10D CGroups + Lab 10. Decision tree: NO requests+NO limits=BestEffort. All requests==limits=Guaranteed. Anything else=Burstable. Eviction order under memory pressure: BestEffort first, then Burstable, then Guaranteed. Common wrong: calling this "Guaranteed" because both requests and limits are set — Guaranteed requires requests *equal* limits for every container and every resource; merely having both present is Burstable.
