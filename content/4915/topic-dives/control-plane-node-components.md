---
id: 4915-topic-control-plane-node-components
title: Control plane + node components
pillar: tech
priority: high
chapter: Mod10A + Quiz4
tags:
  - kubernetes
---

#### Control plane (master)

-   **kube-apiserver** — REST entry point, auth, gateway to etcd
-   **etcd** — distributed key-value store. Raw cluster state *data* persists here.
-   **kube-controller-manager** — runs reconcile loops. Quiz 4 Q5 answer ("maintains state"). etcd *stores* state; the manager *maintains* it.
-   **kube-scheduler** — filters + scores nodes, binds pods
-   **kube-controller-manager** — runs controllers (Deployment, ReplicaSet, Node, Job, etc.) — reconciles desired vs actual
-   **cloud-controller-manager** — cloud integration

#### Node components

-   **kubelet** — agent; talks CRI → container runtime; reports to apiserver (Quiz 4 Q1: "agent implementing control-plane commands")
-   **kube-proxy** — implements Service routing via iptables/IPVS
-   **container runtime** — containerd, CRI-O (implements CRI)

#### Other objects

**Deployment** (most common app, Quiz 4 Q4) wraps ReplicaSet → manages pods with rolling updates. **DaemonSet** runs one pod per node (Quiz 4 Q8). **StatefulSet**, **Job**, **CronJob**.
