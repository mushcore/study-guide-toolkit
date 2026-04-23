---
id: 4915-topic-archives-compression
title: Archives + compression
pillar: tech
priority: low
chapter: Mod02
source: "Mod02"
tags:
  - archives
  - fundamentals
related: [4915-topic-grep-find-wc-tr-tee-sort, 4915-lesson-filesystem-inode-directory-entry]
---

Lab-2 scenario: your instructor hands back a 200-file homework directory and wants it emailed as a single 1 MB attachment. You `tar -czvf hw.tar.gz homework/`, watch gzip halve the size, attach `hw.tar.gz`. The grader runs `tar -xzvf hw.tar.gz` on the other end and gets the tree back identical — same filenames, perms, timestamps. That's the exam-sized archive task.

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

LOW exam priority. Know `tar` + `gzip` existence and basic flags.

> **Pitfall**
>
> `tar -xf archive.tar` extracts into the *current* directory. Run it inside the wrong folder and you scatter files across your cwd. Always `cd` to the target dir first, or use `tar -C target -xf archive.tar`.

> **Example** — roundtrip a directory through gzipped tar
>
> 1. Start: `src/` contains `a.txt`, `b.txt`, `sub/c.txt` (total ~30 KB plain text).
> 2. `tar -czvf src.tar.gz src/` — `-c` create, `-z` pipe through gzip, `-v` verbose, `-f` archive file. Output names each added entry.
> 3. `ls -l src.tar.gz` → ~4 KB. gzip compressed the tar stream.
> 4. `tar -tzvf src.tar.gz` — `-t` list. Shows the same three files with their original perms/timestamps.
> 5. `mv src.tar.gz /tmp; cd /tmp; tar -xzvf src.tar.gz` — extracts `src/` under `/tmp`. `-x` extract, `-z` gunzip, same `-v`/`-f` semantics.
> 6. `diff -r /tmp/src ~/src` → no output. Contents, perms, and relative layout all round-tripped.
> 7. The three forms you must recognize: `-cf` create, `-tf` list, `-xf` extract. Add `-z` for gzip, `-j` for bzip2. Everything else is lab trivia.

> **Q:** What flag unpacks `foo.tar.gz` in a single step?
>
> **A:** `tar -xzf foo.tar.gz`. `-x` extract, `-z` pipe through gzip (handles the `.gz` layer), `-f` names the archive file. Without `-z` you'd have to `gunzip` first, then `tar -xf`.

> **Takeaway**: `tar` packages, `gzip`/`bzip2`/`xz` compress. The simple forms (`tar -cf`, `-tf`, `-xf`, with optional `-z` for gzip) are all the exam tests. Everything else is trivia.
