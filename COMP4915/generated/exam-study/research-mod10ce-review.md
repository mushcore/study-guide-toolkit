# Mod10C-E + Review Research (Build a Pod, cgroups, CNI, Final Review Slides)

## 8 Linux Namespaces (INSTRUCTOR EMPHASIS — isolation primitives)
| Namespace | Isolates |
|---|---|
| PID | process IDs (own PID 1) |
| NET | network stack (own interfaces, routing, iptables) |
| MNT | filesystem mounts |
| UTS | hostname, NIS domain |
| IPC | POSIX/SysV IPC, shared mem |
| USER | UID/GID mapping (unpriv user = container root) |
| CGROUP | cgroup view |
| TIME | system clock offset (kernel 5.6+) |

Tools:
- `unshare` — create new namespace(s): `unshare --pid --net --mount bash`
- `nsenter -t PID -p -n bash` — join existing namespaces of target PID
- `lsns` — list namespaces on system

## Pause container
- First container in every pod
- Holds namespace file descriptors open (NET, IPC, UTS shared across pod)
- Gets pod IP from CNI
- Init containers then app containers join pause's namespaces
- Minimal — does nothing; just keeps namespaces alive
- If pause dies → pod recreated
- **Quiz 4 Q10**: "Helps set up Linux namespaces and cgroups for a pod" (answer A)

## Pod bootstrapping (Fig 3.1)
1. kubelet receives pod spec
2. kubelet → CRI → containerd → creates pause container
3. CNI plugin assigns pod IP, configures pause NET namespace
4. Init containers run to completion (join pause namespaces)
5. App containers start (share NET, IPC, UTS with pause)
6. containerd-shim keeps containers running after containerd restart

## cgroups
- Control Groups — kernel feature to limit/account/isolate resource usage
- Resources: CPU, memory, I/O, pids, devices, network (net_cls)
- v1: separate hierarchies per subsystem; mounted under `/sys/fs/cgroup/<subsystem>/`
- v2: unified hierarchy; single tree `/sys/fs/cgroup/`
- Kubernetes uses cgroups to enforce pod/container resource limits
- CPU: cpu.shares (v1 weight) / cpu.max (v2 quota)
- Memory: memory.limit_in_bytes (v1) / memory.max (v2)

## QoS classes (INSTRUCTOR EMPHASIS — determine from YAML)
| QoS | Condition | Eviction priority |
|---|---|---|
| **Guaranteed** | requests == limits for CPU+memory, all containers | Last evicted |
| **Burstable** | At least one request or limit, but not Guaranteed | Middle |
| **BestEffort** | NO requests AND NO limits | First evicted |

Example Guaranteed:
```yaml
resources:
  requests: {cpu: 500m, memory: 256Mi}
  limits:   {cpu: 500m, memory: 256Mi}
```

## CNI (Container Network Interface)
- Plugin spec: kubelet → CNI binary → configure pod network
- Each pod gets unique IP from cluster CIDR
- Pod IP reachable from any node without NAT

### Plugins
| Plugin | Model | Notable |
|---|---|---|
| Calico | BGP L3 routing | No overlay, scales, NetworkPolicy |
| Antrea | OVS L2/L3 | OVS flow tables |
| Cilium | eBPF | Kernel-level; L7 policies, replaces kube-proxy |
| Flannel | VXLAN overlay | Simple, no policies |
| Weave | Mesh + IPSec | Built-in encryption |

## Kubernetes control plane
- **kube-apiserver** — REST API, auth, validates, gateway to etcd
- **etcd** — distributed KV store, ALL cluster state
- **kube-scheduler** — filters + scores nodes, binds pods
- **kube-controller-manager** — runs controllers (ReplicaSet, Deployment, Node, Job, etc.)
- **cloud-controller-manager** — cloud-specific (load balancer, routes)

## Node components
- **kubelet** — agent; talks CRI; reports status to apiserver
- **kube-proxy** — service routing (iptables/IPVS/userspace modes)
- **container runtime** — containerd / CRI-O (implements CRI)

