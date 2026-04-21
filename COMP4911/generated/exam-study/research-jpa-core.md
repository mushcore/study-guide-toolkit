# COMP 4911: JPA Core Topics Study Package
**Entity Manager, Mapping, Relationships, and Inheritance**

---

## Topic 1: EntityManager and Persistence Context

```json
{
  "topic_id": "jpa_01",
  "topic_title": "EntityManager & Persistence Context",
  "chapter": "Chapter 9",
  "summary": "EntityManager is the core service for all JPA persistence operations. It manages entity instances through their lifecycle states (new, managed, detached, removed) within a Persistence Context—a set of managed entity instances. Two context types exist: transaction-scoped (container-managed, default) and extended (for stateful session beans).",
  
  "key_concepts": [
    "EntityManager interface and its role in ORM",
    "Persistence Context as in-memory cache of managed entities",
    "Entity lifecycle states: new (not managed), managed (in PC), detached (was in PC), removed (marked for deletion)",
    "Transaction-scoped persistence context (lives for one transaction, auto-close)",
    "Extended persistence context (lives across multiple transactions, controlled by developer)",
    "Container-managed vs application-managed EntityManager",
    "@PersistenceContext injection for container-managed",
    "@PersistenceUnit for EntityManagerFactory (application-managed)",
    "EntityManager methods: persist, remove, merge, find, getReference, refresh, contains, flush, clear, detach",
    "Identity semantics: == vs .equals() with managed entities",
    "First-level cache (Persistence Context) behavior"
  ],

  "annotations": [
    "@PersistenceContext(unitName=\"myPU\", type=PersistenceContextType.TRANSACTION) - Injects EntityManager into container-managed bean",
    "@PersistenceContext(type=PersistenceContextType.EXTENDED) - Extended context for SFSBs, lives beyond single transaction",
    "@PersistenceUnit(unitName=\"myPU\") - Injects EntityManagerFactory for application-managed EM"
  ],

  "api_methods": [
    "void persist(Object entity) - Makes new entity managed. No-op if already managed. Cascades with PERSIST.",
    "void remove(Object entity) - Marks managed entity for deletion. Cascades with REMOVE. Throws IllegalArgumentException if detached/new.",
    "Object merge(Object entity) - Brings detached entity back to managed state. Returns reattached instance (may differ from parameter).",
    "Object find(Class cls, Object primaryKey) - Retrieves managed entity by PK. Returns null if not found.",
    "Object getReference(Class cls, Object primaryKey) - Like find() but returns proxy. Throws EntityNotFoundException if not found.",
    "void refresh(Object entity) - Reloads managed entity from database, overwriting memory state.",
    "boolean contains(Object entity) - Returns true if entity is managed in this PC.",
    "void flush() - Writes pending changes to database (still in transaction, not committed).",
    "void clear() - Detaches all managed entities. Clears PC.",
    "void detach(Object entity) - Explicitly detaches single entity from PC."
  ],

  "rules": [
    "Only managed entities are synchronized with database. Detached/new entities require merge() or persist().",
    "Database primary key is immutable once entity is persisted (changing @Id has undefined behavior).",
    "persist() requires entity to be new or managed. Does not work on detached entities.",
    "merge() is idempotent: can be called on new, managed, or detached entities. Always returns managed instance.",
    "remove() requires entity to be managed. Detached entities must be merged first.",
    "Cascade operations propagate method calls (persist, remove, merge, refresh) to related entities based on relationship's cascade attribute.",
    "Default cascade is empty (no cascade). @OneToMany default is no cascade. Explicit cascade=CascadeType.ALL propagates all operations.",
    "flush() is automatic before query execution and at transaction commit (if container-managed).",
    "clear() detaches ALL entities; individual detach() only affects specified entity.",
    "Identity semantics: Two managed entities with same PK are == (same object reference in PC).",
    "Multiple calls to find(Class, pk) with same PK return same object reference (from PC cache)."
  ],

  "code_examples": [
    {
      "title": "Container-Managed Persistence (TRANSACTION-SCOPED)",
      "code": "@Stateless\npublic class EmployeeService {\n  @PersistenceContext(unitName=\"myPU\")\n  private EntityManager em;\n  \n  public void createEmployee(String name, String email) {\n    Employee emp = new Employee(name, email);\n    em.persist(emp);  // Makes emp managed. DB write on tx commit.\n    // emp is now managed, in PC\n  }\n  \n  public Employee findEmployee(Long id) {\n    return em.find(Employee.class, id);  // Managed entity returned\n  }\n  \n  public void updateEmployee(Long id, String newName) {\n    Employee emp = em.find(Employee.class, id);  // managed\n    emp.setName(newName);  // PC detects change\n    em.flush();  // Write to DB (tx still open)\n  }\n  \n  public void deleteEmployee(Long id) {\n    Employee emp = em.find(Employee.class, id);  // managed\n    em.remove(emp);  // Mark for deletion\n    // Deleted on tx commit\n  }\n}"
    },
    {
      "title": "Application-Managed with Detach/Merge",
      "code": "@Stateful\npublic class EditorBean {\n  @PersistenceUnit(unitName=\"myPU\")\n  private EntityManagerFactory emf;\n  \n  public void editEmployee(Employee emp) {\n    // emp is detached (from previous request, PC closed)\n    EntityManager em = emf.createEntityManager();\n    EntityTransaction tx = em.getTransaction();\n    try {\n      tx.begin();\n      Employee managed = em.merge(emp);  // Reattach. managed != emp\n      managed.setName(\"New Name\");  // Changes tracked\n      tx.commit();\n      // managed stays in PC until em.clear() or em.close()\n    } finally {\n      if (tx.isActive()) tx.rollback();\n      em.close();  // PC closed, managed becomes detached\n    }\n  }\n  \n  public void detachSingleEntity(Employee emp) {\n    EntityManager em = emf.createEntityManager();\n    try {\n      Employee managed = em.find(Employee.class, emp.getId());\n      em.detach(managed);  // managed is now detached\n      managed.setName(\"changed\");  // Change is NOT tracked\n    } finally {\n      em.close();\n    }\n  }\n}"
    }
  ],

  "flashcards": [
    {
      "question": "What is the Persistence Context?",
      "answer": "A set of managed entity instances in memory. Acts as a cache between application and database. All entities in PC are synchronized with database on flush()/commit()."
    },
    {
      "question": "Name the four entity lifecycle states.",
      "answer": "1) New (never persisted, not in PC). 2) Managed (in PC, synchronized with DB). 3) Detached (was in PC, now outside). 4) Removed (marked for deletion, still in PC)."
    },
    {
      "question": "What annotation injects EntityManager in a container-managed EJB?",
      "answer": "@PersistenceContext. @PersistenceContext injects a container-managed EntityManager. @PersistenceUnit injects EntityManagerFactory (for application-managed)."
    },
    {
      "question": "What does persist() do to a new entity?",
      "answer": "Makes it managed. Adds to Persistence Context. Schedules INSERT for next flush(). Does NOT immediately write to DB."
    },
    {
      "question": "Why is merge() used instead of persist() for detached entities?",
      "answer": "persist() throws exception on detached entity. merge() reattaches and synchronizes state. merge() is safe for any state (new, managed, detached)."
    },
    {
      "question": "What is the difference between find() and getReference()?",
      "answer": "find() queries DB if entity not in PC, returns null if not found. getReference() returns proxy immediately, throws EntityNotFoundException only if proxy is accessed and entity missing."
    },
    {
      "question": "Does flush() commit the transaction?",
      "answer": "No. flush() writes to DB but transaction remains open. Commit still required. Before queries execute, flush() is automatic."
    },
    {
      "question": "What happens when you call clear()?",
      "answer": "Detaches ALL managed entities in PC. Changes not yet flushed are lost. PC becomes empty."
    },
    {
      "question": "When does cascade=PERSIST propagate?",
      "answer": "When parent entity is persisted via persist(). Related child entities with cascade=PERSIST are also persisted."
    },
    {
      "question": "What is extended Persistence Context?",
      "answer": "Type of PC that lives across multiple transactions in a stateful session bean. Managed entities remain attached. Extended over application-managed means developer controls EM lifecycle."
    },
    {
      "question": "True or False: Calling find(Class, pk) twice with same PK returns different object references.",
      "answer": "False. PC caches entities. Same PK returns same object reference both times (identity semantics)."
    },
    {
      "question": "What does refresh() do?",
      "answer": "Reloads managed entity from database, overwriting its in-memory state. Useful to discard unsaved changes or load fresh data."
    },
    {
      "question": "Which method requires entity to be managed: persist, remove, or merge?",
      "answer": "remove(). persist() requires new/managed, merge() works on any state. remove() throws exception on detached."
    },
    {
      "question": "What is @PersistenceUnit used for?",
      "answer": "Injects EntityManagerFactory (not EntityManager). Used in application-managed scenarios to create EntityManager instances via createEntityManager()."
    },
    {
      "question": "True or False: Detached entities are synchronized with database after flush().",
      "answer": "False. Detached entities are NOT in PC, so not synchronized. Detached changes are lost unless entity is merged first."
    }
  ],

  "exam_traps": [
    "Confusing persist() with merge(): persist() fails on detached; merge() fixes this.",
    "Assuming flush() commits transaction: flush() writes but doesn't commit.",
    "Calling remove() on detached entity: throws exception. Must merge() first.",
    "Thinking all cascade operations happen: default is no cascade. Must explicitly set cascade attribute.",
    "Assuming two find() calls create different instances: they return same object (PC cache).",
    "Not knowing when flush() is automatic: before queries and at transaction commit.",
    "Forgetting @PersistenceContext type: default is TRANSACTION-scoped (lives one tx). Extended is for SFSBs."
  ]
}
```

---

## Topic 2: Mapping Persistent Objects

