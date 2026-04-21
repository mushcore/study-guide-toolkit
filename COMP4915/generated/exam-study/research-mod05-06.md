# Mod05-06 Research (System Admin + SSH/FTP)

## Boot sequence
1. BIOS — POST, find boot device
2. MBR/GRUB — load bootloader, kernel menu
3. Kernel load — init hardware, mount root RO
4. init / systemd (PID 1)
5. `/etc/rc.d/rc.sysinit` — mount /proc, swap on, fsck+mount per /etc/fstab
6. `/etc/rc.d/rc N` — executes /etc/rc.d/rcN.d/Kxx* first (stop), then Sxx* (start)
7. Login prompt

## Run levels (MEMORIZE — INSTRUCTOR EMPHASIS)
| # | Name | Purpose |
|---|---|---|
| 0 | Halt | Shutdown |
| 1 | Single user | Maintenance, root only, no net |
| 2 | Multi-user no net | Minimal |
| 3 | Multi-user text | **Full services, no GUI** |
| 4 | Unused | Custom |
| 5 | Multi-user GUI | X11/GDM login |
| 6 | Reboot | Restart |

- `init N` or `telinit N` change
- Default in /etc/inittab (SysV)
- systemd target equivalents: poweroff, rescue, multi-user, graphical, reboot

## systemd vs SysV init
- Fedora 15+ uses systemd
- `systemctl start|stop|restart|status|enable|disable service`
- `systemctl get-default`, `set-default multi-user.target`
- SysV: `service name start`, `chkconfig name on`
- rc.d naming: K=kill (stop) runs first, S=start runs after; XX number = order

## /etc/passwd (7 fields)
`username:x:UID:GID:GECOS:home:shell`
1. username
2. `x` (password in /etc/shadow)
3. UID (0=root, <1000=system, ≥1000=user)
4. GID (primary group)
5. GECOS (full name, etc.)
6. Home dir
7. Login shell (/bin/bash, /sbin/nologin for disabled)

## /etc/shadow (9 fields, 600 root-only)
`username:hash:last_changed:min:max:warn:inactive:expire:reserved`
- hash `!`/`*` = locked
- last_changed/expire in days since epoch (1970-01-01)

## User/group commands
- `useradd -m username` (create with home)
- `userdel -r username` (remove home)
- `usermod -aG group username` (add to supp group)
- `passwd username` change pw; `passwd -l` lock, `-u` unlock
- `chage -l user`, `chage -M 90 user` (max days), `chage -d 0 user` (force change)
- `groupadd`, `groupdel`, `groupmod -n new old`
- `id username` show UID/GID

## umask
- Default 022 (root and user in most distros)
- Files: 666 & ~umask → 644
- Dirs: 777 & ~umask → 755
- `umask 027` more restrictive: files 640, dirs 750

## crontab fields
`min hour dom month dow cmd`
- min 0-59, hour 0-23, dom 1-31, month 1-12, dow 0-6 (0=Sun)
- `*` all, `*/5` every 5, `1,3,5` list, `1-5` range
- Special: @reboot, @yearly, @monthly, @weekly, @daily, @hourly
- User crontab: `crontab -e`, `crontab -l`
- System: `/etc/crontab`, `/etc/cron.d/`, `/etc/cron.{hourly,daily,weekly,monthly}`
- Access: `/etc/cron.allow`, `/etc/cron.deny`

## PAM (Pluggable Authentication Modules)
- Modular auth — apps call PAM, PAM calls modules
- Config `/etc/pam.d/<service>` per service
- Module types: auth, account, password, session
- Control flags: required, requisite, sufficient, optional
- Linux-PAM purpose: one unified auth policy; no app recompile when methods change

## SSH

### Keys
- `ssh-keygen -t rsa -b 4096` → `~/.ssh/id_rsa` (private 600) + `id_rsa.pub` (public)
- `ssh-copy-id user@host` appends pubkey to remote `~/.ssh/authorized_keys`
- Permissions: `~/.ssh` = 700, private keys = 600, authorized_keys = 600

### Tunneling (INSTRUCTOR EMPHASIS)
| Flag | Meaning |
|---|---|
| `-L local:host:rport` | LOCAL port forward (access remote service via local port) |
| `-R rport:host:lport` | REMOTE port forward (expose local service on remote) |
| `-D port` | Dynamic SOCKS5 proxy |
| `-X` | X11 forward untrusted |
| `-Y` | X11 forward trusted |
| `-N` | No command (tunnel-only) |
| `-f` | Background after auth |

### sshd_config key settings
- `Port 22`
- `PermitRootLogin no|prohibit-password|yes`
- `PasswordAuthentication yes|no`
- `PubkeyAuthentication yes`
- `AllowUsers`, `DenyUsers`
- `X11Forwarding yes`
- Validate: `sshd -t`; restart: `systemctl restart sshd`

## FTP active vs passive
- Control connection: client→server:21
- **Active mode (PORT)**: server initiates data connection server:20→client:highport. Client firewall must allow inbound. NAT-unfriendly.
- **Passive mode (PASV)**: client initiates data connection client→server:highport. Firewall-friendly. Default modern.