## Service types
- **ClusterIP** — internal only (default)
- **NodePort** — exposes on every node's IP:port (30000-32767)
- **LoadBalancer** — cloud provider external LB
- **ExternalName** — DNS CNAME to external

## Other K8s objects
- **Deployment** — manages ReplicaSet, rolling updates
- **ReplicaSet** — maintains replica count (use Deployment, not RS directly)
- **StatefulSet** — stable names/storage for stateful apps
- **DaemonSet** — one pod per node (Quiz 4 Q8)
- **Job** — run-to-completion
- **CronJob** — scheduled Job
- **Namespace (K8s)** — virtual cluster partition (≠ Linux namespace)
- **ConfigMap** — non-sensitive config
- **Secret** — sensitive data (base64; not encrypted by default)
- **Ingress** — HTTP/HTTPS L7 routing rules
- **PersistentVolume / PVC** — storage abstraction

## kubectl essentials
- `kubectl apply -f file.yaml` declarative
- `kubectl get pods`, `get deployment`, `get svc`
- `kubectl describe pod NAME`
- `kubectl logs POD [-c CONTAINER]`
- `kubectl exec -it POD -- /bin/bash`
- `kubectl port-forward pod/NAME 8080:80`
- `kubectl rollout status/undo deployment/NAME`
- `kubectl scale deploy/NAME --replicas=5`

## Pod YAML structure
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp
  namespace: default
  labels: {app: web}
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports: [{containerPort: 80}]
    resources:
      requests: {cpu: 100m, memory: 128Mi}
      limits:   {cpu: 500m, memory: 512Mi}
