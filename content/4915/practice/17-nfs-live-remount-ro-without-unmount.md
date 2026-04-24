---
n: 17
id: 4915-code-nfs-live-remount-ro-without-unmount
title: "NFS — live remount to read-only without unmounting"
lang: bash
tags: [nfs, mount, remount, filesystem]
source: "Mod07 Ch21; materials/labs/Lab7.pdf"
pedagogy: worked-example-first
kind: code
---

## Prompt

A production NFS export `/srv/exports/reports` is currently mounted read-write on a client at `/mnt/reports`. You need to switch it to read-only *without unmounting* — there are open file handles you cannot kill. Then flip it back to read-write.

Show the client-side commands and explain why `umount` + `mount -o ro` would be wrong here.

## Starter

```bash
# Check current mount options:
___

# Flip to read-only in place:
sudo mount ___

# Verify:
___

# Flip back to read-write:
sudo mount ___
```

## Solution

```bash
# Check current state
mount | grep /mnt/reports
#   server:/srv/exports/reports on /mnt/reports type nfs (rw,...)

# Remount read-only — keeps handles open, changes mode in kernel
sudo mount -o remount,ro /mnt/reports

# Verify
mount | grep /mnt/reports
#   server:/srv/exports/reports on /mnt/reports type nfs (ro,...)

# Writes now fail without closing handles:
touch /mnt/reports/foo            # → Read-only file system

# Flip back
sudo mount -o remount,rw /mnt/reports
```

## Why

**Source**: `Mod07 Ch21 NFS.pdf`, `materials/labs/Lab7.pdf`.

**Mechanism**. `mount -o remount,<opts>` tells the kernel to re-parse the options on an *already-mounted* filesystem. No unmount happens — open file descriptors stay valid, the superblock stays in place, only the mount flags change. For NFS this flips the client VFS from RW to RO semantics; subsequent `write(2)` calls fail with `EROFS` immediately.

Contrast with `umount`: it requires every open handle on the mount to be closed (or fails with `Device or resource busy`). Killing processes to free handles is often impossible on a production box — log shippers, long-running reports, stateful writers would lose data. `remount` sidesteps that entirely.

The target path (`/mnt/reports`) must be given; options alone are not enough. `remount` also requires at least one existing option or source to match — the simplest form is `mount -o remount,<new-flags> <mountpoint>`.

**Common wrong approaches**:

- **`umount /mnt/reports && mount -o ro ...`** — fails with `target is busy` if anything holds the mount. Even if it succeeds, open file descriptors on the original mount become stale (ESTALE on NFS) and the application crashes.
- **Editing `/etc/fstab` and rebooting** — works, but is strictly a last resort: it takes the entire client offline, which is much worse than a brief mode flip.
- **`mount -o ro /mnt/reports`** without `remount` — treated as a new mount request; fails with `already mounted` or silently stacks a second mount on the same path depending on kernel version.
- **Expecting `remount,ro` to demote open write handles** — it does not. A process that already has the file open `O_RDWR` can keep writing until it closes and re-opens; `remount,ro` only blocks *new* writes. Close-then-reopen is the enforcement point.
