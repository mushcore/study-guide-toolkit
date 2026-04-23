---
n: 15
id: 4915-code-iptables-output-default-deny-allow-dns-https
title: "iptables — OUTPUT default-deny, allow DNS + HTTPS"
lang: bash
tags: [iptables, firewall, networking, egress]
source: "Mod08 Ch25; materials/labs/Lab8.pdf"
pedagogy: worked-example-first
---

## Prompt

Lock down a host's *outbound* traffic. Set the `OUTPUT` chain to default-deny, then allow only:

1. DNS queries (UDP port 53) to any resolver.
2. HTTPS (TCP port 443) to any host.
3. Replies on established connections (so inbound-initiated traffic can be answered).
4. Loopback (so local services on the box don't break).

Drop everything else outbound. Trace an outbound TCP/22 (SSH) packet to some external host through the chain.

## Starter

```bash
# Default policy on OUTPUT:
iptables -P OUTPUT ___

# Allow loopback (lo interface):
iptables -A OUTPUT ___

# Allow replies on ESTABLISHED,RELATED:
iptables -A OUTPUT ___

# Allow DNS:
iptables -A OUTPUT ___

# Allow HTTPS:
iptables -A OUTPUT ___
```

## Solution

```bash
iptables -P OUTPUT DROP
iptables -A OUTPUT -o lo -j ACCEPT
iptables -A OUTPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -p udp --dport 53 -j ACCEPT
iptables -A OUTPUT -p tcp --dport 443 -j ACCEPT

# Trace: outbound TCP SYN to port 22 on some external host
#   -o lo?                 no   (not loopback)
#   ESTABLISHED,RELATED?   no   (this IS the new connection's SYN)
#   udp dport 53?          no   (tcp, not udp)
#   tcp dport 443?         no   (dport 22)
#   end of chain → default policy DROP → packet dropped
```

## Why

**Source**: `Mod08 Ch25 iptables.pdf`, `materials/labs/Lab8.pdf`.

**Mechanism**. OUTPUT governs packets *originating* on this host. A default-deny OUTPUT policy is an egress firewall — even if an attacker gets code execution, they cannot phone home unless the destination port is in your allow list. DNS on UDP/53 is almost always required (without it, name resolution breaks and every subsequent rule matching by hostname fails). HTTPS on TCP/443 covers package repos, updates, and typical web egress. `ESTABLISHED,RELATED` lets the host answer *inbound* connections it already accepted (e.g. replies to a client that connected to your SSH server).

Loopback is special: systemd, D-Bus, and many local services talk over `lo`. Forgetting `-o lo -j ACCEPT` will lock up local IPC in surprising ways.

**Common wrong approaches**:

- **Allowing only TCP/53 and not UDP/53.** DNS uses UDP for normal queries; TCP is only a fallback for large responses and zone transfers. UDP/53 is the one you need; leaving it out means every resolver lookup hangs until timeout.
- **Forgetting the `ESTABLISHED,RELATED` rule.** Outbound SYN to 443 is allowed, but the returning ACK never hits an OUTPUT rule at all (it's inbound) — *however*, any outbound follow-up packet on that conntrack flow does. Without the state rule, once the TCP handshake completes, subsequent outbound segments on the flow match no explicit rule and get dropped by policy, stalling the connection mid-request.
- **Setting `-P OUTPUT DROP` before writing the allow rules.** The moment the policy flips, your current shell's outbound ACKs (e.g. back to your SSH client) are dropped and you lose the session. Write the allow rules first, flip the policy last.