status: {}  # system-written
```

## Key answers from Quiz 4 (LIKELY TO REAPPEAR per instructor)
1. Agent on cluster nodes implementing control-plane commands → **Kubelet**
2. Executable image format in K8s → **OCI** (Open Container Initiative)
3. Kubernetes — all of: cloud-neutral API, integrates with cloud/hypervisor, fault-tolerant, load balancing → **All of the above**
4. Most common way to run K8s app → **Deployment**
5. K8s uses X to maintain state → **etcd**? Note quiz says kube-controller-manager (state store is etcd, but manager reconciles state)
6. YAML section for container image → **spec**
7. kubectl continually checks → **if pod needs creation/deletion** (reconciliation loop)
8. Object runs pod on every node → **DaemonSet**
9. When a node fails → **all of the above** (kubelet stops reporting, new pods not scheduled there, existing pods rescheduled)
10. Pause container → **sets up Linux namespaces and cgroups for a pod**

## Flashcards (30)

1. **Q:** What agent runs on each node to execute control-plane commands?  **A:** kubelet. [Quiz 4 Q1]
2. **Q:** Executable image format in K8s?  **A:** OCI (Open Container Initiative). [Quiz 4 Q2]
3. **Q:** Most common way to run a K8s app?  **A:** Deployment. [Quiz 4 Q4]
4. **Q:** Where does K8s store cluster state?  **A:** etcd. [Quiz 4 Q5]
5. **Q:** YAML section specifying container image?  **A:** spec. [Quiz 4 Q6]
6. **Q:** K8s object running one pod per node?  **A:** DaemonSet. [Quiz 4 Q8]
7. **Q:** Reason for pause container?  **A:** Holds Linux namespaces (NET/IPC/UTS) open so other pod containers can join them. [Quiz 4 Q10]
8. **Q:** Name 8 Linux namespaces.  **A:** PID, NET, MNT, UTS, IPC, USER, CGROUP, TIME. [Mod10C]
9. **Q:** What does the NET namespace isolate?  **A:** Network stack (interfaces, routing table, iptables). [Mod10C]
10. **Q:** What does UTS namespace isolate?  **A:** Hostname and NIS domain. [Mod10C]
11. **Q:** Command to create new namespaces?  **A:** `unshare`. [Mod10C, Lab10]
12. **Q:** Command to join existing namespaces?  **A:** `nsenter`. [Mod10C, Lab10]
13. **Q:** What is chroot?  **A:** Change root directory for a process — filesystem isolation (jail). [Mod10C]
14. **Q:** cgroups v1 structure?  **A:** Separate hierarchy per subsystem (cpu, memory, etc.). [Mod10D]
15. **Q:** cgroups v2 structure?  **A:** Unified hierarchy — single tree, all controllers. [Mod10D]
16. **Q:** QoS class: requests=limits for all resources?  **A:** Guaranteed. [Mod10D]
17. **Q:** QoS class: no requests AND no limits?  **A:** BestEffort. [Mod10D]
18. **Q:** QoS class: some requests/limits but not Guaranteed?  **A:** Burstable. [Mod10D]
19. **Q:** First evicted under memory pressure?  **A:** BestEffort. [Mod10D]
20. **Q:** What does CNI stand for?  **A:** Container Network Interface. [Mod10E]
21. **Q:** Calico networking model?  **A:** BGP L3 routing, no overlay. [Mod10E]
22. **Q:** Cilium key tech?  **A:** eBPF (kernel-level packet processing, replaces kube-proxy). [Mod10E]
23. **Q:** Service type exposing port on every node?  **A:** NodePort. [Mod10E]
24. **Q:** Service type internal-only?  **A:** ClusterIP. [Mod10E]
25. **Q:** What reconciles desired vs actual state?  **A:** kube-controller-manager (runs controller loops). [Mod10A]
26. **Q:** What schedules pods to nodes?  **A:** kube-scheduler. [Mod10A]
27. **Q:** Component implementing service routing?  **A:** kube-proxy (iptables/IPVS rules). [Mod10E]
28. **Q:** CoreDNS purpose?  **A:** Cluster DNS — resolves service names to ClusterIP. [Mod10E]
29. **Q:** What's the CRI?  **A:** Container Runtime Interface — API between kubelet and container runtime. [Mod10A]
30. **Q:** Container runtimes in K8s today?  **A:** containerd, CRI-O (Docker deprecated). [Mod10A]

## Exam traps
- Linux namespace ≠ Kubernetes namespace (K8s ns = virtual cluster; Linux ns = kernel isolation)
- Pause container ≠ running app; purely holds namespaces
- cgroups enforces limits; namespaces isolate view
- DaemonSet runs on every node INCLUDING control plane (with toleration)
- etcd stores STATE; controller-manager RECONCILES
- QoS determines EVICTION ORDER — BestEffort dies first

## Practice questions

**MCQ 1**: A pod defines `resources.requests.cpu=100m` with no limits. What QoS?
A) Guaranteed B) Burstable C) BestEffort D) Critical
**Answer**: B. Has a request → not BestEffort; requests≠limits → not Guaranteed → Burstable.

**MCQ 2**: Which K8s component is the agent on each node?
A) kubectl B) kubelet C) kube-proxy D) scheduler E) etcd
**Answer**: B. [Quiz 4 Q1 — LIKELY ON FINAL]

**Short 3**: Name the 8 Linux namespaces.
**Answer**: PID, NET, MNT, UTS, IPC, USER, CGROUP, TIME.

**Short 4**: Why does the pause container exist?
**Answer**: To hold the Linux namespaces (NET, IPC, UTS) open so all containers in the pod can join them and share network/hostname/IPC.

**Essay 5**: Explain how a Pod is built from Linux primitives (namespaces, cgroups, chroot). Include the role of pause container and CNI.
**Model outline**:
1. kubelet receives pod spec via CRI.
2. Runtime (containerd) creates pause container — root for shared namespaces (NET, IPC, UTS).
3. CNI plugin configures pause's NET namespace (unique pod IP).
4. cgroups created per container enforcing CPU/memory limits → QoS class determined.
5. chroot / pivot_root gives container its filesystem view.
6. Init containers join pause's namespaces, run to completion.
7. App containers launch, sharing pause's NET/IPC/UTS; get own PID/MNT unless configured.
8. containerd-shim keeps them alive.
Result: isolated but cooperatively networked process group — the Pod.
