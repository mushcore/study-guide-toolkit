---
n: 44
id: file-json
title: "File handling + JSON"
hook: "`json.dumps()` returns a string. `json.dump()` writes to a file. Different functions. Easy T/F trap."
tags: [files, json, io]
module: "Python Advanced Language Features"
source: "Week 4 Slides, finalexamsmerge.pdf T/F json"
bloom_levels: [remember, understand]
related: [exceptions-with]
---

## File I/O with `with`

```python
with open("data.txt", "r") as f:
    content = f.read()

with open("out.txt", "w") as f:
    f.write("line 1\n")
    f.writelines(["a\n", "b\n"])
```

Modes: `"r"` read (default), `"w"` write (overwrites), `"a"` append, `"r+"` read+write. Add `"b"` for binary (`"rb"`, `"wb"`).

> **Q:** Why use `with open(...)` instead of `open(...)` and manually calling `.close()`?
> **A:** `with` guarantees `__exit__` (and thus `close`) runs even if the block raises. Manual close can be skipped on exception paths, leaking file handles. `with` is the idiomatic, exception-safe pattern for any resource acquisition (files, locks, DB connections).

## JSON

```python
import json

# Python → JSON string
json.dumps({"name": "Alice", "age": 30})   # '{"name": "Alice", "age": 30}'

# Python → JSON file
with open("user.json", "w") as f:
    json.dump({"name": "Alice"}, f)

# JSON string → Python
json.loads('{"name": "Alice"}')            # {'name': 'Alice'}

# JSON file → Python
with open("user.json") as f:
    data = json.load(f)
```

## Past-exam T/F trap

> **Example**
> "The `json.dumps()` method can be used to directly write a Python dictionary to a .json file." FALSE. `dumps` (with 's') returns a **string**. `dump` (no 's') writes to a file. *finalexamsmerge.pdf T/F.*

## Takeaway

> **Takeaway**
> Mnemonic for json module: no-s writes, with-s string. `dump`/`load` talk to files; `dumps`/`loads` talk to strings. Same for pickle module.