```json
{
  "topic_id": "jpa_02",
  "topic_title": "Mapping Persistent Objects",
  "chapter": "Chapter 10",
  "summary": "Object-Relational Mapping (ORM) bridges Java objects and relational tables. JPA provides annotations to define entity classes, map properties to columns, specify primary key generation strategies (AUTO, IDENTITY, SEQUENCE, TABLE, UUID), handle composite keys via @IdClass or @EmbeddedId/@Embeddable, map temporal types, enums, and embedded objects.",
  
  "key_concepts": [
    "Entity definition: @Entity class, no-arg constructor, serializable (recommended), mutable state",
    "@Table: maps class to database table. Default table name = class name.",
    "@Column: maps property to database column. Default column name = property name.",
    "@Id: identifies primary key property/field. Exactly one per entity.",
    "@GeneratedValue with strategies: AUTO (default), IDENTITY (auto-increment), SEQUENCE (database sequence), TABLE (separate table), UUID",
    "Composite primary keys: Two approaches: @IdClass (external PK class) vs @EmbeddedId/@Embeddable (embedded PK class)",
    "@Basic: explicit property mapping. Attributes: fetch (EAGER/LAZY), optional (true/false)",
    "@Temporal: maps java.util.Date or java.util.Calendar to DATE, TIME, or TIMESTAMP",
    "@Enumerated: maps enum to ORDINAL (0, 1, 2...) or STRING (name)",
    "@Transient: marks property as not persisted",
    "@Lob: maps to BLOB (binary data) or CLOB (character data)",
    "@Version: optimistic locking. Auto-incremented on each update.",
    "@Embedded/@Embeddable: maps composite object (no table, columns added to parent)",
    "@SecondaryTable: maps entity to multiple tables",
    "@AttributeOverrides: override embedded object's column names",
    "Default mapping: String → VARCHAR(255), long → BIGINT, int → INT, boolean → TINYINT"
  ],

  "annotations": [
    "@Entity - Marks class as JPA entity. Required.",
    "@Table(name=\"table_name\", catalog=\"catalog\", schema=\"schema\") - Maps to table. Default name = class name.",
    "@Id - Identifies PK field/property. Exactly one per entity.",
    "@GeneratedValue(strategy=GenerationType.AUTO|IDENTITY|SEQUENCE|TABLE|UUID, generator=\"genName\") - PK generation. AUTO defers to dialect.",
    "@Column(name=\"col_name\", nullable=true, unique=false, length=255, insertable=true, updatable=true, columnDefinition=\"VARCHAR(100)\") - Maps property to column.",
    "@Basic(fetch=FetchType.EAGER, optional=false) - Explicit mapping. Default is EAGER, optional=true.",
    "@Temporal(TemporalType.DATE|TIME|TIMESTAMP) - Maps Date/Calendar. Required for temporal types.",
    "@Enumerated(EnumType.ORDINAL|STRING) - Maps enum. ORDINAL (0,1...) or STRING (name).",
    "@Transient - Property not persisted.",
    "@Lob - BLOB (byte[]) or CLOB (String). No TemporalType needed.",
    "@Version - Optimistic lock version. Auto-incremented. Must be numeric.",
    "@Embedded - Marks property as embedded object (no separate table).",
    "@Embeddable - Marks class as embeddable (used in @Embedded).",
    "@EmbeddedId - Marks property as embedded primary key.",
    "@IdClass(MyPKClass.class) - External PK class (non-annotated).",
    "@AttributeOverrides({@AttributeOverride(name=\"fieldName\", column=@Column(name=\"colName\"))}) - Override embedded field column.",
    "@SecondaryTable(name=\"table2\", pkJoinColumns=@PrimaryKeyJoinColumn(name=\"emp_id\")) - Map entity to second table.",
    "@DiscriminatorColumn(name=\"DTYPE\", discriminatorType=DiscriminatorType.STRING, length=31) - On root entity for inheritance."
  ],

  "api_methods": [
    "No direct API—annotations drive mapping. JPA provider reads annotations at startup and generates SQL schemas or validates against database."
  ],

  "rules": [
    "Every entity must have exactly one @Id (single or composite).",
    "@Id can be on field or property (getter). Choose one style consistently.",
    "No-arg constructor required (can be private, but exists). Used by JPA for reflection.",
    "@GeneratedValue(AUTO) lets dialect choose. IDENTITY for auto-increment, SEQUENCE for oracle/postgres, TABLE for portable fallback.",
    "String property default maps to VARCHAR(255). Specify @Column(length=100) for smaller columns.",
    "@Temporal required on java.util.Date/Calendar. No @Temporal needed for LocalDate (JPA 2.2+).",
    "@Enumerated(ORDINAL) encodes enum as 0,1,2... Fragile if enum order changes. STRING is safer.",
    "@Transient property is never persisted, not queried. Useful for calculated fields.",
    "Embedded objects share parent table (no FK). @Embeddable class cannot be entity.",
    "Composite PK via @IdClass: PK class is non-entity, mirrors @Id fields in entity. e.g., Employee has @Id long empId, @Id String dept → EmployeePK has empId, dept (no @Entity).",
    "Composite PK via @EmbeddedId: PK class is @Embeddable, entity has one @EmbeddedId field of that type.",
    "@IdClass is simpler for legacy code. @EmbeddedId is more OOP (single field encapsulates PK).",
    "@Version field is auto-incremented on each update. Prevents lost updates (optimistic locking).",
    "@Lob on String → CLOB, on byte[] → BLOB.",
    "@Column(updatable=false) means UPDATE SQL doesn't include this column. Useful for 'created' date.",
    "@Column(insertable=false) means INSERT doesn't include this. Useful for database-generated columns."
  ],

  "code_examples": [
    {
      "title": "Basic Entity Mapping",
      "code": "@Entity\n@Table(name=\"EMPLOYEES\")\npublic class Employee implements Serializable {\n  @Id\n  @GeneratedValue(strategy=GenerationType.AUTO)\n  private Long empId;\n  \n  @Column(name=\"EMP_NAME\", length=100, nullable=false)\n  private String name;\n  \n  @Column(name=\"SALARY\", columnDefinition=\"DECIMAL(10,2)\")\n  private BigDecimal salary;\n  \n  @Basic(optional=false)\n  @Temporal(TemporalType.DATE)\n  @Column(name=\"HIRE_DATE\")\n  private java.util.Date hireDate;\n  \n  @Enumerated(EnumType.STRING)\n  @Column(name=\"STATUS\", length=20)\n  private EmployeeStatus status;  // enum: ACTIVE, INACTIVE\n  \n  @Transient\n  private String temporaryField;  // Not persisted\n  \n  public Employee() {  // no-arg required\n  }\n  \n  public Employee(String name, java.util.Date hireDate) {\n    this.name = name;\n    this.hireDate = hireDate;\n    this.status = EmployeeStatus.ACTIVE;\n  }\n  // getters/setters omitted\n}"
    },
    {
      "title": "Composite Primary Key: @IdClass",
      "code": "// PK Class (non-entity)\npublic class EmployeePK implements Serializable {\n  public Long empId;\n  public String department;\n  \n  public EmployeePK() {\n  }\n  \n  public EmployeePK(Long empId, String department) {\n    this.empId = empId;\n    this.department = department;\n  }\n  \n  @Override\n  public boolean equals(Object o) {\n    if (!(o instanceof EmployeePK)) return false;\n    EmployeePK pk = (EmployeePK) o;\n    return empId.equals(pk.empId) && department.equals(pk.department);\n  }\n  \n  @Override\n  public int hashCode() {\n    return (empId.toString() + department).hashCode();\n  }\n}\n\n// Entity using @IdClass\n@Entity\n@Table(name=\"EMPLOYEES\")\n@IdClass(EmployeePK.class)\npublic class Employee implements Serializable {\n  @Id\n  @Column(name=\"EMP_ID\")\n  private Long empId;\n  \n  @Id\n  @Column(name=\"DEPARTMENT\")\n  private String department;\n  \n  @Column(name=\"EMP_NAME\")\n  private String name;\n  \n  public Employee() {\n  }\n  \n  public Employee(Long empId, String department, String name) {\n    this.empId = empId;\n    this.department = department;\n    this.name = name;\n  }\n}"
    },
    {
      "title": "Composite Primary Key: @EmbeddedId/@Embeddable",
      "code": "// Embeddable PK Class\n@Embeddable\npublic class ProjectKey implements Serializable {\n  @Column(name=\"PROJECT_ID\")\n  private Long projectId;\n  \n  @Column(name=\"VERSION\")\n  private int version;\n  \n  public ProjectKey() {\n  }\n  \n  public ProjectKey(Long projectId, int version) {\n    this.projectId = projectId;\n    this.version = version;\n  }\n  \n  @Override\n  public boolean equals(Object o) {\n    if (!(o instanceof ProjectKey)) return false;\n    ProjectKey pk = (ProjectKey) o;\n    return projectId.equals(pk.projectId) && version == pk.version;\n  }\n  \n  @Override\n  public int hashCode() {\n    return (projectId.toString() + version).hashCode();\n  }\n}\n\n// Entity with @EmbeddedId\n@Entity\n@Table(name=\"PROJECTS\")\npublic class Project implements Serializable {\n  @EmbeddedId\n  private ProjectKey id;\n  \n  @Column(name=\"PROJECT_NAME\")\n  private String name;\n  \n  public Project() {\n  }\n  \n  public Project(Long projectId, int version, String name) {\n    this.id = new ProjectKey(projectId, version);\n    this.name = name;\n  }\n  \n  // Access: project.getId().getProjectId()\n}"
    },
    {
      "title": "Embedded Objects (@Embeddable)",
      "code": "@Embeddable\npublic class Address implements Serializable {\n  @Column(name=\"STREET\")\n  private String street;\n  \n  @Column(name=\"CITY\")\n  private String city;\n  \n  @Column(name=\"ZIP\")\n  private String zip;\n  \n  public Address() {\n  }\n  \n  public Address(String street, String city, String zip) {\n    this.street = street;\n    this.city = city;\n    this.zip = zip;\n  }\n  // getters/setters omitted\n}\n\n@Entity\n@Table(name=\"EMPLOYEES\")\npublic class Employee implements Serializable {\n  @Id\n  @GeneratedValue(strategy=GenerationType.AUTO)\n  private Long empId;\n  \n  @Column(name=\"EMP_NAME\")\n  private String name;\n  \n  @Embedded\n  @AttributeOverrides({\n    @AttributeOverride(name=\"street\", column=@Column(name=\"HOME_STREET\")),\n    @AttributeOverride(name=\"city\", column=@Column(name=\"HOME_CITY\")),\n    @AttributeOverride(name=\"zip\", column=@Column(name=\"HOME_ZIP\"))\n  })\n  private Address homeAddress;\n  \n  @Embedded\n  @AttributeOverrides({\n    @AttributeOverride(name=\"street\", column=@Column(name=\"WORK_STREET\")),\n    @AttributeOverride(name=\"city\", column=@Column(name=\"WORK_CITY\")),\n    @AttributeOverride(name=\"zip\", column=@Column(name=\"WORK_ZIP\"))\n  })\n  private Address workAddress;\n  \n  public Employee() {\n  }\n  // getters/setters omitted\n}"
    }
  ],

  "flashcards": [
    {
      "question": "What is the default table name in @Table if not specified?",
      "answer": "Class name (exact). @Entity class Employee → table 'Employee'. Use @Table(name=\"employees\") to override."
    },
    {
      "question": "What is the default column name if @Column is not used?",
      "answer": "Property name (exact). Property String name → column 'name'. Use @Column(name=\"emp_name\") to override."
    },
    {
      "question": "What does @GeneratedValue(strategy=GenerationType.AUTO) do?",
      "answer": "Lets the JPA dialect choose appropriate strategy (IDENTITY, SEQUENCE, or TABLE). Portable but not explicit."
    },
    {
      "question": "What is the difference between @IdClass and @EmbeddedId for composite keys?",
      "answer": "@IdClass: external non-entity PK class, @Id fields in entity mirror PK class fields. @EmbeddedId: @Embeddable PK class, single @EmbeddedId field in entity. @EmbeddedId is more OOP."
    },
    {
      "question": "Why is @Temporal required for java.util.Date?",
      "answer": "Date includes time but SQL has separate DATE, TIME, TIMESTAMP types. @Temporal specifies which: TemporalType.DATE, TIME, or TIMESTAMP."
    },
    {
      "question": "What does @Transient do?",
      "answer": "Marks property as not persisted to database. Useful for calculated/temporary fields."
    },
    {
      "question": "How does @Enumerated(EnumType.ORDINAL) differ from STRING?",
      "answer": "ORDINAL: enum stored as 0, 1, 2... (fragile if order changes). STRING: enum stored as name (safe but uses more space)."
    },
    {
      "question": "What does @Embeddable indicate?",
      "answer": "Class can be embedded in another entity. No separate table. Columns added to parent table."
    },
    {
      "question": "What is @AttributeOverrides used for?",
      "answer": "Overrides column names of embedded objects when same @Embeddable is used multiple times in one entity."
    },
    {
      "question": "What does @Version do?",
      "answer": "Marks numeric field for optimistic locking. Auto-incremented on each update. Detects concurrent modifications."
    },
    {
      "question": "What is the default value of @Column(nullable)?",
      "answer": "true (allows NULL). Set nullable=false to add NOT NULL constraint."
    },
    {
      "question": "True or False: @Temporal is required for java.time.LocalDate",
      "answer": "False. LocalDate is natively supported in JPA 2.2+. @Temporal is only for legacy java.util.Date/Calendar."
    },
    {
      "question": "What does @Column(updatable=false) do?",
      "answer": "UPDATE SQL excludes this column. Useful for 'created' date or immutable fields."
    },
    {
      "question": "What does @Lob do?",
      "answer": "Maps to BLOB (byte[]) or CLOB (String). No length constraint. Used for large binary or text data."
    },
    {
      "question": "What must a composite key class implement?",
      "answer": "Serializable. Also equals() and hashCode() (used by JPA for identity comparison)."
    }
  ],

  "exam_traps": [
    "Forgetting no-arg constructor: Entity requires it (can be private, but exists).",
    "Not using @Temporal on java.util.Date: fails at runtime or mapping error.",
    "Assuming enum default is STRING: default is ORDINAL (fragile). Consider STRING for safety.",
    "Using @Embeddable for separate tables: @Embedded shares parent table. For separate FK table, use @OneToOne/@OneToMany.",
    "Confusing @IdClass and @EmbeddedId: both work, different syntax. @IdClass mirrors @Id fields, @EmbeddedId is single field.",
    "Not implementing equals/hashCode in PK class: JPA uses them for caching and comparisons.",
    "Assuming @Column(length) affects numeric types: only affects STRING/CHAR. Numeric types need columnDefinition.",
    "@Version on non-numeric field: must be numeric (long, int, short, byte, BigInteger)."
  ]
}
```

