# COMP 4915 Exam Preparation Diagnosis

**Generated**: 2026-04-08
**Exam**: Final Exam, Week of April 20, 2026
**Scope**: Comprehensive (Mod01-Mod10E)

---

## Exam Format Summary

| Component | Marks Each | Count (midterm) | Notes |
|-----------|-----------|-----------------|-------|
| Multiple Choice | 2 | 37 (74 marks) | One best answer, scantron sheet |
| True/False | 1 | 10 (10 marks) | Scantron sheet |
| Short Answer | 3 | 10 (30 marks) | Written in booklet |
| Essay | 10 | 3 (30 marks) | Written in booklet |
| **Total** | — | **60 questions** | **144 marks in 100 min** |

- Midterm was 20% of course grade, 144 marks, 100 minutes
- Final exam format will be "similar to midterm" — expect same question types
- Final is comprehensive: ALL Mod01-Mod10E content
- Final likely worth 30-40% of course grade (typical BCIT weighting)
- Expect more questions total since it covers all 10 modules vs. midterm covering ~5

---

## Topic Inventory

| # | Module | Topics | Est. Exam Weight | Midterm Coverage |
|---|--------|--------|-----------------|------------------|
| 1 | Mod01 | Linux history, GNU, shell basics, Fedora/RHEL | 5% | Heavy |
| 2 | Mod02 | Filesystem, permissions, ACLs, links, utilities, grep, find, tar, X Window | 12% | Heavy |
| 3 | Mod03 | Networking, DNS basics, NFS/NIS/Samba intro, SSH, FTP, r-commands | 10% | Medium |
| 4 | Mod04 | Bash shell: variables, quoting, expansion, job control, processes | 10% | Heavy |
| 5 | Mod05 | System admin: boot sequence, run levels, systemd, SELinux, user/group mgmt | 10% | Medium |
| 6 | Mod06 | Admin tasks, SSH key auth, tunneling, FTP/vsftpd | 8% | Light |
| 7 | Mod07 | Sendmail, NIS/LDAP, NFS, Samba (detailed) | 10% | None |
| 8 | Mod08 | DNS (BIND), iptables/netfilter, Apache | 12% | None |
| 9 | Mod09 | Shell programming: control structures, test, here docs, builtins | 10% | None |
| 10 | Mod10A-E | Kubernetes, Pods, namespaces, cgroups, CNI, QoS | 13% | None |

**Key insight**: Mod07-Mod10 were NOT on the midterm, so the final is the ONLY exam covering these topics. Professor will likely weight them heavily.

---

## High-Leverage Topics (Ranked)

### 1. Shell Programming (Mod09) — HIGHEST PRIORITY
- **Why**: Not on midterm, professor emphasizes practical scripting, essay/short-answer gold
- **What to know**: if/elif/else/fi, for/in, while, until, case/esac, `test`/`[ ]` operators, here documents, `${name:-default}` forms, `exec`, `trap`
- **Exam likely**: Write a script (essay), fix a script (short answer), predict output (MCQ)
- **Source**: Mod09 slides, Lab 4, Lab 8

### 2. Kubernetes & Containers (Mod10A-E) — HIGHEST PRIORITY
- **Why**: Not on midterm, 5 sub-modules = heavy emphasis, graph god node (11 edges)
- **What to know**: Pod definition, 8 Linux namespace types, Pause container, kube-apiserver/scheduler/controller-manager roles, QoS classes (BestEffort/Burstable/Guaranteed), cgroups v1 vs v2, CNI providers (Calico=BGP/L3, Antrea=OVS/L2, Cilium=eBPF), unshare/nsenter commands, CRI interfaces, Deployment vs DaemonSet vs StatefulSet
- **Exam likely**: Define Pod (essay), name namespace types (short answer), QoS classification from YAML (MCQ), iptables routing chain (short answer)
- **Source**: Mod10A-E slides, Lab 9, Lab 10

### 3. iptables & Network Security (Mod08) — HIGH PRIORITY
- **Why**: Not on midterm, highly practical, complex enough for essays
- **What to know**: Three tables (Filter/NAT/Mangle), five chains (INPUT/OUTPUT/FORWARD/PREROUTING/POSTROUTING), rule syntax (`iptables -A INPUT -s IP -p tcp --dport 80 -j DROP`), DNAT vs SNAT vs MASQUERADE, packet flow diagram, `/etc/sysconfig/iptables`
- **Exam likely**: Write an iptables rule (short answer), explain packet flow (essay), table/chain identification (MCQ)
- **Source**: Mod08 slides

