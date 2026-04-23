---
"n": 10
id: 4915-lesson-containers-pods-kubernetes
title: Containers, Pods, Kubernetes
hook: All of Quiz 4 was K8s. Expect similar weight on final. This lesson is the anchor.
tags:
  - kubernetes
module: Kubernetes & containers
source: "Mod10A-E; materials/labs/Lab9.pdf, Lab10.pdf; materials/past-exams/comp4915_quiz4.md"
related: [4915-topic-linux-namespaces-8-types, 4915-topic-cgroups-qos-classes, 4915-topic-control-plane-node-components, 4915-topic-pod-architecture-pause-container, 4915-topic-cni-services]
---

You're running 20 microservices on a single Linux host. Process A binds `:8080`; Process B also needs `:8080` — **address already in use**. Process C reads `/etc/config.yaml`; Process D just overwrote it. Process E forks 10,000 children and starves the scheduler for everyone else. You want each service to think it owns the machine — without spinning up 20 VMs.

Before reading on, commit to an answer: which Linux kernel features would let you isolate these services from each other, each with its own network, its own filesystem view, and bounded CPU? Write down what you know, or admit "I'm not sure yet."

The answers are three Linux kernel primitives that every container runtime — and every Kubernetes pod — is built on. Once you see those three, the entire K8s object model stops being a pile of names to memorize and becomes predictable.

### The three primitives Kubernetes stands on

Strip away the YAML and the dashboard, and every container on earth runs on:

1. **Namespaces** — give the process an isolated *view* of kernel resources (its own network, its own process tree, its own hostname).
2. **cgroups** — *limit* how much of the real hardware the process can consume (CPU, memory, I/O).
3. **chroot / pivot\_root** — restrict which files the process can *see* by re-rooting its filesystem.

Kubernetes adds a scheduler, a key-value store (etcd), an API server, and a set of reconcile loops on top. That fourth layer handles *placement* — deciding which node runs which constrained processes. But the isolation itself is still exactly those three Linux primitives, running inside the kernel of every worker node.

## Namespaces — isolate the process's view

A **namespace** is a kernel feature that gives a process its own private slice of a global resource. When you create a new namespace of a given type, the process inside it sees only what was placed in that namespace — the host's view is hidden.

Eight types exist (all exam-tested):

