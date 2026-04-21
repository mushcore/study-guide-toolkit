---
id: 4915-topic-pod-architecture-pause-container
title: Pod architecture + pause container
pillar: tech
priority: high
chapter: Mod10C
tags:
  - kubernetes
---

Pod = smallest deployable K8s unit. 1+ containers sharing NET, IPC, UTS namespaces + storage volumes.

#### Pause container

First container in every pod. Does nothing. Its job: hold namespaces open so other containers can join them. Gets pod IP from CNI plugin.

Why it matters: if app container restarts, namespaces survive because pause still holds them. Pod IP stays.

#### Pod bootstrap sequence

1.  Scheduler binds pod to node
2.  kubelet on node receives spec via apiserver watch
3.  kubelet → CRI → containerd: create pause container
4.  CNI plugin configures pause's NET namespace (assigns pod IP)
5.  Init containers run to completion (join pause namespaces)
6.  App containers start, share pause's NET/IPC/UTS
7.  containerd-shim keeps containers running if containerd restarts

Quiz 4 Q10 answer: pause "helps set up Linux namespaces and cgroups for a pod".

#### Quiz 4 Q5 wording trap — "maintain" vs "store"

Quiz 4 Q5 ("What does kubernetes use to maintain its state?") lists `kube-controller-manager`, `kube-scheduler`, `kubelet`, `kubectl`, `pods`. **etcd is not in the option list**. The keyed answer is `kube-controller-manager` — it runs the reconcile loops that drive actual state toward desired state. etcd is where the raw data persists, but that wasn't offered.
