---
id: 4915-topic-inode-hard-vs-soft-links
title: Inode + hard vs soft links
pillar: tech
priority: high
chapter: Mod02 Ch6
tags:
  - filesystem
  - fundamentals
---

An inode holds: owner, group, modes, timestamps (atime/mtime/ctime), size, link count, type, data-block pointers. **NOT filename.**

Directory = file of `(inode, name)` entries. Always contains `.` and `..`.

| Aspect | Hard link | Soft/symbolic link |
| --- | --- | --- |
| Storage | Extra directory entry; same inode | Special file holding pathname text |
| Cross-filesystem | NO (inode numbers scoped to one FS) | YES |
| Dangling | Never (link count > 0) | Can (target deleted) |
| Link to directory | NO (normal users) | YES |
| ls -l marker | same as file type | `l`, shows `-> target` |

**Trap:** midterm Q24 tests which link "ensures the linked file exists even after the original is deleted" — answer: hard link. Soft link would dangle.
