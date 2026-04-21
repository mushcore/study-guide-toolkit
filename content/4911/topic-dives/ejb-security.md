---
id: 4911-topic-ejb-security
title: EJB Security
pillar: tech
priority: med
chapter: Ch 15
tags:
  - ejb
  - security
  - tech
---

#### Mechanism — how declarative security is evaluated

EJB security is checked **per method invocation**, not once per session. When a client calls a business method, the container intercepts the call before executing the bean code and asks two questions: (1) who is the caller's Principal (carried in the invocation context from the authenticated login), and (2) does that Principal hold any role listed in the method's `@RolesAllowed`?

Precedence rule: method-level annotations override class-level. `@RolesAllowed("ADMIN")` on a single method overrides a class-level `@PermitAll`. `@DenyAll` on a method blocks it for everyone regardless of class policy. If no annotation applies, the default is unchecked (open). If the check fails, the container throws `EJBAccessException` *before* your method body runs — the bean never sees the call.

`@RunAs("SYSTEM")` does not affect the caller check on THIS method. It changes the Principal used for *downstream* calls the bean makes. Use this when a bean needs elevated privileges to call another bean.

```java
@Stateless
@DeclareRoles({"ADMIN","USER","GUEST"})
public class AccountService {

    @PermitAll                          // any authenticated user
    public Account getAccount(Long id) { ... }

    @RolesAllowed({"ADMIN","USER"})     // only these roles
    public void update(Account a) { ... }

    @RolesAllowed("ADMIN")              // single role
    public void delete(Long id) { ... }

    @DenyAll                            // no one can call
    public void internalOnly() { ... }

    @RunAs("SYSTEM")                    // elevates identity for downstream
    public void spawnAudit() { ... }
}
```

#### Programmatic checks

```java
@Resource SessionContext ctx;
...
if (ctx.isCallerInRole("ADMIN")) { ... }
Principal caller = ctx.getCallerPrincipal();
```
