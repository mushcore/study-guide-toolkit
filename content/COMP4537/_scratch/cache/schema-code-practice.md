## SCHEMA §Code-practice

Frontmatter:
```yaml
---
n: 1
id: express-route-handler
title: "Express route handler"
lang: js
tags: [express, routing]
source: "Slide 8, Part 3"
pedagogy: worked-example-first
---
```

Body — four H2 sections in this order:
```markdown
## Prompt

Write an Express GET handler for `/users/:id` that returns a JSON user object.

## Starter

​```js
const express = require('express');
const app = express();
// TODO: add GET /users/:id
​```

## Solution

​```js
const express = require('express');
const app = express();

app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ id, name: 'Alice' });
});
​```

## Why

`req.params.id` extracts the dynamic segment. `res.json()` sets Content-Type to application/json automatically.
Common wrong approach: using `req.query.id` instead of `req.params.id` when the id is part of the path, not the query string.
```

Invariants:
- Exactly four H2 sections: `Prompt`, `Starter`, `Solution`, `Why`. In that order.
- `Starter` contains exactly one fenced code block.
- `Solution` contains exactly one fenced code block.
- Both fences use the same language tag as frontmatter `lang`.

For diagram-inventory topics: reproduce past-exam diagram as inline SVG in `## Prompt`.
