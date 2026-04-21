---
n: 13
id: builder
title: "Builder — construct complex objects step by step"
hook: "A pizza with a dozen optional ingredients. A user doesn't want to list every one. They want to say 'Margherita' and have the builder know the recipe."
tags: [pattern, creational, builder, director]
module: "Design Patterns — Creational & Structural"
source: "DesignPatternsTable p.9, Week 10 Slides, Lecture Transcripts (Builder demo)"
bloom_levels: [understand, apply, analyze]
related: [abstract-factory, factory]
---

A constructor with fifteen optional parameters is a smell. Builder extracts construction into its own class with `build_step_A()`, `build_step_B()`, `build_step_Z()`, and a `get_result()` that hands back the finished product. A separate `Director` can encode known recipes.

```python
class Pizza:
    def __init__(self):
        self.toppings = []
        self.size = None
    def __str__(self):
        return f"{self.size} pizza with {', '.join(self.toppings)}"

class PizzaBuilder:
    def __init__(self):
        self.reset()
    def reset(self):
        self._pizza = Pizza()
    def set_size(self, size):
        self._pizza.size = size
        return self
    def add_topping(self, t):
        self._pizza.toppings.append(t)
        return self
    def get_result(self):
        result = self._pizza
        self.reset()
        return result

class PizzaDirector:
    def __init__(self, builder):
        self.builder = builder
    def make_margherita(self):
        self.builder.reset()
        self.builder.set_size("Medium").add_topping("Tomato").add_topping("Mozzarella").add_topping("Basil")
        return self.builder.get_result()

director = PizzaDirector(PizzaBuilder())
pizza = director.make_margherita()
print(pizza)  # Medium pizza with Tomato, Mozzarella, Basil
```

> **Q:** Could we just give the `Pizza` constructor many keyword args with defaults?
> **A:** For a few fields, yes. Builder pays off when construction has order-dependent steps, conditional logic, or multiple distinct recipes you want to encode explicitly.

## Structure

- **Builder interface** — `reset()`, `build_step_X()`, `get_result()`.
- **Concrete builder(s)** — produces different representations of the product.
- **Director** (optional) — knows canonical recipes, invokes builder in order.
- **Product** — the complex object being built.

## Past-exam cue

> **Example**
> MCQ: "Which design pattern constructs complex objects step by step?" → **Builder**. Distractors: Abstract Factory (families, not steps), Factory (one method, one product), Singleton (irrelevant — instance count). *finalexamsmerge.pdf MCQ Q1.*

## Takeaway

> **Takeaway**
> Builder is the pattern for "I want to construct this object across several calls with named steps". Combine with Director when the steps form stable recipes. Skip when a constructor + defaults would do.
