# COMP 4911 Exam Study Guide: JPQL, Transactions, Security, and Design

**Date Generated:** April 18, 2026  
**Topics:** JPQL/Queries, Entity Callbacks, Security, JNDI/ENC/Injection, Transactions, Java EE Design  
**Instructor Notes:** Focus on transaction attributes, JPQL query patterns, security annotations, entity callbacks, and design patterns.

---

## Table of Contents

1. [JPQL & Queries (Chapter 13)](#1-jpql--queries-chapter-13)
2. [Entity Callbacks & Listeners (Chapter 14)](#2-entity-callbacks--listeners-chapter-14)
3. [EJB Security (Chapter 15)](#3-ejb-security-chapter-15)
4. [JNDI, ENC, Injection (Chapter 16)](#4-jndi-enc-injection-chapter-16)
5. [Transactions (Chapter 17)](#5-transactions-chapter-17)
6. [Transaction Attributes Reference Table](#6-transaction-attributes-reference-table)
7. [Java EE & EJB Design (Chapter 18)](#7-java-ee--ejb-design-chapter-18)
8. [Flashcard Deck (40+ cards)](#8-flashcard-deck)
9. [Practice Exam Questions](#9-practice-exam-questions)

---

## 1. JPQL & Queries (Chapter 13)

### Summary
JPQL (Java Persistence Query Language) is a standard query language for EJB that operates on the abstract persistence schema of entity beans, not on the underlying database. It enables developers to query entities using a syntax similar to SQL, with support for relationships, named parameters, dynamic queries, and the Criteria API. Query objects are obtained from EntityManager and support result pagination, bulk updates/deletes, and both named and typed queries.

### Key Concepts

| Term | Definition | Source |
|------|-----------|--------|
| **JPQL** | Jakarta Persistence Query Language; a platform-independent query language for entities operating on abstract persistence schema | EJB12 |
| **TypedQuery<T>** | Query interface returning a strongly-typed result set for a specific class T; safer than untyped Query | EJB12 |
| **Named Query** | Query defined with @NamedQuery or @NamedQueries annotations at entity/bean level; executed by name from EntityManager | EJB12 |
| **Native Query** | SQL query executed directly against underlying database; obtained via createNativeQuery(); bypasses JPQL abstraction | EJB12 |
| **FETCH JOIN** | Eager loading strategy preventing N+1 problem by joining related entities in single query: SELECT b FROM Book b JOIN FETCH b.author a | EJB12 |
| **Positional Parameter** | Query parameter referenced by ?n (e.g., ?1, ?2); set via setParameter(int position, Object value) | EJB12 |
| **Named Parameter** | Query parameter referenced by :name (e.g., :authorId); set via setParameter("name", value); preferred over positional | EJB12 |
| **Bulk Update/Delete** | executeUpdate() on Query for mass modifications: UPDATE Entity e SET e.field = value WHERE condition | EJB12 |
| **CriteriaAPI** | Type-safe alternative to JPQL; uses CriteriaBuilder, CriteriaQuery, Root, Predicate for building queries programmatically | EJB12 |
| **Constructor Expression** | SELECT new com.x.Dto(field1, field2) FROM Entity; creates DTO instances directly in query result | EJB12 |

### Syntax Reference

| Element | Syntax | Notes |
|---------|--------|-------|
| **SELECT** | `SELECT e FROM Employee e` | Returns entity instances |
| **SELECT Projection** | `SELECT e.name, e.salary FROM Employee e` | Returns Object[] or tuple |
| **SELECT COUNT** | `SELECT COUNT(e) FROM Employee e` | Aggregate function |
| **SELECT NEW** | `SELECT new dto.EmployeeDTO(e.id, e.name) FROM Employee e` | Constructor projection |
| **FROM** | `FROM Employee e` | Entity reference (e is alias) |
| **JOIN** | `JOIN e.department d` | Inner join on relationship |
| **LEFT JOIN** | `LEFT JOIN e.department d` | Left outer join; includes unmatched parent |
| **FETCH JOIN** | `JOIN FETCH e.department` | Eager load without creating separate result variable |
| **WHERE** | `WHERE e.salary > :minSal` | Filter results by condition |
| **GROUP BY** | `GROUP BY e.department` | Aggregate results |
| **HAVING** | `HAVING COUNT(e) > 5` | Filter groups after aggregation |
| **ORDER BY** | `ORDER BY e.name ASC, e.salary DESC` | Sort results; ASC (default) or DESC |
| **Subquery** | `SELECT e FROM Employee e WHERE e.salary > (SELECT AVG(e2.salary) FROM Employee e2)` | Nested SELECT |
| **Aggregate Avg** | `SELECT AVG(e.salary) FROM Employee e` | Average value |
| **Aggregate Sum** | `SELECT SUM(e.salary) FROM Employee e` | Sum of values |
| **Aggregate Min** | `SELECT MIN(e.salary) FROM Employee e` | Minimum value |
| **Aggregate Max** | `SELECT MAX(e.salary) FROM Employee e` | Maximum value |

### Query Patterns (Common)

| Purpose | Example | Notes |
|---------|---------|-------|
| **Find by PK** | `TypedQuery<Employee> q = em.createQuery("SELECT e FROM Employee e WHERE e.id = :id", Employee.class); q.setParameter("id", 123); Employee emp = q.getSingleResult();` | Use getSingleResult() for single expected result |
| **Find All** | `List<Employee> emps = em.createQuery("SELECT e FROM Employee e", Employee.class).getResultList();` | getResultList() for 0+ results |
| **Inner Join** | `SELECT b FROM Book b JOIN b.author a WHERE a.name = :aname` | Returns Book; author must exist (INNER JOIN) |
| **Left Join** | `SELECT b FROM Book b LEFT JOIN b.author a WHERE a.name = :aname` | Returns Book even if author is null |
| **Fetch Join (N+1 fix)** | `SELECT b FROM Book b JOIN FETCH b.author WHERE b.title = :title` | Loads author in same query; no N+1 problem |
| **Pagination** | `query.setFirstResult(0).setMaxResults(10).getResultList();` | Page 0, 10 items per page; firstResult is 0-based |
| **Bulk Update** | `int updated = em.createQuery("UPDATE Employee e SET e.salary = e.salary * 1.1 WHERE e.department.name = :dept").setParameter("dept", "Sales").executeUpdate();` | Returns count of rows updated |
| **Bulk Delete** | `int deleted = em.createQuery("DELETE FROM Employee e WHERE e.salary < :min").setParameter("min", 30000).executeUpdate();` | Returns count of rows deleted |
| **Named Query** | `@NamedQuery(name="findByName", query="SELECT e FROM Employee e WHERE e.name = :name")` then `em.createNamedQuery("findByName", Employee.class).setParameter("name", "John").getResultList();` | Defined once, reused; may be pre-compiled |
| **Count** | `Long count = em.createQuery("SELECT COUNT(e) FROM Employee e WHERE e.salary > :min", Long.class).setParameter("min", 50000).getSingleResult();` | Returns Long; use getSingleResult() |
| **Constructor DTO** | `SELECT new com.x.EmployeeDTO(e.id, e.name, e.salary) FROM Employee e` | DTO must have matching constructor signature |

### EntityManager Query Methods

| Method | Signature | Return Type | Notes |
|--------|-----------|-------------|-------|
| **createQuery(String)** | `Query createQuery(String qlString)` | Query (untyped) | Create untyped query; requires casting |
| **createQuery(String, Class)** | `<T> TypedQuery<T> createQuery(String qlString, Class<T> resultClass)` | TypedQuery<T> | Type-safe query; preferred |
| **createQuery(CriteriaQuery)** | `<T> TypedQuery<T> createQuery(CriteriaQuery<T> criteriaQuery)` | TypedQuery<T> | Criteria API query |
| **createNamedQuery(String)** | `Query createNamedQuery(String name)` | Query | Untyped named query |
| **createNamedQuery(String, Class)** | `<T> TypedQuery<T> createNamedQuery(String name, Class<T> resultClass)` | TypedQuery<T> | Typed named query |
| **createNativeQuery(String)** | `Query createNativeQuery(String sqlString)` | Query | Raw SQL; returns Object[] |
| **createNativeQuery(String, Class)** | `Query createNativeQuery(String sqlString, Class resultClass)` | Query | Raw SQL returning entity class |

### Query Interface Methods

| Method | Signature | Purpose | Notes |
|--------|-----------|---------|-------|
| **setParameter(name, value)** | `Query setParameter(String name, Object value)` | Set named parameter :name | Fluent API (returns Query for chaining) |
| **setParameter(position, value)** | `Query setParameter(int position, Object value)` | Set positional parameter ?n | 1-based indexing |
| **setParameter(name, value, type)** | `Query setParameter(String name, Date value, TemporalType type)` | Set date/time with type | Type: DATE, TIME, TIMESTAMP |
| **setMaxResults(max)** | `Query setMaxResults(int maxResult)` | Limit result count | Fluent API; e.g., setMaxResults(10) |
| **setFirstResult(start)** | `Query setFirstResult(int startPosition)` | Pagination offset | 0-based; setFirstResult(0).setMaxResults(10) for page 1 |
| **getResultList()** | `List getResultList()` | Execute; return all results | Returns empty list if no results (never null) |
| **getSingleResult()** | `Object getSingleResult()` | Execute; expect exactly 1 result | Throws EntityNotFoundException (0 results) or NonUniqueResultException (multiple) |
| **executeUpdate()** | `int executeUpdate()` | Execute INSERT/UPDATE/DELETE | Returns count of affected rows |

### Criteria API Basics

| Component | Purpose | Example |
|-----------|---------|---------|
| **CriteriaBuilder** | Factory for building query predicates and expressions | `CriteriaBuilder cb = em.getCriteriaBuilder();` |
| **CriteriaQuery<T>** | Represents a query structure | `CriteriaQuery<Employee> cq = cb.createQuery(Employee.class);` |
| **Root<T>** | Entity reference in FROM clause | `Root<Employee> emp = cq.from(Employee.class);` |
| **Predicate** | WHERE condition | `Predicate p = cb.equal(emp.get("name"), "John");` |
| **Example** | Build type-safe query | `cq.select(emp).where(cb.equal(emp.get("name"), "John"));` |

### Code Examples

#### Example 1: Basic JPQL Query with Named Parameters
```java
// Query all employees with salary above threshold
public List<Employee> findHighEarners(double minSalary) {
    TypedQuery<Employee> query = entityManager.createQuery(
        "SELECT e FROM Employee e WHERE e.salary > :minSal ORDER BY e.salary DESC",
        Employee.class
    );
    query.setParameter("minSal", minSalary);
    return query.getResultList();
}
```

#### Example 2: Named Query Definition and Usage
```java
// At entity class level
@Entity
@NamedQuery(name = "findByDept", 
    query = "SELECT e FROM Employee e WHERE e.department.name = :deptName")
public class Employee { ... }

// In client
TypedQuery<Employee> q = entityManager.createNamedQuery("findByDept", Employee.class);
q.setParameter("deptName", "Engineering");
List<Employee> results = q.getResultList();
```

#### Example 3: Pagination
```java
// Get page 3, 20 items per page (0-based)
int pageSize = 20;
int pageNum = 2; // 3rd page
int offset = pageNum * pageSize;

List<Employee> page = entityManager.createQuery(
    "SELECT e FROM Employee e ORDER BY e.name", Employee.class)
    .setFirstResult(offset)
    .setMaxResults(pageSize)
    .getResultList();
```

#### Example 4: FETCH JOIN (Prevent N+1 Problem)
```java
// Eager load author with books in single query
List<Book> books = entityManager.createQuery(
    "SELECT b FROM Book b JOIN FETCH b.author ORDER BY b.title",
    Book.class
).getResultList();
// Accessing book.getAuthor() now doesn't trigger additional query
```

#### Example 5: Bulk Update
```java
// Give all sales employees 10% raise
int updated = entityManager.createQuery(
    "UPDATE Employee e SET e.salary = e.salary * 1.1 " +
    "WHERE e.department.name = :dept")
    .setParameter("dept", "Sales")
    .executeUpdate();
System.out.println("Raised " + updated + " employees");
```

#### Example 6: Constructor Projection (DTO)
```java
public class EmployeeDTO {
    public EmployeeDTO(Long id, String name, double salary) {
        this.id = id;
        this.name = name;
        this.salary = salary;
    }
    // fields...
}

// Query returns DTO instances directly
List<EmployeeDTO> dtos = entityManager.createQuery(
    "SELECT new com.example.EmployeeDTO(e.id, e.name, e.salary) " +
    "FROM Employee e WHERE e.salary > :min",
    EmployeeDTO.class
).setParameter("min", 50000).getResultList();
```

#### Example 7: Aggregate Functions
```java
// Get salary statistics
public record SalaryStats(double average, double max, double min, long count) {}

List<Object[]> stats = entityManager.createQuery(
    "SELECT AVG(e.salary), MAX(e.salary), MIN(e.salary), COUNT(e) " +
    "FROM Employee e"
).getResultList();
Object[] row = stats.get(0);
double avg = (double) row[0];
double max = (double) row[1];
```

#### Example 8: Subquery in WHERE
```java
// Find employees earning more than department average
List<Employee> highEarners = entityManager.createQuery(
    "SELECT e FROM Employee e " +
    "WHERE e.salary > (SELECT AVG(e2.salary) FROM Employee e2 " +
    "WHERE e2.department = e.department)",
    Employee.class
).getResultList();
```

### Exam Traps

- **N+1 Query Problem:** Using regular JOIN instead of FETCH JOIN; each entity reference triggers a separate query. Use `JOIN FETCH` for eager loading.
- **getSingleResult() Exceptions:** Assumes exactly 1 result. Use getResultList() for 0+. getSingleResult() throws EntityNotFoundException (0) or NonUniqueResultException (2+).
- **Parameter Setting:** Must set ALL parameters or query fails. Positional parameters are 1-based (?1, ?2), not 0-based.
- **Pagination Ordering:** setFirstResult(0) is offset 0 (first result). Mixing ORDER BY with pagination can produce inconsistent ordering across pages.
- **Bulk Operations:** executeUpdate() works only on UPDATE/DELETE (and INSERT...SELECT). For INSERT, use persist().
- **Named Parameters vs Positional:** Always use named parameters (:name) over positional (?1) for clarity and maintainability.
- **Constructor Arity:** Constructor projection requires DTO constructor with exact matching types and parameter count.
- **Native Queries:** Lose ORM benefits; prone to SQL injection without parameterization. Use only when JPQL insufficient.

---

## 2. Entity Callbacks & Listeners (Chapter 14)

### Summary
Entity callbacks are lifecycle hooks that execute when an entity transitions between states (creation, loading, update, removal). The framework provides 8 callback annotations (@PrePersist, @PostPersist, @PreUpdate, @PostUpdate, @PreRemove, @PostRemove, @PostLoad). Callback methods must return void, take no parameters (or a single Object parameter in listeners), and throw no checked exceptions. External listeners can be registered via @EntityListeners, and inheritance rules apply (parent listeners called before child).

### Key Concepts

| Term | Definition | Timing | Parameters | Use Case |
|------|-----------|--------|-----------|----------|
| **@PrePersist** | Fires before entity inserted into DB | Before INSERT statement | None | Validate, set defaults (e.g., createdDate) |
| **@PostPersist** | Fires after entity inserted into DB | After INSERT commit | None | Log insertion, trigger events |
| **@PostLoad** | Fires after entity loaded from DB | After SELECT/find/refresh | None | Initialize derived fields, cache values |
| **@PreUpdate** | Fires before entity synchronized (UPDATE) | Before UPDATE statement | None | Audit changes, validate updates (e.g., lastModifiedDate) |
| **@PostUpdate** | Fires after entity synchronized (UPDATE) | After UPDATE commit | None | Log updates, invalidate caches |
| **@PreRemove** | Fires before entity removed | Before DELETE statement | None | Validate deletion, cascade cleanup |
| **@PostRemove** | Fires after entity removed | After DELETE commit | None | Log deletion, cleanup related data |
| **@EntityListeners** | External class(es) listening to callbacks | On any callback event | Entity instance as parameter | Centralized auditing, logging, business rules |

### Callback Rules

1. **Method signature:** Must return `void`
2. **Parameters:** 
   - For callbacks on entity class: NO parameters
   - For @EntityListeners class: Single Object parameter (the entity instance)
3. **Exceptions:** Must not throw checked exceptions; RuntimeExceptions allowed but may trigger rollback
4. **No-arg constructor:** Entity listener classes must have public no-argument constructor
5. **Inheritance:** Superclass listeners execute before subclass listeners; callbacks in entity class run last
6. **Exclusion:** Use @ExcludeDefaultListeners to skip default listeners; use @ExcludeSuperClassListeners to skip parent listeners

### Code Examples

#### Example 1: Basic Callbacks on Entity
```java
@Entity
@Table(name = "EMPLOYEE")
public class Employee {
    @Id private Long id;
    private String name;
    private Long createdDate;
    private Long lastModifiedDate;

    @PrePersist
    void beforeInsert() {
        createdDate = System.currentTimeMillis();
        lastModifiedDate = createdDate;
        System.out.println("About to insert employee: " + name);
    }

    @PostPersist
    void afterInsert() {
        System.out.println("Employee inserted with ID: " + id);
    }

    @PreUpdate
    void beforeUpdate() {
        lastModifiedDate = System.currentTimeMillis();
        System.out.println("Updating employee: " + name);
    }

    @PostUpdate
    void afterUpdate() {
        System.out.println("Employee updated");
    }

    @PostLoad
    void afterLoad() {
        System.out.println("Loaded employee: " + name);
    }

    @PreRemove
    void beforeRemove() {
        System.out.println("Deleting employee: " + name);
    }

    @PostRemove
    void afterRemove() {
        System.out.println("Employee deleted");
    }
}
```

#### Example 2: External Listener Class
```java
public class AuditListener {
    @PrePersist
    void onPrePersist(Object entity) {
        System.out.println("PrePersist: " + entity.getClass().getName());
    }

    @PostPersist
    void onPostPersist(Object entity) {
        System.out.println("PostPersist: " + entity.getClass().getName());
        // Could log to audit table, send events, etc.
    }

    @PreUpdate
    void onPreUpdate(Object entity) {
        System.out.println("PreUpdate: " + entity.getClass().getName());
    }

    @PostLoad
    void onPostLoad(Object entity) {
        if (entity instanceof Employee emp) {
            System.out.println("Loaded employee: " + emp.getName());
        }
    }
}

@Entity
@EntityListeners({AuditListener.class})
public class Employee {
    // Fields and callbacks...
}
```

#### Example 3: Multiple Listeners
```java
public class TimestampListener {
    @PrePersist
    @PreUpdate
    void updateTimestamp(Object entity) {
        if (entity instanceof Auditable) {
            ((Auditable) entity).setLastModified(System.currentTimeMillis());
        }
    }
}

public class NotificationListener {
    @PostPersist
    void notifyNewEntity(Object entity) {
        System.out.println("New entity created: " + entity.getClass().getSimpleName());
    }
}

@Entity
@EntityListeners({TimestampListener.class, NotificationListener.class})
public class Employee implements Auditable {
    // Fields...
}
```

#### Example 4: Listener with Inheritance
```java
@Entity
public class BaseEntity {
    @PostLoad
    void basePostLoad() {
        System.out.println("BaseEntity.postLoad called");
    }
}

@Entity
@EntityListeners({AuditListener.class})
public class Employee extends BaseEntity {
    @PostLoad
    void employeePostLoad() {
        System.out.println("Employee.postLoad called");
    }
}

// When Employee loaded: prints "BaseEntity.postLoad called" then "AuditListener.onPostLoad" then "Employee.postLoad called"
```

### Exam Traps

- **Callback Parameters:** Callbacks on entity must have NO parameters; listener callbacks take exactly ONE Object parameter (the entity).
- **Listener Constructor:** Listener class must have public no-arg constructor or container cannot instantiate it.
- **Return Type:** All callbacks must return void; any other return type is ignored or causes error.
- **Checked Exceptions:** Callbacks must not throw checked exceptions; unchecked (Runtime) exceptions allowed.
- **Listener Inheritance:** Parent class listeners execute BEFORE child class listeners; entity callbacks run LAST.
- **PreRemove vs PostRemove:** PreRemove fires before DELETE (can still access entity); PostRemove fires after.
- **Multiple Listeners:** Order of execution is based on order in @EntityListeners array.

---

## 3. EJB Security (Chapter 15)

### Summary
EJB security is declarative (annotations/XML) and roles-based. @DeclareRoles declares role names, @RolesAllowed restricts methods to specific roles, @PermitAll allows any authenticated user, @DenyAll blocks all access, @RunAs propagates a different role to called beans. Programmatic checks (isCallerInRole, getCallerPrincipal) provide fine-grained control. Security is container-managed at the method level for session beans.

### Key Concepts

| Annotation | Target | Purpose | Example |
|------------|--------|---------|---------|
| **@DeclareRoles** | Class | Declare role names used in the class | `@DeclareRoles({"admin", "user", "guest"})` |
| **@RolesAllowed** | Class or Method | Restrict access to specified roles | `@RolesAllowed({"admin", "supervisor"})` |
| **@PermitAll** | Class or Method | Allow any authenticated user | `@PermitAll` (default for unannotated methods) |
| **@DenyAll** | Class or Method | Block all access; use for testing | `@DenyAll` |
| **@RunAs** | Class or Method | Propagate a specific role when calling other beans | `@RunAs("admin")` |
| **isCallerInRole(String)** | EJBContext method | Programmatic: check if caller is in role | `if (ctx.isCallerInRole("admin")) { ... }` |
| **getCallerPrincipal()** | EJBContext method | Programmatic: get Principal (user identity) | `Principal p = ctx.getCallerPrincipal(); String name = p.getName();` |

### Declarative Security (Annotations)

#### Example 1: Role-Based Access Control
```java
@Stateless
@DeclareRoles({"admin", "student", "instructor"})
public class SchoolBean {

    @PermitAll
    public boolean isOpen() {
        return true; // Anyone can check if open
    }

    @RolesAllowed("admin")
    public void openSchool() {
        // Only admin can open
    }

    @RolesAllowed("admin")
    public void closeSchool() {
        // Only admin can close
    }

    @RolesAllowed({"admin", "janitor"})
    public void unlockServiceDoor() {
        // Admin or janitor
    }

    @RolesAllowed("student")
    public void enterSchool() {
        // Only students
    }

    @DenyAll
    public void secretMethod() {
        // No one can call (testing/placeholder)
    }
}
```

#### Example 2: Programmatic Security Check
```java
@Stateless
@DeclareRoles({"admin", "user"})
public class AccountBean {
    @Resource
    private SessionContext ctx;

    public void deleteAccount(String accountId) {
        // Programmatic check at finer boundary
        if (!ctx.isCallerInRole("admin")) {
            throw new SecurityException("Only admins can delete accounts");
        }
        // Delete account...
    }

    public void auditLog() {
        Principal p = ctx.getCallerPrincipal();
        String username = p.getName();
        System.out.println("Audit: User " + username + " accessed audit log");
    }
}
```

#### Example 3: Role Propagation with @RunAs
```java
@Stateless
@DeclareRoles({"user", "admin"})
public class UserServiceBean {
    @EJB private AdminServiceBean adminSvc;

    @RolesAllowed("user")
    @RunAs("admin")
    public void upgradeUserAccount(String userId) {
        // User calls this method, but it runs as 'admin'
        // When this method calls adminSvc, the admin role is propagated
        adminSvc.performAdminTask(); // adminSvc sees caller as 'admin'
    }
}

@Stateless
@DeclareRoles("admin")
public class AdminServiceBean {
    @RolesAllowed("admin")
    public void performAdminTask() {
        // Will succeed because @RunAs propagated admin role
    }
}
```

### XML-Based Security (ejb-jar.xml)

```xml
<ejb-jar>
    <assembly-descriptor>
        <!-- Declare security roles -->
        <security-role>
            <role-name>student</role-name>
        </security-role>
        <security-role>
            <role-name>instructor</role-name>
        </security-role>
        <security-role>
            <role-name>admin</role-name>
        </security-role>

        <!-- Define method permissions -->
        <method-permission>
            <role-name>student</role-name>
            <role-name>instructor</role-name>
            <method>
                <ejb-name>CourseBean</ejb-name>
                <method-name>getCourseInfo</method-name>
            </method>
        </method-permission>

        <method-permission>
            <role-name>admin</role-name>
            <method>
                <ejb-name>CourseBean</ejb-name>
                <method-name>deleteCourse</method-name>
            </method>
        </method-permission>

        <!-- Unchecked method (no security) -->
        <method-permission>
            <unchecked/>
            <method>
                <ejb-name>CourseBean</ejb-name>
                <method-name>searchCourses</method-name>
            </method>
        </method-permission>
    </assembly-descriptor>
</ejb-jar>
```

### Authentication & Realms

**Realm:** Collection of users and groups controlled by same authentication policy (e.g., database, LDAP, Kerberos)

**Methods:**
- Certificate-based
- Database (SQL query for credentials)
- LDAP directory service
- Kerberos
- Client certificate
- Custom

### Code Examples

#### Example 4: getCallerPrincipal() Usage
```java
@Stateless
public class AuditBean {
    @Resource
    private SessionContext ctx;

    public void logAction(String action) {
        try {
            Principal principal = ctx.getCallerPrincipal();
            String username = principal.getName();
            System.out.println(username + " performed action: " + action);
            // Log to database...
        } catch (Exception e) {
            System.out.println("Anonymous user performed action: " + action);
        }
    }
}
```

#### Example 5: Fine-Grained Programmatic Control
```java
@Stateless
@DeclareRoles({"user", "premium", "admin"})
public class ReportBean {
    @Resource
    private SessionContext ctx;

    public void viewReport(String reportId) {
        Principal caller = ctx.getCallerPrincipal();
        boolean isPremium = ctx.isCallerInRole("premium");
        boolean isAdmin = ctx.isCallerInRole("admin");

        if (!isPremium && !isAdmin) {
            // Regular user: show limited report
            System.out.println(caller.getName() + " viewing limited report " + reportId);
        } else {
            // Premium or admin: full report
            System.out.println(caller.getName() + " viewing full report " + reportId);
        }
    }
}
```

### Security at Different Layers

1. **Web Tier:** Servlets, JSP, JSF handle initial authentication (login forms, HTTP auth)
2. **EJB Tier:** Session beans enforce authorization via @RolesAllowed, @DenyAll
3. **Data Tier:** Database security, row-level security (vendor-dependent)
4. **Message-Driven Beans:** Detached from clients; queues handle authentication

### Exam Traps

- **@DeclareRoles Required:** Must declare roles before using @RolesAllowed or programmatic checks; declare at class level.
- **getCallerPrincipal():** Returns Principal representing the user; getName() returns username string.
- **isCallerInRole() String Arg:** Takes role name as String, not a constant; case-sensitive.
- **@RunAs Propagation:** Propagates role to called EJBs; called bean must declare the role.
- **@PermitAll Default:** Methods without @RolesAllowed or @DenyAll default to @PermitAll (any authenticated user).
- **XML vs Annotations:** Prefer annotations; XML in ejb-jar.xml is alternative, not combined.
- **Unchecked Permission:** <unchecked/> in XML means no security check (dangerous; use sparingly).

---

## 4. JNDI, ENC, Injection (Chapter 16)

### Summary
JNDI (Java Naming and Directory Interface) provides a directory service for looking up resources. ENC (Enterprise Naming Context) is a private registry per EJB component accessible via java:comp/env, storing references to EJBs, data sources, persistence units, etc. Dependency injection (@EJB, @Resource, @PersistenceContext, @PersistenceUnit) automatically binds resources, eliminating manual JNDI lookups. Global JNDI names (java:global, java:app, java:module) enable remote access and cross-application lookups.

### Key Concepts

| Term | Scope | Access | Use Case |
|------|-------|--------|----------|
| **ENC (java:comp/env)** | Single component | Internal lookups only | Component-local resource bindings |
| **java:global** | Server-wide | Remote clients + local | Global EJB, exported service names |
| **java:app** | Application (EAR) | Within EAR only | App-level shared resources |
| **java:module** | Module (JAR/WAR) | Within module only | Module-level resource sharing |
| **java:/** | Server JVM only | Not remote | Vendor-specific (Wildfly-only) names |
| **InitialContext** | Entry point | JNDI service | Start point for naming lookups |
| **Context** | Interface | JNDI service | Holds name-to-object bindings |
| **Binding** | Name-to-Object mapping | JNDI service | Associates name with resource reference |
| **@EJB** | Injection | Declarative | Reference to another EJB bean |
| **@Resource** | Injection | Declarative | Data source, JMS, connection factory, etc. |
| **@PersistenceContext** | Injection | Declarative | EntityManager reference (transaction-scoped or extended) |
| **@PersistenceUnit** | Injection | Declarative | EntityManagerFactory reference |

### Injection Annotations (Preferred)

#### @EJB Injection
```java
@Stateless
public class TravelAgentBean {
    // Injection into field
    @EJB
    private ProcessPaymentLocal payment;

    // Injection via setter
    @EJB
    public void setFlightLookup(FlightLookupLocal flight) {
        this.flight = flight;
    }

    public void bookTrip() {
        // 'payment' automatically injected by container
        payment.processPayment(...);
    }
}
```

**@EJB Attributes:**
- `name()` - ENC name (default: fully qualified class name + field name)
- `beanInterface()` - Local or remote interface class
- `beanName()` - Target bean name (if ambiguous)
- `mappedName()` - Vendor-specific global JNDI name

#### @Resource Injection
```java
@Stateless
public class DataAccessBean {
    // Inject data source
    @Resource(name = "jdbc/OracleDB", type = javax.sql.DataSource.class)
    private DataSource dataSource;

    // Inject JMS queue factory
    @Resource
    private javax.jms.QueueConnectionFactory queueFactory;

    // Inject session context (for security, transactions)
    @Resource
    private SessionContext ctx;

    public void query() {
        try (Connection conn = dataSource.getConnection()) {
            // Use connection...
        }
    }
}
```

**@Resource Attributes:**
- `name()` - ENC name
- `type()` - Resource class (javax.sql.DataSource, etc.)
- `authenticationType()` - CONTAINER or APPLICATION
- `shareable()` - true (default) or false
- `mappedName()` - Vendor-specific JNDI name

#### @PersistenceContext Injection
```java
@Stateless
public class EmployeeService {
    // Inject transaction-scoped EntityManager
    @PersistenceContext
    private EntityManager em;

    // Inject extended EntityManager (for SFSB)
    @PersistenceContext(type = PersistenceContextType.EXTENDED)
    private EntityManager extendedEm;

    public Employee findEmployee(Long id) {
        return em.find(Employee.class, id);
    }
}
```

**@PersistenceContext Attributes:**
- `name()` - ENC name
- `unitName()` - Persistence unit name from persistence.xml
- `type()` - TRANSACTION (default, auto-close) or EXTENDED (SFSB only)
- `properties()` - Vendor-specific properties

#### @PersistenceUnit Injection
```java
@Stateless
public class EntityManagerFactoryUser {
    @PersistenceUnit(unitName = "TravelUnit")
    private EntityManagerFactory emf;

    public void useFactory() {
        EntityManager em = emf.createEntityManager();
        // Manual EntityManager management
        try {
            // Use em...
        } finally {
            em.close();
        }
    }
}
```

### Manual JNDI Lookup (Alternative to Injection)

```java
@Stateless
public class LookupExample {
    @Resource
    private SessionContext ctx;

    public void exampleLookups() {
        // Lookup within ENC
        ProcessPaymentLocal payment = (ProcessPaymentLocal) ctx.lookup("ejb/ProcessPayment");

        // Lookup with InitialContext
        Context ictx = new InitialContext();
        ProcessPaymentRemote remotePayment = (ProcessPaymentRemote) ictx.lookup(
            "java:global/TravelApp/PaymentBean!com.titan.processpayment.ProcessPaymentRemote"
        );
    }
}
```

### ENC Entry Binding Examples

```java
@Stateless
@EJB(name = "ejb/Payment", 
     beanInterface = ProcessPaymentLocal.class,
     beanName = "ProcessPaymentBean")
public class TravelAgentBean {
    // Registers ProcessPayment under java:comp/env/ejb/Payment
    // Default name without explicit name: 
    // java:comp/env/com.titan.travelagent.TravelAgentBean/payment
}
```

### Dependency Injection from XML (ejb-jar.xml)

```xml
<ejb-jar>
    <enterprise-beans>
        <session>
            <ejb-name>TravelAgentBean</ejb-name>
            <ejb-class>com.titan.TravelAgentBean</ejb-class>
            
            <!-- EJB reference -->
            <ejb-ref>
                <ejb-ref-name>ejb/ProcessPayment</ejb-ref-name>
                <ejb-ref-type>Session</ejb-ref-type>
                <home>com.titan.processpayment.ProcessPaymentHome</home>
                <remote>com.titan.processpayment.ProcessPaymentRemote</remote>
                <ejb-link>ProcessPaymentBean</ejb-link>
            </ejb-ref>

            <!-- Resource reference -->
            <resource-ref>
                <res-ref-name>jdbc/OracleDB</res-ref-name>
                <res-type>javax.sql.DataSource</res-type>
                <res-auth>Container</res-auth>
                <res-sharing-scope>Shareable</res-sharing-scope>
            </resource-ref>

            <!-- Environment entry (configuration) -->
            <env-entry>
                <env-entry-name>minCheckNumber</env-entry-name>
                <env-entry-type>java.lang.Integer</env-entry-type>
                <env-entry-value>2000</env-entry-value>
                <injection-target>
                    <injection-target-class>com.titan.TravelAgentBean</injection-target-class>
                    <injection-target-name>minCheckNumber</injection-target-name>
                </injection-target>
            </env-entry>
        </session>
    </enterprise-beans>
</ejb-jar>
```

### Global JNDI Naming Syntax

```
java:global[/app-name]/module-name/bean-name[!FQN]
java:app/module-name/bean-name[!FQN]         (within EAR)
java:module/bean-name[!FQN]                  (within module)
java:comp/env/...                             (component ENC)
```

**Example:**
```
java:global/TravelApp/PaymentModule/ProcessPaymentBean!com.titan.processpayment.ProcessPaymentRemote
java:app/PaymentModule/ProcessPaymentBean         (shorter, within app)
java:module/ProcessPaymentBean                    (within module)
java:comp/env/ejb/ProcessPayment                  (component private)
```

### Code Examples

#### Example 1: Injection with Multiple Beans
```java
@Stateless
public class FlightBookingBean {
    @EJB private FlightLookupLocal flightLookup;
    @EJB private CabinLookupLocal cabinLookup;
    @EJB private ReservationLocal reservation;
    @Resource(name="jdbc/BookingDB") private DataSource bookingDB;

    public void bookFlight() {
        List<Flight> flights = flightLookup.findFlights(...);
        List<Cabin> cabins = cabinLookup.findAvailable(...);
        reservation.create(...);
    }
}
```

#### Example 2: PersistenceContext Injection
```java
@Stateless
public class EmployeeService {
    @PersistenceContext(unitName = "EmployeeUnit")
    private EntityManager em;

    public Employee createEmployee(String name, double salary) {
        Employee e = new Employee();
        e.setName(name);
        e.setSalary(salary);
        em.persist(e);
        return e;
    }

    public Employee findById(Long id) {
        return em.find(Employee.class, id);
    }
}
```

#### Example 3: Remote Client JNDI Lookup
```java
public class RemoteClient {
    public static void main(String[] args) throws Exception {
        Properties props = new Properties();
        props.put(Context.INITIAL_CONTEXT_FACTORY, 
            "org.jboss.naming.remote.client.InitialContextFactory");
        props.put(Context.PROVIDER_URL, "remote://localhost:4447");
        props.put(Context.SECURITY_PRINCIPAL, "username");
        props.put(Context.SECURITY_CREDENTIALS, "password");

        Context ctx = new InitialContext(props);
        ProcessPaymentRemote payment = (ProcessPaymentRemote) ctx.lookup(
            "java:global/TravelApp/PaymentModule/ProcessPaymentBean!" +
            "com.titan.processpayment.ProcessPaymentRemote"
        );

        payment.processPayment(1000.0);
    }
}
```

### Exam Traps

- **Injection Preferred:** Always use @EJB, @Resource, @PersistenceContext over manual JNDI lookups.
- **ENC Names:** Injection creates ENC entry automatically; if no name() attribute, defaults to FQN + field name.
- **PersistenceContext Type:** TRANSACTION (default) closes after method; EXTENDED (SFSB only) lives across methods.
- **Remote vs Local:** @EJB requires explicit interface declaration; auto-discovery works within same JAR.
- **Shareable DataSource:** default true; set false for exclusive connection pool.
- **Global JNDI Syntax:** java:global requires app/module/bean name; vendor-specific mappedName() alternative.

---

## 5. Transactions (Chapter 17)

### Summary
Transactions ensure ACID properties (Atomicity, Consistency, Isolation, Durability). EJB supports Container-Managed Transactions (CMT, default) via 6 transaction attributes (REQUIRED, REQUIRES_NEW, SUPPORTS, NOT_SUPPORTED, MANDATORY, NEVER). Each attribute defines whether a method participates in an existing transaction, creates a new one, or rejects/ignores transactions. System exceptions (unchecked) cause automatic rollback; application exceptions don't unless marked @ApplicationException(rollback=true). BMT (Bean-Managed) uses UserTransaction API (begin, commit, rollback, setRollbackOnly) for manual control.

### ACID Properties

| Property | Definition | Exam Focus |
|----------|-----------|-----------|
| **Atomicity** | Transaction executes completely or not at all; no partial updates | All-or-nothing: if payment fails, reservation rolls back |
| **Consistency** | Data integrity constraints maintained after transaction | Database state remains valid; foreign keys enforced |
| **Isolation** | Concurrent transactions don't interfere; each sees consistent snapshot | Level of isolation affects performance (dirty read, phantom read, etc.) |
| **Durability** | Committed changes persist even if system crashes | Changes written to durable storage (disk), not just memory |

**Quiz 4 Note:** Each ACID property asked separately; know definitions and examples.

### 6. Transaction Attributes Reference Table

**THE CRITICAL TABLE FOR EXAM:**

| Attribute | Caller Has TX | Caller No TX | Method Runs In | Exception Handling | Use Case |
|-----------|---|---|---|---|---|
| **REQUIRED** (default) | Uses caller's TX | Creates new TX | Caller's TX or new | Rollback on unchecked exception | Default for business methods; participates or starts |
| **REQUIRES_NEW** | Suspends caller TX, creates new | Creates new TX | Own TX (isolated) | Rollback on unchecked exception | Nested transaction; independent scope; logging even if parent fails |
| **SUPPORTS** | Uses caller's TX | None (no TX) | Caller's TX or none | Rollback on unchecked exception | Optional transaction; methods that may/may not need TX |
| **NOT_SUPPORTED** | Suspends caller TX | None (no TX) | No TX | No automatic rollback | Read-only queries; logging; methods that must run outside TX |
| **MANDATORY** | Uses caller's TX | Throws exception | Caller's TX | Rollback on unchecked exception | Enforces caller must have TX; fails if no TX |
| **NEVER** | Throws exception | None (no TX) | No TX | No automatic rollback | Enforces method must NOT run in TX; fails if TX exists |

**Detailed Scenarios:**

**REQUIRED (Default)**
```
Scenario 1: Caller has TX
  → Method uses caller's TX
  → Commit/rollback with caller
  → Example: paymentService.process() calls reservationService.save() [both REQUIRED]

Scenario 2: Caller has no TX
  → Container creates new TX for method
  → Method's TX commits/rolls back independently
  → Example: client (no TX) calls paymentService.process() [REQUIRED creates new TX]

Scenario 3: Exception
  → Unchecked (RuntimeException) → auto-rollback
  → Checked (Exception) → no rollback unless @ApplicationException(rollback=true)
```

**REQUIRES_NEW**
```
Scenario 1: Caller has TX
  → Container suspends caller's TX
  → Creates new isolated TX for method
  → Caller's TX commits/rolls back independently of method's TX
  → Example: if auditLog() fails, parent transaction still commits

Scenario 2: Caller has no TX
  → Container creates new TX for method
  → Method's TX commits/rolls back independently
  → Example: client (no TX) calls auditLog() [REQUIRES_NEW creates new TX]

Scenario 3: Use Case
  → Logging/auditing must succeed even if business transaction fails
  → Credit card charge must complete independently of account update failure
```

**SUPPORTS**
```
Scenario 1: Caller has TX
  → Method uses caller's TX
  → Example: helper method called from transactional service uses same TX

Scenario 2: Caller has no TX
  → Method runs without TX
  → No transaction context
  → Example: read-only lookup method called from non-transactional client

Scenario 3: Flexibility
  → Method works with or without TX; does not require one
  → Useful for methods called from multiple contexts
```

**NOT_SUPPORTED**
```
Scenario 1: Caller has TX
  → Container suspends caller's TX
  → Method runs WITHOUT TX
  → Caller's TX continues after method returns
  → Example: logging/monitoring that must not affect business transaction

Scenario 2: Caller has no TX
  → Method runs without TX
  → Example: read-only query called from non-transactional client

Scenario 3: Use Case
  → Methods that must execute outside of transaction context
  → Logging, analytics, read-only reporting
```

**MANDATORY**
```
Scenario 1: Caller has TX
  → Method uses caller's TX
  → Example: critical database operation requires caller to manage TX

Scenario 2: Caller has no TX
  → Container throws TransactionRequiredException
  → Method fails with exception
  → Example: payment processor requires buyer to initiate TX

Scenario 3: Use Case
  → Enforce that method is only called from transactional context
  → Critical operations that must not run standalone
```

**NEVER**
```
Scenario 1: Caller has TX
  → Container throws EJBException (or similar)
  → Method fails; TX rolls back
  → Example: method incompatible with transactions

Scenario 2: Caller has no TX
  → Method runs without TX
  → Example: utility/logging that must never be transactional

Scenario 3: Use Case
  → Enforce that method never runs within transaction
  → Rare; used for non-transactional operations that must fail if called from TX context
```

---

### Container-Managed Transactions (CMT)

```java
@Stateless
@TransactionManagement(TransactionManagementType.CONTAINER)  // Default; often omitted
public class PaymentServiceBean {

    @TransactionAttribute(TransactionAttributeType.REQUIRED)  // Default
    public void processPayment(Payment p) {
        // Uses caller's TX or creates new
    }

    @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
    public void logTransaction(String message) {
        // Always runs in own TX; logs even if parent fails
    }

    @TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
    public void readAnalytics() {
        // Runs outside TX; read-only
    }

    @TransactionAttribute(TransactionAttributeType.MANDATORY)
    public void criticalUpdate(String data) {
        // Caller MUST have TX
    }

    @TransactionAttribute(TransactionAttributeType.SUPPORTS)
    public void flexibleOperation() {
        // Works with or without TX
    }

    @TransactionAttribute(TransactionAttributeType.NEVER)
    public void nonTransactionalOnly() {
        // Must NOT be in TX; fails if called from TX
    }
}
```

### Bean-Managed Transactions (BMT)

```java
@Stateless
@TransactionManagement(TransactionManagementType.BEAN)
public class ManualTransactionBean {
    @Resource
    private SessionContext ctx;

    public void manualTransaction() {
        UserTransaction tx = ctx.getUserTransaction();
        try {
            tx.begin();
            // Business logic...
            doSomething();
            tx.commit();
        } catch (Exception e) {
            try {
                tx.rollback();
            } catch (SystemException se) {
                // Rollback failed
            }
        }
    }

    public void setRollbackExample() throws Exception {
        UserTransaction tx = ctx.getUserTransaction();
        tx.begin();
        try {
            doWork();
            if (someErrorCondition) {
                ctx.setRollbackOnly();  // Mark TX for rollback but continue
            }
            tx.commit();  // Will rollback because setRollbackOnly() called
        } catch (Exception e) {
            tx.rollback();
        }
    }
}
```

### UserTransaction API

| Method | Purpose | Throws |
|--------|---------|--------|
| `begin()` | Start new transaction | NotSupportedException, SystemException |
| `commit()` | Commit transaction | RollbackException, HeuristicMixedException, HeuristicRollbackException, SystemException |
| `rollback()` | Rollback transaction | IllegalStateException, SystemException |
| `getStatus()` | Get TX status (Status.STATUS_ACTIVE, etc.) | SystemException |
| `setRollbackOnly()` | Mark TX for rollback but continue | IllegalStateException, SystemException |

### Exception Handling

**System Exceptions (Unchecked)** → Auto-rollback
```java
@Stateless
public class PaymentService {
    @TransactionAttribute(REQUIRED)
    public void processPayment() {
        try {
            charge(); // May throw RuntimeException
        } catch (RuntimeException e) {
            // TX will rollback automatically
            throw e;
        }
    }
}
```

**Application Exceptions (Checked)** → NO auto-rollback (unless marked)
```java
@Stateless
public class PaymentService {
    @TransactionAttribute(REQUIRED)
    public void processPayment() throws PaymentException {
        charge();  // Throws PaymentException (checked)
        // TX will NOT rollback; exception thrown to caller
        // Caller can retry or handle
    }
}

// Mark application exception for rollback
@ApplicationException(rollback = true)
public class CriticalPaymentException extends Exception {
    // This checked exception WILL cause rollback
}
```

### Session Synchronization (SFSB)

For Stateful Session Beans, lifecycle callbacks:

```java
@Stateful
public class ShoppingCartBean implements SessionSynchronization {

    @AfterBegin
    void onTxStart() {
        System.out.println("Transaction started");
        // Called after container starts TX
    }

    @BeforeCompletion
    void onTxPrepare() {
        System.out.println("Transaction about to commit");
        // Called before commit; can modify state; should not throw exceptions
    }

    @AfterCompletion(committed = true)
    void onTxSuccess() {
        System.out.println("Transaction committed");
        // Called after successful commit
    }

    @AfterCompletion(committed = false)
    void onTxFailure() {
        System.out.println("Transaction rolled back");
        // Called after rollback
    }
}
```

### Code Examples

#### Example 1: Transaction Propagation (REQUIRED)
```java
@Stateless
public class ReservationService {
    @EJB private PaymentService paymentSvc;

    @TransactionAttribute(REQUIRED)
    public void bookCabin(long cabinId, double price) {
        // Method runs in TX
        createReservation(cabinId);
        paymentSvc.process(price);  // Shares same TX
        // Both succeed or both rollback
    }
}

@Stateless
public class PaymentService {
    @TransactionAttribute(REQUIRED)  // Uses caller's TX
    public void process(double amount) {
        chargeCard(amount);
        // If exception here, whole reservation rolls back
    }
}
```

#### Example 2: Independent Transaction (REQUIRES_NEW)
```java
@Stateless
public class ReservationService {
    @EJB private AuditService auditSvc;

    @TransactionAttribute(REQUIRED)
    public void bookCabin(long cabinId) {
        createReservation(cabinId);
        auditSvc.log("Cabin " + cabinId + " booked");  // Separate TX
        // Audit logged even if booking fails
    }
}

@Stateless
public class AuditService {
    @TransactionAttribute(REQUIRES_NEW)  // Own isolated TX
    public void log(String message) {
        insertAuditRecord(message);
        // Commits independent of caller
    }
}
```

#### Example 3: Optional Transaction (SUPPORTS)
```java
@Stateless
public class EmployeeService {
    @TransactionAttribute(SUPPORTS)
    public Employee findById(long id) {
        // Works with or without TX
        // If called from TX context, uses TX; if not, runs without
        return em.find(Employee.class, id);
    }
}
```

#### Example 4: Enforce Transaction (MANDATORY)
```java
@Stateless
public class TransferService {
    @TransactionAttribute(MANDATORY)
    public void transfer(Account from, Account to, double amount) {
        // MUST be called from TX context; throws exception if not
        from.debit(amount);
        to.credit(amount);
    }
}

// Caller MUST manage TX
UserTransaction tx = ctx.getUserTransaction();
tx.begin();
try {
    transferSvc.transfer(acct1, acct2, 1000);
    tx.commit();
} catch (Exception e) {
    tx.rollback();
}
```

#### Example 5: User Transaction API (Bean-Managed)
```java
@Stateless
@TransactionManagement(BEAN)
public class ManualPaymentService {
    @Resource
    private SessionContext ctx;
    @Resource
    private DataSource dataSource;

    public void processMultiplePayments(List<Payment> payments) throws Exception {
        UserTransaction tx = ctx.getUserTransaction();
        tx.begin();
        try {
            for (Payment p : payments) {
                processOne(p);
            }
            tx.commit();
        } catch (Exception e) {
            tx.rollback();
            throw e;
        }
    }
}
```

### Exam Traps

- **REQUIRED is Default:** Methods without @TransactionAttribute use REQUIRED (participates or creates TX).
- **REQUIRES_NEW Suspends:** Caller's TX is suspended; method runs in isolated TX; caller resumes after.
- **System vs Application Exceptions:** Unchecked (RuntimeException) → auto-rollback; checked → no rollback unless @ApplicationException(rollback=true).
- **MANDATORY Enforces TX:** Method fails (throws TransactionRequiredException) if no caller TX.
- **NEVER Prevents TX:** Method fails if called from TX context; ensures method runs non-transactional.
- **setRollbackOnly():** Marks TX for rollback but doesn't stop method; continues and commits/rolls back when TX boundary reached.
- **Transaction Scope:** All EJBs called within same method share same TX unless method has REQUIRES_NEW.
- **Quiz 4 Distinctions:** Know how each attribute behaves with/without caller TX; know exception propagation.

---

## 7. Java EE & EJB Design (Chapter 18)

### Summary
Java EE applications follow multi-tiered architecture: Web Tier (JSP, JSF, Servlets), Business Tier (Session Beans), and Data/EIS Tier (JPA Entities, Databases). Best practices: use Session Facades (stateless session beans wrapping entities), Data Transfer Objects (DTOs) for cross-network boundaries, local interfaces for efficiency, entity beans as domain model (not EJB 2.0 entity beans), lazy loading/eager loading strategies, and separation of concerns. EAR (Enterprise Archive) packages WARs (web) and JARs (EJB modules) with application.xml descriptor.

### Multi-Tiered Architecture

```
┌─────────────────────────────────┐
│   Client Tier                   │
│  (Web Browser, Desktop App)     │
└──────────────┬──────────────────┘
               │ HTTP/SOAP
┌──────────────▼──────────────────┐
│   Web Tier                      │
│  (JSF, JSP, Servlets)          │
│   Handles presentation logic    │
└──────────────┬──────────────────┘
               │ Local/Remote calls
┌──────────────▼──────────────────┐
│   Business/Application Tier     │
│  (Session Beans, DTOs)         │
│   Contains business logic       │
└──────────────┬──────────────────┘
               │ JDBC/JPA
┌──────────────▼──────────────────┐
│   Data/EIS Tier                 │
│  (JPA Entities, Databases)      │
│   Persistent storage            │
└─────────────────────────────────┘
```

### Key Design Patterns

#### 1. Session Facade Pattern
```java
// Facade: Single entry point for business operations
@Stateless
public class TravelAgencyFacade {
    @EJB private CabinSearchBean cabinSearch;
    @EJB private BookingBean booking;
    @EJB private PaymentBean payment;

    @TransactionAttribute(REQUIRED)
    public Booking bookCruise(long customerId, long cruiseId, long cabinId, double price) {
        // Coordinates multiple operations
        Customer cust = findCustomer(customerId);
        Cabin cabin = cabinSearch.findCabin(cabinId);
        Cruise cruise = findCruise(cruiseId);

        // All in same TX
        Booking b = booking.create(cust, cruise, cabin);
        payment.process(cust, price);
        b.setConfirmed(true);
        return b;
    }
}
```

#### 2. Data Transfer Object (DTO) Pattern
```java
// DTO: Lightweight object for cross-network boundaries
public class CabinDTO implements Serializable {
    private long id;
    private String name;
    private int deckLevel;
    private double price;

    // Constructors, getters, setters...
}

// Session bean converts entity to DTO
@Stateless
public class CabinService {
    @PersistenceContext private EntityManager em;

    public CabinDTO findCabin(long id) {
        Cabin entity = em.find(Cabin.class, id);
        return new CabinDTO(entity.getId(), entity.getName(), 
                           entity.getDeckLevel(), entity.getPrice());
    }
}
```

#### 3. Business Delegate (Wrapper)
```java
// Wrapper around EJB to handle lookup, exception translation
public class CabinBusinessDelegate {
    private CabinServiceLocal cabinSvc;

    public CabinDTO findCabin(long id) {
        try {
            return cabinSvc.getCabin(id);
        } catch (EJBException e) {
            throw new BusinessException("Cabin lookup failed", e);
        }
    }
}
```

#### 4. Dependency Injection for Loose Coupling
```java
// Inject dependencies; avoids tight coupling, aids testing
@Stateless
public class PaymentService {
    @EJB private AuditService auditSvc;
    @Resource private DataSource dataSource;
    @PersistenceContext private EntityManager em;

    // Dependencies injected; not hardcoded
}
```

### Application Deployment

#### EAR (Enterprise Archive) Structure
```
TravelApp.ear/
  META-INF/
    application.xml
    MANIFEST.MF
  TravelWeb.war/
    WEB-INF/
      web.xml
      classes/
      lib/
    index.jsp
    ...
  TravelBeans.jar/
    META-INF/
      ejb-jar.xml
    com/titan/.../*.class
  lib/
    common-lib.jar
```

#### application.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<application xmlns="http://java.sun.com/xml/ns/j2ee" version="1.4">
    <display-name>Travel Agency Application</display-name>
    <description>Complete travel booking system</description>

    <module>
        <web>
            <web-uri>TravelWeb.war</web-uri>
            <context-root>/travel</context-root>
        </web>
    </module>

    <module>
        <ejb>TravelBeans.jar</ejb>
    </module>

    <security-role>
        <role-name>Administrator</role-name>
    </security-role>
    <security-role>
        <role-name>Customer</role-name>
    </security-role>
</application>
```

### Entity vs Session Beans

| Aspect | Session Bean | Entity Bean (JPA POJO) |
|--------|-------------|----------------------|
| **Purpose** | Business logic, services | Persistent data representation |
| **Lifecycle** | Short-lived (per request/conversation) | Persisted in database |
| **Usage** | Called by clients or other EJBs | Used within session beans or DAOs |
| **Relationships** | With other EJBs | With other entities (1-1, 1-n, n-n) |
| **Transactionality** | Explicit TX management | Implicit (via EntityManager) |
| **Local vs Remote** | Both supported | Typically local (accessed by business tier) |

### Best Practices

1. **Separate Concerns:**
   - Web tier: presentation logic only
   - Business tier: rules, validation, orchestration
   - Data tier: persistence, relationships

2. **Use Session Facade:**
   - Single entry point for operations
   - Manages TX boundaries
   - Coordinates multiple entities

3. **Detached Entities / DTOs:**
   - Don't pass attached entities across network
   - Use lightweight DTOs for serialization
   - Merge detached entities on return

4. **Eager vs Lazy Loading:**
   - Eager: Load related entities immediately (FETCH JOIN)
   - Lazy: Load on access (may cause N+1 problem)

5. **Local Interfaces for Efficiency:**
   - Local references don't serialize; faster
   - Use remote only when accessing from different JVM

6. **Exception Handling:**
   - Translate checked exceptions to application exceptions
   - Provide meaningful error messages
   - Log appropriately

### Code Example: Complete Booking Scenario

```java
// Entity: Domain model
@Entity
@Table(name = "CABIN")
public class Cabin {
    @Id private long id;
    private String name;
    private double price;
    @ManyToOne private Cruise cruise;
    // Getters, setters...
}

// DTO: Transfer object
public class CabinDTO implements Serializable {
    private long id;
    private String name;
    private double price;
    // Constructors, getters, setters...
}

// Service: Session bean (business logic)
@Stateless
public class CabinService {
    @PersistenceContext private EntityManager em;
    @EJB private AuditService auditSvc;

    @TransactionAttribute(REQUIRED)
    public CabinDTO bookCabin(long cabinId, long customerId) {
        Cabin cabin = em.find(Cabin.class, cabinId);
        if (cabin == null) throw new EntityNotFoundException();

        cabin.setBooked(true);
        em.merge(cabin);  // Update in TX

        auditSvc.log("Cabin " + cabinId + " booked by customer " + customerId);
        return convertToDTO(cabin);
    }

    private CabinDTO convertToDTO(Cabin cabin) {
        return new CabinDTO(cabin.getId(), cabin.getName(), cabin.getPrice());
    }
}

// Facade: Coordinates multiple services
@Stateless
public class TravelFacade {
    @EJB private CabinService cabinSvc;
    @EJB private PaymentService paymentSvc;

    @TransactionAttribute(REQUIRED)
    public BookingDTO bookTrip(long cabinId, long customerId, double amount) {
        CabinDTO cabin = cabinSvc.bookCabin(cabinId, customerId);
        paymentSvc.chargeCard(customerId, amount);
        return new BookingDTO(cabin, amount);
    }
}
```

---

## 8. Flashcard Deck

### JPQL & Queries (12 cards)

**Card 1**
- **Q:** What is JPQL and how does it differ from SQL?
- **A:** JPQL (Java Persistence Query Language) is a platform-independent language that operates on the abstract persistence schema of entities, not the underlying database. SQL is database-specific and operates directly on tables. JPQL abstracts the database and is more portable.
- **Bloom:** Understand
- **Source:** EJB12

**Card 2**
- **Q:** Name three ways to create a Query object from EntityManager.
- **A:** (1) createQuery(String qlString) for untyped Query, (2) createQuery(String, Class<T>) for TypedQuery<T>, (3) createNamedQuery(String name) to execute pre-defined queries.
- **Bloom:** Remember
- **Source:** EJB12

**Card 3**
- **Q:** What is the difference between getSingleResult() and getResultList()?
- **A:** getSingleResult() expects exactly 1 result and throws EntityNotFoundException (0 results) or NonUniqueResultException (2+). getResultList() returns a List (empty if no results) and never throws. Use getSingleResult() for unique lookups; getResultList() for searches.
- **Bloom:** Understand
- **Source:** EJB12

**Card 4**
- **Q:** Explain the N+1 query problem and how FETCH JOIN solves it.
- **A:** N+1 problem: regular JOIN loads parent entity, then 1 query per related entity (N queries). Solution: use FETCH JOIN (JOIN FETCH b.author) to eagerly load related entities in the initial query, reducing to 1 total query.
- **Bloom:** Understand
- **Source:** EJB12

**Card 5**
- **Q:** What is a named parameter and how is it preferred over positional parameters?
- **A:** Named parameter uses :name syntax (e.g., :authorId) and setParameter("authorId", value). Positional uses ?n (e.g., ?1) and setParameter(1, value). Named parameters are preferred because they're self-documenting and order-independent.
- **Bloom:** Understand
- **Source:** EJB12

**Card 6**
- **Q:** Write a JPQL query that finds all books by a given author using FETCH JOIN to prevent N+1.
- **A:** `SELECT b FROM Book b JOIN FETCH b.author a WHERE a.name = :authorName ORDER BY b.title`
- **Bloom:** Apply
- **Source:** EJB12

**Card 7**
- **Q:** What is the purpose of constructor projection in JPQL and provide an example.
- **A:** Constructor projection creates DTOs directly from query results without loading full entities. Example: `SELECT new com.x.CabinDTO(c.id, c.name, c.price) FROM Cabin c WHERE c.price > :minPrice`. Requires DTO constructor with matching signature.
- **Bloom:** Understand
- **Source:** EJB12

**Card 8**
- **Q:** How do you implement pagination in JPQL? What is the 0-based offset?
- **A:** Use setFirstResult(offset) and setMaxResults(pageSize). Example: `query.setFirstResult(20).setMaxResults(10).getResultList()` retrieves page 3 (10 items per page). firstResult is 0-based; offset 20 = 3rd page.
- **Bloom:** Apply
- **Source:** EJB12

**Card 9**
- **Q:** What does executeUpdate() do and what does it return?
- **A:** executeUpdate() executes bulk UPDATE, DELETE, or INSERT...SELECT statements. Returns int count of affected rows. Only for DML; use persist() for INSERT of new entities.
- **Bloom:** Remember
- **Source:** EJB12

**Card 10**
- **Q:** What is the Criteria API and how is it different from JPQL string-based queries?
- **A:** Criteria API is a type-safe, programmatic way to build queries using CriteriaBuilder, CriteriaQuery, Root, Predicate objects. Unlike JPQL strings, it provides compile-time type checking and IDE support but is more verbose.
- **Bloom:** Understand
- **Source:** EJB12

**Card 11**
- **Q:** Write a JPQL query with GROUP BY and HAVING to find authors with more than 5 books.
- **A:** `SELECT a, COUNT(b) FROM Author a LEFT JOIN a.books b GROUP BY a HAVING COUNT(b) > 5 ORDER BY COUNT(b) DESC`
- **Bloom:** Apply
- **Source:** EJB12

**Card 12**
- **Q:** What is a bulk update in JPQL and provide an example of giving all sales employees a 10% raise.
- **A:** Bulk update (executeUpdate()) modifies multiple rows in one query. Example: `int raised = em.createQuery("UPDATE Employee e SET e.salary = e.salary * 1.1 WHERE e.department.name = :dept").setParameter("dept", "Sales").executeUpdate();`
- **Bloom:** Apply
- **Source:** EJB12

---

### Entity Callbacks (8 cards)

**Card 13**
- **Q:** List the 8 entity callback annotations and when they fire.
- **A:** (1) @PrePersist (before INSERT), (2) @PostPersist (after INSERT), (3) @PostLoad (after SELECT/find), (4) @PreUpdate (before UPDATE), (5) @PostUpdate (after UPDATE), (6) @PreRemove (before DELETE), (7) @PostRemove (after DELETE). One more: @EntityListeners (external listener).
- **Bloom:** Remember
- **Source:** EJB14

**Card 14**
- **Q:** What are the constraints on callback method signatures in entity classes?
- **A:** (1) Must return void, (2) take NO parameters, (3) throw no checked exceptions. Method name can be anything (unlike EJB 2.0 fixed names).
- **Bloom:** Remember
- **Source:** EJB14

**Card 15**
- **Q:** How do entity listener classes differ from entity callbacks in method signature?
- **A:** Listener methods take exactly ONE Object parameter (the entity instance), while entity callback methods take NO parameters. Both must return void and throw no checked exceptions. Listener class must have public no-arg constructor.
- **Bloom:** Understand
- **Source:** EJB14

**Card 16**
- **Q:** Write a @PrePersist callback that sets creation timestamp.
- **A:** ```java
@PrePersist
void beforeInsert() {
    this.createdDate = System.currentTimeMillis();
    this.lastModified = createdDate;
}```
- **Bloom:** Apply
- **Source:** EJB14

**Card 17**
- **Q:** How do you register an external entity listener and what advantage does it provide?
- **A:** Use @EntityListeners({ListenerClass.class}) annotation on entity. Advantage: centralize auditing/logging logic; reuse listener across multiple entities; separate concerns (entity vs auditing).
- **Bloom:** Understand
- **Source:** EJB14

**Card 18**
- **Q:** What happens when superclass and subclass both have callbacks and listeners?
- **A:** Superclass listeners execute first, then subclass listeners, then entity class callbacks last. Use @ExcludeSuperClassListeners to skip parent listeners; use @ExcludeDefaultListeners to skip default listeners.
- **Bloom:** Understand
- **Source:** EJB14

**Card 19**
- **Q:** Provide an example of an @EntityListener class for audit logging.
- **A:** ```java
public class AuditListener {
    @PostPersist void onInsert(Object entity) {
        System.out.println("Inserted: " + entity.getClass().getSimpleName());
    }
    @PostUpdate void onUpdate(Object entity) {
        System.out.println("Updated: " + entity.getClass().getSimpleName());
    }
}```
- **Bloom:** Apply
- **Source:** EJB14

**Card 20**
- **Q:** What is the use case for @PostLoad callback?
- **A:** Restore transient fields, cache values, initialize derived data. Example: load employee, post-load calculates annualBonus from salary; initialize UI state or lazy collections.
- **Bloom:** Understand
- **Source:** EJB14

---

### Security (8 cards)

**Card 21**
- **Q:** What is the difference between @RolesAllowed and @PermitAll?
- **A:** @RolesAllowed restricts method to specified roles (e.g., @RolesAllowed("admin")). @PermitAll allows any authenticated user to call method (default for unannotated methods).
- **Bloom:** Understand
- **Source:** EJB15

**Card 22**
- **Q:** Why is @DeclareRoles required when using role-based security?
- **A:** @DeclareRoles declares all role names used in the class, enabling the container to recognize them. Without it, container may not resolve role references properly. Declare at class level.
- **Bloom:** Understand
- **Source:** EJB15

**Card 23**
- **Q:** Explain @RunAs and when you would use it.
- **A:** @RunAs(role) propagates a specific role to called EJBs. Example: user calls method marked @RunAs("admin"), the method runs and calls other EJBs with admin role (not user role). Use for privilege escalation in controlled scenarios.
- **Bloom:** Understand
- **Source:** EJB15

**Card 24**
- **Q:** What do getCallerPrincipal() and isCallerInRole(String) do?
- **A:** getCallerPrincipal() returns Principal object representing caller; call getName() to get username string. isCallerInRole(String role) returns true if caller is in specified role. Both available via EJBContext.
- **Bloom:** Remember
- **Source:** EJB15

**Card 25**
- **Q:** Write a code example using isCallerInRole() for programmatic access control.
- **A:** ```java
@Resource SessionContext ctx;
public void deleteUser(long userId) {
    if (!ctx.isCallerInRole("admin")) {
        throw new SecurityException("Only admins can delete");
    }
    // Delete user...
}```
- **Bloom:** Apply
- **Source:** EJB15

**Card 26**
- **Q:** What is the purpose of @DenyAll and where is it useful?
- **A:** @DenyAll blocks all access to a method; no one can call it (even authenticated users). Use for testing/placeholder methods, temporarily disabling functionality.
- **Bloom:** Understand
- **Source:** EJB15

**Card 27**
- **Q:** How do you declare security roles in XML (ejb-jar.xml)?
- **A:** Use <security-role> element with <role-name>. Example: `<security-role><role-name>admin</role-name></security-role>`. Define multiple roles for method permissions.
- **Bloom:** Remember
- **Source:** EJB15

**Card 28**
- **Q:** What is a Realm and how does it relate to authentication?
- **A:** Realm is a collection of users and groups controlled by same authentication policy (database, LDAP, Kerberos, certificates, etc.). Container maps realm users to application roles. JBoss defines realms in standalone.xml.
- **Bloom:** Understand
- **Source:** EJB15

---

### JNDI, ENC, Injection (6 cards)

**Card 29**
- **Q:** What is ENC (Enterprise Naming Context) and what is its scope?
- **A:** ENC is a private registry per EJB component at java:comp/env. Stores component-local resource bindings (EJB references, data sources, persistence units). Only accessible from within that component; not remote.
- **Bloom:** Understand
- **Source:** EJB16

**Card 30**
- **Q:** Compare java:global, java:app, and java:module JNDI name scopes.
- **A:** java:global: server-wide, remote accessible. java:app: within EAR only. java:module: within JAR/WAR only. Global JNDI format: `java:global/app-name/module-name/bean-name!FQN`
- **Bloom:** Understand
- **Source:** EJB16

**Card 31**
- **Q:** What does @EJB injection do and what parameters can you specify?
- **A:** @EJB injects reference to another EJB. Parameters: name() (ENC name), beanInterface() (local/remote class), beanName() (target bean), mappedName() (vendor-specific). Container auto-discovers if only @EJB with no attributes.
- **Bloom:** Remember
- **Source:** EJB16

**Card 32**
- **Q:** Difference between @PersistenceContext and @PersistenceUnit injection?
- **A:** @PersistenceContext injects EntityManager (TRANSACTION-scoped by default, auto-closes). @PersistenceUnit injects EntityManagerFactory for manual EntityManager creation. Use @PersistenceContext for most cases.
- **Bloom:** Understand
- **Source:** EJB16

**Card 33**
- **Q:** What is the default ENC name if @EJB does not specify name() attribute?
- **A:** Fully qualified class name + field name. Example: field `ProcessPaymentLocal payment` in `com.titan.TravelAgentBean` creates default ENC entry at `java:comp/env/com.titan.TravelAgentBean/payment`
- **Bloom:** Understand
- **Source:** EJB16

**Card 34**
- **Q:** Write a remote client JNDI lookup to call an EJB on a server.
- **A:** ```java
Properties props = new Properties();
props.put(Context.INITIAL_CONTEXT_FACTORY, 
    "org.jboss.naming.remote.client.InitialContextFactory");
props.put(Context.PROVIDER_URL, "remote://localhost:4447");
Context ctx = new InitialContext(props);
EJBRemote remote = (EJBRemote) ctx.lookup(
    "java:global/App/Module/BeanName!com.x.EJBRemote");
```
- **Bloom:** Apply
- **Source:** EJB16

---

### Transactions - THE CRITICAL 6 ATTRIBUTES (15 cards)

**Card 35 (REQUIRED)**
- **Q:** What is REQUIRED transaction attribute and when is it used?
- **A:** REQUIRED (default): if caller has TX, method uses it; if not, container creates new TX. Method participates in caller's TX or creates own. Use: most business methods (default choice). Exception: unchecked exceptions rollback.
- **Bloom:** Understand
- **Source:** EJB17

**Card 36 (REQUIRES_NEW)**
- **Q:** Explain REQUIRES_NEW: what happens to caller's transaction?
- **A:** REQUIRES_NEW: container suspends caller's TX, creates new isolated TX for method, resumes caller's TX after. Caller's and method's TXs commit/rollback independently. Use: logging/auditing that must succeed even if parent fails.
- **Bloom:** Understand
- **Source:** EJB17

**Card 37 (SUPPORTS)**
- **Q:** What does SUPPORTS do and when would you use it?
- **A:** SUPPORTS: if caller has TX, method uses it; if not, method runs without TX. Method works with or without TX context. Use: optional operations, read-only queries, helper methods called from multiple contexts.
- **Bloom:** Understand
- **Source:** EJB17

**Card 38 (NOT_SUPPORTED)**
- **Q:** What happens to caller's transaction with NOT_SUPPORTED attribute?
- **A:** NOT_SUPPORTED: container suspends caller's TX, method runs without TX, caller's TX resumes. Method executes outside any transaction context. Use: logging, monitoring, operations that must not affect business TX.
- **Bloom:** Understand
- **Source:** EJB17

**Card 39 (MANDATORY)**
- **Q:** What happens if MANDATORY method is called without a transaction?
- **A:** MANDATORY: requires caller to have active TX; if no TX, container throws TransactionRequiredException. Method fails immediately. Use: critical operations enforcing caller must manage TX.
- **Bloom:** Understand
- **Source:** EJB17

**Card 40 (NEVER)**
- **Q:** What is NEVER attribute and when is it used?
- **A:** NEVER: method must NOT run in TX. If called from TX context, container throws EJBException and rolls back. If no caller TX, method runs successfully. Use: non-transactional operations requiring enforcement.
- **Bloom:** Understand
- **Source:** EJB17

**Card 41**
- **Q:** Create a scenario: Account transfer from checking to savings. Which transaction attribute for transfer method and why?
- **A:** REQUIRED or MANDATORY. REQUIRED: if caller has TX, transfers participate; if not, container creates TX. MANDATORY: enforces caller must manage TX (stronger guarantee). Both ensure both debits/credits succeed or both rollback atomically.
- **Bloom:** Apply
- **Source:** EJB17

**Card 42**
- **Q:** Design logging/auditing scenario: payment service calls audit service. What attributes?
- **A:** Payment: REQUIRED (business operation). Audit: REQUIRES_NEW (own TX). Reason: audit logs even if payment fails; independent TX guarantees log persists.
- **Bloom:** Apply
- **Source:** EJB17

**Card 43**
- **Q:** Compare system exceptions vs application exceptions in transaction handling.
- **A:** System (unchecked/RuntimeException): auto-rollback on throw. Application (checked/Exception): no rollback unless @ApplicationException(rollback=true). Checked exceptions allow caller to recover.
- **Bloom:** Understand
- **Source:** EJB17

**Card 44**
- **Q:** What is @ApplicationException(rollback=true) and why is it needed?
- **A:** Marks checked exception to trigger rollback (unusual). Normally checked exceptions don't rollback (allow recovery). @ApplicationException(rollback=true) forces rollback on throw, treating it like system exception. Use: critical application errors requiring rollback.
- **Bloom:** Understand
- **Source:** EJB17

**Card 45**
- **Q:** Explain UserTransaction API: begin(), commit(), rollback(), setRollbackOnly().
- **A:** begin(): start TX. commit(): finish and persist changes. rollback(): discard changes. setRollbackOnly(): mark TX for rollback but don't stop method; continues and rolls back at boundary. Used in Bean-Managed Transactions.
- **Bloom:** Remember
- **Source:** EJB17

**Card 46**
- **Q:** When would you use Bean-Managed Transactions (BMT) over Container-Managed (CMT)?
- **A:** BMT: fine-grained TX control, multiple TXs per method, dynamic TX boundaries. CMT: default, simpler, more declarative. Prefer CMT unless BMT requirements (e.g., handle multiple independent TXs in one method).
- **Bloom:** Understand
- **Source:** EJB17

**Card 47**
- **Q:** What is setRollbackOnly() and how does it differ from rollback()?
- **A:** setRollbackOnly(): marks TX for rollback but method continues executing. rollback(): immediately stops TX and discards. setRollbackOnly() defers rollback to TX boundary; rollback() is immediate.
- **Bloom:** Understand
- **Source:** EJB17

**Card 48**
- **Q:** Explain Session Synchronization for SFSB: @AfterBegin, @BeforeCompletion, @AfterCompletion.
- **A:** @AfterBegin: fires after container starts TX. @BeforeCompletion: before commit (can modify state). @AfterCompletion(committed=true/false): after commit or rollback. Use: SFSB cleanup, state management across TX.
- **Bloom:** Understand
- **Source:** EJB17

**Card 49 (EXAM CRITICAL)**
- **Q:** Create a comparison table: REQUIRED vs REQUIRES_NEW for caller HAS TX scenario.
- **A:** REQUIRED: uses caller's TX, commits/rolls back with caller. REQUIRES_NEW: suspends caller's TX, creates new isolated TX, caller's TX resumes. Different TXs = independent commit/rollback outcomes.
- **Bloom:** Apply
- **Source:** EJB17

---

### Java EE Design (5 cards)

**Card 50**
- **Q:** What is the Session Facade pattern and why is it useful?
- **A:** Session Facade: single stateless session bean (facade) wraps multiple session beans and coordinates business operations. Benefit: simplified client API, encapsulation, transaction boundary control, orchestration of complex logic.
- **Bloom:** Understand
- **Source:** EJB18

**Card 51**
- **Q:** Explain Data Transfer Object (DTO) pattern: when and why use it?
- **A:** DTO: lightweight serializable object carrying data across network boundaries (client-server). Difference from entity: detached, no relationships, only needed fields. Use: avoid serializing full entity graphs, control network payload, decouple client from entity schema.
- **Bloom:** Understand
- **Source:** EJB18

**Card 52**
- **Q:** What is the difference between entity beans and session beans in architecture?
- **A:** Entity beans (JPA): represent persistent data; have relationships; short-lived in memory. Session beans: business logic; services; coordinate operations; can be stateless or stateful. Entities accessed by session beans; clients call session beans (not entities directly).
- **Bloom:** Understand
- **Source:** EJB18

**Card 53**
- **Q:** Describe multi-tiered architecture layers and responsibilities.
- **A:** Web Tier: presentation, JSP/JSF. Business Tier: session beans, services, validation, TX. Data Tier: JPA entities, persistence. Each tier independent; separation of concerns aids testing, scaling, maintenance.
- **Bloom:** Understand
- **Source:** EJB18

**Card 54**
- **Q:** What is application.xml and what does it contain in an EAR?
- **A:** application.xml: deployment descriptor in EAR's META-INF/. Contains: <module> entries for WAR (web), JAR (EJB), <security-role> definitions, display-name, description. Defines how web and EJB modules are packaged together.
- **Bloom:** Remember
- **Source:** EJB18

---

## 9. Practice Exam Questions

### Multiple Choice (6 Questions)

**MCQ 1:** What is the primary advantage of using FETCH JOIN in JPQL?
- A) Improves sorting efficiency
- B) Prevents N+1 query problem by eagerly loading related entities
- C) Allows subqueries in WHERE clause
- D) Enables pagination across relationships

**Answer:** B. FETCH JOIN eagerly loads related entities in a single query, preventing N+1 (1 + N queries → 1 query total).

---

**MCQ 2:** Which transaction attribute suspends the caller's transaction and creates an isolated transaction for the method?
- A) REQUIRED
- B) REQUIRES_NEW
- C) SUPPORTS
- D) MANDATORY

**Answer:** B. REQUIRES_NEW suspends caller's TX, creates new isolated TX, resumes caller's TX after. Caller's and method's TXs are independent.

---

**MCQ 3:** A method marked @RolesAllowed("admin") is called by a user with "user" role. What happens?
- A) Method executes; container logs unauthorized access
- B) Container throws SecurityException; method doesn't execute
- C) User is elevated to "admin" role temporarily
- D) Caller is prompted for admin credentials

**Answer:** B. Container throws SecurityException/EJBAccessException before method executes. @RolesAllowed only allows specified roles.

---

**MCQ 4:** What does getCallerPrincipal() return?
- A) String username of the caller
- B) Principal object representing the caller; call getName() for username
- C) boolean true if caller is authenticated
- D) EJBContext of the caller

**Answer:** B. getCallerPrincipal() returns Principal object; Principal.getName() returns username string.

---

**MCQ 5:** Which injection annotation injects an EntityManager that auto-closes after method?
- A) @PersistenceUnit
- B) @PersistenceContext(type=EXTENDED)
- C) @PersistenceContext (or @PersistenceContext(type=TRANSACTION))
- D) @Resource(type=EntityManager.class)

**Answer:** C. @PersistenceContext defaults to TRANSACTION type (auto-closes after method). EXTENDED persists across methods (SFSB only).

---

**MCQ 6:** An audit logging method is marked @TransactionAttribute(REQUIRES_NEW). If the calling business method throws an exception, does the audit log get persisted?
- A) No; both methods rollback together
- B) Yes; audit method has own isolated TX
- C) Only if the exception is handled in calling method
- D) Only if audit method commits explicitly

**Answer:** B. REQUIRES_NEW creates isolated TX; audit logs persist even if caller rolls back. Independent TXs = independent commit/rollback.

---

### True/False (3 Questions)

**T/F 1:** Callback methods in entity classes can take the entity instance as a parameter.

**Answer:** FALSE. Callbacks on entity classes take NO parameters. External listeners (@EntityListeners) take one Object parameter (the entity).

---

**T/F 2:** A method marked @TransactionAttribute(MANDATORY) can be safely called from a non-transactional client.

**Answer:** FALSE. MANDATORY requires caller to have active TX. Non-transactional caller causes TransactionRequiredException; method fails.

---

**T/F 3:** @EJB injection automatically creates an entry in the component's ENC (Enterprise Naming Context).

**Answer:** TRUE. @EJB creates ENC entry at java:comp/env/[name] (or default name if not specified). Entry can be looked up via JNDI.

---

### Short Answer (3 Questions)

**SA 1:** Describe a scenario where you would use NOT_SUPPORTED transaction attribute. What problem does it solve?

**Answer:**
Scenario: Reading analytics or generating reports from persistent data without affecting ongoing business transactions.

Problem: If analytics query runs in same TX as business operations, it might lock rows or slow down critical operations.

Solution: Mark analytics method @TransactionAttribute(NOT_SUPPORTED). Container suspends caller's TX, runs analytics without TX, resumes caller's TX. Analytics reads latest committed data; no locking; business TX unaffected.

---

**SA 2:** You have an entity with @PrePersist and @PostLoad callbacks. Why might @PostLoad be useful for initializing a transient field?

**Answer:**
Transient fields are not persisted in database. When entity is loaded from DB, transient fields are null/uninitialized. @PostLoad fires after entity loaded; can initialize transient fields from other entity data (e.g., calculate bonus from salary). Ensures transient fields have correct state when entity is accessed.

---

**SA 3:** Explain why session facades are preferred over clients directly calling individual business service beans. What advantage does the facade provide?

**Answer:**
Session Facade benefits:
1. **Single entry point:** Clients call one bean (facade) instead of multiple services.
2. **Encapsulation:** Facade coordinates complex operations; clients don't know about internal beans.
3. **Transaction boundary:** Facade controls TX boundary for entire operation; all coordinated services participate in same TX (REQUIRED).
4. **Simplified API:** Facade method names reflect business operations; hides service bean complexity.
5. **Maintenance:** Changes to internal beans don't impact client API.

Example: TravelFacade.bookTrip() calls CabinService, PaymentService, ReservationService internally; all in same TX.

---

### Code Annotation / JPQL Writing Question

**Question:** Write a complete JPQL query with explanation:

"Find all employees earning above average salary in their department, ordered by salary descending. Return DTO with employee ID, name, salary, and department name."

**Requirements:**
1. Use named parameter for clarity
2. Handle the department average subquery
3. Use constructor projection for DTO
4. Explain why you chose JOIN (inner vs left) and how it avoids N+1

**Answer:**

```java
// DTO class
public class EmployeeDTO {
    public EmployeeDTO(Long id, String name, Double salary, String deptName) {
        this.id = id;
        this.name = name;
        this.salary = salary;
        this.deptName = deptName;
    }
    // Fields, getters...
}

// Query
List<EmployeeDTO> highEarners = entityManager.createQuery(
    "SELECT new com.example.EmployeeDTO(" +
    "  e.id, e.name, e.salary, d.name) " +
    "FROM Employee e " +
    "INNER JOIN e.department d " +  // INNER JOIN: each employee must have a department
    "WHERE e.salary > " +
    "  (SELECT AVG(e2.salary) FROM Employee e2 " +
    "   WHERE e2.department = e.department) " +
    "ORDER BY e.salary DESC",
    EmployeeDTO.class
).getResultList();

// Alternative using GROUP BY and HAVING (if subquery is expensive):
List<EmployeeDTO> highEarners2 = entityManager.createQuery(
    "SELECT new com.example.EmployeeDTO(" +
    "  e.id, e.name, e.salary, d.name) " +
    "FROM Employee e " +
    "INNER JOIN e.department d " +
    "GROUP BY e.id, e.name, e.salary, d.name, d.id " +
    "HAVING e.salary > (SELECT AVG(e2.salary) FROM Employee e2 WHERE e2.department = d) " +
    "ORDER BY e.salary DESC",
    EmployeeDTO.class
).getResultList();
```

**Explanation:**

1. **Constructor Projection:** `SELECT new com.example.EmployeeDTO(...)` creates DTO instances directly; no separate mapping required.

2. **INNER JOIN:** Used because every employee must have a department. INNER JOIN excludes employees without departments (NULL). If employees could be NULL, use LEFT JOIN.

3. **Subquery for Average:** Subquery calculates average salary per department. Correlated with outer query (WHERE e2.department = e.department) to compare each employee against their own department average.

4. **Named Parameter:** Added :minBonus example (not in main query but good practice for WHERE conditions).

5. **Avoiding N+1:** 
   - Standard query loads employees with e.salary and d.name in ONE query due to JOIN.
   - Without JOIN, each e.department access would trigger separate query (N+1).
   - FETCH JOIN not needed here because we select specific columns (constructor projection), not full entities.

6. **ORDER BY:** Descending salary puts highest earners first.

---

## Summary Table: Transaction Attributes Quick Reference

| Attribute | Caller TX? | Creates TX | Suspended? | Exception Rollback | Use Case |
|-----------|---------|---------|---------|---------|---------|
| REQUIRED | Yes→use | No | No | Yes | Default; participate or create |
| REQUIRES_NEW | Yes→suspend | Yes | Yes | Yes | Independent TX; logging |
| SUPPORTS | Yes→use | No | No | Yes | Optional; read-only |
| NOT_SUPPORTED | Yes→suspend | No | Yes | No | Outside TX; reporting |
| MANDATORY | Yes→use | Exception | No | Yes | Enforce TX required |
| NEVER | Exception | No | No | No | Enforce NO TX |

---

## Key Exam Reminders

1. **JPQL:** Use FETCH JOIN for N+1 prevention; prefer named parameters; understand getSingleResult() exceptions.
2. **Callbacks:** No parameters (entity), one parameter (listener); return void; throw no checked exceptions.
3. **Security:** Declare roles with @DeclareRoles; @RolesAllowed restricts; getCallerPrincipal() returns Principal.
4. **Injection:** @EJB, @Resource, @PersistenceContext preferred; auto-creates ENC entry.
5. **Transactions:** REQUIRED default; REQUIRES_NEW for isolation; MANDATORY enforces; system exceptions rollback; checked don't.
6. **Design:** Session Facade wraps services; DTOs cross boundaries; entities in data tier; multi-tiered architecture.

---

## PDF Source Attribution

- **EJB12:** Queries Criteria API and JPQL — JPQL syntax, query methods, named queries, bulk operations
- **EJB14:** Entity Callbacks and Listeners — @PrePersist, @PostLoad, @EntityListeners, inheritance
- **EJB15:** Security — @RolesAllowed, @DeclareRoles, @RunAs, isCallerInRole, getCallerPrincipal, realms
- **EJB16:** JNDI, ENC, Injection — @EJB, @Resource, @PersistenceContext, @PersistenceUnit, global JNDI names
- **EJB17:** Transactions — ACID, 6 transaction attributes, CMT, BMT, UserTransaction, exceptions, Session Synchronization
- **EJB18:** Java EE & EJB Design — multi-tiered architecture, Session Facade, DTO, EAR/WAR/JAR structure
- **Comp4911ReviewTechnical:** Overview and foundational concepts

---

**Document Complete. Ready for exam study and flashcard drill.**