---

## Topic 3: Entity Relationships (7 Types)

```json
{
  "topic_id": "jpa_03",
  "topic_title": "Entity Relationships",
  "chapter": "Chapter 11",
  "summary": "JPA supports seven relationship types: 1:1 unidirectional, 1:1 bidirectional, 1:N unidirectional, N:1 unidirectional, 1:N bidirectional (equiv. to N:1 bidirectional from inverse), M:N unidirectional, M:N bidirectional. Relationships are navigable in code as object references. Owning side holds @JoinColumn/@JoinTable; inverse side uses mappedBy. Cascade, fetch strategy, and orphan removal control synchronization behavior.",
  
  "key_concepts": [
    "Seven relationship types: 1:1 uni, 1:1 bi, 1:N uni, N:1 uni, 1:N bi, M:N uni, M:N bi",
    "Owning side: defines join strategy (@JoinColumn, @JoinTable), holds FK, mappings defined here",
    "Inverse side: uses mappedBy attribute, read-only (updates ignored), convenience navigation",
    "@OneToOne: 1:1 mapping. Owning side has @JoinColumn (FK in source). Inverse has mappedBy.",
    "@OneToMany: 1:N mapping. Source has collection (List, Set, Collection, Map). Owning side uses @JoinColumn on target or @JoinTable.",
    "@ManyToOne: N:1 mapping (inverse of @OneToMany). Usually unidirectional, often mandatory (optional=false).",
    "@ManyToMany: M:N mapping. Both sides have collections. @JoinTable with joinColumns (source FK) and inverseJoinColumns (target FK).",
    "@JoinColumn: defines FK column in source table. Attributes: name (FK col name), referencedColumnName (target PK), table (target table if multi-table).",
    "@JoinTable: defines join table for M:N. Attributes: name (table name), joinColumns (source FKs), inverseJoinColumns (target FKs).",
    "@PrimaryKeyJoinColumn: 1:1 mapping using target's PK as FK (no separate FK column).",
    "Cascade types: ALL, PERSIST, MERGE, REMOVE, REFRESH, DETACH. Propagate EntityManager calls.",
    "Fetch strategies: EAGER (load immediately), LAZY (load on access, may require open PC). Default: *ToOne=EAGER, *ToMany=LAZY.",
    "orphanRemoval=true: when relationship set to null/removed from collection, orphaned entity is deleted.",
    "Collection types: Collection (no order, no index), List (indexed), Set (no duplicates, no order), Map (key-based lookup).",
    "Bidirectional consistency: both sides must refer to same target. Maintaining consistency is developer responsibility (no automatic two-way update).",
    "Database FK naming: default = property_name + '_' + target_PK_column_name. e.g., address_id, employee_id."
  ],

  "annotations": [
    "@OneToOne(targetEntity=Address.class, cascade=CascadeType.ALL, fetch=FetchType.LAZY, optional=true, mappedBy=\"employee\", orphanRemoval=false) - 1:1 mapping",
    "@OneToMany(targetEntity=Phone.class, cascade=CascadeType.PERSIST, fetch=FetchType.LAZY, mappedBy=\"employee\") - 1:N mapping (collection in source)",
    "@ManyToOne(targetEntity=Department.class, cascade=CascadeType.PERSIST, fetch=FetchType.EAGER, optional=false) - N:1 mapping",
    "@ManyToMany(targetEntity=Project.class, cascade=CascadeType.PERSIST, fetch=FetchType.LAZY, mappedBy=\"employees\") - M:N mapping",
    "@JoinColumn(name=\"ADDRESS_ID\", referencedColumnName=\"id\", table=\"ADDRESSES\") - FK column definition",
    "@JoinTable(name=\"EMPLOYEE_PROJECT\", joinColumns=@JoinColumn(name=\"EMP_ID\"), inverseJoinColumns=@JoinColumn(name=\"PROJ_ID\")) - Join table for M:N",
    "@PrimaryKeyJoinColumn(name=\"EMP_ID\", referencedColumnName=\"EMPLOYEE_ID\") - 1:1 using PK as FK"
  ],

  "api_methods": [
    "No direct API—annotations drive creation. Relationships are accessed through object references and collections. persist/remove/merge cascade based on cascade attribute."
  ],

  "rules": [
    "1:1 unidirectional: Source has @OneToOne with @JoinColumn (FK in source). Target has no reference. One table has FK.",
    "1:1 bidirectional: Both have @OneToOne. Owning side has @JoinColumn, inverse has mappedBy. Still one FK (in owning side table).",
    "1:N unidirectional: Source has Collection<Target> with @OneToMany. Can use @JoinColumn on source (FK in Target table) or @JoinTable (separate join table).",
    "N:1 unidirectional: Source has @ManyToOne reference. FK in source table. Inverse (@OneToMany) not present.",
    "1:N bidirectional: Source has Collection<Target>. Target has Source reference with @ManyToOne. Typically @OneToMany uses mappedBy. FK in Target table (owned by @ManyToOne side).",
    "M:N unidirectional: Source has Collection<Target> with @ManyToMany and @JoinTable. Target has no reference. Join table created.",
    "M:N bidirectional: Both have Collection. One side is owning (has @JoinTable), other has mappedBy. Both sides navigate each other.",
    "Owning side determines join strategy: only owning side's @JoinColumn/@JoinTable affects database. Inverse side is read-only.",
    "For bidirectional, always pick owning side clearly. Usually @ManyToOne or side with fewer entities owns the relationship.",
    "Default cascade is empty (no cascade). Set cascade=CascadeType.ALL to propagate all operations (persist, remove, merge, refresh).",
    "Default fetch: *ToOne (1:1, N:1) = EAGER. *ToMany (1:N, M:N) = LAZY. LAZY requires open PC to access collection (else LazyInitializationException).",
    "orphanRemoval=true: when child removed from collection or relationship set null, child is deleted. Only for dependent children.",
    "Collection default type: List (if not specified). List has indexed access. Set has no duplicates. Map allows get(key) access.",
    "Bidirectional consistency is developer's job. Setting emp.setDept(dept) doesn't auto set dept.getEmployees().add(emp). Must do both.",
    "@JoinColumn default name = property_name + \"_\" + target_PK_column. e.g., address_id, project_id.",
    "For @OneToMany(mappedBy=\"parent\"), the FK is in child table, owned by @ManyToOne on child."
  ],

  "code_examples": [
    {
      "title": "1:1 UNIDIRECTIONAL (Employee -> Address)",
      "code": "// Address: no reference back to Employee\n@Entity\n@Table(name=\"ADDRESSES\")\npublic class Address implements Serializable {\n  @Id\n  @GeneratedValue(strategy=GenerationType.AUTO)\n  private Long id;\n  \n  @Column(name=\"STREET\")\n  private String street;\n  \n  public Address() {\n  }\n  // getters/setters\n}\n\n// Employee: owns relationship with @JoinColumn\n@Entity\n@Table(name=\"EMPLOYEES\")\npublic class Employee implements Serializable {\n  @Id\n  @GeneratedValue(strategy=GenerationType.AUTO)\n  private Long id;\n  \n  @Column(name=\"NAME\")\n  private String name;\n  \n  @OneToOne(cascade=CascadeType.ALL, fetch=FetchType.LAZY)\n  @JoinColumn(name=\"ADDRESS_ID\", referencedColumnName=\"id\")\n  private Address address;\n  \n  public Employee() {\n  }\n  // getters/setters\n}\n\n// Database: EMPLOYEES table has ADDRESS_ID FK column"
    },
    {
      "title": "1:1 BIDIRECTIONAL with mappedBy (Computer <-> Employee)",
      "code": "// Employee: owns relationship (has @JoinColumn, FK in EMPLOYEES table)\n@Entity\n@Table(name=\"EMPLOYEES\")\npublic class Employee implements Serializable {\n  @Id\n  @GeneratedValue(strategy=GenerationType.AUTO)\n  private Long id;\n  \n  @Column(name=\"NAME\")\n  private String name;\n  \n  @OneToOne(cascade=CascadeType.ALL, fetch=FetchType.EAGER, optional=false)\n  @JoinColumn(name=\"COMPUTER_ID\", referencedColumnName=\"id\")\n  private Computer computer;\n  \n  public Employee() {\n  }\n  \n  public void setComputer(Computer c) {\n    this.computer = c;\n    if (c != null && c.getEmployee() != this) {\n      c.setEmployee(this);  // Maintain bidirectional consistency\n    }\n  }\n  // getters/setters\n}\n\n// Computer: inverse side (mappedBy, no @JoinColumn, read-only)\n@Entity\n@Table(name=\"COMPUTERS\")\npublic class Computer implements Serializable {\n  @Id\n  @GeneratedValue(strategy=GenerationType.AUTO)\n  private Long id;\n  \n  @Column(name=\"MODEL\")\n  private String model;\n  \n  @OneToOne(mappedBy=\"computer\", cascade=CascadeType.ALL, fetch=FetchType.LAZY)\n  private Employee employee;\n  \n  public Computer() {\n  }\n  \n  public void setEmployee(Employee e) {\n    this.employee = e;\n    if (e != null && e.getComputer() != this) {\n      e.setComputer(this);  // Maintain bidirectional consistency\n    }\n  }\n  // getters/setters\n}\n\n// Usage:\nEmployee emp = new Employee(\"John\");\nComputer comp = new Computer(\"Dell XPS\");\nemp.setComputer(comp);  // Sets both sides\n// comp.getEmployee() == emp  (if code maintains bidirectional)"
    },
    {
      "title": "1:N UNIDIRECTIONAL (Employee -> PhoneCollection)",
      "code": "// Phone: no reference back to Employee\n@Entity\n@Table(name=\"PHONES\")\npublic class Phone implements Serializable {\n  @Id\n  @GeneratedValue(strategy=GenerationType.AUTO)\n  private Long id;\n  \n  @Column(name=\"NUMBER\")\n  private String number;\n  \n  public Phone() {\n  }\n  // getters/setters\n}\n\n// Employee: owns relationship with Collection<Phone>\n@Entity\n@Table(name=\"EMPLOYEES\")\npublic class Employee implements Serializable {\n  @Id\n  @GeneratedValue(strategy=GenerationType.AUTO)\n  private Long id;\n  \n  @Column(name=\"NAME\")\n  private String name;\n  \n  @OneToMany(cascade=CascadeType.ALL, fetch=FetchType.LAZY, orphanRemoval=true)\n  @JoinColumn(name=\"EMPLOYEE_ID\", referencedColumnName=\"id\")  // FK in PHONES table\n  private List<Phone> phones = new ArrayList<>();\n  \n  public Employee() {\n  }\n  \n  public void addPhone(Phone p) {\n    phones.add(p);\n  }\n  \n  public void removePhone(Phone p) {\n    phones.remove(p);  // orphanRemoval=true deletes p from DB\n  }\n  // getters/setters\n}\n\n// Database: PHONES table has EMPLOYEE_ID FK column"
    },
    {
      "title": "1:N BIDIRECTIONAL DETAILED EXAMPLE (Department <-> Employee)",
      "code": "// COMPLETE BIDIRECTIONAL 1:N MAPPING\n// Key annotations highlighted: @OneToMany on parent (owning=false), @ManyToOne on child (owning=true)\n\n// Parent: Department (has Collection<Employee>, @OneToMany with mappedBy)\n@Entity\n@Table(name=\"DEPARTMENTS\")\npublic class Department implements Serializable {\n  @Id\n  @GeneratedValue(strategy=GenerationType.AUTO)\n  private Long deptId;\n  \n  @Column(name=\"DEPT_NAME\", length=100)\n  private String deptName;\n  \n  // ===== CRITICAL: @OneToMany with mappedBy=\"department\" =====\n  // This side is INVERSE (read-only). No @JoinColumn or @JoinTable here.\n  // The FK \"DEPARTMENT_ID\" is in EMPLOYEES table, owned by Employee.@ManyToOne\n  @OneToMany(\n    targetEntity=Employee.class,\n    mappedBy=\"department\",  // Points to 'department' property in Employee\n    cascade={CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE},\n    fetch=FetchType.LAZY,\n    orphanRemoval=false  // Employees stay if dept deleted (optional)\n  )\n  private List<Employee> employees = new ArrayList<>();\n  \n  public Department() {\n  }\n  \n  public Department(String deptName) {\n    this.deptName = deptName;\n  }\n  \n  // Helper to maintain bidirectional consistency\n  public void addEmployee(Employee emp) {\n    if (!employees.contains(emp)) {\n      employees.add(emp);\n      emp.setDepartment(this);  // Set inverse reference\n    }\n  }\n  \n  public void removeEmployee(Employee emp) {\n    if (employees.contains(emp)) {\n      employees.remove(emp);\n      emp.setDepartment(null);  // Clear inverse reference\n    }\n  }\n  \n  public List<Employee> getEmployees() {\n    return employees;\n  }\n  \n  public void setEmployees(List<Employee> employees) {\n    this.employees = employees;\n  }\n  // getters/setters\n}\n\n// Child: Employee (has Department reference, @ManyToOne)\n@Entity\n@Table(name=\"EMPLOYEES\")\npublic class Employee implements Serializable {\n  @Id\n  @GeneratedValue(strategy=GenerationType.AUTO)\n  private Long empId;\n  \n  @Column(name=\"EMP_NAME\", length=100)\n  private String empName;\n  \n  @Column(name=\"SALARY\")\n  private BigDecimal salary;\n  \n  // ===== CRITICAL: @ManyToOne with NO mappedBy =====\n  // This is OWNING side (FK in EMPLOYEES table named DEPARTMENT_ID).\n  // @JoinColumn defines: FK column name = \"DEPARTMENT_ID\", references Department.deptId\n  @ManyToOne(\n    targetEntity=Department.class,\n    cascade={CascadeType.PERSIST, CascadeType.MERGE},  // Don't REMOVE parent if child removed\n    fetch=FetchType.EAGER,  // Usually EAGER for *ToOne\n    optional=true  // Employee can exist without department (nullable FK)\n  )\n  @JoinColumn(\n    name=\"DEPARTMENT_ID\",  // FK column in EMPLOYEES table\n    referencedColumnName=\"deptId\",  // References Department.deptId (mapped to DEPT_ID column)\n    nullable=true  // Allows NULL\n  )\n  private Department department;\n  \n  public Employee() {\n  }\n  \n  public Employee(String empName, BigDecimal salary) {\n    this.empName = empName;\n    this.salary = salary;\n  }\n  \n  // Helper to set both sides\n  public void setDepartment(Department dept) {\n    this.department = dept;\n    if (dept != null && !dept.getEmployees().contains(this)) {\n      dept.getEmployees().add(this);  // Update inverse side\n    }\n  }\n  \n  public Long getEmpId() {\n    return empId;\n  }\n  \n  public String getEmpName() {\n    return empName;\n  }\n  \n  public void setEmpName(String empName) {\n    this.empName = empName;\n  }\n  \n  public BigDecimal getSalary() {\n    return salary;\n  }\n  \n  public void setSalary(BigDecimal salary) {\n    this.salary = salary;\n  }\n  \n  public Department getDepartment() {\n    return department;\n  }\n  \n  // getters/setters\n}\n\n// USAGE:\nDepartment sales = new Department(\"Sales\");\nEmployee alice = new Employee(\"Alice\", new BigDecimal(\"50000\"));\nEmployee bob = new Employee(\"Bob\", new BigDecimal(\"55000\"));\n\nsales.addEmployee(alice);  // Sets both sides: alice.department=sales, sales.employees includes alice\nsales.addEmployee(bob);\n\n// Database state after persist:\n// DEPARTMENTS: deptId=1, DEPT_NAME='Sales'\n// EMPLOYEES: empId=1, EMP_NAME='Alice', SALARY=50000, DEPARTMENT_ID=1\n//            empId=2, EMP_NAME='Bob',   SALARY=55000, DEPARTMENT_ID=1"
    },
    {
      "title": "M:N UNIDIRECTIONAL (Employee -> ProjectCollection)",
      "code": "// Project: no reference back to Employee\n@Entity\n@Table(name=\"PROJECTS\")\npublic class Project implements Serializable {\n  @Id\n  @GeneratedValue(strategy=GenerationType.AUTO)\n  private Long id;\n  \n  @Column(name=\"PROJECT_NAME\")\n  private String projectName;\n  \n  public Project() {\n  }\n  // getters/setters\n}\n\n// Employee: owns relationship with @ManyToMany and @JoinTable\n@Entity\n@Table(name=\"EMPLOYEES\")\npublic class Employee implements Serializable {\n  @Id\n  @GeneratedValue(strategy=GenerationType.AUTO)\n  private Long id;\n  \n  @Column(name=\"NAME\")\n  private String name;\n  \n  @ManyToMany(cascade=CascadeType.PERSIST, fetch=FetchType.LAZY)\n  @JoinTable(\n    name=\"EMPLOYEE_PROJECT\",  // Join table\n    joinColumns=@JoinColumn(name=\"EMPLOYEE_ID\", referencedColumnName=\"id\"),  // FK to EMPLOYEES\n    inverseJoinColumns=@JoinColumn(name=\"PROJECT_ID\", referencedColumnName=\"id\")  // FK to PROJECTS\n  )\n  private List<Project> projects = new ArrayList<>();\n  \n  public Employee() {\n  }\n  \n  public void addProject(Project p) {\n    if (!projects.contains(p)) {\n      projects.add(p);\n    }\n  }\n  // getters/setters\n}\n\n// Database:\n// EMPLOYEES: id, name\n// PROJECTS: id, project_name\n// EMPLOYEE_PROJECT: employee_id FK, project_id FK (composite PK or unique constraint)"
    },
    {
      "title": "M:N BIDIRECTIONAL (Employee <-> Project)",
      "code": "// Project: inverse side with mappedBy\n@Entity\n@Table(name=\"PROJECTS\")\npublic class Project implements Serializable {\n  @Id\n  @GeneratedValue(strategy=GenerationType.AUTO)\n  private Long id;\n  \n  @Column(name=\"PROJECT_NAME\")\n  private String projectName;\n  \n  @ManyToMany(mappedBy=\"projects\", cascade=CascadeType.PERSIST, fetch=FetchType.LAZY)\n  private List<Employee> employees = new ArrayList<>();\n  \n  public Project() {\n  }\n  \n  public void addEmployee(Employee emp) {\n    if (!employees.contains(emp)) {\n      employees.add(emp);\n      emp.getProjects().add(this);\n    }\n  }\n  // getters/setters\n}\n\n// Employee: owning side with @JoinTable\n@Entity\n@Table(name=\"EMPLOYEES\")\npublic class Employee implements Serializable {\n  @Id\n  @GeneratedValue(strategy=GenerationType.AUTO)\n  private Long id;\n  \n  @Column(name=\"NAME\")\n  private String name;\n  \n  @ManyToMany(cascade=CascadeType.PERSIST, fetch=FetchType.LAZY)\n  @JoinTable(\n    name=\"EMPLOYEE_PROJECT\",\n    joinColumns=@JoinColumn(name=\"EMPLOYEE_ID\"),\n    inverseJoinColumns=@JoinColumn(name=\"PROJECT_ID\")\n  )\n  private List<Project> projects = new ArrayList<>();\n  \n  public Employee() {\n  }\n  \n  public void addProject(Project p) {\n    if (!projects.contains(p)) {\n      projects.add(p);\n      p.getEmployees().add(this);\n    }\n  }\n  // getters/setters\n}"
    }
  ],

  "flashcards": [
    {
      "question": "What defines the owning side of a relationship?",
      "answer": "The side that defines the join strategy: @JoinColumn for 1:1 and N:1, @JoinTable for M:N. Inverse side uses mappedBy and is read-only."
    },
    {
      "question": "What is mappedBy?",
      "answer": "Used on inverse side of bidirectional relationship. Points to property name on owning side. Indicates this side is read-only."
    },
    {
      "question": "Name the default fetch strategy for @OneToMany.",
      "answer": "LAZY. Collection not loaded until accessed. Requires open Persistence Context (else LazyInitializationException)."
    },
    {
      "question": "Name the default fetch strategy for @ManyToOne.",
      "answer": "EAGER. Reference loaded immediately with owning entity."
    },
    {
      "question": "What does orphanRemoval=true do?",
      "answer": "When child removed from collection or relationship set null, child entity is deleted from database. Use for dependent entities only."
    },
    {
      "question": "What annotation defines join table columns for M:N?",
      "answer": "@JoinTable with joinColumns (FK to source) and inverseJoinColumns (FK to target). Used on owning side only."
    },
    {
      "question": "How many times does a FK appear in a 1:1 bidirectional relationship?",
      "answer": "Once. Owning side table has FK. Inverse side table has no FK column."
    },
    {
      "question": "In 1:N bidirectional, which side owns the relationship?",
      "answer": "@ManyToOne side (child). FK in child table. @OneToMany uses mappedBy."
    },
    {
      "question": "What is the default @JoinColumn name?",
      "answer": "property_name + '_' + target_PK_column_name. e.g., department_deptId, address_id."
    },
    {
      "question": "Can you set values on the inverse side of a bidirectional relationship?",
      "answer": "No. Inverse side is read-only. Changes to inverse side are ignored by JPA. Must update owning side."
    },
    {
      "question": "True or False: cascade=ALL propagates to all @OneToMany relationships in entity.",
      "answer": "False. cascade applies to single relationship only. Each relationship specifies its own cascade."
    },
    {
      "question": "What does @PrimaryKeyJoinColumn do?",
      "answer": "Maps 1:1 relationship using target entity's PK as FK (no separate FK column). Target PK = source FK."
    },
    {
      "question": "In 1:N unidirectional with @JoinColumn, where is the FK?",
      "answer": "In the target (many) table. @JoinColumn on @OneToMany side specifies FK column name in target table."
    },
    {
      "question": "True or False: In M:N bidirectional, both sides have @JoinTable.",
      "answer": "False. Only owning side has @JoinTable. Inverse side has mappedBy."
    },
    {
      "question": "What does cascade=CascadeType.REMOVE do?",
      "answer": "When parent entity is removed, related child entities (reachable via cascaded relationship) are also removed."
    }
  ],

  "exam_traps": [
    "Confusing owning side with 'one' side: owning side is determined by @JoinColumn/@JoinTable, not by 1 or N.",
    "Updating inverse side expecting database change: inverse side is read-only. Updates are silently ignored.",
    "Assuming lazy-loaded collection is populated: LAZY means not loaded until accessed. Must access in open PC.",
    "Setting cascade=ALL unnecessarily: be explicit. REMOVE cascade can delete unexpected entities.",
    "Forgetting bidirectional consistency in code: JPA does NOT auto-update both sides. Developer must maintain.",
    "Not handling LazyInitializationException: accessing LAZY collection outside PC throws exception.",
    "Assuming FK is in 'one' side of 1:N: FK is in 'many' side (target table), owned by @ManyToOne.",
    "Using wrong collection type: List is default (indexed), Set removes duplicates, Map allows key-based lookup.",
    "Not specifying targetEntity when type is ambiguous: can be inferred from generic Collection<T>, but safer to specify.",
    "Orphan removal on non-dependent entities: orphanRemoval=true deletes child when removed from collection. Only use for truly dependent children."
  ]
}
```