### 4. Apache Web Server (Mod08) — HIGH PRIORITY
- **Why**: Not on midterm, config-heavy = testable details
- **What to know**: httpd.conf 3 sections (Global/Main Server/VirtualHosts), DocumentRoot (`/var/www/html`), `<Directory>` blocks, AllowOverride, .htaccess, htpasswd, VirtualHost containers, `httpd -S`
- **Exam likely**: Config file questions (MCQ), access control setup (short answer)
- **Source**: Mod08 slides, Lab 8

### 5. Network Services: NIS/LDAP/NFS/Samba (Mod07) — HIGH PRIORITY
- **Why**: Not on midterm, many config files and daemons = MCQ/short answer material
- **What to know**:
  - **NIS**: ypinit -m (master), /var/yp/securenets, ypcat/ypmatch/ypwhich, NIS domain != DNS domain
  - **LDAP**: slapd.conf (suffix/rootdn/rootpw), DN/RDN/CN/DC/OU, ports 389/636
  - **NFS**: /etc/exports, autofs/auto.master, ports (111/2049)
  - **Samba**: smb.conf sections ([global]/[homes]/[printers]/[sharename]), smbpasswd -a, testparm, swat (port 901, overwrites smb.conf)
- **Source**: Mod07 slides, Lab 7

### 6. System Administration (Mod05-06) — MEDIUM-HIGH
- **Why**: Partially on midterm (Q35 run levels, Q19 NFS, Q11 hosts.deny), but deep details not yet tested
- **What to know**: Boot sequence (BIOS→MBR→kernel→init→inittab→rc.sysinit→rc n), run levels (0/1/3/5/6), K=kill S=start in rc.d, systemd/systemctl, SELinux modes (Enforcing/Permissive/Disabled), /etc/passwd and /etc/shadow field formats, SSH key setup (ssh-keygen, ssh-copy-id, permissions 700/600), SSH tunneling (-L/-R), vsftpd config
- **Source**: Mod05-06 slides, Lab 6

### 7. Bash Shell Internals (Mod04) — MEDIUM
- **Why**: Already tested on midterm but deep concepts remain (expansion order, special params)
- **What to know**: Startup file order (login vs non-login), 8-step expansion sequence, $?/$$/!/$#/$*/$@, 2>&1 semantics, single vs double quotes, IFS, declare flags
- **Source**: Mod04 slides

### 8. File System & Utilities (Mod02) — MEDIUM
- **Why**: Already tested but hard/soft links, permissions, and utilities are perennial
- **What to know**: Hard vs soft links (inode sharing), umask calculation, chmod numeric/symbolic, ACLs (setfacl/getfacl), grep options, find syntax, tar flags, 7 file types
- **Source**: Mod02 slides, Lab 2

---

## Question Style Analysis

Based on the actual midterm and sample midterm, Bruce Link's question patterns:

### MCQ Patterns (2 marks each)
- **Command identification**: "What command does X?" (grep, tr, wc, find, kill, ls, man, chown, chsh, tail, pushd)
- **Concept definition**: "What is X?" (PPID, FQDN, bit-bucket, PAM, superuser)
- **Config file location**: "Which file contains X?" (/etc/hosts.deny, /etc/services)
- **Syntax precision**: Exact command syntax matters (find / -name foo vs find -name foo)
- **Service identification**: "What service for X?" (NFS for Linux-to-Linux, SMB for Windows)
- **Security knowledge**: "What is secure/insecure?" (sftp secure, ftp insecure, rsh risky)
- **Redirection**: Output redirection operators (>, 2>, tee)
- **Quoting**: Single vs double quote behavior with variables

### True/False Patterns (1 mark each)
- **Common misconceptions**: Tests whether students believe false claims (Q43: redirection warns before overwrite — FALSE)
- **Subtle distinctions**: Correct statements that seem too good to be true (Q41: Linux can run some Windows programs — TRUE)
- **Security claims**: Network attack knowledge claims (Q38: attacks require good knowledge — FALSE)
- **Command behavior**: What specific commands do (Q40: less pages output — TRUE; Q46: tr -d '\r' converts DOS files — TRUE)

### Short Answer Patterns (3 marks each)
- **Name the thing**: /dev/null, hostname, mkdir, alias (1 word/phrase answers)
- **Predict output**: Given a sequence of commands, what does the last one output? (Q50: redirection with 2>&1)
- **Glob matching**: Given files, which match a pattern? (Q56, Q57)
- **Write a command**: Single-line command to accomplish a task (Q55: grep -vi "bb" *)

