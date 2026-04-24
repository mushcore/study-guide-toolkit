---
n: 14
id: 4915-code-iptables-packet-flow-and-chain-traversal
title: "iptables — packet flow and chain traversal"
lang: bash
tags: [iptables, firewall, networking]
source: "Mod08 Ch25; materials/labs/Lab8.pdf; mock-exam.yaml q22"
pedagogy: worked-example-first
kind: code
---

## Prompt

Build a default-deny INPUT chain with three explicit allows:

1. Inbound SSH from the `10.0.0.0/24` subnet.
2. Inbound HTTP (port 80) from anywhere.
3. Replies to the host's outbound connections (`ESTABLISHED,RELATED`).

Drop everything else. Then trace two test packets through the chain: a TCP packet to port 22 from `10.0.0.5`, and a TCP packet to port 3306 from `192.168.1.1`.

## Starter

```bash
# Set default policy:
iptables -P INPUT ___

# Rule 1 — SSH from trusted subnet
iptables -A INPUT ___

# Rule 2 — HTTP from anywhere
iptables -A INPUT ___

# Rule 3 — established connections (response traffic)
iptables -A INPUT ___

# Decision tree:
#
#   [ inbound packet ]
#           │
#   ┌───────┴───────┐
#   │  INPUT chain  │
#   │  rule 1?  ────┼──→ match → ACCEPT
#   │  rule 2?  ────┼──→ match → ACCEPT
#   │  rule 3?  ────┼──→ match → ACCEPT
#   │  (no match)   │
#   └───────┬───────┘
#           │
#      default policy: ???
#           │
#        DROP / ACCEPT
```

## Solution

```bash
iptables -P INPUT DROP
iptables -A INPUT -p tcp --dport 22 -s 10.0.0.0/24 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Trace 1: TCP/22 from 10.0.0.5
#   rule 1? dport 22 AND src in 10.0.0.0/24 → MATCH → ACCEPT (done)
#
# Trace 2: TCP/3306 from 192.168.1.1
#   rule 1? dport 22 → no   (dport mismatch)
#   rule 2? dport 80 → no   (dport mismatch)
#   rule 3? state ESTABLISHED → no   (new connection)
#   end of chain → default policy DROP → packet dropped
```

## Why

**Source**: `Mod08 Ch25 iptables.pdf`, `materials/labs/Lab8.pdf`, mock-exam.yaml q22.

**Mechanism**. iptables evaluates rules top-to-bottom within a chain. The *first* rule whose match conditions all succeed fires its target (ACCEPT, DROP, REJECT, or a jump) and the rest of the chain is skipped. If no rule matches, the chain's default policy applies — set with `-P CHAINNAME POLICY`. A default-deny (`DROP`) policy with explicit allows is the textbook firewall pattern because new services never leak through by default.

The `ESTABLISHED,RELATED` rule is what lets outbound connections receive their replies. Without it, you could open a TCP connection from the host but the return SYN-ACK would hit the default DROP and the connection would hang.

**Common wrong approaches**:

- **Appending an allow rule after a terminal DROP at the bottom.** The DROP fires first; new rules below it are unreachable. Insert with `-I` (insert at top) or renumber.
- **Forgetting the `-p tcp` when using `--dport`.** iptables requires the protocol match to unlock port matching. `iptables -A INPUT --dport 22 ...` errors out.
- **Using the wrong policy chain.** `-P OUTPUT DROP` instead of `-P INPUT DROP` silently blocks all *outgoing* traffic while leaving the host wide open to inbound. Policy name matters.
