---
"n": 12
id: 4915-code-identify-file-type-from-ls-l
title: Identify file type from ls -l
lang: bash
variant: starter-solution
tags:
  - linux
---

## Prompt

Given:

```bash
brw-rw---- 1 root disk 8, 0 Apr 18 /dev/sda
crw-rw-rw- 1 root root 1, 3 Apr 18 /dev/null
lrwxrwxrwx 1 root root    7 Apr 18 /bin -> usr/bin
-rw-r--r-- 1 root root  256 Apr 18 /etc/hostname
drwxr-xr-x 2 root root 4096 Apr 18 /etc
srw-rw---- 1 root mysql  0 Apr 18 /var/run/mysqld.sock
prw-r--r-- 1 root root   0 Apr 18 /tmp/pipe
```

What is each file type?

## Starter

```bash
/dev/sda: ?
/dev/null: ?
/bin: ?
/etc/hostname: ?
/etc: ?
mysqld.sock: ?
/tmp/pipe: ?
```

## Solution

```bash
/dev/sda: block special (b)
/dev/null: character special (c)
/bin: symbolic link (l)
/etc/hostname: plain file (-)
/etc: directory (d)
mysqld.sock: socket (s)
/tmp/pipe: named pipe / FIFO (p)
```

## Why

7 types total. First char of ls -l line: - plain, d dir, b block, c char, l symlink, s socket, p pipe.
