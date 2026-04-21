---
id: 4915-topic-nis-ldap
title: NIS + LDAP
pillar: tech
priority: high
chapter: Mod07 Ch21
tags:
  - networking
  - network
---

#### NIS

Centralized maps for passwd/group/hosts/services. NIS domain is SEPARATE from DNS domain.

-   `ypserv` — server daemon
-   `ypbind` — client daemon
-   `ypinit -m` — build master; `ypinit -s master` — slave
-   `ypcat passwd`, `ypmatch jeff passwd`, `ypwhich` — queries
-   `/var/yp/securenets` — restrict client nets
-   `/etc/yp.conf` — client config (domain + server)

#### LDAP

Hierarchical directory. More scalable than NIS.

-   `slapd` — server daemon. Config `slapd.conf` or `cn=config`.
-   DN = Distinguished Name = full path (e.g. `cn=alice,ou=users,dc=bcit,dc=ca`)
-   Components: **DC** domain component, **CN** common name, **OU** org unit, **O** org, **UID** user id
-   Ports: **389** LDAP, **636** LDAPS (TLS)
-   `ldapsearch -x -b "dc=bcit,dc=ca" "(uid=alice)"`
-   LDIF = file format for import/export

> **Example**
> #### Worked example — NIS master init + client bind
>
> 1.  **Master** — `sudo dnf install ypserv rpcbind`.
> 2.  Set NIS domain: `sudo nisdomainname infosec`; persist in `/etc/sysconfig/network` as `NISDOMAIN=infosec`.
> 3.  Restrict clients — write `/var/yp/securenets`:  
>     `255.255.255.0 192.168.1.0`
> 4.  `sudo systemctl enable --now rpcbind ypserv`.
> 5.  `sudo /usr/lib64/yp/ypinit -m` — build maps from `/etc/passwd`, `/etc/group`, `/etc/hosts`.
> 6.  **Client** — install `ypbind`, set same NIS domain, add to `/etc/nsswitch.conf`: `passwd: files nis`.
> 7.  `sudo systemctl enable --now ypbind`. Verify: `ypwhich` (shows server), `ypcat passwd.byname`.
>
> NIS domain ≠ DNS domain. `securenets` is the one file that actually stops NIS from leaking passwd maps to the internet.

> **Example**
> #### Worked example — LDAP lookup by DN
>
> 1.  Base DN for infosec.bcit.ca: `dc=infosec,dc=bcit,dc=ca`.
> 2.  Query anonymously: `ldapsearch -x -H ldap://ldap.infosec.bcit.ca -b "dc=infosec,dc=bcit,dc=ca" "(uid=alice)"`.
> 3.  `-x` = simple bind (no SASL). `-H` = URI. `-b` = base to search. Last arg = LDAP filter.
> 4.  Result shows alice's full DN: `cn=alice,ou=users,dc=infosec,dc=bcit,dc=ca` plus attributes (uid, mail, uidNumber, ...).
> 5.  Over TLS instead: `ldapsearch -H ldaps://...` (port 636).
>
> Read a DN right-to-left like a postal address: CA → BCIT → INFOSEC → users unit → alice. That's how the tree walks.
