---
"n": 2
id: 4911-cp-p2-1-1-bidirectional-relationship
title: P2 · 1:1 bidirectional relationship
lang: java
variant: annotation
tags:
  - relationships
---

> User and UserProfile. One-to-one BIDIRECTIONAL. UserProfile owns the FK column `USER_ID`. Deleting a User should also delete its UserProfile.

## Code

```java
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String username;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private UserProfile profile;
}

@Entity
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String bio;

    @OneToOne
    @JoinColumn(name = "USER_ID")
    private User user;
}
```

## Notes

- **line 23** · `@JoinColumn` — Owning side = side with @JoinColumn (UserProfile).
- **line 2** · User inverse → — User inverse → mappedBy="user" (field name on UserProfile).
- **line 10** · Cascade + orphanRemoval — Cascade + orphanRemoval on User propagates delete.
