---
"n": 10
id: 4915-lesson-containers-pods-kubernetes
title: Containers, Pods, Kubernetes
hook: All of Quiz 4 was K8s. Expect similar weight on final. This lesson is the anchor.
tags:
  - kubernetes
module: Kubernetes & containers
---

**Motivation.** The instructor said "same questions may reappear." Quiz 4 was 10-for-10 on Kubernetes. This lesson covers the exact answers to Q1 (kubelet), Q5 (controller-manager), Q6 (spec section), Q8 (DaemonSet), Q10 (pause container) — plus the Mod10 A-E scaffolding they sit on.

**Scenario.** You're running *20 microservices* on one Linux host. Process A binds `:8080`. Process B tries to bind `:8080` — *address already in use*. Process C reads `/etc/config.yaml` that process D clobbered. Process E forks 10,000 children and the scheduler starves everyone else. You want each service to think it owns the host — without spinning up 20 VMs. The answer: **Linux namespaces + cgroups + chroot**. Kubernetes wraps those primitives in a scheduler, an API server, and a bunch of reconcile loops. Everything else in this lesson is decoration on that core idea.

### Container primitives — the Linux kernel does the heavy lifting

##### Namespaces — ISOLATE view

Each process sees its own slice of a kernel resource. 8 types:

-   **PID** — own process tree (own PID 1)
-   **NET** — own interfaces, routing, iptables
-   **MNT** — own mount points
-   **UTS** — own hostname, NIS domain
-   **IPC** — own SysV/POSIX IPC
-   **USER** — UID/GID mapping (unpriv user = container root)
-   **CGROUP** — own cgroup view
-   **TIME** — clock offset (kernel 5.6+)

Tools: `unshare`, `nsenter`, `lsns`.

##### cgroups — LIMIT resources

Kernel accounting + hard caps on a group of processes.

-   CPU: shares / quotas
-   Memory: hard limit (OOM-kill at limit)
-   I/O: read/write bandwidth caps
-   PIDs, devices, net\_cls

v1 = separate hierarchy per subsystem  
v2 = unified tree under `/sys/fs/cgroup/`. K8s uses cgroups to enforce QoS.

##### chroot / pivot\_root — FS jail

Change a process's view of `/` to a subdirectory. Process cannot see files outside that subtree.

-   `chroot /jail /bin/bash`
-   Container runtimes use `pivot_root` (more robust)
-   Combined with MNT namespace = full FS isolation

Instructor: "8 namespaces — memorize the list"

PID · NET · MNT · UTS · IPC · USER · CGROUP · TIME.   Mnemonic: "Please Name My UNIX Isolation Using Consistent Timing."

### The Pod — why it's not just "one container"

A **Pod** is K8s's smallest deployable unit: 1 or more containers that SHARE three namespaces (NET, IPC, UTS) while keeping their own MNT and PID. They share an IP address, hostname, and IPC space — but not each other's filesystems.

> **Analogy**
> **Apartment analogy.** The *pause container* signs the lease — it holds the NET/IPC/UTS namespace file descriptors open. Other containers in the Pod are roommates who move into the same apartment: they share the kitchen (NET), mail (IPC), and doorbell (UTS). Each has their own bedroom (MNT). If the lease-holder walks out, everyone moves out — pod is recreated.

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

Control plane lives on master (apiserver is the only door; etcd is the only truth). Worker node runs kubelet + kube-proxy + a runtime; Pods live inside the runtime.

Quiz 4 Q10 — the EXACT answer to memorize

The **pause container** is the first container in every Pod. Its only job is to *hold the shared namespace file descriptors open* (NET, IPC, UTS) so other containers can join them. It also gets the pod's IP from CNI. Tiny, does nothing, always-on. If it dies, the Pod dies and gets recreated.

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

Essay-ready 5-step bootstrap. Each step maps to a Linux primitive: scheduling (logical), namespaces (pause), CNI (NET ns setup), init containers (join), app containers (join + run).

> **Example**
> #### Pod bootstrap — step by step (essay material)
>
> 1.  **Scheduling.** You `kubectl apply -f pod.yaml`. apiserver writes the pod spec to etcd in Pending state. kube-scheduler watches etcd, picks a suitable node (resource fit + taints + affinity), writes the binding back to etcd. The chosen node's kubelet sees "pod assigned to me" and starts work.
> 2.  **Pause container.** kubelet tells the runtime (containerd) to create the pause container. Runtime calls `unshare` to make fresh NET, IPC, UTS namespaces and starts the pause process inside them. Pause blocks on a signal and does nothing else.
> 3.  **CNI.** kubelet invokes the CNI plugin (Calico / Cilium / Flannel / ...). The plugin allocates a pod IP from the cluster CIDR, creates a veth pair, drops one end in pause's NET namespace with the IP, hooks the other into the node's bridge/routing. Pod is now network-addressable.
> 4.  **Init containers.** Any `initContainers` launch one at a time, each joining the pause's namespaces. They run to completion (exit 0). Used for migrations, config fetch, cert setup.
> 5.  **App containers.** Finally the real app containers start, all sharing the pause's NET/IPC/UTS (but their own MNT + PID). They talk to each other via `localhost` because they share NET.
>
> This is the model answer to "explain how a Pod is built from Linux primitives" (Mod10B/C essay prep).

### Interacting with a cluster — kubectl

