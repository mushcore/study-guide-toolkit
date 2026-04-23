---
id: 4915-topic-shell-scripting-essentials
title: Shell scripting essentials
pillar: tech
priority: high
chapter: Mod09 Ch28
source: "Mod09 Ch28; materials/labs/Lab9.pdf; materials/past-exams/midterm.md Q59, Q60"
tags:
  - shell
  - scripting
related: [4915-topic-special-parameters, 4915-topic-redirection-pipes, 4915-topic-quoting-rules]
---

Structure:

```bash
#!/bin/bash
# set -euo pipefail         # strict mode (optional)

greet() {
  local name="$1"           # formal arg via $1
  echo "Hello, $name"
}

if [ -f /etc/hosts ]; then
  for h in "$@"; do greet "$h"; done
fi
```

#### test / \[ \] operators

File: `-e -f -d -r -w -x -s -L`. String: `-z` empty, `-n` non-empty, `=`, `!=`. Numeric: `-eq -ne -lt -le -gt -ge`.

`[[ ]]` is bash-only, supports `&&` `||` `=~` regex.

#### Loops

```bash
for i in 1 2 3; do echo $i; done
for ((i=0;i<5;i++)); do echo $i; done
while read line; do echo "$line"; done < file
until [ $x -gt 5 ]; do ((x++)); done
case "$1" in
  start) do_start ;;
  stop)  do_stop  ;;
  *)     echo "usage: $0 {start|stop}" ;;
esac
```

#### Param expansion

`${var:-default}`, `${var:=default}`, `${var:?err}`, `${#var}` length, `${var#prefix}`, `${var%suffix}`.

#### Here doc / here string

```bash
cat <<EOF
multi
line
EOF

grep pat <<< "one line"
```

> **Pitfall**
>
> Missing the shebang `#!/bin/bash` means the kernel falls back to the user's login shell to run the script. If that's `/bin/sh`, bash-only features (arrays, `[[`, `$'…'`) fail silently or with obscure errors. Always start scripts with `#!/bin/bash` — it's one line and saves hours.

> **Example** — minimal exam-shaped script: `psgrep` bash function from midterm Q60
>
> ```bash
> #!/bin/bash
> # psgrep — print processes whose command matches the first arg
> psgrep() {
>   if [ $# -ne 1 ]; then
>     echo "usage: psgrep PATTERN" >&2
>     return 1
>   fi
>   ps -ef | grep "$1" | grep -v grep
> }
> psgrep "$@"
> ```
>
> 1. Shebang → bash. 2. `$#` argument-count check → clean error path to stderr + non-zero exit. 3. `"$1"` quoted → whitespace in pattern preserved. 4. `grep -v grep` strips the grep itself from the result. 5. `psgrep "$@"` at end makes the file usable as a standalone script.
> Save as `psgrep`, `chmod +x psgrep`, then `./psgrep sshd` — exam-ready answer in 10 lines.

> **Takeaway**: A working script needs a shebang, executable permission, and argument handling through special parameters. Control flow (`if`, `for`, `while`, `case`), file tests (`-f`, `-d`, `-r`), and exit-status checks (`$?`) cover the exam's entire short-answer question space.