## vsftpd
- Config: `/etc/vsftpd/vsftpd.conf`
- `anonymous_enable=YES` (anon access, /var/ftp/pub)
- `local_enable=YES` (system user login)
- `write_enable=YES` (uploads)
- `chroot_local_user=YES` (jail local users)
- `pasv_enable=YES`, `pasv_min_port`, `pasv_max_port`

## SFTP vs FTP
| | FTP | SFTP |
|---|---|---|
| Port | 21 + 20/high | 22 |
| Encrypt | NO | YES (SSH) |
| Auth | cleartext | key or password |
| Daemon | vsftpd | part of sshd |

## Disk / mount
- `mount /dev/sdb1 /mnt/data` manual
- `umount /mnt/data`
- `df -h`, `du -sh *`
- `/etc/fstab` format (instructor says know basics only — don't memorize dump/fsck fields):
  `device  mount_point  fstype  options  dump  passno`
- Common options: defaults, ro, rw, noexec, nosuid, noatime

## Logging
- `/var/log/messages` — main syslog
- `/var/log/secure` — auth attempts
- `/var/log/cron` — cron jobs
- `journalctl -u sshd`, `journalctl -f`
- `logrotate` — archive/compress old logs

## Flashcards (20)

1. **Q:** Run level 3?  **A:** Multi-user text mode (full services no GUI). [midterm Q35, sample Q5]
2. **Q:** Run level 5?  **A:** Multi-user graphical (GUI login). [sample Q5]
3. **Q:** PID 1 process on boot?  **A:** init (or systemd on modern distros). [sample Q9]
4. **Q:** First script run during boot?  **A:** init / systemd (rc.sysinit after). [sample Q9]
5. **Q:** `/etc/passwd` field 3?  **A:** UID. [Mod05]
6. **Q:** `/etc/passwd` field 7?  **A:** Login shell. [Mod05]
7. **Q:** `/etc/shadow` file purpose?  **A:** Encrypted password hashes, root-readable only. [Mod05]
8. **Q:** umask 022 → new file permissions?  **A:** 644 (666 & ~022). [Mod05]
9. **Q:** umask 022 → new dir permissions?  **A:** 755 (777 & ~022). [Mod05]
10. **Q:** 5 crontab fields in order?  **A:** min hour dom month dow. [Mod05]
11. **Q:** What does `@reboot` in crontab do?  **A:** Run at boot. [Mod05]
12. **Q:** Linux-PAM?  **A:** Pluggable Authentication Modules — modular auth framework. [midterm Q51]
13. **Q:** ssh-keygen output?  **A:** Public key (.pub) + private key (no extension) in ~/.ssh. [Mod06]
14. **Q:** ssh-copy-id purpose?  **A:** Append local public key to remote ~/.ssh/authorized_keys. [Mod06]
15. **Q:** `~/.ssh/` permissions?  **A:** 700. [Mod06]
16. **Q:** `~/.ssh/authorized_keys` permissions?  **A:** 600. [Mod06]
17. **Q:** `ssh -L 8080:db:5432 user@bastion` does?  **A:** Forward local port 8080 through bastion to db:5432 via encrypted tunnel. [Mod06]
18. **Q:** `ssh -D 1080 user@host`?  **A:** Dynamic SOCKS5 proxy on local port 1080 through host. [Mod06]
19. **Q:** FTP passive mode — who initiates data connection?  **A:** Client initiates to server. [Mod06]
20. **Q:** Commands: create user with home dir?  **A:** `useradd -m username`. [Mod05]

## Exam traps
- Run level 2 has no network; 3 is the full text-mode default server
- init = PID 1 (first process, not first SCRIPT)
- umask is SUBTRACTED from defaults (666 files, 777 dirs)
- SSH key perms: private=600; too permissive = ssh refuses to use it
- `~/.ssh/authorized_keys` is on REMOTE server (not local)
- `-L` vs `-R` — L = Local port (access remote), R = Remote port (expose local)
- rsh/rlogin/telnet insecure; ssh/sftp/scp secure

## Practice questions

**MCQ 1**: Default run level for command-line-only multi-user server?
A) 1 B) 2 C) 3 D) 5 E) 6
**Answer**: C. Level 2 has no network; 3 has all services text-mode.

**MCQ 2**: What is the 5th field of `/etc/passwd`?
A) UID B) GID C) GECOS D) home E) shell
**Answer**: C. GECOS (full name/comment).

**Short 3**: Write SSH command to forward local 3306 through bastion.example.com to db.internal:3306.
**Answer**: `ssh -L 3306:db.internal:3306 user@bastion.example.com`

**Short 4**: Generate an RSA key pair with passphrase.
**Answer**: `ssh-keygen -t rsa -b 4096` (prompts for passphrase).

**Essay 5**: Explain difference between FTP active and passive modes, and why passive is firewall-friendly.
**Model**: Control on 21 both modes. Active: server:20→client:highport (client must accept inbound, breaks NAT). Passive: client→server:highport (outbound from client, works through NAT). Firewalls trust outbound more; passive works in most networks.