inspect pods — standard diagnostic flow

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
> #### A real pod YAML — read each field
>
> 1.  Paste into `nginx-pod.yaml`:
>     
>     ```yaml
>     apiVersion: v1              # core API group — stable
>     kind: Pod                   # what kind of object (Quiz 4 Q6: "spec" is where image lives)
>     metadata:
>       name: web                 # unique in the namespace
>       namespace: default        # K8s namespace (virtual cluster, NOT Linux ns)
>       labels:
>         app: web                # selectors + services use these
>     spec:                       # DESIRED STATE starts here
>       containers:
>       - name: nginx             # container name (for logs/exec)
>         image: nginx:1.25       # OCI image reference (Quiz 4 Q2: OCI format)
>         ports:
>         - containerPort: 80
>         resources:
>           requests:             # cgroups MIN reservation — scheduler uses this
>             cpu: 100m           # 0.1 CPU
>             memory: 128Mi
>           limits:               # cgroups HARD CAP — OOM-killed past this
>             cpu: 500m
>             memory: 512Mi
>     status: {}                  # system-written — leave empty
>     ```
>     
> 2.  Apply: `kubectl apply -f nginx-pod.yaml`. apiserver validates and writes to etcd.
> 3.  Because **requests != limits**, this pod is **Burstable** QoS. If both matched exactly it would be Guaranteed. Neither set → BestEffort.
> 4.  `kubectl get pod web -o wide` shows the pod IP assigned by CNI; the nginx container sees that IP on its eth0 (in the pause's NET namespace).
>
> Quiz 4 Q6 answer: "spec" section holds the container image. Memorize the field *name*.

### QoS classes — determined from YAML, decide eviction order

##### Guaranteed

**Condition:** requests == limits for CPU AND memory, all containers.  
**Evicted:** LAST (most protected)

```yaml
requests: {cpu: 500m, memory: 256Mi}
limits:   {cpu: 500m, memory: 256Mi}
```

##### Burstable

**Condition:** at least one request OR limit set, but not Guaranteed.  
**Evicted:** MIDDLE

```yaml
requests: {cpu: 100m, memory: 128Mi}
limits:   {cpu: 500m, memory: 512Mi}
```

##### BestEffort

**Condition:** NO requests AND NO limits.  
**Evicted:** FIRST under memory pressure

```yaml
# nothing under resources:
# (or no resources key at all)
```

### Workload controllers — which object for which job

##### Deployment

**Stateless app, replicas, rolling update.** Manages a ReplicaSet which manages Pods. *Most common way to run apps* (Quiz 4 Q4).

##### DaemonSet

**Exactly one pod per node.** Used for node-local agents (logging, monitoring, CNI plugins). Runs on new nodes automatically (Quiz 4 Q8).

##### StatefulSet

**Stable identity + stable storage.** Pods get ordinal names (db-0, db-1), stable DNS, persistent volumes. Use for databases, queues.

##### Job

**Run-to-completion.** One-shot work; retries on failure; terminates when done. Batch processing, migrations.

##### CronJob

**Scheduled Job.** Like `cron` for K8s — creates a Job on a schedule (`"0 2 * * *"`). Backups, reports.

### Control plane + node components

-   **kube-apiserver** — the ONLY door in. REST endpoint, auth, validation. Every other component talks through it.
-   **etcd** — distributed KV store; raw cluster state data persists here.
-   **kube-scheduler** — watches pending Pods, picks a node (filter + score), writes the binding to etcd.
-   **kube-controller-manager** — runs reconcile loops (ReplicaSet, Node, Job, etc.). "Desired vs actual, converge."
-   **kubelet** — node agent. Talks to apiserver, talks to runtime via CRI, reports status. *Quiz 4 Q1.*
-   **kube-proxy** — implements Service routing via iptables/IPVS rules on each node.
-   **Container runtime** — containerd or CRI-O (Docker deprecated). Actually creates the container processes.

### CNI plugins (Mod10E)

Each pod gets a unique IP, reachable from any node without NAT. That magic is done by a CNI plugin:

-   **Calico** — L3 BGP routing, no overlay. Scales well, has NetworkPolicy.
-   **Cilium** — eBPF in the kernel; L7 policies; can replace kube-proxy entirely.
-   **Flannel** — VXLAN overlay. Simple, no policies.
-   **Antrea** — OVS-based, OpenFlow rules.
-   **Weave** — mesh, optional IPSec encryption built in.

> **Note**
> **Common confusion.** *Linux* namespace ≠ *Kubernetes* namespace. Linux namespace = kernel isolation primitive (PID, NET, etc.). Kubernetes namespace = virtual cluster partition (label for grouping objects). They share a word, nothing else.

Check: Reason for the pause container? (Quiz 4 Q10)It holds the Linux namespaces (NET, IPC, UTS) for the pod so other containers can share them — and it holds the pod's IP from CNI. Does nothing else. Check: What's the kubelet's role? (Quiz 4 Q1)Agent on each node. Watches apiserver for pods assigned to its node, tells the container runtime via CRI to pull images and start containers, reports status back. Check: A pod has `requests.cpu=100m` and no limits. What QoS class?Burstable. Has a request → not BestEffort; requests≠limits → not Guaranteed → Burstable. Check: Which object runs exactly one pod on every node?DaemonSet. (Quiz 4 Q8.) Used for log shippers, node exporters, CNI agents. Check: Name the 8 Linux namespaces.PID, NET, MNT, UTS, IPC, USER, CGROUP, TIME.

Sources: Mod10A/B/C/D/E · Quiz 4 Q1, Q2, Q4, Q5, Q6, Q8, Q10 · Lab 10
