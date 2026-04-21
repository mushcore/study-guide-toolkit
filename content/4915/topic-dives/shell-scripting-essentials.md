---
id: 4915-topic-shell-scripting-essentials
title: Shell scripting essentials
pillar: tech
priority: high
chapter: Mod09 Ch28
tags:
  - shell
  - scripting
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