---

## Topic 4: Entity Inheritance

```json
{
  "topic_id": "jpa_04",
  "topic_title": "Entity Inheritance",
  "chapter": "Chapter 12",
  "summary": "JPA supports three inheritance strategies to map class hierarchies to relational tables: SINGLE_TABLE (all classes in one table with discriminator, fastest, default), JOINED (separate table per class with FK joins, normalized), TABLE_PER_CLASS (one table per concrete class, non-portable). @MappedSuperclass is used for non-entity base classes. Discriminator column (@DiscriminatorColumn, @DiscriminatorValue) identifies concrete type.",
  
  "key_concepts": [
    "Three inheritance strategies: SINGLE_TABLE, JOINED, TABLE_PER_CLASS",
    "SINGLE_TABLE (default): all classes in one table, uses @DiscriminatorColumn to identify type, fastest, non-normalized",
    "JOINED: separate table per class, FK join to parent, normalized, slower due to joins",
    "TABLE_PER_CLASS: one table per concrete class, all columns in each, non-portable, no discriminator",
    "@Inheritance(strategy=...) on root entity class. Defines strategy for entire hierarchy.",
    "@DiscriminatorColumn: defines column that holds class type indicator. Name default='DTYPE', type default=STRING(31).",
    "@DiscriminatorValue: on each concrete class, specifies value in discriminator column. Default=simple class name.",
    "@MappedSuperclass: marks non-entity base class. Properties inherited into child tables. No table for superclass.",
    "Polymorphic queries: queries return instances of specified type and subtypes. find(superclass, pk) still works.",
    "Inheritance vs composition: inheritance for IS-A relationships (Person IS-A). Composition for HAS-A (Employee HAS-A Address).",
    "Discriminator value is automatically inserted/queried by JPA. Developer need not set it.",
    "SINGLE_TABLE fastest for reads (no joins), but wasteful (null columns for unused subtypes).",
    "JOINED most normalized (no null columns), but slower (joins required).",
    "TABLE_PER_CLASS simplest schema (copy columns to each table), but non-portable (polymorphic queries across tables).",
    "@MappedSuperclass properties added to each child table (copy down), no single parent table."
  ],

  "annotations": [
    "@Entity - Marks class as entity",
    "@Inheritance(strategy=InheritanceType.SINGLE_TABLE|JOINED|TABLE_PER_CLASS) - On root entity. Defines strategy for hierarchy.",
    "@DiscriminatorColumn(name=\"DTYPE\", discriminatorType=DiscriminatorType.STRING, length=31, columnDefinition=\"VARCHAR(50)\") - On root entity. Defines discriminator column.",
    "@DiscriminatorValue(\"CUSTOMER\") - On concrete entity. Value in discriminator column for this type.",
    "@MappedSuperclass - On abstract non-entity base class. Properties inherited, no table created.",
    "@PrimaryKeyJoinColumn(name=\"EMP_ID\", referencedColumnName=\"PERSON_ID\") - On child entity (JOINED strategy). Links to parent PK."
  ],

  "api_methods": [
    "No direct API—annotations drive schema mapping. Polymorphic queries use Criteria API or JPQL: \"SELECT p FROM Person p\" returns Person and all subtypes."
  ],

  "rules": [
    "@Inheritance applies to entire hierarchy. Defined on root (abstract or concrete). All descendants inherit strategy.",
    "SINGLE_TABLE uses one table for all types. All columns present in table. Non-null columns only for root and each concrete type.",
    "@DiscriminatorColumn default name='DTYPE', type=STRING(31). Automatic column addition in SINGLE_TABLE. Not used in JOINED/TABLE_PER_CLASS (keys distinguish).",
    "@DiscriminatorValue default = simple class name (e.g., \"Customer\", \"Employee\"). Can be any value.",
    "SINGLE_TABLE is fastest (no joins) but non-normalized (many null columns).",
    "JOINED requires one table per class (including abstract). Root table has PK. Child tables have PK+FK to parent, plus own columns.",
    "TABLE_PER_CLASS each concrete class gets table with all inherited columns. Abstract classes have no table. Non-portable (queries across tables not guaranteed).",
    "@MappedSuperclass is not an entity. Has no table. Properties copied to each child table (down-inheritance, not up). Useful for shared columns (id, createdDate).",
    "Polymorphic queries: SELECT p FROM Person p returns all Person, Customer, Employee instances. JPA constructs query using discriminator (SINGLE_TABLE) or UNION (TABLE_PER_CLASS) or JOINs (JOINED).",
    "Abstract vs concrete: Can be abstract (shared base) or concrete (instantiable). Discriminator value required for concrete classes.",
    "Root class: Can be abstract (just template) or concrete (has own rows). If abstract, typically marked as such in Java (abstract keyword) but not required by JPA.",
    "No strategy switching in hierarchy: all classes use same strategy (defined at root).",
    "Default strategy is SINGLE_TABLE if @Inheritance not specified."
  ],

  "code_examples": [
    {
      "title": "SINGLE_TABLE Strategy (All in One Table with Discriminator)",
      "code": "// SINGLE_TABLE: PERSON table holds Person, Customer, Employee with DTYPE column\n\n@Entity\n@Table(name=\"PERSON\")\n@Inheritance(strategy=InheritanceType.SINGLE_TABLE)  // Strategy for all subtypes\n@DiscriminatorColumn(name=\"DTYPE\", discriminatorType=DiscriminatorType.STRING, length=50)\n@DiscriminatorValue(\"P\")  // Value for Person rows\npublic abstract class Person implements Serializable {\n  @Id\n  @GeneratedValue(strategy=GenerationType.AUTO)\n  private Long id;\n  \n  @Column(name=\"NAME\", length=100)\n  private String name;\n  \n  @Basic\n  @Temporal(TemporalType.DATE)\n  @Column(name=\"DOB\")\n  private java.util.Date dateOfBirth;\n  \n  public Person() {\n  }\n  \n  public Person(String name, java.util.Date dob) {\n    this.name = name;\n    this.dateOfBirth = dob;\n  }\n  \n  public abstract String getRole();\n  // getters/setters\n}\n\n@Entity\n@DiscriminatorValue(\"C\")  // Value in DTYPE for Customer rows\npublic class Customer extends Person implements Serializable {\n  @Column(name=\"CUSTOMER_ID\")\n  private String customerId;\n  \n  @Column(name=\"LOYALTY_POINTS\")\n  private int loyaltyPoints;\n  \n  public Customer() {\n  }\n  \n  public Customer(String name, java.util.Date dob, String customerId) {\n    super(name, dob);\n    this.customerId = customerId;\n    this.loyaltyPoints = 0;\n  }\n  \n  @Override\n  public String getRole() {\n    return \"CUSTOMER\";\n  }\n  // getters/setters\n}\n\n@Entity\n@DiscriminatorValue(\"E\")  // Value in DTYPE for Employee rows\npublic class Employee extends Person implements Serializable {\n  @Column(name=\"EMPLOYEE_ID\")\n  private String employeeId;\n  \n  @Column(name=\"SALARY\")\n  private BigDecimal salary;\n  \n  public Employee() {\n  }\n  \n  public Employee(String name, java.util.Date dob, String employeeId, BigDecimal salary) {\n    super(name, dob);\n    this.employeeId = employeeId;\n    this.salary = salary;\n  }\n  \n  @Override\n  public String getRole() {\n    return \"EMPLOYEE\";\n  }\n  // getters/setters\n}\n\n// Database PERSON table:\n// id | name       | dob        | DTYPE | customer_id | loyalty_points | employee_id | salary\n// 1  | John       | 1990-05-15 | E     | NULL        | NULL           | EMP001      | 50000\n// 2  | Jane       | 1985-08-20 | C     | CUST002     | 500            | NULL        | NULL"
    },
    {
      "title": "JOINED Strategy (Separate Tables with Joins)",
      "code": "// JOINED: Person (base), Customer, Employee each get own table\n\n@Entity\n@Table(name=\"PERSON\")\n@Inheritance(strategy=InheritanceType.JOINED)  // Separate tables with FK joins\npublic abstract class Person implements Serializable {\n  @Id\n  @GeneratedValue(strategy=GenerationType.AUTO)\n  private Long id;\n  \n  @Column(name=\"NAME\", length=100)\n  private String name;\n  \n  @Basic\n  @Temporal(TemporalType.DATE)\n  @Column(name=\"DOB\")\n  private java.util.Date dateOfBirth;\n  \n  public Person() {\n  }\n  \n  public Person(String name, java.util.Date dob) {\n    this.name = name;\n    this.dateOfBirth = dob;\n  }\n  \n  public abstract String getRole();\n  // getters/setters\n}\n\n@Entity\n@Table(name=\"CUSTOMER\")\npublic class Customer extends Person implements Serializable {\n  @PrimaryKeyJoinColumn(name=\"PERSON_ID\", referencedColumnName=\"id\")  // FK to PERSON.id\n  \n  @Column(name=\"CUSTOMER_ID\")\n  private String customerId;\n  \n  @Column(name=\"LOYALTY_POINTS\")\n  private int loyaltyPoints;\n  \n  public Customer() {\n  }\n  \n  public Customer(String name, java.util.Date dob, String customerId) {\n    super(name, dob);\n    this.customerId = customerId;\n    this.loyaltyPoints = 0;\n  }\n  \n  @Override\n  public String getRole() {\n    return \"CUSTOMER\";\n  }\n  // getters/setters\n}\n\n@Entity\n@Table(name=\"EMPLOYEE\")\npublic class Employee extends Person implements Serializable {\n  @PrimaryKeyJoinColumn(name=\"PERSON_ID\", referencedColumnName=\"id\")  // FK to PERSON.id\n  \n  @Column(name=\"EMPLOYEE_ID\")\n  private String employeeId;\n  \n  @Column(name=\"SALARY\")\n  private BigDecimal salary;\n  \n  public Employee() {\n  }\n  \n  public Employee(String name, java.util.Date dob, String employeeId, BigDecimal salary) {\n    super(name, dob);\n    this.employeeId = employeeId;\n    this.salary = salary;\n  }\n  \n  @Override\n  public String getRole() {\n    return \"EMPLOYEE\";\n  }\n  // getters/setters\n}\n\n// Database:\n// PERSON table: id | name | dob\n// CUSTOMER table: person_id (PK/FK) | customer_id | loyalty_points\n// EMPLOYEE table: person_id (PK/FK) | employee_id | salary\n\n// Query uses JOINs to reconstruct entities."
    },
    {
      "title": "TABLE_PER_CLASS Strategy (Table Per Concrete Class)",
      "code": "// TABLE_PER_CLASS: each concrete class gets table with all columns (including inherited)\n// Non-portable (queries across tables not guaranteed)\n\n@Entity\n@Inheritance(strategy=InheritanceType.TABLE_PER_CLASS)  // One table per concrete class\npublic abstract class Person implements Serializable {\n  @Id\n  @GeneratedValue(strategy=GenerationType.AUTO)\n  private Long id;\n  \n  @Column(name=\"NAME\", length=100)\n  private String name;\n  \n  @Basic\n  @Temporal(TemporalType.DATE)\n  @Column(name=\"DOB\")\n  private java.util.Date dateOfBirth;\n  \n  public Person() {\n  }\n  \n  public Person(String name, java.util.Date dob) {\n    this.name = name;\n    this.dateOfBirth = dob;\n  }\n  \n  public abstract String getRole();\n  // getters/setters\n}\n\n@Entity\n@Table(name=\"CUSTOMER\")\npublic class Customer extends Person implements Serializable {\n  @Column(name=\"CUSTOMER_ID\")\n  private String customerId;\n  \n  @Column(name=\"LOYALTY_POINTS\")\n  private int loyaltyPoints;\n  \n  public Customer() {\n  }\n  \n  public Customer(String name, java.util.Date dob, String customerId) {\n    super(name, dob);\n    this.customerId = customerId;\n  }\n  \n  @Override\n  public String getRole() {\n    return \"CUSTOMER\";\n  }\n  // getters/setters\n}\n\n@Entity\n@Table(name=\"EMPLOYEE\")\npublic class Employee extends Person implements Serializable {\n  @Column(name=\"EMPLOYEE_ID\")\n  private String employeeId;\n  \n  @Column(name=\"SALARY\")\n  private BigDecimal salary;\n  \n  public Employee() {\n  }\n  \n  public Employee(String name, java.util.Date dob, String employeeId, BigDecimal salary) {\n    super(name, dob);\n    this.employeeId = employeeId;\n    this.salary = salary;\n  }\n  \n  @Override\n  public String getRole() {\n    return \"EMPLOYEE\";\n  }\n  // getters/setters\n}\n\n// Database:\n// CUSTOMER table: id | name | dob | customer_id | loyalty_points\n// EMPLOYEE table: id | name | dob | employee_id | salary\n// No PERSON table (abstract). Columns copied down."
    },
    {
      "title": "@MappedSuperclass (Non-Entity Base Class)",
      "code": "// @MappedSuperclass: not an entity, no table. Properties inherited and copied to child tables.\n\n@MappedSuperclass  // Not an entity, no table\npublic abstract class BaseEntity implements Serializable {\n  @Id\n  @GeneratedValue(strategy=GenerationType.AUTO)\n  private Long id;\n  \n  @Basic\n  @Temporal(TemporalType.TIMESTAMP)\n  @Column(name=\"CREATED_AT\", nullable=false, updatable=false)\n  private java.util.Date createdAt;\n  \n  @Basic\n  @Temporal(TemporalType.TIMESTAMP)\n  @Column(name=\"UPDATED_AT\")\n  private java.util.Date updatedAt;\n  \n  public BaseEntity() {\n    this.createdAt = new java.util.Date();\n    this.updatedAt = new java.util.Date();\n  }\n  \n  public Long getId() {\n    return id;\n  }\n  \n  public java.util.Date getCreatedAt() {\n    return createdAt;\n  }\n  \n  public java.util.Date getUpdatedAt() {\n    return updatedAt;\n  }\n  \n  public void setUpdatedAt(java.util.Date updatedAt) {\n    this.updatedAt = updatedAt;\n  }\n}\n\n// Concrete entities inherit from BaseEntity\n@Entity\n@Table(name=\"CUSTOMERS\")\npublic class Customer extends BaseEntity implements Serializable {\n  @Column(name=\"CUSTOMER_NAME\")\n  private String customerName;\n  \n  @Column(name=\"EMAIL\")\n  private String email;\n  \n  public Customer() {\n    super();\n  }\n  \n  public Customer(String customerName, String email) {\n    super();\n    this.customerName = customerName;\n    this.email = email;\n  }\n  // getters/setters\n}\n\n@Entity\n@Table(name=\"ORDERS\")\npublic class Order extends BaseEntity implements Serializable {\n  @Column(name=\"ORDER_NUMBER\")\n  private String orderNumber;\n  \n  @Column(name=\"TOTAL_AMOUNT\")\n  private BigDecimal totalAmount;\n  \n  public Order() {\n    super();\n  }\n  \n  public Order(String orderNumber, BigDecimal totalAmount) {\n    super();\n    this.orderNumber = orderNumber;\n    this.totalAmount = totalAmount;\n  }\n  // getters/setters\n}\n\n// Database:\n// CUSTOMERS table: id | created_at | updated_at | customer_name | email\n// ORDERS table: id | created_at | updated_at | order_number | total_amount\n// No separate BaseEntity table"
    }
  ],

  "flashcards": [
    {
      "question": "What is the default inheritance strategy in JPA?",
      "answer": "SINGLE_TABLE. All classes in one table with @DiscriminatorColumn. Fastest but non-normalized."
    },
    {
      "question": "Where is the FK in JOINED strategy?",
      "answer": "In child table, pointing to parent table PK. Uses @PrimaryKeyJoinColumn. Allows NOT NULL constraints on parent columns."
    },
    {
      "question": "True or False: @DiscriminatorColumn is used in JOINED strategy.",
      "answer": "False. Discriminator only in SINGLE_TABLE. JOINED uses table structure itself to distinguish types."
    },
    {
      "question": "What does @MappedSuperclass indicate?",
      "answer": "Non-entity base class. Not persisted, no table. Properties copied to child entity tables."
    },
    {
      "question": "What is the default value of @DiscriminatorColumn name?",
      "answer": "DTYPE (VARCHAR(31)). Automatically added to SINGLE_TABLE table."
    },
    {
      "question": "True or False: Abstract classes in JPA require @Entity annotation.",
      "answer": "False. Abstract classes can be @Entity (root of hierarchy) or @MappedSuperclass (shared properties). Java's abstract keyword is independent."
    },
    {
      "question": "How does polymorphic query work in SINGLE_TABLE?",
      "answer": "SELECT p FROM Person p returns all Person and subtypes. Query filters by @DiscriminatorColumn value."
    },
    {
      "question": "What is the advantage of TABLE_PER_CLASS?",
      "answer": "Simple schema (all columns in each table, no NULL columns for unused subtypes). Disadvantage: non-portable, queries across tables complex."
    },
    {
      "question": "True or False: You can mix inheritance strategies in a hierarchy.",
      "answer": "False. Strategy defined at root, applies to all descendants. No mixing."
    },
    {
      "question": "What does @DiscriminatorValue do?",
      "answer": "On concrete class, specifies value in discriminator column for instances of that type. Default=simple class name."
    },
    {
      "question": "In JOINED strategy, which table has the PK?",
      "answer": "Root (parent) table. Child tables have PK that is also FK to parent PK."
    },
    {
      "question": "Can you instantiate a @MappedSuperclass?",
      "answer": "No. @MappedSuperclass is not an entity. Only concrete @Entity subclasses are instantiable."
    },
    {
      "question": "True or False: SINGLE_TABLE is slower than JOINED for reads.",
      "answer": "False. SINGLE_TABLE is fastest for reads (no joins). JOINED requires joins (slower)."
    },
    {
      "question": "What is the trade-off between SINGLE_TABLE and JOINED?",
      "answer": "SINGLE_TABLE: fast reads, non-normalized (many NULLs). JOINED: normalized (no NULLs), slower (joins required)."
    },
    {
      "question": "True or False: @Inheritance can be specified on child entities.",
      "answer": "False. @Inheritance is specified on root entity only. Applies to entire hierarchy."
    }
  ],

  "exam_traps": [
    "Assuming JOINED has discriminator column: discriminator only in SINGLE_TABLE. JOINED uses FK/table structure.",
    "Applying @Inheritance to child class: must be on root class. Child classes don't redeclare it.",
    "Thinking TABLE_PER_CLASS is portable: it's not. Queries across tables are database-specific.",
    "Forgetting @DiscriminatorValue on concrete classes: JPA needs to know how to identify type. Default=class name (usually fine).",
    "Using @MappedSuperclass as entity: @MappedSuperclass is not @Entity. Has no table. Use @Entity for polymorphic root.",
    "Assuming @MappedSuperclass allows polymorphic queries: polymorphic queries only for @Entity roots. @MappedSuperclass just shares columns.",
    "Not handling NULL columns in SINGLE_TABLE: many columns are NULL for non-applicable types. Schema not normalized.",
    "Instantiating abstract @Entity: abstract @Entity is still @Entity. Can be instantiated (though bad practice). @MappedSuperclass cannot.",
    "Changing strategy mid-hierarchy: all classes must use same strategy. Defined at root.",
    "Assuming discriminator value is user-set: JPA auto-manages discriminator. Developer doesn't set it in persist()."
  ]
}
```

