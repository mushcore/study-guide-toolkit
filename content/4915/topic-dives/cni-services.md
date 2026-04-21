---
id: 4915-topic-cni-services
title: CNI + Services
pillar: tech
priority: med
chapter: Mod10E
tags:
  - kubernetes
  - editor
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