-   **PID** — own process tree. The process sees its own PID 1 and cannot see PIDs outside the namespace.
-   **NET** — own network interfaces, routing table, iptables rules, and port space.
-   **MNT** — own set of mount points; the process sees a different filesystem layout.
-   **UTS** — own hostname and NIS domain name.
-   **IPC** — own SysV semaphores and POSIX message queues.
-   **USER** — own UID/GID mapping. An unprivileged host user can appear as root inside.
-   **CGROUP** — own view of the cgroup hierarchy (so the container thinks it's at the root).
-   **TIME** — own clock offset (Linux 5.6+; rare in practice).

The key tools: `unshare` creates a new namespace, `nsenter` joins an existing one by PID, `lsns` lists all namespaces on the system. In Lab 10 §13 you used `nsenter -at 1847 /bin/sh` to enter the exact namespaces of a running container process — bypassing kubectl entirely and going straight to the kernel.

> **Q:** You open a shell inside a container and run `ps aux`. You see exactly two processes: PID 1 (your app) and PID 2 (ps itself). On the node outside, the very same app process has PID 1847. Which namespace produces this effect, and why does the PID differ?
>
> **A:** The **PID namespace**. Each PID namespace has its own process tree starting at PID 1. The kernel maps host-side PID 1847 to container-side PID 1 transparently — one process, two PID numbers depending on which namespace you observe from. Lab 10 §21 confirmed this: `kubectl exec -t -i core-k8s -- ps` showed only two processes, while `ps aux` on the node showed the same sleep as PID 1847.

## cgroups — limit what the process can consume

A **cgroup** (control group) is a kernel accounting and enforcement mechanism. You place a set of processes into a cgroup, then set hard caps:

-   **CPU** — shares (soft weight) and quotas (hard throttle via CFS bandwidth control: the process gets N ms of CPU time per 100 ms period, then is throttled).
-   **Memory** — hard limit; the OOM killer fires when the process reaches it.
-   **I/O** — read/write bandwidth per block device.
-   **PIDs** — maximum number of processes in the group.

Two generations: **v1** uses a separate hierarchy per subsystem (one tree for CPU, another for memory); **v2** unifies everything under `/sys/fs/cgroup/`. Kubernetes uses cgroups to enforce the `resources.requests` and `resources.limits` fields in a pod spec — the scheduler uses requests to decide node placement; cgroups enforce the limits at runtime.

> **Q:** A pod has `resources.limits.cpu: 100m`. You run `dd if=/dev/zero of=/dev/null` inside it. On the node you observe ~10% CPU usage, even though the node has spare capacity. Why exactly 10%?
>
> **A:** 100 millicores = 0.1 CPU. The CFS bandwidth controller enforces this by giving the process a budget of 10 ms per 100 ms scheduling period — after that 10 ms is spent, the process is throttled regardless of available CPU. Lab 10 §19 observed exactly this: dd with `limits.cpu: 100m` pegged at ~10% while the node was otherwise idle.

## chroot and pivot\_root — the filesystem jail

**chroot** changes a process's root directory to a subdirectory. After `chroot /jail /bin/bash`, the process believes `/jail` is `/` — it cannot `cd` above it or read files outside that subtree. Container runtimes use `pivot_root` instead (it atomically replaces the root mount and is more robust), but the effect is identical.

Lab 10 taught an important negative result: **chroot alone is not isolation**. In §7a you ran `ps aux` inside the chroot jail and saw every process on the node — dozens of them, including `etcd` and `kube-apiserver`. The reason: chroot restricts only the filesystem view. The PID namespace was still shared with the host, and `/proc` was bind-mounted from the host into the jail, so ps read the real kernel process table. Real containers combine `pivot_root` with a PID namespace (and a MNT namespace that hides the host `/proc`) to achieve actual process isolation.

Combine all three — a MNT namespace with `pivot_root`, a PID namespace, and cgroups — and the process lives in what feels like its own machine while the kernel enforces strict resource limits. That combination is what "container" actually means.

> **Q:** In Lab 10 you entered a chroot jail and ran `ps aux`. You expected to see only jail processes, but instead saw ~50 processes including `kube-apiserver`. What did you miss, and how is it fixed in a real container?
>
> **A:** chroot restricts the filesystem root but doesn't touch the PID namespace. Because `/proc` was bind-mounted into the jail from the host, ps read the real process table. Real containers add a **PID namespace** (`unshare --pid`) so the kernel presents an isolated process tree — plus a MNT namespace that provides its own `/proc` — making host processes invisible.

## The Pod — why it's not just "one container"

A **Pod** is Kubernetes's smallest deployable unit. It wraps one or more containers that *share a subset of Linux namespaces* — specifically **NET, IPC, and UTS** — while keeping their own **MNT** and **PID** namespaces. Sharing NET means all containers in the pod see the same network interface, the same IP address, and can reach each other on `localhost`. Sharing UTS means they share the same hostname.

> **Analogy**
> **Apartment analogy.** The *pause container* signs the lease — it holds the NET/IPC/UTS namespace file descriptors open. Other containers in the pod are roommates who move into the same apartment: they share the kitchen (NET), the mail slot (IPC), and the doorbell (UTS). Each has their own bedroom (MNT). If the lease-holder walks out, the apartment dissolves — the pod is recreated.

K8s cluster — control plane + worker node + pod internals

flowchart TB subgraph CP\["CONTROL PLANE (master)"\] direction LR API\["kube-apiserver  
REST · auth · gateway"\] ETCD\["etcd  
raw state data store"\] SCHED\["kube-scheduler  
binds pods → nodes"\] CTRL\["controller-manager  
reconcile loops"\] end subgraph WN\["WORKER NODE"\] direction TB KUBELET\["kubelet  
agent (Quiz 4 Q1) · CRI"\] KPROXY\["kube-proxy  
Service routing (iptables)"\] CRUN\["container runtime  
containerd / CRI-O"\] subgraph POD\["POD — shares NET / IPC / UTS"\] direction LR PAUSE\["pause  
holds ns"\] INITC\["init  
run-to-exit"\] APP1\["app-1"\] APP2\["app-2"\] end KUBELET --> CRUN CRUN --> POD end SCHED -. "bind pod → node" .-> KUBELET classDef cp fill:#181822,stroke:#7aa2f7,color:#e5e5e5; classDef node fill:#1a1a1a,stroke:#262626,color:#e5e5e5; classDef pause fill:#201c15,stroke:#e0af68,color:#e0af68; classDef app fill:#1a2218,stroke:#9ece6a,color:#9ece6a; class API,ETCD,SCHED,CTRL cp; class KUBELET,KPROXY,CRUN node; class PAUSE pause; class INITC,APP1,APP2 app;

The control plane lives on the master (apiserver is the only external door; etcd is the only source of truth). Each worker node runs kubelet + kube-proxy + a container runtime. Pods live inside the runtime.

The **pause container** is the first container created in every pod. Its only job is to hold the NET, IPC, and UTS namespace file descriptors open so all other containers in the pod can join them. It also receives the pod IP from the CNI plugin. Pause is tiny, does nothing useful, and never exits voluntarily — if it dies, the pod loses its namespace anchor and the whole pod is recreated. That is the Quiz 4 Q10 answer.

## Pod bootstrap — five steps from YAML to running app

When you run `kubectl apply -f pod.yaml`, here is exactly what happens, mapped to Linux primitives at each step:

Pod bootstrap timeline — 5 steps from YAML to running app

flowchart LR S1\["1. Schedule  
scheduler binds pod  
kubelet watches"\] --> S2\["2. Pause  
containerd creates pause  
holds NET/IPC/UTS"\] S2 --> S3\["3. CNI  
plugin assigns pod IP  
to pause NET ns"\] S3 --> S4\["4. Init  
init containers join ns  
run to completion"\] S4 --> S5\["5. App  
app containers launch  
share NET/IPC/UTS"\] classDef blue fill:#181822,stroke:#7aa2f7,color:#e5e5e5; classDef amber fill:#201c15,stroke:#e0af68,color:#e0af68; classDef gray fill:#181818,stroke:#262626,color:#e5e5e5; classDef green fill:#181a18,stroke:#9ece6a,color:#9ece6a; class S1 blue; class S2 amber; class S3 gray; class S4,S5 green;

> **Example**
> #### Pod bootstrap — step by step (essay material)
>
> 1. **Scheduling.** `kubectl apply` sends the manifest to apiserver, which validates it and writes a Pending pod to etcd. kube-scheduler watches etcd, finds the new pending pod, picks a node (resource fit, taints, affinity), and writes the binding back to etcd. The chosen node's kubelet sees "pod assigned to me" via its watch on apiserver and starts work.
> 2. **Pause container.** kubelet tells the runtime (containerd) to pull and start the pause image. containerd calls `unshare` to create fresh NET, IPC, and UTS namespaces, starts the tiny pause binary inside them, and returns a container ID. Pause blocks waiting for a signal — it intentionally does nothing else.
> 3. **CNI.** kubelet invokes the configured CNI plugin (Calico, Cilium, Flannel, …). The plugin allocates a pod IP from the cluster CIDR, creates a virtual Ethernet (veth) pair, drops one end inside pause's NET namespace with the IP assigned, and connects the other end to the node's bridge or routing table. The pod now has a routable IP reachable from any node without NAT. Lab 9 §20 showed the pod nameserver pointing to CoreDNS (`10.96.0.10`) while the node used the host DNS — CNI sets that per-pod `resolv.conf` at this step.
> 4. **Init containers.** Any `initContainers` launch one at a time. Each joins pause's NET, IPC, and UTS namespaces but gets its own MNT namespace. They run to completion (exit 0) before the next starts. Used for migrations, fetching secrets, or any setup that must complete before the app starts.
> 5. **App containers.** Finally the containers you care about start. Each joins pause's NET/IPC/UTS namespaces and gets its own MNT and PID. Because they all share NET, they communicate via `localhost` — the pod IP is the address on their shared `eth0` inside pause's NET namespace.
>
> Lab 10 §12 confirmed this hierarchy: `ps` on the node showed `containerd-shim (PID 1780) → pause (PID 1810), sleep (PID 1847)` — pause and the app container both children of the same shim, exactly step 2 and step 5.

## Interacting with a cluster — kubectl

```console
$ kubectl get pods
NAME              READY   STATUS      RESTARTS   AGE
web-5c9f-abcd     1/1     Running     0          2m
web-5c9f-efgh     1/1     Running     0          2m
worker-job-x7q2   0/1     Completed   0          5m

$ kubectl describe pod web-5c9f-abcd
Name:       web-5c9f-abcd
Namespace:  default
Node:       worker-2/10.0.0.12
Status:     Running
IP:         10.244.1.47
Containers:
  nginx:
    Image:      nginx:1.25
    State:      Running
    Requests:   cpu: 100m, memory: 128Mi
    Limits:     cpu: 500m, memory: 512Mi
Events:
  Scheduled   2m   default-scheduler   Successfully assigned to worker-2
  Pulling     2m   kubelet             Pulling image "nginx:1.25"
  Started     2m   kubelet             Started container nginx

$ kubectl logs web-5c9f-abcd
2026/04/18 10:14:03 [notice] worker processes starting
```

> **Example**
> #### A pod YAML, field by field
>
> ```yaml
> apiVersion: v1              # core API group — stable
> kind: Pod                   # resource type
> metadata:
>   name: web
>   namespace: default        # K8s namespace — NOT a Linux namespace (see Pitfall)
>   labels:
>     app: web                # Services and selectors use these
> spec:                       # DESIRED STATE starts here (Quiz 4 Q6: image lives here)
>   containers:
>   - name: nginx
>     image: nginx:1.25       # OCI image reference (Quiz 4 Q2: OCI format)
>     ports:
>     - containerPort: 80
>     resources:
>       requests:             # cgroups minimum — scheduler uses this for placement
>         cpu: 100m           # 0.1 CPU
>         memory: 128Mi
>       limits:               # cgroups hard cap — OOM-killed if exceeded
>         cpu: 500m
>         memory: 512Mi
> status: {}                  # system-written; leave empty in your YAML
> ```
>
> Because requests ≠ limits here, this pod is **Burstable** QoS. Lab 9 §19b showed each pod gets its own IP from the CIDR range (`10.244.0.5`) — that IP lives on the `eth0` inside pause's NET namespace. Quiz 4 Q6: the container image goes in the `spec` section.

## QoS classes — derived from the YAML, decide eviction order

The QoS class is not something you declare — Kubernetes *derives* it from the resource fields you wrote. Under memory pressure, lower-class pods are evicted first.

**Guaranteed** — every container in the pod has requests equal to limits for **both** CPU and memory. Evicted last.

```yaml
requests: {cpu: 500m, memory: 256Mi}
limits:   {cpu: 500m, memory: 256Mi}
```

**Burstable** — at least one container has a request or limit set, but the pod doesn't meet Guaranteed. Evicted in the middle.

```yaml
requests: {cpu: 100m, memory: 128Mi}
limits:   {cpu: 500m, memory: 512Mi}
```

**BestEffort** — no requests and no limits on any container. Evicted first under memory pressure. Lab 10 §21: `core-k8s` (no resources set) returned `BestEffort` from `kubectl get po core-k8s -o jsonpath='{.status.qosClass}'`.

```yaml
# nothing under resources:
```

## Workload controllers — which object for which job

A Pod by itself is unmanaged — if it crashes, nothing recreates it. Lab 9 §18 confirmed this: the standalone `core-k8s` pod, once deleted, was gone permanently, while the nginx Deployment pods were immediately replaced by the ReplicaSet controller.

-   **Deployment** — stateless apps, replicas, rolling updates. Manages a ReplicaSet which manages Pods. Most common way to run apps (Quiz 4 Q4).
-   **DaemonSet** — runs exactly one pod on every node. New nodes automatically get the pod. Used for log shippers, monitoring exporters, CNI plugins (Quiz 4 Q8).
-   **StatefulSet** — stable identity and stable storage per replica. Pods get ordinal names (db-0, db-1), stable DNS, persistent volumes. Use for databases and queues.
-   **Job** — run-to-completion. One-shot; retries on failure; terminates when all pods succeed.
-   **CronJob** — schedules a Job on a cron expression (`"0 2 * * *"`). Backups, periodic reports.

## Control plane + node components

-   **kube-apiserver** — the only door in. REST endpoint, authentication, validation. Every other component talks through it.
-   **etcd** — distributed key-value store; the single source of truth for all cluster state.
-   **kube-scheduler** — watches for Pending pods, scores nodes (resource fit, taints, affinity), writes the binding to etcd.
-   **kube-controller-manager** — runs all reconcile loops (ReplicaSet, Node, Job, …). "Desired vs actual — converge." Quiz 4 Q5.
-   **kubelet** — the agent on each worker node. Watches apiserver for pods assigned to its node, tells the runtime via CRI to pull images and create containers, reports status back. Quiz 4 Q1.
-   **kube-proxy** — implements Service routing on each node via iptables/IPVS rules. Gives a stable ClusterIP to a set of pods.
-   **Container runtime** — containerd or CRI-O (Docker's direct K8s integration was deprecated). Actually creates container processes by applying namespaces, cgroups, and chroot/pivot\_root.

## CNI plugins — how every pod gets a routable IP

Each pod gets a unique IP reachable from any node without NAT. The CNI plugin does this at bootstrap step 3 by wiring a veth pair into pause's NET namespace:

-   **Calico** — L3 BGP routing, no overlay. Scales well; supports NetworkPolicy.
-   **Cilium** — eBPF in the kernel; L7-aware policies; can replace kube-proxy entirely.
-   **Flannel** — VXLAN overlay. Simple, no NetworkPolicy support.
-   **Antrea** — OVS-based, uses OpenFlow rules.
-   **Weave** — mesh networking with optional IPSec encryption built in.

Lab 9 §10g showed `registry.k8s.io/pause:3.9` in the node's image list alongside the CNI image (`kindnet`) — the CNI plugin runs as a DaemonSet (one pod per node) and wires the network namespace every time a new pod bootstraps.

## Checkpoints

> **Q:** What does the pause container do? (Quiz 4 Q10)
>
> **A:** Nothing useful — deliberately. It's the first container created in every pod and its only job is to hold the NET, IPC, and UTS namespace file descriptors open so all other containers in the pod can join them. That's how the pod gets a shared IP. It also receives the pod IP from CNI. Kill pause and the pod loses its namespace anchor and gets recreated.

> **Q:** What is the kubelet's role? (Quiz 4 Q1)
>
> **A:** It's the agent on each worker node. It watches apiserver for pods assigned to its node, tells the container runtime via CRI to pull images and start containers, and reports health status back. It is not the scheduler (which picks nodes) and not the controller-manager (which runs reconcile loops) — kubelet is the node-side executor.

> **Q:** A pod spec has `requests.cpu: 100m` but no limits at all. What QoS class does Kubernetes assign?
>
> **A:** **Burstable.** At least one request is set → not BestEffort. But requests are not equal to limits (no limits means the pod can burst without a cap) → not Guaranteed. Burstable is the middle class, evicted after BestEffort pods.

> **Q:** Which Kubernetes object runs exactly one pod on every node? (Quiz 4 Q8)
>
> **A:** **DaemonSet.** When a new node joins the cluster, the DaemonSet controller automatically schedules the pod onto it. Used for node-local agents: log shippers, node exporters, CNI plugins. All three CNI agents in the lab ran as DaemonSets.

> **Q:** Name the 8 Linux namespaces.
>
> **A:** PID, NET, MNT, UTS, IPC, USER, CGROUP, TIME. All eight are exam-tested. The first five (PID through IPC) are the ones containers use for application isolation; USER lets an unprivileged host user map to root inside the namespace; CGROUP and TIME are newer and less commonly tested but still on the list.

> **Pitfall:** *Linux* namespace ≠ *Kubernetes* namespace. A Linux namespace is one of the eight kernel isolation primitives above — a process-level construct. A Kubernetes namespace is a virtual cluster partition, just a label for grouping API objects (`default`, `kube-system`, etc.). They share only the word. Quiz 4 set this up as a trap: a question about "namespaces" required knowing which kind was being asked about.

> **Pitfall:** QoS class is *derived* from the spec, not declared. `Guaranteed` requires every container in the pod to have equal requests and limits for every resource it lists. Miss one container, list CPU but omit memory, or have requests ≠ limits on any resource — and you drop to `Burstable`. No requests or limits at all on any container → `BestEffort`, the first class to be OOM-killed under node pressure. Lab 10 §21 observed all three classes in one session.

> **Takeaway:** Kubernetes is three Linux primitives — namespaces (isolate view), cgroups (limit consumption), chroot/pivot\_root (restrict filesystem) — plus a scheduler and reconcile loops on top. The pause container holds a pod's shared namespaces so other containers can join them; kubelet is the node-side executor that applies those primitives via CRI; QoS class is derived from resource fields and decides eviction order; DaemonSet puts exactly one pod on every node. Know those four concepts cold and Quiz 4's ten questions become pattern-matching you've already done.