---

## Code Annotation Challenge: Bidirectional OneToMany with Full Annotations

### Problem Statement

You are given a partial mapping for a Department-Employee relationship. Complete the mapping by adding ALL necessary annotations, ensuring:

1. Department has a Collection of Employees
2. Employee has a reference to Department
3. The relationship is bidirectional
4. FK is in the EMPLOYEES table (owned by @ManyToOne)
5. Department is parent (inverse), Employee is child (owning)
6. Add all cascade, fetch, and optional attributes explicitly
7. Add @Column annotations for non-relationship properties
8. Add @Table and @Column mappings

### Incomplete Code (Fill in annotations)

```java
// === PARENT: Department ===
public class Department implements Serializable {
  private Long deptId;
  private String deptName;
  private List<Employee> employees;
  
  public Department() {
  }
  
  public void addEmployee(Employee emp) {
    if (!employees.contains(emp)) {
      employees.add(emp);
      emp.setDepartment(this);
    }
  }
  
  public List<Employee> getEmployees() {
    return employees;
  }
}

// === CHILD: Employee ===
public class Employee implements Serializable {
  private Long empId;
  private String empName;
  private BigDecimal salary;
  private Department department;
  
  public Employee() {
  }
  
  public Employee(String empName, BigDecimal salary) {
    this.empName = empName;
    this.salary = salary;
  }
  
  public void setDepartment(Department dept) {
    this.department = dept;
    if (dept != null && !dept.getEmployees().contains(this)) {
      dept.getEmployees().add(this);
    }
  }
  
  public Department getDepartment() {
    return department;
  }
}
```

