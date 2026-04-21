---
id: 4915-topic-iptables-netfilter
title: iptables (netfilter)
pillar: tech
priority: high
chapter: Mod08 Ch25
tags:
  - text-processing
  - networking
  - network
---

Kernel firewall. Packet walks through tables → chains → rules.

flowchart LR IN\["incoming  
NIC packet"\] --> PRE\["PREROUTING  
nat (DNAT)  
mangle"\] PRE --> RD{"routing  
decision"} RD -->|local| INPUT\["INPUT (filter)  
ACCEPT / DROP"\] RD -->|through host| FWD\["FORWARD (filter)  
router mode"\] INPUT --> LP\["local process"\] LP --> OUT\["OUTPUT (filter)  
locally-generated"\] OUT --> POST\["POSTROUTING  
nat (SNAT/MASQ)"\] FWD --> POST POST --> OG\["outgoing  
to NIC"\] classDef blue fill:#1a1a22,stroke:#7aa2f7,color:#e5e5e5; classDef amber fill:#201c15,stroke:#e0af68,color:#e0af68; classDef gray fill:#1a1a1a,stroke:#262626,color:#e5e5e5; classDef green fill:#1a2218,stroke:#9ece6a,color:#9ece6a; class IN,OG blue; class PRE,FWD,POST amber; class RD,LP gray; class INPUT,OUT green;

**Tables (3):** filter (default) · nat (NAT rules) · mangle (packet mods). **Targets:** ACCEPT, DROP (silent), REJECT (sends ICMP), LOG, SNAT/DNAT/MASQUERADE. Rule order matters — first match wins.  
`iptables -A INPUT -p tcp --dport 22 -s 10.0.0.0/8 -j ACCEPT`  
Source: Mod08 Ch25

#### Tables

-   **filter** — default; INPUT/OUTPUT/FORWARD; accept/drop
-   **nat** — PREROUTING (DNAT), POSTROUTING (SNAT/MASQUERADE), OUTPUT
-   **mangle** — packet modification (TOS, TTL)

#### Targets

ACCEPT, DROP (silent), REJECT (sends ICMP), LOG, SNAT, DNAT, MASQUERADE (dynamic SNAT).

#### Syntax

```bash
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -s 10.0.0.0/8 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -j DROP       # deny-by-default
iptables -L -n -v               # list rules
iptables-save > /etc/sysconfig/iptables
```

Key match options: `-p tcp/udp/icmp`, `--dport N`, `--sport N`, `-s CIDR`, `-d CIDR`, `-i iface`, `-o iface`, `-m state --state`.

Modern alt: `firewalld` with `firewall-cmd --add-service=http --permanent`.
