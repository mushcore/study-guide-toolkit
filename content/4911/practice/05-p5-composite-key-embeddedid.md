---
"n": 5
id: 4911-cp-p5-composite-key-embeddedid
title: P5 · Composite key (@EmbeddedId)
lang: java
variant: annotation
tags:
  - ejb
kind: code
source: "TODO: trace to lab/assignment/past-exam (legacy — needs enrichment)"
---

> OrderLine has a composite PK made of `orderId` and `lineNumber`. Use the @EmbeddedId approach.

## Code

```java
@Embeddable
public class OrderLineKey implements Serializable {
    @Column(name = "ORDER_ID")
    private Long orderId;

    @Column(name = "LINE_NUMBER")
    private int lineNumber;

    public OrderLineKey() { }
    public OrderLineKey(Long orderId, int lineNumber) {
        this.orderId = orderId;
        this.lineNumber = lineNumber;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof OrderLineKey)) return false;
        OrderLineKey k = (OrderLineKey) o;
        return orderId.equals(k.orderId) && lineNumber == k.lineNumber;
    }

    @Override
    public int hashCode() {
        return orderId.hashCode() * 31 + lineNumber;
    }
}

@Entity
public class OrderLine {
    @EmbeddedId
    private OrderLineKey id;

    private String productName;
    private int quantity;
}
```

## Notes

<!-- note parsing degraded: some notes lack exact line references; summary-scope lines used instead -->
- **line 1** · `@Embeddable` — @Embeddable on PK class + implements Serializable + equals/hashCode + no-arg ctor.
- **line 28** · `@EmbeddedId` — Entity uses @EmbeddedId (single field).
- **lines 1–35** · Access via orderLine.getId().getOrderId() — Access via orderLine.getId().getOrderId().
- **lines 1–35** · `@IdClass` — Alternative: @IdClass with two @Id fields in entity.