### Solution (Complete Annotations)

```java
import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

// ===== PARENT: Department (Inverse Side - Read-Only) =====
@Entity
@Table(name = "DEPARTMENTS")
public class Department implements Serializable {
  
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "DEPT_ID")
  private Long deptId;
  
  @Column(name = "DEPT_NAME", length = 100, nullable = false)
  private String deptName;
  
  // ===== CRITICAL: @OneToMany with mappedBy (INVERSE SIDE) =====
  // FK is in EMPLOYEES table (owned by Employee.@ManyToOne)
  // mappedBy="department" points to 'department' property in Employee
  // This side is READ-ONLY (for navigation only)
  // Cascade: PERSIST, MERGE, REMOVE propagates to employees
  // Fetch: LAZY (default for *ToMany, don't load collection unless accessed)
  // orphanRemoval: false (keep employees if dept deleted, optional)
  @OneToMany(
    targetEntity = Employee.class,
    mappedBy = "department",
    cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE},
    fetch = FetchType.LAZY,
    orphanRemoval = false
  )
  private List<Employee> employees = new ArrayList<>();
  
  public Department() {
  }
  
  public Department(String deptName) {
    this.deptName = deptName;
  }
  
  public void addEmployee(Employee emp) {
    if (!employees.contains(emp)) {
      employees.add(emp);
      emp.setDepartment(this);
    }
  }
  
  public void removeEmployee(Employee emp) {
    if (employees.contains(emp)) {
      employees.remove(emp);
      emp.setDepartment(null);
    }
  }
  
  public Long getDeptId() {
    return deptId;
  }
  
  public String getDeptName() {
    return deptName;
  }
  
  public void setDeptName(String deptName) {
    this.deptName = deptName;
  }
  
  public List<Employee> getEmployees() {
    return employees;
  }
  
  public void setEmployees(List<Employee> employees) {
    this.employees = employees;
  }
}

// ===== CHILD: Employee (Owning Side - FK in EMPLOYEES table) =====
@Entity
@Table(name = "EMPLOYEES")
public class Employee implements Serializable {
  
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "EMP_ID")
  private Long empId;
  
  @Column(name = "EMP_NAME", length = 100, nullable = false)
  private String empName;
  
  @Column(name = "SALARY", columnDefinition = "DECIMAL(10,2)")
  private BigDecimal salary;
  
  // ===== CRITICAL: @ManyToOne (OWNING SIDE) =====
  // This is the owning side (no mappedBy)
  // @JoinColumn defines FK in EMPLOYEES table: DEPARTMENT_ID → DEPARTMENTS.dept_id
  // Cascade: PERSIST, MERGE (don't REMOVE parent if employee deleted)
  // Fetch: EAGER (default for *ToOne, load immediately)
  // optional: true (employee can exist without department, nullable FK)
  @ManyToOne(
    targetEntity = Department.class,
    cascade = {CascadeType.PERSIST, CascadeType.MERGE},
    fetch = FetchType.EAGER,
    optional = true
  )
  @JoinColumn(
    name = "DEPARTMENT_ID",
    referencedColumnName = "DEPT_ID",
    nullable = true,
    foreignKey = @ForeignKey(name = "FK_EMP_DEPT")
  )
  private Department department;
  
  public Employee() {
  }
  
  public Employee(String empName, BigDecimal salary) {
    this.empName = empName;
    this.salary = salary;
  }
  
  public void setDepartment(Department dept) {
    this.department = dept;
    if (dept != null && !dept.getEmployees().contains(this)) {
      dept.getEmployees().add(this);
    }
  }
  
  public Long getEmpId() {
    return empId;
  }
  
  public String getEmpName() {
    return empName;
  }
  
  public void setEmpName(String empName) {
    this.empName = empName;
  }
  
  public BigDecimal getSalary() {
    return salary;
  }
  
  public void setSalary(BigDecimal salary) {
    this.salary = salary;
  }
  
  public Department getDepartment() {
    return department;
  }
  
  @Override
  public String toString() {
    return "Employee{" +
      "empId=" + empId +
      ", empName='" + empName + '\'' +
      ", salary=" + salary +
      ", department=" + (department != null ? department.getDeptName() : "null") +
      '}';
  }
}

// ===== USAGE EXAMPLE =====
public class Main {
  public static void main(String[] args) {
    // Create entities
    Department sales = new Department("Sales");
    Employee alice = new Employee("Alice", new BigDecimal("50000"));
    Employee bob = new Employee("Bob", new BigDecimal("55000"));
    
    // Maintain bidirectional consistency
    sales.addEmployee(alice);  // Sets: alice.department=sales, sales.employees.add(alice)
    sales.addEmployee(bob);    // Sets: bob.department=sales, sales.employees.add(bob)
    
    // Persist (with cascading)
    // em.persist(sales);  // Cascades PERSIST to alice and bob
    
    // Database state:
    // DEPARTMENTS: dept_id=1, dept_name='Sales'
    // EMPLOYEES: emp_id=1, emp_name='Alice', salary=50000, department_id=1
    //            emp_id=2, emp_name='Bob', salary=55000, department_id=1
  }
}
```

