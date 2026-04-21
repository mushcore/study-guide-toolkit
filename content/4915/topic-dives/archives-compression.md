---
id: 4915-topic-archives-compression
title: Archives + compression
pillar: tech
priority: low
chapter: Mod02
tags:
  - archives
  - fundamentals
---

tar packages files (no compression by default). gzip/bzip2/xz compress.

```bash
tar -cvf archive.tar dir/          # create (c), verbose, file
tar -czvf archive.tar.gz dir/      # + gzip
tar -cjvf archive.tar.bz2 dir/     # + bzip2
tar -xvf archive.tar               # extract
tar -xzvf archive.tar.gz           # extract gzipped
tar -tvf archive.tar               # list contents
gzip file; gunzip file.gz
zcat file.gz                       # read without decompressing
```

LOW priority per instructor. Know `tar` + `gzip` existence and basic flags.
