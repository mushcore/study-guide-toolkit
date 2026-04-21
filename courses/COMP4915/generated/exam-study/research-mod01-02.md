# Mod01-02 Research (Linux Intro + File System + Utilities)

## Summaries
- **UNIX/Linux history**: UNIX at AT&T 1969; rewritten in C 1973; Linux 1991 Torvalds; kernel 1.0 1994, 2.0 1996, 2.6 2003; current 4.14+/6.x
- **Linux features**: multiuser, multitasking, hierarchical FS, shell=interpreter+language, hundreds of utilities
- **Shell**: user program, command interpreter, programming language. Not the kernel.
- **Filesystem hierarchy**: tree rooted at `/`. Inode+data blocks per file. Filename lives in directory entry, NOT inode.
- **Hard vs soft links**: hard=extra directory entry pointing same inode (can't cross FS); soft=special file containing pathname text (can cross FS, can dangle)

## Key commands

### Navigation/Listing
| Cmd | Purpose | Flags |
|---|---|---|
| pwd | print working dir | - |
| cd | change dir | `~` home, `-` prev, `..` parent |
| ls | list | `-l` long, `-a` all, `-i` inode, `-F` types |
| find | search FS | `-name`, `-type f/d`, `-mtime`, `-exec` |
| which | locate in PATH | - |
| whereis | binary+manual+source | - |
| locate | DB search | - |

### File ops
| Cmd | Flags |
|---|---|
| cp | `-r` recursive, `-i` interactive |
| mv | `-i` interactive |
| rm | `-r` recursive, `-f` force |
| mkdir | `-p` parents |
| rmdir | only empty dirs |
| ln | `-s` symbolic |
| touch | create/update timestamp |
| stat | inode info |
| file | file type detection |

### Text
| Cmd | Purpose |
|---|---|
| grep | search by pattern (`-i`, `-v`, `-n`, `-c`, `-l`, `-w`, `-r`) |
| cat | concatenate |
| head/tail | first/last N lines (`-n N`, `-f` follow) |
| wc | lines/words/chars (`-l`, `-w`, `-c`) |
| tr | translate/delete chars (`tr -d '\r'` DOS→Unix) |
| cut | extract cols (`-d`, `-f`) |
| sort | `-n` numeric, `-r` reverse, `-u` unique |
| uniq | dedupe (requires sort first) |
| tee | stdout AND file |
| sed | stream edit |
| diff | compare |
| less/more | page |

### Archive
| Cmd | Flags |
|---|---|
| tar | `-c` create, `-x` extract, `-t` list, `-z` gzip, `-j` bz2, `-f` file, `-v` verbose |
| gzip | `-d` decompress, `-v` verbose |
| du | `-s` summary, `-h` human |
| df | `-h` human |

### Permissions
- chmod numeric: `chmod 755 file` (u=rwx, g=rx, o=rx)
- chmod symbolic: `chmod u+rwx,g-w,o= file`
- Special bits: setuid 4000, setgid 2000, sticky 1000
- chown user:group file (`-R` recursive)

## 7 Unix file types (first char of ls -l)
- `-` plain file
- `d` directory
- `b` block special (disks)
- `c` character special (terminals)
- `l` symbolic link
- `s` socket
- `p` named pipe (FIFO)

## Shell expansion order (all fair game — INSTRUCTOR EMPHASIS)
1. Brace `{a,b,c}`
2. Tilde `~`, `~user`
3. Parameter `$var`, `${var}`
4. Command `$(cmd)` or `` `cmd` ``
5. Arithmetic `$((2+2))`
6. Word splitting (IFS)
7. Pathname (globbing `*`, `?`, `[...]`)

## Quoting
- `'...'` single: ALL expansions suppressed, literal
- `"..."` double: parameter+command+arithmetic expand; glob + word splitting NOT
- `` `...` `` and `$()` command substitution
- `\` backslash escapes single char

## Redirection
- `>` stdout overwrite
- `>>` stdout append
- `<` stdin from file
- `2>` stderr to file
- `&>` both stdout+stderr
- `2>&1` merge stderr INTO stdout (order matters! put AFTER `> file`)
- `|` pipe stdout→stdin

## Glob vs Regex (HIGH PRIORITY TRAP)
- Globbing: shell-level, filename matching. `*`=any chars, `?`=one char, `[abc]`=set, `[!abc]`=not in set
- Regex: utility-level (grep/sed). `*`=0+ of prev char, `.`=any char, `^`=start, `$`=end
- TRAP: `grep *` — shell expands `*` to filenames, grep uses first as pattern, rest as files. Always quote: `grep "pattern" *`

## Inode structure
- owner
- group
- access modes
- timestamps: atime, mtime, ctime (inode update)
- size (bytes)
- link count
- file type
- array of data block pointers
- **NO filename** (filename in directory entry)

## Hard vs Soft Link (ESSAY MATERIAL — midterm Q58)
| Aspect | Hard Link | Soft (Symbolic) Link |
|---|---|---|
| What | extra directory entry, same inode | special file, contains pathname text |
| Cross-filesystem | NO (inode unique only in FS) | YES |
| Dangling | NO (file persists until all links removed) | YES (target can be deleted) |
| Directory linking | NO (except root) | YES |
| Inode | same as original | own inode |
| ls -l marker | nothing special | `l` type, arrow `->` to target |
| Link count effect | increments | no effect |

## Filesystem hierarchy
- `/bin` essential user binaries
- `/sbin` system admin binaries (statically linked for rescue)
- `/usr/bin` `/usr/sbin` non-essential
- `/etc` configuration
- `/var` variable data: logs, mail, spool
- `/home` user homes
- `/tmp` temp
- `/dev` device files
- `/proc` pseudo-FS (process info)
- `/boot` kernel, bootloader
- `/root` root user home

## Flashcards (20)

1. **Q:** What's the top of the Linux filesystem hierarchy?  **A:** `/` (root directory, NOT `/root` which is root user's home). [Mod02, Ch6]
2. **Q:** What does the inode contain?  **A:** owner, group, modes, timestamps, size, link count, type, data block pointers. NOT filename. [Mod02 "What precisely is a file?"]
3. **Q:** Why can't hard links cross filesystems?  **A:** Inode numbers are unique only within a filesystem. [Mod02 + Lab2]
4. **Q:** What does `tee` do?  **A:** Read stdin, write to stdout AND to a file. [Mod01 Pipes slide]
5. **Q:** `tr -d '\r'` purpose?  **A:** Delete carriage returns — converts DOS/Windows text files to Unix. [midterm Q46]
6. **Q:** Cloze: `chmod 755 file` sets owner {{rwx}}, group {{r-x}}, other {{r-x}}.  [Mod02 Ch6]
7. **Q:** What are the 7 Unix file types?  **A:** `-` plain, `d` dir, `b` block, `c` char, `l` link, `s` socket, `p` named pipe. [Mod02]
8. **Q:** Order of shell expansions?  **A:** Brace → tilde → parameter → command → arithmetic → word split → pathname. [Mod04]
9. **Q:** `echo '$HOME'` output?  **A:** Literal `$HOME` — single quotes suppress expansion. [midterm Q47]
10. **Q:** `echo "$HOME"` output?  **A:** `/home/username` — double quotes allow parameter expansion. [Mod04]
11. **Q:** `find / -name foo` vs `find -name foo`?  **A:** First searches entire FS; second starts from cwd (GNU accepts). [midterm Q6]
12. **Q:** Difference: `>` vs `>>`?  **A:** `>` overwrites file; `>>` appends. [Mod01]
13. **Q:** What does `2>&1` do?  **A:** Redirects stderr (fd 2) into stdout (fd 1). [midterm Q50]
14. **Q:** Name of Linux bit-bucket?  **A:** `/dev/null`. [midterm Q48, sample Q13]
15. **Q:** Why is `grep *` dangerous without quotes?  **A:** Shell globs `*` to filenames; first becomes regex pattern. Quote it. [instructor emphasis]
16. **Q:** `ls libby1*.jpg` given libby1.jpg, libby11.jpg, libby12.jpg, libby1.txt?  **A:** libby1.jpg, libby11.jpg, libby12.jpg (matches libby1 + anything + .jpg). [midterm Q56]
17. **Q:** `ls libby[6-8].jpg`?  **A:** libby6.jpg, libby7.jpg, libby8.jpg. [midterm Q57]
18. **Q:** Delete hard link — file gone?  **A:** No. File exists until link count hits 0. [Lab2]
19. **Q:** Delete target of soft link — what happens to link?  **A:** Link dangles (points to non-existent path). [Lab2]
20. **Q:** Cloze: Directory always contains {{.}} and {{..}}.  [Mod02]

## Exam traps
- `grep *` unquoted — globbing consumes args
- `echo '$var'` literal, `echo "$var"` expanded
- Hard link cannot cross FS
- chmod 755 ≠ chmod u+rwx (second is additive)
- `>` overwrites SILENTLY — no warning (midterm Q43 FALSE, Q44 TRUE)
- Redirection fd order: `> file 2>&1` merges AFTER redirect; `2>&1 > file` doesn't
- `find -name foo` needs path — default cwd in GNU only
- `rm -rf /` nuclear; `rm -rf / tmp/junk` (space!) catastrophic

## Practice questions

**MCQ 1**: Which option displays line numbers in matching grep output?
A) -l  B) -c  C) -n  D) -v  E) -i
**Answer**: C. -l lists files, -c counts, -v inverts, -i ignores case.

**T/F 2**: Deleting a file with active hard links removes data immediately.
**Answer**: F. Data persists until link count = 0.

**Short 3**: Write command to find all .log files under /var modified in last 2 days.
**Answer**: `find /var -name "*.log" -mtime -2`

**Essay 4**: Compare hard and soft links. Use cases, limitations, filesystem behavior.
**Model answer**: See table above. Hard link = extra directory entry sharing inode; cannot span FS; no dangling. Soft link = special file with target path as text; spans FS; can dangle. Use hard for duplicate-looking refs on same FS; soft for cross-mount or URL-like refs.

**Short 5**: What output from `cat x y 1>hold 2>&1; cat hold` if x does not exist, y contains "This is y"?
**Answer**: `cat: x: No such file or directory\nThis is y` (stderr merged into stdout, both captured). [midterm Q50]