---

## Practice Questions

### Multiple Choice (6 questions)

1) **Which annotation marks a class as an entity?**
   - A) @Table
   - B) @Entity
   - C) @Persistent
   - D) @Model
   - E) @JPA
   
   **Answer: B**

2) **In a bidirectional 1:N relationship, which side owns the foreign key?**
   - A) The 1 side (parent, with @OneToMany)
   - B) The N side (child, with @ManyToOne)
   - C) Neither side (always in a join table)
   - D) Decided by developer at runtime
   - E) Both sides jointly
   
   **Answer: B**

3) **What does orphanRemoval=true do in a @OneToMany?**
   - A) Prevents loading of orphaned entities
   - B) Automatically deletes child entities when removed from collection
   - C) Renames orphaned entities
   - D) Locks orphaned entities from updates
   - E) No effect (deprecated attribute)
   
   **Answer: B**

4) **Which inheritance strategy is most normalized (fewest NULL columns)?**
   - A) SINGLE_TABLE
   - B) JOINED
   - C) TABLE_PER_CLASS
   - D) All are equivalent
   - E) None—inheritance is always non-normalized
   
   **Answer: B**

5) **What is the default @GeneratedValue strategy?**
   - A) IDENTITY
   - B) SEQUENCE
   - C) AUTO
   - D) TABLE
   - E) UUID
   
   **Answer: C**

