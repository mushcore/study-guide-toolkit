---
"n": 2
id: 4915-lesson-filesystem-inode-directory-entry
title: "Filesystem: inode + directory entry"
hook: Every 'why can't I hard-link across drives?' answer lives in this lesson.
tags:
  - filesystem
module: Filesystem & permissions
source: "Mod02 Ch6; materials/past-exams/midterm.md Q21, Q24, Q32"
related: [4915-topic-inode-hard-vs-soft-links, 4915-topic-permissions-chmod-umask, 4915-topic-etc-passwd-etc-shadow-user-mgmt]
---

The midterm had TWO link questions (Q24, Q58). The final will have at least one. Everything hangs on one idea: *the filename is not part of the file*.

The one idea that unlocks all link questions

A file = **inode + data blocks**. The inode stores owner, perms, timestamps, size, link count, type, block pointers — **never** the filename. A directory is a file whose data is a list of `(inode_number, filename)` pairs.

> **Analogy**
> **Hotel analogy.** Inode = the room (with stuff in it). Filename = nameplate on a door pointing at a room. Hard link = second nameplate pointing at the same room. Delete one nameplate → room still there. Last nameplate removed → housekeeping cleans the room.

Hard link vs soft link — inode view

flowchart LR subgraph HL\["HARD LINK — 2 dir entries point at SAME inode"\] direction LR DE1\["Dir entry  
'file.txt'  
inode 1234"\] DE2\["Dir entry  
'alias.txt'  
inode 1234"\] IN1\["inode 1234  
owner · perms  
timestamps  
link\_count = 2  
→ data blocks  
NO filename"\] DE1 --> IN1 DE2 --> IN1 end subgraph SL\["SOFT / SYMBOLIC LINK — symlink file holds path as text"\] direction LR DS1\["Dir entry 'short'  
inode 9999"\] IN2\["inode 9999 (symlink)  
type=l  
content='/x/real'"\] DS2\["Dir entry 'real'  
inode 5555"\] IN3\["inode 5555 (target)  
link\_count=1  
→ data blocks"\] DS1 --> IN2 DS2 --> IN3 IN2 -. "resolve via pathname" .-> IN3 end classDef hard fill:#1a2218,stroke:#9ece6a,color:#e5e5e5; classDef soft fill:#201c15,stroke:#e0af68,color:#e5e5e5; classDef entry fill:#1a1a1a,stroke:#262626,color:#e5e5e5; class DE1,DE2,DS1,DS2,IN3 entry; class IN1 hard; class IN2 soft;

Hard link = second directory entry, same inode (link count = 2). Soft link = tiny file whose body is the target path as text.

create a hard link — watch the inode number + link count

```console
$ echo "hello" > greet.txt

$ ls -li greet.txt
131073 -rw-r--r--. 1 alex alex 6 Apr 18 10:14 greet.txt

$ ln greet.txt hi.txt    # hard link — no -s

$ ls -li greet.txt hi.txt
131073 -rw-r--r--. 2 alex alex 6 Apr 18 10:14 greet.txt
131073 -rw-r--r--. 2 alex alex 6 Apr 18 10:14 hi.txt
```

Both names point at inode **131073**. Link count jumped from 1 → **2**. Neither is "the original" — they are equal citizens of one file.

now a soft link — notice the l prefix and the arrow

```console
$ ln -s greet.txt short

$ ls -li short
262145 lrwxrwxrwx. 1 alex alex 9 Apr 18 10:15 short -> greet.txt

$ cat short
hello
```

Soft link has its **own** inode (262145, not 131073). First char is `l`. Permissions always show `lrwxrwxrwx` — the target's perms are what actually apply.

> **Example**
> #### Walkthrough: delete the target — hard link survives, soft link dies
>
> 1.  State: `greet.txt` (inode 131073, link\_count=2), `hi.txt` (same inode), `short` (symlink → greet.txt).
> 2.  `rm greet.txt` — removes the *directory entry* "greet.txt". Link count drops to 1. Data blocks stay — the file still has a name.
> 3.  `cat hi.txt` → hello. Hard link still works because inode 131073 is still live (link\_count=1).
> 4.  `cat short` → cat: short: No such file or directory. Symlink dangles — the path "greet.txt" no longer resolves.
> 5.  Lesson: hard link is another *name*; soft link is another *pointer to a name*. Remove the last name and everything downstream breaks.
>
> Exam reflex: "which link keeps working after the original is deleted?" → hard link. Midterm Q24.

7 Unix file types — first char of `ls -l`

`-` plain  ·  `d` directory  ·  `b` block special (disks)  ·  `c` character special (terminals)  ·  `l` symbolic link  ·  `s` socket  ·  `p` named pipe (FIFO)

> **Note**
> **Why hard links can't cross filesystems.** Inode numbers are scoped to one filesystem. Inode 131073 on / and inode 131073 on /boot are different files. A directory entry on / that said "inode 131073 on /boot" would be nonsense. `ln /boot/vmlinuz ~/link` → `Invalid cross-device link`. Use `ln -s`.

Check: I run `ln /boot/vmlinuz ~/link` and get "Invalid cross-device link". Why?`/boot` is a separate partition with its own inode table. Hard links share inode numbers, which are only unique within one filesystem. Use `ln -s` for a symlink — it stores the path as text and crosses filesystems fine. Check: I delete the target of a symlink. What does `ls -l` show?Symlink still listed with `l` type and the old arrow. Reading it (`cat`) errors with "No such file or directory". Hard link siblings would be unaffected because they share the inode, not a pathname. Check: `ls -l` shows `lrwxrwxrwx`. Can anyone write through the link?Not necessarily. Symlink perms are cosmetic — only the target's permissions matter. If target is `-r--r--r--`, nobody can write through the symlink either.

Sources: Mod02 Ch6 · Lab 2 · midterm Q24 + Q58 · Review Apr 17

> **Q:** Does an inode contain the filename?
>
> **A:** **No.** The inode stores owner, group, permissions, timestamps, size, link count, type, and block pointers — but not the name. The filename lives in the directory entry, which maps a name to an inode number. That separation is why hard links work: two entries, one inode.

> **Pitfall**: Hard links cannot cross filesystems — inode numbers are unique only per-FS, so `ln /boot/vmlinuz ~/link` errors with `Invalid cross-device link`. Use `ln -s` (symlink) for cross-FS references. Midterm Q24 bait on "original deleted" scenarios — hard link still works (shared inode), soft link dangles.

> **Takeaway**: The inode stores metadata + block pointers; the directory entry stores the name → inode mapping. That separation makes hard links possible (many entries → one inode) and confines them to a single filesystem (inode numbers are per-FS).
