---
id: html-css-review
title: "HTML & CSS Reference: Box Model, Selectors, Attributes, Structure"
pillar: tech
priority: low
source: "Slide 1, ISAQuiz1"
bloom_levels: [remember, understand]
related: []
---

## CSS Box Model Layers (Inside → Outside)

| Layer | CSS properties that affect it | Notes |
|---|---|---|
| content | `width`, `height` | Default sizing target |
| padding | `padding`, `padding-top/right/bottom/left` | Transparent; adds to rendered size |
| border | `border`, `border-width`, `border-style` | Visible edge |
| margin | `margin`, `margin-top/right/bottom/left` | Transparent; collapses between siblings |

`box-sizing: border-box` makes `width`/`height` include padding and border.

---

## CSS Selector Quick Reference

| Selector | Syntax | Matches |
|---|---|---|
| Element | `p` | All `<p>` |
| Class | `.card` | All elements with `class="card"` |
| Element + class | `div.card` | `<div>` with class `card` |
| Grouping | `h1, h2, p` | All three element types |
| Descendant | `nav a` | `<a>` anywhere inside `<nav>` |
| Direct child | `ul > li` | `<li>` that is a direct child of `<ul>` |

**Multiple classes on one element:** space-separated in HTML — `class="bold red large"`.

---

## Stylesheet Delivery Methods

| Type | Where it lives | Syntax |
|---|---|---|
| External | Separate `.css` file | `<link rel="stylesheet" href="...">` in `<head>` |
| Internal | Inside `<head>` | `<style> ... </style>` |
| Inline | On the element | `style="color: red;"` attribute |

---

## HTML Document Tree

```
Document
└── <!DOCTYPE html>
└── <html>
    ├── <head>
    │   ├── <title>
    │   └── <link> / <style>
    └── <body>
        └── (visible elements)
```

- `<!DOCTYPE html>` precedes `<html>` — it is a declaration, not an element.
- `<head>` and `<body>` are direct children of `<html>`, not of each other.

---

## Common HTML Attributes

| Element | Attribute | Purpose |
|---|---|---|
| `<img>` | `src` | Path or URL to the image file |
| `<img>` | `alt` | Fallback text when image cannot load |
| `<a>` | `href` | Link destination |
| Any | `class` | One or more CSS class names (space-separated) |
| Any | `id` | Unique identifier on the page |
| Any | `style` | Inline CSS declarations |

Both `src="image.jpg"` and `src='image.jpg'` are valid — HTML accepts single or double quotes.

---

## Block vs Inline Elements

| Element | Display type |
|---|---|
| `<div>` | Block — starts on a new line, takes full width |
| `<p>`, `<h1>`–`<h6>`, `<ul>` | Block |
| `<span>` | Inline — flows within text |
| `<a>`, `<img>`, `<strong>` | Inline |

---

## Common CSS Properties

| Property | What it changes |
|---|---|
| `color` | Text color |
| `background-color` | Element background color |
| `font-size` | Text size (`px`, `em`, `%` all valid) |
| `border` | Shorthand for width, style, color |
| `margin` / `padding` | Spacing outside / inside the border |

> **Pitfall:** `color` targets text, not background. To change background color, use `background-color`. ISAQuiz1 tests this property name distinction.
