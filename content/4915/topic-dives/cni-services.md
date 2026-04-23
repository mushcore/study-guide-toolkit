---
id: 4915-topic-cni-services
title: CNI + Services
pillar: tech
priority: med
chapter: Mod10E
source: "Mod10E; materials/labs/Lab10.pdf"
tags:
  - kubernetes
  - editor
related: [4915-topic-linux-namespaces-8-types, 4915-topic-iptables-netfilter, 4915-topic-dns-bind, 4915-topic-pod-architecture-pause-container]
---

CNI = Container Network Interface. Plugin spec for configuring pod network.

| Plugin | Tech | Notes |
| --- | --- | --- |
| Calico | BGP (default) or IPIP/VXLAN overlay | L3 routing, scales, NetworkPolicy |
| Antrea | OVS (Open vSwitch) | flow tables; L2 overlay or routed |
| Cilium | eBPF | kernel packet processing; can replace kube-proxy; L7 policies |
| Flannel | VXLAN (or host-gw) | Simple overlay, no NetworkPolicy |
| Weave | mesh | optional IPSec encryption |

#### Service types

-   **ClusterIP** — internal only (default)
-   **NodePort** — exposes on every node's IP at 30000-32767
-   **LoadBalancer** — cloud LB
-   **ExternalName** — DNS CNAME

CoreDNS handles cluster DNS: `svc.ns.svc.cluster.local` → ClusterIP → pods via kube-proxy rules.

> **Pitfall**
>
> The CNI plugin runs *after* the pause container is created, not before. If CNI fails, the pod stays in `ContainerCreating` — the pause container is up but has no IP. `kubectl describe pod` shows the CNI error in events.

> **Example** — CNI plumbs a new pod onto the network (Calico)
>
> 1. kubelet creates the pause container; its NET namespace (`ns-pod1`) exists but has no interfaces beyond `lo`.
> 2. kubelet invokes the CNI binary with `CNI_COMMAND=ADD`, passing `ns-pod1` and pod metadata.
> 3. Plugin creates a **veth pair**: `cali123` on the host side, `eth0` inside `ns-pod1`.
> 4. Plugin asks IPAM for an IP — returns `10.244.1.7/32` from the node's pod-CIDR slice.
> 5. Inside the namespace: `ip addr add 10.244.1.7/32 dev eth0; ip route add default dev eth0` — pod can now send packets.
> 6. On the host: `cali123` joins the routing table; BGP announces `10.244.1.7/32` to peer nodes so replies find their way back.
> 7. App containers join pause's NET namespace and reuse `eth0` — same IP, same routes, `localhost` talk between siblings.

> **Takeaway**: CNI plugins attach pods to the network by dropping a veth pair into the pod's NET namespace. Calico, Flannel, and Weave all do this — they differ in how they route between nodes, not in the basic mechanism.
