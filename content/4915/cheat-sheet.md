---
title: "COMP 4915 — exam-eve cheat sheet"
---

## Run levels

| # | Meaning |
| --- | --- |
| 0 | halt |
| 1 | single user |
| 2 | multi no net |
| 3 | multi text |
| 4 | unused |
| 5 | multi GUI |
| 6 | reboot |

## Special parameters

<table><tbody><tr><td><code>$0</code></td><td>script name</td></tr><tr><td><code>$1..$9</code></td><td>positional args</td></tr><tr><td><code>$#</code></td><td>count</td></tr><tr><td><code>"$@"</code></td><td>all args, separate</td></tr><tr><td><code>"$*"</code></td><td>all args, one string</td></tr><tr><td><code>$?</code></td><td>last exit</td></tr><tr><td><code>$$</code></td><td>shell PID</td></tr><tr><td><code>$!</code></td><td>last bg PID</td></tr></tbody></table>

## Expansion order

1.  Brace `{a,b}`
2.  Tilde `~`
3.  Parameter `$var`
4.  Arithmetic `$((…))`
5.  Command `$(…)`
6.  Word split (IFS)
7.  Pathname / glob

## Command precedence

1.  Alias
2.  Keyword (if, while, …)
3.  Function
4.  Builtin
5.  $PATH

Bypass: `command`, `builtin`, `/abs/path`, `\name`

## Quoting

<table><tbody><tr><td><code>'x'</code></td><td>literal</td></tr><tr><td><code>"x"</code></td><td>$, $(), \\ expand</td></tr><tr><td>none</td><td>all expansions</td></tr><tr><td><code>\c</code></td><td>escape char</td></tr></tbody></table>

## Redirection

-   `>` stdout overwrite
-   `>>` append
-   `<` stdin
-   `2>` stderr
-   `&>` both
-   `2>&1` merge stderr→stdout (AFTER >)
-   `|` pipe
-   `tee` split

## File types (ls -l char 1)

-   `-` plain
-   `d` directory
-   `b` block special
-   `c` character special
-   `l` symlink
-   `s` socket
-   `p` named pipe

## Hard vs soft links

| aspect | hard | soft |
| --- | --- | --- |
| inode | shared | own |
| cross-FS | NO | YES |
| dangle | NO | YES |
| dir link | no (user) | yes |

## Permissions + umask

-   r=4 w=2 x=1
-   u/g/o triplets
-   4000 setuid · 2000 setgid · 1000 sticky
-   umask 022 → file 644, dir 755
-   umask 027 → file 640, dir 750

## grep / find / wc

-   grep -i -v -n -c -l -w -r
-   find `/ -name X -type f -mtime -N -exec C \;`
-   wc -l (lines) -w -c
-   tr 'a-z' 'A-Z' · tr -d '\\r'

## SSH

-   `ssh-keygen -t rsa -b 4096`
-   `ssh-copy-id u@h`
-   ~/.ssh=700 key=600 authorized\_keys=600
-   `-L local:h:p` local fwd
-   `-R rp:h:lp` remote fwd
-   `-D port` SOCKS5
-   `-X` X11

## Users + /etc

-   passwd: user:x:UID:GID:GECOS:home:shell
-   shadow: user:hash:last:min:max:warn:inactive:expire:
-   useradd -m · userdel -r · passwd · chage
-   groupadd · groupdel

## iptables

-   Tables: filter, nat, mangle
-   Chains: INPUT/OUTPUT/FORWARD (filter); PRE/POSTROUTING (nat)
-   Targets: ACCEPT DROP REJECT LOG SNAT DNAT MASQ
-   `-A INPUT -p tcp --dport 22 -s CIDR -j ACCEPT`

## DNS records

<table><tbody><tr><td>A</td><td>host→IPv4</td></tr><tr><td>AAAA</td><td>host→IPv6</td></tr><tr><td>CNAME</td><td>alias</td></tr><tr><td>MX</td><td>mail</td></tr><tr><td>NS</td><td>nameserver</td></tr><tr><td>PTR</td><td>reverse</td></tr><tr><td>SOA</td><td>authority</td></tr></tbody></table>

## NFS + Samba + NIS + LDAP

-   NFS: /etc/exports · ports 111+2049 · showmount -e
-   Samba: /etc/samba/smb.conf · smbpasswd -a · testparm · ports 137-139+445
-   NIS: ypinit -m · ypcat · ypmatch · /var/yp/securenets
-   LDAP: slapd · ports 389/636 · DN=cn,ou,dc

## Apache

-   /etc/httpd/conf/httpd.conf
-   DocumentRoot /var/www/html
-   htpasswd -c file user
-   httpd -S list vhosts · httpd -t test
-   Port 80 HTTP · 443 HTTPS

## K8s components

-   **Control:** apiserver · etcd · scheduler · controller-manager
-   **Node:** kubelet · kube-proxy · runtime (containerd)
-   **Workloads:** Deployment · DaemonSet · StatefulSet · Job
-   **Services:** ClusterIP · NodePort · LoadBalancer

## K8s: 8 Linux namespaces

-   PID — process IDs
-   NET — network stack
-   MNT — mount points
-   UTS — hostname
-   IPC — IPC/shm
-   USER — UID mapping
-   CGROUP — cgroup view
-   TIME — clock offset

## K8s: QoS

-   **Guaranteed**: requests==limits (all) · LAST evicted
-   **Burstable**: any requests/limits, not Guaranteed
-   **BestEffort**: nothing set · FIRST evicted

Pause container holds namespaces.

## Trap checklist

-   grep `*` — quote pattern
-   `'`single`'` = literal; `"`double`"` = expand
-   `> file 2>&1` order matters
-   chown `-R` not -r
-   hard link NOT cross FS
-   runlevel 3 text, 5 GUI
-   NFS Linux · Samba Windows
-   $# count · $? exit · $$ PID · $! bg

## Review-class confirmed (Apr 17)

-   Linus Torvalds + Richard Stallman (GNU)
-   ls -r -x = ls -rx (combined flags)
-   \> >> < + stderr + pipes — important
-   $\* vs $@ — 'probably on exam'
-   All expansions fair game
-   System V run levels — need to know
-   setuid AND setgid
-   Soft link = ln -s
-   Hard link — can't tell original
-   /dev/null, /dev/zero — easily asked
-   DHCP how it works (not dhcpd.conf)
-   DNS — IPv4 only, NOT IPv6
-   NFS — only behind firewalls
-   tar -cf / -tf / -xf only
-   hostname = machine you're on
-   grep -r recursive
-   Container images — useful

## Review-class SKIP (Apr 17)

-   Perl — not tested
-   ACL / Access Control Lists
-   IPv6 DNS records
-   dhcpd.conf reproduction
-   fstab mount options + last 2 fields
-   Deep utility details
-   History dates
-   Precedence — 'not super likely'
-   pushd/popd scripts
-   Hard scripting gymnastics