### Essay Patterns (10 marks each)
- **Compare/contrast**: Hard vs soft links (Q58) — expect similar for NFS vs Samba, NIS vs LDAP, iptables tables
- **Write a script**: Complete shell script for a task (Q59, Q60)
- **Write a function**: Bash function using pipes and built-in commands
- **System design**: Expect essays on securing a Linux system, setting up a service, or explaining Kubernetes architecture

---

## Bloom's Level Profile

Based on midterm analysis:

| Bloom's Level | Midterm Distribution | Target for Final |
|---------------|---------------------|-----------------|
| **Remember** | ~45% (command names, file locations, definitions) | ~35% |
| **Understand** | ~25% (explain concepts, distinguish similar items) | ~30% |
| **Apply** | ~20% (write commands, predict output, match globs) | ~25% |
| **Analyze** | ~10% (compare/contrast, debug scripts) | ~10% |

The professor tests heavily at Remember/Understand level for MCQ/T-F, but essays require Apply/Analyze. The final may push toward more Apply questions for post-midterm topics (shell scripting, Kubernetes YAML, iptables rules).

---

## Coverage Gaps (All Material Not Yet Studied)

Since the student reports being behind on most material, effectively ALL modules are gaps. Priority ordering:

1. **Mod09 Shell Programming** — completely unstudied, high exam weight
2. **Mod10A-E Kubernetes** — completely unstudied, 5 sub-modules
3. **Mod08 iptables + Apache** — completely unstudied
4. **Mod07 NIS/LDAP/NFS/Samba** — completely unstudied
5. **Mod05-06 System Admin + SSH/FTP** — partially covered by midterm study
6. **Mod01-04 Fundamentals** — partially covered by midterm study (review only)

---

## Past Exam Patterns

### Recurring Themes Across Midterm + Sample Midterm
These appeared on BOTH the actual midterm and sample midterm:

| Theme | Midterm Q# | Sample Q# | Prediction for Final |
|-------|-----------|-----------|---------------------|
| man command | Q8 | Q1 | Very likely again |
| wc command | Q37 | Q2 | Very likely |
| tee command | Q4 | Q4 | Likely |
| Run levels | Q35 | Q5 | Almost certain (expanded with systemd) |
| NFS for Linux sharing | Q19 | Q6 | Almost certain |
| Redirection (stdout/stderr) | Q10 | Q7 | Almost certain |
| /dev/null (bit-bucket) | Q48 | Q13 | Very likely |
| fg %n (job control) | — | Q14 | Likely |
| hard vs soft links | Q58 (essay) | — | Likely as MCQ on final |
| Shell scripting | Q59, Q60 | Q20 | Almost certain (expanded) |
| Linux vs Windows comparison | — | Q19 | Possible essay topic |
| Bash comments (#) | — | Q8 | Possible MCQ |
| init (first process) | — | Q9 | Likely |

### Topics Appearing Once (High-Value for Final)
- SSH port forwarding (Q3) — expect deeper questions
- DNS named daemon (Q28) — expect expanded DNS content
- FQDN concept (Q30) — likely revisited with DNS module
- PAM (Q51) — may appear as MCQ
- chown -R (Q16) — permissions questions likely
- Symbolic link permissions (Q32) — link knowledge tested

### Predicted New Topics for Final
Based on post-midterm modules not yet tested:
- **iptables rule writing** (short answer or essay)
- **Apache httpd.conf configuration** (MCQ or short answer)
- **Samba smb.conf sections** (MCQ)
- **NIS vs LDAP** (essay compare/contrast)
- **Shell script control structures** (essay — write a script)
- **Kubernetes Pod definition** (short answer or essay)
- **QoS classes** (MCQ — given YAML, identify QoS)
- **Linux namespaces** (short answer — list the 8 types)
- **cgroups** (MCQ or short answer)
- **SSH key setup procedure** (short answer)

---

## Graph Cross-Reference

From the knowledge graph (GRAPH_REPORT.md):

### God Nodes (highest connected concepts)
1. **Kubernetes (K8S)** — 11 edges — confirms highest structural importance
2. **Kubelet** — 8 edges — central to Mod10 understanding
3. **Control Groups (cgroups)** — 8 edges — bridges Container Runtime, K8S Core, and QoS communities
4. **Lab 1/2/3/4** — high edges but represent fundamentals already partially studied

### Graph-Flagged Priorities
- **cgroups** has high betweenness centrality (0.050) — it bridges three graph communities. This means understanding cgroups is key to connecting container isolation, Kubernetes pod management, and QoS resource management. Study this topic as a bridge concept.
- **Pod** has high betweenness centrality (0.039) — bridges K8S Core and Container Runtime communities. The Pod is the conceptual bridge between Linux primitives and Kubernetes orchestration.
- 98 isolated nodes in the graph suggest many standalone concepts (individual commands, file paths) that are tested as factual recall MCQ.

### Surprising Connections
- grep (Lab 4) connects to grep (midterm) — same concept tested across contexts
- BIND (Lab 3) connects to named daemon (midterm) — DNS tested at multiple levels
- tr command appears in both labs and midterm — recurring utility
- Hard link cross-filesystem limitation (Lab 2) connects to hard link essay (midterm) — deep testing of link concepts

---

## Recommended Priority Order

Given 12 days (April 8-20) and 1-2 hours/day:

### Phase 1: Review Slides First (Days 1-3)
**Start with the final exam review PDF** (`materials/past-exams/Comp4915 Review.pdf`) — it summarizes ALL key topics the professor considers most important.

### Phase 2: New Material Deep Dive (Days 4-9)
| Day | Focus | Time | Activity |
|-----|-------|------|----------|
| 4 | Mod09 Shell Programming | 2h | Read slides, practice writing scripts |
| 5 | Mod10A-B Kubernetes + Pods | 2h | Read slides, understand Pod/namespace concepts |
| 6 | Mod10C-E Build Pod + cgroups + CNI | 2h | Read slides, understand unshare/nsenter/QoS |
| 7 | Mod08 iptables | 1.5h | Read slides, practice writing rules |
| 7 | Mod08 Apache | 0.5h | Read slides, know httpd.conf structure |
| 8 | Mod07 NIS/LDAP/NFS/Samba | 2h | Read slides, focus on config files and daemons |
| 9 | Mod05-06 System Admin + SSH | 1.5h | Review slides, focus on boot sequence, run levels, SSH keys |

### Phase 3: Retrieval Practice (Days 10-12)
| Day | Activity |
|-----|----------|
| 10 | Flashcard review (all generated decks) + practice exam |
| 11 | Write practice scripts, iptables rules, YAML from memory |
| 12 | Final review of weak areas identified by practice exam; sleep >= 7 hours |

### Triage Rules
- If running short on time, **cut Windows labs** entirely — low exam probability
- Prioritize **config file locations and formats** — highest MCQ density
- For essays, prepare **3 templates**: compare/contrast (links, NFS/Samba, NIS/LDAP), write-a-script, explain-a-system (K8S, iptables)
- Memorize the **command → purpose** mapping for ~30 key commands
- Know **port numbers**: SSH=22, FTP=21, HTTP=80, DNS=53, NFS=2049, portmap=111, LDAP=389/636, Samba=137-139/445, SMTP=25, swat=901

---

## Quick Reference: 30 Most Likely Exam Commands

| Command | Purpose | Module |
|---------|---------|--------|
| grep | Search file content by pattern | Mod02 |
| find | Search filesystem by attributes | Mod02 |
| chmod/chown | Change permissions/ownership | Mod02 |
| tar | Archive/extract files | Mod02 |
| ssh/scp/sftp | Secure remote access/transfer | Mod03/06 |
| ssh-keygen | Generate SSH key pair | Mod06 |
| ssh-copy-id | Deploy public key to remote host | Mod06 |
| mount/umount | Mount/unmount filesystems | Mod05 |
| fsck | Check/repair filesystem | Mod05 |
| useradd/userdel | Manage user accounts | Mod05 |
| systemctl | Control systemd services | Mod05 |
| crontab | Schedule recurring tasks | Mod05 |
| iptables | Configure firewall rules | Mod08 |
| htpasswd | Create Apache password files | Mod08 |
| smbpasswd | Manage Samba user passwords | Mod07 |
| testparm | Validate smb.conf syntax | Mod07 |
| ypinit | Initialize NIS server | Mod07 |
| ypcat/ypmatch | Query NIS maps | Mod07 |
| ldapsearch | Search LDAP directory | Mod07 |
| kubectl | Kubernetes CLI | Mod10 |
| unshare | Create isolated namespaces | Mod10C |
| nsenter | Join existing namespaces | Mod10C |
| tr | Translate/delete characters | Mod02 |
| wc | Count lines/words/bytes | Mod02 |
| tee | Pipe to stdout AND file | Mod01 |
| kill | Send signal to process | Mod04 |
| ps | List processes | Mod04 |
| alias | Define command shortcuts | Mod04 |
| test / [ ] | Evaluate conditions in scripts | Mod09 |
| chsh | Change login shell | Mod05 |