6) **Which attribute is required on every entity?**
   - A) @Table
   - B) @Id
   - C) @Column
   - D) @GeneratedValue
   - E) @Basic
   
   **Answer: B**

### True/False (3 questions)

7) **True or False: You can update the inverse side of a bidirectional relationship and expect JPA to synchronize the database.**
   
   **Answer: False** (Inverse side is read-only; updates are ignored. Must update owning side.)

8) **True or False: @Temporal is required on java.time.LocalDate properties.**
   
   **Answer: False** (@Temporal only for legacy java.util.Date/Calendar. LocalDate is natively supported in JPA 2.2+.)

9) **True or False: @PersistenceContext(type=PersistenceContextType.EXTENDED) can be used in a stateless session bean.**
   
   **Answer: False** (Extended context is for stateful session beans. Stateless beans use transaction-scoped context only.)

### Short Answer (3 questions)

10) **Describe how to determine the owning side in a one-to-many bidirectional relationship.**
    
    **Answer:** The owning side is the N side (has @ManyToOne). It defines the join strategy via @JoinColumn or @JoinTable. The FK is in the N side's table. The 1 side (parent) is the inverse side and uses mappedBy in @OneToMany to reference the @ManyToOne property name.

11) **What are the three ways to map an inheritance hierarchy to a relational database using JPA?**
    
    **Answer:** 1) SINGLE_TABLE: All classes in one table with @DiscriminatorColumn (fastest, non-normalized). 2) JOINED: Separate table per class with FK joins (normalized, slower). 3) TABLE_PER_CLASS: One table per concrete class, all columns in each (non-portable).

12) **Explain the difference between @IdClass and @EmbeddedId for composite primary keys.**
    
    **Answer:** @IdClass: External non-entity PK class (mirrors @Id fields in entity). Entity has multiple @Id-annotated fields. @EmbeddedId: @Embeddable PK class, entity has single @EmbeddedId field of that type. @EmbeddedId is more OO; @IdClass is simpler for legacy code. Both require equals() and hashCode().

### Code Annotation Questions (2 questions)

13) **You have a many-to-many relationship between Employee and Project. Write the annotations for the OWNING SIDE (Employee) of a bidirectional M:N relationship. Specify @ManyToMany and @JoinTable with proper join column names.**
    
    **Answer:**
    ```java
    @ManyToMany(
      targetEntity = Project.class,
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = null  // Owning side has no mappedBy
    )
    @JoinTable(
      name = "EMPLOYEE_PROJECT",
      joinColumns = @JoinColumn(
        name = "EMPLOYEE_ID",
        referencedColumnName = "id"
      ),
      inverseJoinColumns = @JoinColumn(
        name = "PROJECT_ID",
        referencedColumnName = "id"
      )
    )
    private List<Project> projects = new ArrayList<>();
    ```

14) **Complete the mapping for an embedded address object in an Employee entity. Include @Embeddable class definition, @Embedded in Employee, and @AttributeOverrides to customize column names.**
    
    **Answer:**
    ```java
    @Embeddable
    public class Address implements Serializable {
      @Column(name = "STREET")
      private String street;
      
      @Column(name = "CITY")
      private String city;
      
      @Column(name = "ZIP")
      private String zip;
      
      public Address() {
      }
      // getters/setters
    }
    
    @Entity
    @Table(name = "EMPLOYEES")
    public class Employee implements Serializable {
      @Id
      @GeneratedValue(strategy = GenerationType.AUTO)
      private Long id;
      
      @Embedded
      @AttributeOverrides({
        @AttributeOverride(name = "street", column = @Column(name = "HOME_STREET")),
        @AttributeOverride(name = "city", column = @Column(name = "HOME_CITY")),
        @AttributeOverride(name = "zip", column = @Column(name = "HOME_ZIP"))
      })
      private Address address;
      
      // getters/setters
    }
    ```

---

## Summary of High-Priority Topics

**Bruce's Focus Areas (Likely Exam Questions):**

1. **Seven Entity Relationship Types** — Technically difficult. Expects students to:
   - Distinguish owning side (has @JoinColumn/@JoinTable) from inverse side (has mappedBy)
   - Understand when FK is in source table vs. target table vs. join table
   - Know default fetch strategies (*ToOne=EAGER, *ToMany=LAZY)
   - Handle bidirectional consistency code (both sides must be updated)

2. **Composite Keys** — Two approaches, don't memorize blindly:
   - **@IdClass**: External PK class (non-entity), @Id fields in entity mirror PK class fields
   - **@EmbeddedId/@Embeddable**: @Embeddable PK class, single @EmbeddedId field in entity
   - Both require equals() and hashCode(). Understand trade-offs, not just syntax.

3. **Code Annotations** — Annotation discipline critical:
   - Students focus on relationships (OneToMany, ManyToOne) and forget entity itself
   - **Always annotate class first** (@Entity, @Table) before members
   - Each property requires annotation (@Column, @Id, @Basic, @Temporal, etc.)
   - Common mistake: forgetting @Column on basic properties, assuming defaults

4. **Auto-Generated Key Types** — Unlikely to ask specifics, but "several kinds exist":
   - AUTO (dialect-dependent), IDENTITY (auto-increment), SEQUENCE (DB sequence), TABLE (portable), UUID (newest)
   - Know each has different performance/portability characteristics

---

## Additional Resources

- **ACID Properties (in transaction context)**:
  - Atomic: All-or-nothing (commit/rollback)
  - Consistent: Data integrity maintained
  - Isolated: No interference from other transactions
  - Durable: Persisted after commit

- **Testing Types** (from quiz context):
  - Performance test: Response/processing time
  - Unit test: Single component
  - Black box test: System acceptance (external behavior only)
  - White box test: Code structure (internal logic)

---

**End of Study Package**

Generated: 2026-04-18 | Topics: 4 | Flashcards: 60+ | Practice Questions: 14 | Code Examples: 15+
