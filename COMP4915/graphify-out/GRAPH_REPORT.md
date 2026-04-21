# Graph Report - ./materials  (2026-04-08)

## Corpus Check
- Corpus is ~2,114 words - fits in a single context window. You may not need a graph.

## Summary
- 179 nodes · 175 edges · 34 communities detected
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 31 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `COMP 4915 Midterm Exam Spring 2026` - 12 edges
2. `Kubernetes (K8S)` - 11 edges
3. `Lab 1 - Linux Basics (Ch 1-5)` - 9 edges
4. `Lab 3 - DNS Server Setup` - 8 edges
5. `Lab 9 - Kubernetes Exploration with Kind` - 8 edges
6. `Kubelet` - 8 edges
7. `Control Groups (cgroups)` - 8 edges
8. `Lab 2 - Unix File System` - 7 edges
9. `Lab 10 - Linux Namespaces and cgroups` - 7 edges
10. `Lab 4 - Shell Utilities and Scripting` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Regular Expressions with grep` --semantically_similar_to--> `grep Command`  [INFERRED] [semantically similar]
  materials/labs/Lab4.pdf → materials/past-exams/midterm.md
- `BIND Package (bind, bind-utils)` --semantically_similar_to--> `named Daemon (DNS)`  [INFERRED] [semantically similar]
  materials/labs/Lab3.pdf → materials/past-exams/midterm.md
- `tr Command (Character Translation)` --semantically_similar_to--> `tr Command`  [INFERRED] [semantically similar]
  materials/labs/Lab4.pdf → materials/past-exams/midterm.md
- `SSH X11 Tunneling / Forwarding` --conceptually_related_to--> `SSH - Secure Shell`  [INFERRED]
  materials/labs/Lab6.pdf → materials/past-exams/midterm.md
- `Hard Link Cross-Filesystem Limitation` --conceptually_related_to--> `Hard Link`  [INFERRED]
  materials/labs/Lab2.pdf → materials/past-exams/midterm.md

## Hyperedges (group relationships)
- **Kubernetes Container Isolation Stack (namespaces + cgroups + chroot)** — lab10_linux_namespaces, lab10_cgroups, lab10_chroot, lab10_pause_container, lab10_containerd_shim [EXTRACTED 0.88]
- **DNS Service Management (BIND + systemctl + firewall-cmd + zone files)** — lab3_bind_package, lab3_systemctl, lab3_firewall_cmd, lab3_dns_zone_files, lab3_dns_caching_server [EXTRACTED 0.90]
- **Kubernetes Pod Lifecycle (kubectl + YAML + deployment)** — lab9_kubectl, lab9_kubectl_apply, lab9_pod_yaml, lab9_deployment_yaml, lab9_namespace_kubernetes [EXTRACTED 0.87]
- **Pod Creation Linux Primitive Stack** — mod10c_linux_namespaces, mod10d_cgroups_concept, mod10c_pause_container, mod10c_kubelet [EXTRACTED 0.95]
- **Kubernetes Node Runtime Components** — mod10c_kubelet, mod10a_cri, mod10c_cni, mod10a_containerd [EXTRACTED 0.92]
- **Pod QoS and Resource Management via cgroups** — mod10d_cgroups_concept, mod10d_qos, mod10d_qos_guaranteed, mod10d_qos_burstable, mod10d_qos_besteffort [EXTRACTED 0.95]

## Communities

### Community 0 - "Kubernetes Core & Pods"
Cohesion: 0.09
Nodes (25): Container (OCI), Module 10A: Containers, Pods and Kubernetes, Control Plane, DaemonSet, Deployment (K8S), Docker, etcd Database, Infrastructure Drift Problem (+17 more)

### Community 1 - "Container Runtime & Namespaces"
Cohesion: 0.13
Nodes (19): containerd (CRI), CRI (Container Runtime Interface), Node (Kubernetes), Pod Bootstrapping Timeline (Fig 3.1), chroot (Isolated Process), CNI (Container Network Interface), CSI (Container Storage Interface), Kubelet (+11 more)

### Community 2 - "DNS & DHCP Setup"
Cohesion: 0.13
Nodes (16): BIND Package (bind, bind-utils), DHCP Reserved IP (MAC-based), Lab 3 - DHCP Server Setup, dig Command (DNS Query Tool), DNS Caching Server, Lab 3 - DNS Server Setup, DNS Zone Files (named.conf, db.*), firewall-cmd (Firewall Port Management) (+8 more)

### Community 3 - "Linux Basics & Processes"
Cohesion: 0.18
Nodes (14): Cilium (eBPF Network Policy), /dev/null (Bit Bucket), diff Command, eBPF (Extended Berkeley Packet Filter), find Command, grep Options (-c, -l, -n, -i), gzip Compression Utility, Lab 1 - Linux Basics (Ch 1-5) (+6 more)

### Community 4 - "Midterm Exam Concepts"
Cohesion: 0.17
Nodes (13): Bash Shell Variables, COMP 4915 Midterm Exam Spring 2026, grep Command, Hard Link, Linux-PAM (Pluggable Authentication Modules), named Daemon (DNS), NFS - Network File System, Run Level 3 (Multiuser Text Mode) (+5 more)

### Community 5 - "File System & Permissions"
Cohesion: 0.18
Nodes (12): File Permissions / chmod, df Command (Disk Filesystems), /etc/passwd File, Hard Link Cross-Filesystem Limitation, inode Number, mount Command, Shadow Passwords (/etc/shadow), Lab 2 - Unix File System (+4 more)

### Community 6 - "Samba, Sendmail & K8S Labs"
Cohesion: 0.18
Nodes (12): Kind (Kubernetes in Docker), Lab 7 - Samba Setup, Samba WORKGROUP Configuration, Lab 7 - Sendmail Setup, Kubernetes Deployment YAML (nginx), docker exec (Container Shell Access), kubectl jsonpath Queries, kubectl Command (+4 more)

### Community 7 - "Namespaces, cgroups & Containers Lab"
Cohesion: 0.29
Nodes (10): cgroups (Control Groups), chroot Jail, containerd-shim Process, Kubernetes CPU Limits/Requests, Lab 10 - Linux Namespaces and cgroups, ldd Command (Library Dependencies), Linux Namespaces (Process Isolation), nsenter Command (+2 more)

### Community 8 - "Windows Server & AD"
Cohesion: 0.2
Nodes (10): Active Directory Installation, Active Directory User Account Management, Organizational Unit (OU) Management, pathping and tracert Commands, Windows PowerShell, Domain Local and Global Security Groups, Windows Server Manager, Folder Auditing via Group Policy (+2 more)

### Community 9 - "Shell Utilities & Text Processing"
Cohesion: 0.25
Nodes (8): IFS Variable (Internal Field Separator), PATH Variable, Regular Expressions with grep, sed Command (Stream Editor), Lab 4 - Shell Utilities and Scripting, sort Command as Filter, tr Command (Character Translation), tr Command

### Community 10 - "QoS & Resource Management"
Cohesion: 0.25
Nodes (8): Module 10D: CGroups, Metrics (gauges, histograms, counters), Prometheus Monitoring, Quality of Service (QoS), QoS BestEffort Class, QoS Burstable Class, QoS Guaranteed Class, Rationale: QoS Tradeoffs Between Cost and Service Levels

### Community 11 - "FTP, SSH & Java Setup"
Cohesion: 0.33
Nodes (6): /etc/profile (System-wide Environment), FTP Anonymous Account (/pub), Lab 6 - FTP Server Setup, Java EE Server (Wildfly) on Linux, JAVA_HOME Environment Variable, SSH X11 Tunneling / Forwarding

### Community 12 - "Apache & Shell Scripts"
Cohesion: 0.5
Nodes (4): Apache Password-Protected Directory, Lab 8 - Apache Web Server Setup, bundle Shell Archive Script, Shell Functions (Lab 8 Scripts)

### Community 13 - "cgroups Versions"
Cohesion: 1.0
Nodes (2): cgroups v1, cgroups v2

### Community 14 - "Network Security"
Cohesion: 1.0
Nodes (1): /etc/hosts.deny File

### Community 15 - "Process IDs"
Cohesion: 1.0
Nodes (1): PPID - Parent Process ID

### Community 16 - "Root Access"
Cohesion: 1.0
Nodes (1): Superuser / Root Account

### Community 17 - "File Ownership"
Cohesion: 1.0
Nodes (1): chown Command

### Community 18 - "I/O Redirection"
Cohesion: 1.0
Nodes (1): I/O Redirection and stderr

### Community 19 - "Glob Patterns"
Cohesion: 1.0
Nodes (1): Shell Glob Patterns / Wildcards

### Community 20 - "File Paths"
Cohesion: 1.0
Nodes (1): Absolute vs Relative Pathnames

### Community 21 - "Text Formatting"
Cohesion: 1.0
Nodes (1): col -b Command (Strip Backspaces)

### Community 22 - "DNS Validation"
Cohesion: 1.0
Nodes (1): named-checkconf / named-checkzone Tools

### Community 23 - "Shell Scripting Basics"
Cohesion: 1.0
Nodes (1): Shell Script Basics (chmod, execute)

### Community 24 - "K8S Namespaces"
Cohesion: 1.0
Nodes (1): Kubernetes Namespace

### Community 25 - "CIDR Notation"
Cohesion: 1.0
Nodes (1): CIDR (Classless Inter-Domain Routing)

### Community 26 - "Kubelet Agent"
Cohesion: 1.0
Nodes (1): kubelet

### Community 27 - "Windows Registry"
Cohesion: 1.0
Nodes (1): Windows Registry Editor (regedit)

### Community 28 - "IPv6 Networking"
Cohesion: 1.0
Nodes (1): IPv6 (IP Next Generation)

### Community 29 - "Swap Management"
Cohesion: 1.0
Nodes (1): swapoff Command

### Community 30 - "Namespace Inspection"
Cohesion: 1.0
Nodes (1): nsenter Command

### Community 31 - "Namespace Listing"
Cohesion: 1.0
Nodes (1): lsns Command

### Community 32 - "Network Relaying"
Cohesion: 1.0
Nodes (1): socat Command

### Community 33 - "K8S Custom Resources"
Cohesion: 1.0
Nodes (1): Custom Resource Definition (CRD)

## Knowledge Gaps
- **98 isolated node(s):** `SFTP - Secure File Transfer Protocol`, `tee Command`, `/etc/hosts.deny File`, `Background Process Execution (&)`, `tr Command` (+93 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `cgroups Versions`** (2 nodes): `cgroups v1`, `cgroups v2`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Network Security`** (1 nodes): `/etc/hosts.deny File`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Process IDs`** (1 nodes): `PPID - Parent Process ID`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Root Access`** (1 nodes): `Superuser / Root Account`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `File Ownership`** (1 nodes): `chown Command`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `I/O Redirection`** (1 nodes): `I/O Redirection and stderr`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Glob Patterns`** (1 nodes): `Shell Glob Patterns / Wildcards`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `File Paths`** (1 nodes): `Absolute vs Relative Pathnames`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Text Formatting`** (1 nodes): `col -b Command (Strip Backspaces)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `DNS Validation`** (1 nodes): `named-checkconf / named-checkzone Tools`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Shell Scripting Basics`** (1 nodes): `Shell Script Basics (chmod, execute)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `K8S Namespaces`** (1 nodes): `Kubernetes Namespace`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CIDR Notation`** (1 nodes): `CIDR (Classless Inter-Domain Routing)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Kubelet Agent`** (1 nodes): `kubelet`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Windows Registry`** (1 nodes): `Windows Registry Editor (regedit)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `IPv6 Networking`** (1 nodes): `IPv6 (IP Next Generation)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Swap Management`** (1 nodes): `swapoff Command`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Namespace Inspection`** (1 nodes): `nsenter Command`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Namespace Listing`** (1 nodes): `lsns Command`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Network Relaying`** (1 nodes): `socat Command`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `K8S Custom Resources`** (1 nodes): `Custom Resource Definition (CRD)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Control Groups (cgroups)` connect `Container Runtime & Namespaces` to `Kubernetes Core & Pods`, `QoS & Resource Management`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `Pod` connect `Kubernetes Core & Pods` to `Container Runtime & Namespaces`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `Lab 9 - Kubernetes Exploration with Kind` (e.g. with `Kind (Kubernetes in Docker)` and `Minikube (Local Kubernetes)`) actually correct?**
  _`Lab 9 - Kubernetes Exploration with Kind` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `SFTP - Secure File Transfer Protocol`, `tee Command`, `/etc/hosts.deny File` to the rest of the system?**
  _98 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Kubernetes Core & Pods` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Container Runtime & Namespaces` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._
- **Should `DNS & DHCP Setup` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._