# COMP 4915 Exam Study: Shell Programming & Kubernetes

**Module 09**: Shell Programming (Bash Scripting)  
**Module 10A-B**: Containers, Pods & Kubernetes Infrastructure  
**Student**: A01353636  
**Last Updated**: April 2026

---

## Table of Contents

1. [Module 09: Shell Programming Fundamentals](#module-09-shell-programming)
2. [Module 10A-B: Kubernetes & Container Orchestration](#module-10ab-kubernetes)
3. [Flashcards](#flashcards-30-cards)
4. [Practice Questions](#practice-questions-15-questions)
5. [Key Distinctions & Examples](#key-distinctions)

---

## Module 09: Shell Programming

### Section 1: Control Structures

#### If-Then-Else Statements

Basic if structure:
```bash
if [ condition ]; then
    commands
elif [ condition ]; then
    commands
else
    commands
fi
```

The test command `[ ]` evaluates conditions. Exit status 0 = true, non-zero = false.

**File Tests (most critical for exams)**:
- `-e file` : File exists
- `-f file` : Regular file exists
- `-d dir`  : Directory exists
- `-r file` : File readable by current user
- `-w file` : File writable by current user
- `-x file` : File executable by current user
- `-s file` : File exists and has size > 0
- `-L file` : Symbolic link exists

**String Tests**:
- `-z string` : String is empty (length = 0)
- `-n string` : String is NOT empty
- `string1 = string2` : Strings are equal
- `string1 != string2` : Strings NOT equal
- `string1 < string2` : Lexicographic less-than
- `string1 > string2` : Lexicographic greater-than

**Numeric Tests**:
- `num1 -eq num2` : Equal
- `num1 -ne num2` : Not equal
- `num1 -lt num2` : Less than
- `num1 -le num2` : Less than or equal
- `num1 -gt num2` : Greater than
- `num1 -ge num2` : Greater than or equal

**Logical Operators**:
- `[ cond1 ] && [ cond2 ]` : AND (both true)
- `[ cond1 ] || [ cond2 ]` : OR (at least one true)
- `[ ! cond ]` : NOT (negate)

#### Case Statements

Execute different blocks based on pattern matching:

```bash
case $var in
    pattern1) commands ;;
    pattern2|pattern3) commands ;;
    *) default commands ;;
esac
```

Patterns support wildcards: `*`, `?`, `[abc]`

### Section 2: Loops

#### For Loops

Iterate over list:
```bash
for var in list; do
    commands
done
```

Iterate over array indices:
```bash
for ((i=0; i<10; i++)); do
    commands
done
```

Iterate over positional parameters:
```bash
for file in "$@"; do
    echo "$file"
done
```

#### While and Until Loops

```bash
while [ condition ]; do
    commands
done

until [ condition ]; do
    commands
done
```

Until loop continues until condition becomes TRUE (opposite of while).

#### Loop Control

- `break` : Exit loop immediately
- `continue` : Skip to next iteration
- `break 2` : Break out of nested loop (2 levels up)

### Section 3: Bash Functions - Core Concept

#### Function Syntax (Bash)

Bash functions do NOT have formal parameters in the function signature:

```bash
myfunction() {
    local var="$1"
    echo "First arg: $var"
    echo "All args: $@"
    echo "Number of args: $#"
}

myfunction arg1 arg2 arg3
```

**Key Points About Bash Functions**:
- No parameter list in signature: `myfunction()` NOT `myfunction(arg1, arg2)`
- Arguments accessed via `$1`, `$2`, `$3`, etc.
- `$@` expands to all positional parameters (quoted preserves spaces)
- `$*` expands to all parameters as single string
- `$#` is count of arguments
- `local` keyword creates function-scoped variables (prevents global pollution)
- Return value: `return N` exits function with status N (0=success)
- Function output: Use `echo` or `$()` for output capture

#### Practical Example: addx Function

From Lab08: Add execute permission to files

```bash
addx() {
    if [ $# -eq 0 ]; then
        echo "Usage: addx file [file ...]" >&2
        return 1
    fi
    for file in "$@"; do
        if [ -e "$file" ]; then
            chmod u+x "$file"
            echo "Added execute permission to $file"
        else
            echo "addx: $file: No such file" >&2
        fi
    done
}
```

Usage:
```bash
addx script1.sh script2.sh script3.sh
```

### Section 4: C Functions - Contrast

#### Function Syntax (C)

C functions HAVE formal parameters declared in the signature:

```c
int add(int a, int b) {
    return a + b;
}

char* process_string(char *str, int mode) {
    // Processing logic
    return result;
}

void print_file(const char *filename) {
    // Read and print file
}
```

**Key Points About C Functions**:
- Formal parameters listed in function signature: `func(int a, int b)`
- Type checking enforced at compile time
- Return type explicitly declared
- Parameters passed by value (or by pointer if `*` used)
- No access to variable argument count like bash `$#`
- Stack-based parameter passing
- Function pointers and callbacks common pattern

#### Direct Comparison: Bash vs C

| Aspect | Bash | C |
|--------|------|---|
| **Parameters in signature** | No (accessed via $1, $2, $#) | Yes (formal list: `int func(int a, int b)`) |
| **Type checking** | None (runtime only) | Strict (compile-time) |
| **Return value** | Exit status (0-255) or echo output | Declared type (int, char*, void, etc.) |
| **Variable scope** | Global by default, `local` for function scope | Block-scoped (local), function-scoped |
| **Argument count** | Accessible via `$#` | Not directly accessible (use *args pattern or sentinel) |
| **Variadic** | Easy: `"$@"` captures all | Complex: ellipsis `...` requires va_list |

**Exam Focus**: Instructors emphasize this distinction because:
1. Students often mix syntax (writing bash functions with C-style params)
2. Understanding parameter passing is fundamental to scripting
3. Test questions may ask to identify function type or fix incorrect syntax
4. Real-world scripts use bash functions heavily; knowing the difference prevents errors

### Section 5: Parameter Expansion

Core syntax for variable manipulation:

```bash
${var}              # Variable value
${var:-default}     # Use default if unset or null
${var:=default}     # Assign default if unset or null (modifies var)
${var:+alternate}   # Use alternate if var is set and non-null
${var:?error}       # Print error and exit if unset or null
${#var}             # Length of variable (string length)
${var#pattern}      # Remove shortest matching prefix
${var##pattern}     # Remove longest matching prefix
${var%pattern}      # Remove shortest matching suffix
${var%%pattern}     # Remove longest matching suffix
${var/old/new}      # Replace first occurrence
${var//old/new}     # Replace all occurrences
${var:offset:length} # Substring (offset and length)
```

**Examples**:
```bash
path="/usr/local/bin:/usr/bin:/bin"
echo "${path##*:}"     # Output: bin (longest suffix removed)

file="archive.tar.gz"
echo "${file%.*}"      # Output: archive.tar (remove .gz)
echo "${file%%.*}"     # Output: archive (remove all suffixes)

# Default values
config="${CONFIG_FILE:-/etc/config.conf}"
home="${HOME:=/root}"
```

### Section 6: Here Documents and Here Strings

#### Here Document (<<EOF)

Redirect multi-line input to command:

```bash
cat << EOF
This is line 1
This is line 2
Variable expansion: $HOME
EOF
```

Prevent variable expansion with quoted delimiter:
```bash
cat << 'EOF'
This $HOME is NOT expanded
EOF
```

Common use: Create files or send input to commands

#### Here String (<<<)

Pass string directly as stdin:

```bash
while read line; do
    echo "Processing: $line"
done <<< "$(cat file.txt)"
```

### Section 7: Read Command

Read input from stdin:

```bash
read var                    # Read one line into $var
read -p "Prompt: " var      # Print prompt before reading
read -r var                 # Raw mode (backslash not escape char)
read -n 5 var               # Read exactly 5 characters
read -t 5 var               # Timeout after 5 seconds
read -a array               # Read line into array (space-separated)
```

**Example - Parse input**:
```bash
while IFS=: read user pass uid gid rest; do
    echo "User: $user, UID: $uid"
done < /etc/passwd
```

### Section 8: Trap and Signal Handling

Handle signals and errors:

```bash
trap 'cleanup' EXIT         # Run cleanup on exit
trap 'handle_error' ERR     # Run on command error
trap 'ignore_signal' SIGTERM # Ignore SIGTERM

cleanup() {
    rm -f /tmp/tempfile
    echo "Cleanup complete"
}
```

Signal codes: SIGHUP(1), SIGINT(2), SIGQUIT(3), SIGTERM(15)

### Section 9: Arrays and Arithmetic

#### Indexed Arrays

```bash
arr=(one two three)         # Create array
echo "${arr[0]}"            # Access first element
echo "${arr[@]}"            # All elements
echo "${#arr[@]}"           # Array length
arr[3]="four"               # Add element
```

#### Arithmetic Expansion

```bash
result=$((5 + 3))           # $(( )) evaluates math
((x++))                     # Increment x
((y = x * 2))               # Assignment in arithmetic
[ $x -gt 5 ]                # Use -gt for numeric comparison
```

### Section 10: Built-in Commands and Utilities

#### Essential Builtins

- `echo` : Output text
- `printf` : Formatted output
- `test` / `[` : Conditional evaluation
- `expr` : Evaluate expressions
- `sed` : Stream editor (pattern replacement)
- `awk` : Text processing and reporting
- `grep` : Search patterns in files
- `cut` : Extract columns from text
- `tr` : Translate/delete characters
- `sort` : Sort lines
- `uniq` : Remove duplicate lines
- `wc` : Count lines, words, characters
- `head` / `tail` : Print first/last lines

#### Text Processing Examples

```bash
# Extract first field (colon-delimited)
cut -d: -f1 /etc/passwd

# Replace pattern
sed 's/old/new/g' file.txt

# Count matching lines
grep -c "pattern" file.txt

# Extract columns by pattern
awk -F: '{print $1, $3}' /etc/passwd
```

---

## Module 10A-B: Kubernetes & Container Orchestration

### Section 1: Why Kubernetes Exists

#### The Infrastructure Drift Problem

**Traditional Server Management**:
- Manual installation of applications
- Manual configuration changes
- Inconsistent state across instances
- Hard to reproduce failures
- Scaling requires human intervention
- Infrastructure "drifts" from intended state over time

**Kubernetes Solution**:
- **Declarative**: Describe desired state in YAML
- **Automatic**: System maintains that state
- **Observable**: Easy to inspect actual state
- **Recoverable**: Failed containers automatically restarted
- **Scalable**: Simple commands to scale workloads

### Section 2: Core Kubernetes Concepts

#### Container (OCI Standard)

**Open Container Initiative (OCI)**:
- Industry standard for container format
- Specifies container image format, runtime, filesystem
- Enables portability across container runtimes

**Container Runtime Interface (CRI)**:
- Kubernetes abstraction for container operations
- Implementations: containerd, CRI-O, Docker
- Kubelet uses CRI to manage containers

**Container Basics**:
- Lightweight process isolation
- Filesystem isolation via mount namespaces
- Network isolation via network namespaces
- Resource limits via cgroups
- Image: Read-only filesystem template
- Container: Running instance of image

#### Pod (Atomic Unit)

**Pod Definition**:
- Smallest deployable unit in Kubernetes
- Contains one or more containers (usually one)
- Shares network namespace (all containers share IP)
- Containers in pod can communicate via localhost
- Shared storage volumes mount in all containers

**Why Pod (Not Just Container)**:
- Enables sidecar pattern (logging, monitoring alongside app)
- Grouped containers share network/storage resources
- Atomic unit for scheduling and scaling

#### Deployment

**Deployment Definition**:
- Declarative object for managing Pod replicas
- Defines desired number of running Pods
- Automatically creates ReplicaSets
- Handles rolling updates and rollbacks
- Manages Pod lifecycle

**Example YAML**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
```

#### kubectl (Command-Line Interface)

**Common kubectl Commands**:
- `kubectl get nodes` : List cluster nodes
- `kubectl get pods` : List pods in current namespace
- `kubectl describe pod <name>` : Detailed pod info
- `kubectl logs <pod-name>` : Container logs
- `kubectl exec -it <pod> bash` : Execute command in container
- `kubectl apply -f file.yaml` : Create/update resource from YAML
- `kubectl delete pod <name>` : Delete pod
- `kubectl scale deployment <name> --replicas=5` : Scale deployment

### Section 3: Container Isolation & Namespaces

#### Linux Namespaces (Pod Implementation)

Pods isolate containers using Linux kernel namespaces:

**PID Namespace**:
- Isolates process IDs
- Each pod has own PID 1 (init process)
- Processes in pod cannot see processes outside pod
- Signal delivery scoped to namespace

**IPC Namespace**:
- Isolates inter-process communication
- Separate shared memory segments
- Separate message queues
- Separate semaphores

**Network Namespace**:
- Isolates network stack
- Each pod gets virtual Ethernet interface
- Own IP address
- Containers in same pod share network interface (localhost connectivity)

**Mount Namespace**:
- Isolates filesystem mounts
- Container sees own filesystem tree
- Volume mounts appear in container's filesystem
- Changes to mounts isolated from host

**User Namespace**:
- Isolates user/group IDs
- Containers often run as unprivileged users
- Provides security boundary

#### cgroups (Resource Limits)

Control Groups limit resource usage:
- CPU limits (cpu.max, cpu.weight)
- Memory limits (memory.max, memory.high)
- I/O limits (io.max)
- Device access restrictions

### Section 4: Kubernetes Architecture

#### Control Plane Components

**kube-apiserver**:
- REST API gateway for cluster
- State stored in etcd
- Validates and processes all requests
- All cluster changes go through API server

**etcd Database**:
- Distributed key-value store
- Stores all cluster state
- Single source of truth
- Requires backup strategy

**kube-scheduler**:
- Assigns pods to nodes
- Considers resource requests, constraints, taints
- Makes scheduling decisions
- Doesn't run the pods (kubelet does)

**kube-controller-manager**:
- Runs cluster controllers
- ReplicaSet Controller: Maintains pod replicas
- Deployment Controller: Manages rolling updates
- StatefulSet Controller: Ordered pod startup
- DaemonSet Controller: One pod per node
- Job Controller: One-off task execution

#### Worker Node Components

**kubelet**:
- Agent running on every node
- Communicates with control plane
- Manages pods via CRI (Container Runtime Interface)
- Reports node status and pod status
- Watches etcd for pod assignments
- Runs privileged operations (mounting volumes, setting up networking)

**kube-proxy**:
- Network proxy on every node
- Maintains network rules (iptables/IPVS)
- Implements Service abstraction
- Routes traffic to correct pod

**Container Runtime**:
- Implements CRI (Container Runtime Interface)
- Manages container lifecycle (create, start, stop, delete)
- Common implementations: containerd, CRI-O
- Pulls images, manages storage

#### Cluster Networking

**CNI (Container Networking Interface)**:
- Standard for cluster networking plugins
- Assigns IP addresses to pods
- Implements inter-pod communication
- Common implementations: Flannel, Weave, Calico

**Service Abstraction**:
- Stable IP for group of pods
- Load balances across pod replicas
- Types: ClusterIP, NodePort, LoadBalancer
- Enables decoupling of clients from pods

### Section 5: Deployment Patterns

#### ReplicaSet

Ensures specified number of pod replicas running:
```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: web-replica
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: web:v1
```

#### DaemonSet

Runs one pod per node (monitoring, logging):
```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: node-exporter
spec:
  selector:
    matchLabels:
      app: node-exporter
  template:
    metadata:
      labels:
        app: node-exporter
    spec:
      containers:
      - name: exporter
        image: prom/node-exporter:latest
```

Use case: Log collection, monitoring agents, network plugins

#### StatefulSet

Ordered pod startup for stateful applications:
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  serviceName: mysql
  replicas: 3
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:5.7
```

Guarantees: Ordered names (mysql-0, mysql-1, mysql-2), ordered startup

#### Job

One-off task execution (batch processing, backups):
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: backup
spec:
  template:
    spec:
      containers:
      - name: backup
        image: backup-tool:latest
        command: ["./backup.sh"]
      restartPolicy: Never
```

### Section 6: Kubernetes API and Resources

#### API Groups and Versions

- `v1` : Core API (Pods, Services, ConfigMaps, Secrets)
- `apps/v1` : Deployments, StatefulSets, DaemonSets, ReplicaSets
- `batch/v1` : Jobs, CronJobs
- `networking.k8s.io/v1` : NetworkPolicy, Ingress

#### YAML Structure

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
  namespace: default
  labels:
    app: myapp
    version: v1
  annotations:
    description: "My pod description"
spec:
  containers:
  - name: app-container
    image: myapp:1.0
    ports:
    - containerPort: 8080
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
    env:
    - name: CONFIG_PATH
      value: "/etc/config"
    volumeMounts:
    - name: config-vol
      mountPath: /etc/config
  volumes:
  - name: config-vol
    configMap:
      name: app-config
```

#### JSONPath Queries

Extract specific values from resources:
```bash
kubectl get pods -o jsonpath='{.items[*].metadata.name}'
kubectl get pod my-pod -o jsonpath='{.spec.containers[0].image}'
kubectl get pods -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.phase}{"\n"}{end}'
```

### Section 7: Advanced Topics

#### CRI (Container Runtime Interface)

Contract between kubelet and container runtime:
- `CreateContainer` : Create but don't start
- `StartContainer` : Start container
- `StopContainer` : Stop container
- `RemoveContainer` : Delete container
- `ListContainers` : List containers

Enables multiple runtime implementations (Docker, containerd, CRI-O)

#### Container Lifecycle Hooks

Hooks execute at key lifecycle points:
```yaml
lifecycle:
  postStart:
    exec:
      command: ["/bin/sh", "-c", "echo 'Container started'"]
  preStop:
    exec:
      command: ["/bin/sh", "-c", "sleep 15"]
```

#### Namespaces in Kubernetes

**Kubernetes Namespaces** (different from Linux namespaces):
- Logical clusters within single cluster
- Resource quota boundaries
- RBAC (Role-Based Access Control) boundaries
- Service DNS scoped to namespace

```bash
kubectl get namespaces
kubectl create namespace dev
kubectl get pods --namespace dev
kubectl get pods -A                    # All namespaces
```

#### Operators and Infrastructure Controllers

**Operator Pattern**:
- Custom resource definitions (CRDs)
- Custom controllers manage resources
- Encodes operational knowledge
- Example: Prometheus Operator manages monitoring

---

## Flashcards (30+ Cards)

### Shell Programming Cards

**Card 1: File Test Operators**
- Front: What does `-x file` test?
- Back: File exists AND is executable by current user

**Card 2: String Comparison**
- Front: How do you test if a string is empty in bash?
- Back: Use `[ -z "$string" ]` or `[ "$string" = "" ]`

**Card 3: Function Definition**
- Front: Write the shell function syntax to create a function named "process"
- Back: `process() { ... }` (Note: NO parameters in signature)

**Card 4: Function Arguments**
- Front: In bash, how do you access the third argument passed to a function?
- Back: `$3` (or use `${3}` for clarity)

**Card 5: Bash vs C Functions**
- Front: Do bash functions list parameters in the signature?
- Back: No. Bash functions have empty signatures like `func()`. Parameters accessed via `$1, $2, $#, $@`. C functions list parameters: `int func(int a, int b)`

**Card 6: Bash Parameter Expansion**
- Front: What does `${var:-default}` do?
- Back: Returns the value of `var`, or `default` if `var` is unset or empty

**Card 7: Parameter Expansion Assignment**
- Front: What's the difference between `${var:-default}` and `${var:=default}`?
- Back: `-default` uses default if unset; `:=default` uses AND assigns default to var

**Card 8: String Pattern Removal**
- Front: How do you remove the shortest suffix matching pattern from a string?
- Back: `${var%pattern}` (% = suffix/right, # = prefix/left)

**Card 9: For Loop Syntax**
- Front: Write a for loop that iterates over all positional parameters
- Back: `for arg in "$@"; do echo "$arg"; done`

**Card 10: Case Statement**
- Front: What's the special pattern in a case statement that matches anything?
- Back: `*)` matches any value not matched by previous patterns

**Card 11: Arithmetic in Bash**
- Front: How do you assign the result of 3 + 5 to a variable in bash?
- Back: `result=$((3 + 5))` or `result=$(expr 3 + 5)`

**Card 12: Read Command**
- Front: Write a command to read input with a prompt "Enter name: " into variable `name`
- Back: `read -p "Enter name: " name`

**Card 13: While Loop**
- Front: Write a while loop that reads lines from stdin until EOF
- Back: `while read line; do echo "$line"; done`

**Card 14: Here Document**
- Front: How do you prevent variable expansion in a here document?
- Back: Quote the delimiter: `cat << 'EOF'` instead of `cat << EOF`

**Card 15: Array Access**
- Front: How do you access all elements of an array in bash?
- Back: `"${arr[@]}"` (or `${arr[*]}` but less safe with IFS)

**Card 16: Test Conditions**
- Front: Combine two conditions to test if file exists AND is readable
- Back: `[ -e "$file" ] && [ -r "$file" ]` or `[ -e "$file" -a -r "$file" ]`

**Card 17: local Variables**
- Front: Why use `local` keyword in bash functions?
- Back: Prevents variable from polluting global scope; limits scope to function

**Card 18: Exit Status**
- Front: What does `return 0` do in a bash function?
- Back: Exits function with status 0 (success). Other values indicate error

**Card 19: String Substitution**
- Front: Replace all occurrences of "old" with "new" in a string variable
- Back: `${string//old/new}`

**Card 20: Numeric Comparison**
- Front: What test operator checks if num1 is greater than num2?
- Back: `[ $num1 -gt $num2 ]` (use -gt, not >)

### Kubernetes Cards

**Card 21: Pod Definition**
- Front: What is a Kubernetes Pod?
- Back: Smallest deployable unit; one or more containers sharing network namespace (same IP, can communicate via localhost)

**Card 22: Deployment Purpose**
- Front: What does a Kubernetes Deployment manage?
- Back: Manages Pod replicas; automatically creates ReplicaSets; handles rolling updates and rollbacks

**Card 23: kubelet Role**
- Front: What does the kubelet component do?
- Back: Runs on every node; manages pods via CRI; reports node status; watches etcd for pod assignments

**Card 24: etcd Purpose**
- Front: What is etcd in Kubernetes?
- Back: Distributed key-value store that holds all cluster state; single source of truth

**Card 25: CRI (Container Runtime Interface)**
- Front: Why does Kubernetes define CRI?
- Back: Abstract interface between kubelet and container runtime; enables multiple implementations (containerd, CRI-O, Docker)

**Card 26: kube-scheduler**
- Front: Does kube-scheduler run the pods it schedules?
- Back: No; it only assigns pods to nodes. kubelet on the node runs the pods

**Card 27: Network Namespace**
- Front: In a Kubernetes Pod, what is shared in the network namespace?
- Back: All containers in pod share same IP address and network interface; can communicate via localhost

**Card 28: ReplicaSet**
- Front: What does a ReplicaSet ensure?
- Back: Specified number of Pod replicas are running at all times

**Card 29: DaemonSet Use Case**
- Front: When would you use a DaemonSet instead of Deployment?
- Back: When you need exactly one Pod per node (monitoring agents, logging collectors, network plugins)

**Card 30: kubectl apply**
- Front: What does `kubectl apply -f file.yaml` do?
- Back: Creates or updates Kubernetes resource(s) defined in YAML file (declarative)

**Card 31: Linux Namespaces in Pods**
- Front: Name three Linux namespaces used by Kubernetes Pods
- Back: PID (process isolation), IPC (communication isolation), Network (IP isolation), Mount (filesystem isolation), User (UID isolation)

**Card 32: Resource Limits**
- Front: How do you set memory and CPU limits for a container in a Pod?
- Back: In spec.containers[].resources.limits (memory in Mi/Gi, CPU in millicores, e.g. "500m" = 0.5 CPU)

---

## Practice Questions (15+ Questions)

### Shell Programming Questions

**Question 1: File Test Script**

Write a bash script that:
1. Takes a filename as argument
2. Checks if file exists AND is readable
3. Prints appropriate message

Answer:
```bash
#!/bin/bash
if [ $# -eq 0 ]; then
    echo "Usage: $0 filename" >&2
    exit 1
fi

filename="$1"
if [ -e "$filename" ] && [ -r "$filename" ]; then
    echo "$filename exists and is readable"
elif [ -e "$filename" ]; then
    echo "$filename exists but is not readable"
else
    echo "$filename does not exist"
fi
```

**Question 2: Function Parameter Handling**

Write a bash function that accepts multiple filenames and prints the count and size of each file that exists.

Answer:
```bash
file_info() {
    if [ $# -eq 0 ]; then
        echo "Usage: file_info file [file ...]" >&2
        return 1
    fi
    for file in "$@"; do
        if [ -f "$file" ]; then
            size=$(wc -c < "$file")
            echo "$file: $size bytes"
        else
            echo "$file: not a regular file" >&2
        fi
    done
}
```

**Question 3: Loop and String Manipulation**

Write a script that:
1. Reads the PATH variable
2. Splits on colons
3. Prints each directory on separate line
4. Indicates which are readable

Answer:
```bash
#!/bin/bash
IFS=':'
for dir in $PATH; do
    if [ -r "$dir" ]; then
        echo "$dir (readable)"
    else
        echo "$dir (not readable)"
    fi
done
```

**Question 4: Array Processing**

Write a function that takes multiple arguments, stores them in an array, and prints them in reverse order.

Answer:
```bash
reverse_args() {
    local -a arr=("$@")
    local -i len=$#
    for ((i=len-1; i>=0; i--)); do
        echo "${arr[$i]}"
    done
}
```

**Question 5: Case Statement**

Write a script that reads a file extension and prints the file type (use case statement).

Answer:
```bash
#!/bin/bash
if [ $# -ne 1 ]; then
    echo "Usage: $0 filename" >&2
    exit 1
fi

case "$1" in
    *.txt) echo "Text file" ;;
    *.pdf) echo "PDF file" ;;
    *.jpg|*.jpeg|*.png) echo "Image file" ;;
    *.sh) echo "Shell script" ;;
    *) echo "Unknown file type" ;;
esac
```

**Question 6: Parameter Expansion**

Given variable `path="/usr/local/bin:/usr/bin:/bin"`, use parameter expansion to:
1. Extract the last directory (bin)
2. Extract everything except the last directory

Answer:
```bash
path="/usr/local/bin:/usr/bin:/bin"

# Extract last directory
last="${path##*:}"                # Result: bin

# Extract everything except last
rest="${path%:*}"                 # Result: /usr/local/bin:/usr/bin
```

**Question 7: While Loop with Read**

Write a script that reads lines from a file, counts them, and prints the total.

Answer:
```bash
#!/bin/bash
if [ $# -ne 1 ]; then
    echo "Usage: $0 filename" >&2
    exit 1
fi

count=0
while read line; do
    ((count++))
done < "$1"
echo "Total lines: $count"
```

### Kubernetes Questions

**Question 8: Pod vs Container**

Explain the relationship between a Pod and a Container. Why have Pods?

Answer:
A Container is a single isolated process environment. A Pod is a Kubernetes abstraction that wraps one or more containers. Pods enable:
- Sidecar pattern (logging/monitoring alongside main app)
- Shared network namespace (containers communicate via localhost)
- Atomic scaling (all containers in pod scale together)
- Shared storage (volumes mount in all containers)
- Lifecycle coupling (containers created/destroyed together)

**Question 9: Deployment Manifest**

Write a minimal Kubernetes Deployment YAML for a web server with 3 replicas, image "nginx:1.14", exposing port 80.

Answer:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14
        ports:
        - containerPort: 80
```

**Question 10: kubectl Commands**

List the kubectl commands to:
1. Get all pods in current namespace
2. Get all pods in all namespaces
3. View logs from a pod
4. Execute a bash shell in a running container

Answer:
```bash
kubectl get pods
kubectl get pods -A
kubectl logs <pod-name>
kubectl exec -it <pod-name> bash
```

**Question 11: kubelet and kube-scheduler**

Describe the roles of kubelet and kube-scheduler. Are they the same component?

Answer:
No, they are different:
- **kube-scheduler**: Control plane component that assigns Pods to Nodes based on resource requirements and constraints
- **kubelet**: Node component that:
  - Watches etcd for Pod assignments to its node
  - Manages containers on the node via CRI
  - Reports node and Pod status back to control plane
  - Executes lifecycle hooks and liveness probes

**Question 12: Linux Namespaces in Kubernetes**

Explain how PID namespace isolation in Pods provides security benefit.

Answer:
Each Pod has its own PID namespace. This means:
- Container processes see only processes within their Pod
- Cannot see or signal processes in other Pods or host
- Process 1 in Pod is isolated from host PID 1
- Provides process isolation security boundary
- Prevents one container from interfering with others via signals

**Question 13: Deployment Rolling Update**

A Deployment has 3 replicas running version 1.0. You update the image to 2.0. What happens?

Answer:
Rolling update process:
1. Deployment controller creates new ReplicaSet for version 2.0
2. Gradually scales new ReplicaSet up (creates new Pods with 2.0)
3. Simultaneously scales old ReplicaSet down (terminates 1.0 Pods)
4. Process is gradual to maintain availability
5. Can rollback to previous version if needed
6. Old ReplicaSet remains in cluster for quick rollback

**Question 14: DaemonSet vs Deployment**

When would you use a DaemonSet instead of a Deployment?

Answer:
Use DaemonSet when you need exactly one Pod per node:
- Node monitoring agents (collecting CPU, memory metrics)
- Log collection (forwarding logs from each node)
- Network plugins (CNI daemons)
- Security agents (scanning, compliance)

Deployment is for stateless services that don't require per-node instances.

**Question 15: JSONPath Query**

Write a kubectl command using JSONPath to list all Pod names in current namespace.

Answer:
```bash
kubectl get pods -o jsonpath='{.items[*].metadata.name}'
```

Or formatted with newlines:
```bash
kubectl get pods -o jsonpath='{range .items[*]}{.metadata.name}{"\n"}{end}'
```

---

## Key Distinctions

### Bash Functions vs C Functions (Exam Critical Content)

This section summarizes the most important distinction emphasized by instructors.

#### Bash Function Example

```bash
#!/bin/bash

calculate() {
    # NO parameters in signature
    # Arguments accessed via $1, $2, $#, $@
    
    if [ $# -lt 2 ]; then
        echo "Error: need two arguments" >&2
        return 1
    fi
    
    local num1="$1"
    local num2="$2"
    local operation="${3:-add}"
    
    case "$operation" in
        add)
            echo $((num1 + num2))
            ;;
        multiply)
            echo $((num1 * num2))
            ;;
        *)
            echo "Unknown operation: $operation" >&2
            return 1
            ;;
    esac
}

# Usage
result=$(calculate 10 5 add)
echo "Result: $result"
```

**Key Bash Points**:
- Function signature is empty: `calculate()`
- Uses `$1`, `$2`, `$3` for positional arguments
- `$#` gives count of arguments
- `$@` expands all arguments (safe with spaces)
- `return` sets exit status
- Output captured with `$()`

#### C Function Example

```c
#include <stdio.h>
#include <string.h>

// C function WITH formal parameters in signature
int calculate(int num1, int num2, const char *operation) {
    if (operation == NULL) {
        fprintf(stderr, "Error: operation cannot be NULL\n");
        return -1;  // Return error code
    }
    
    if (strcmp(operation, "add") == 0) {
        return num1 + num2;
    }
    else if (strcmp(operation, "multiply") == 0) {
        return num1 * num2;
    }
    else {
        fprintf(stderr, "Error: Unknown operation: %s\n", operation);
        return -1;
    }
}

// Usage
int main() {
    int result = calculate(10, 5, "add");
    if (result == -1) {
        fprintf(stderr, "Error in calculation\n");
        return 1;
    }
    printf("Result: %d\n", result);
    return 0;
}
```

**Key C Points**:
- Function signature lists formal parameters: `(int num1, int num2, const char *operation)`
- Type checking at compile time
- Return type explicitly declared: `int`
- Parameters passed by value (unless pointer)
- Error handling via return codes or exceptions
- Type safety enforced by compiler

#### Comparison Table

| Feature | Bash | C |
|---------|------|---|
| **Signature** | `func()` | `type func(param1, param2)` |
| **Parameter Access** | `$1, $2, $3, $#, $@` | Formal parameters directly |
| **Type Safety** | None (runtime) | Strict (compile-time) |
| **Return Value** | Exit status (0-255) or stdout | Declared type |
| **Variadic Args** | Natural: `"$@"` | Complex: `va_list`, `...` |
| **Error Handling** | `return N` or `echo error >&2` | Return codes, exceptions, or assertions |
| **Scope** | Global by default, `local` for local | Block-scoped, function-scoped |

#### Why This Matters for Exams

Instructors test this distinction because:

1. **Common Student Error**: Writing bash functions with C-style parameters
   ```bash
   # WRONG - this won't work
   process(file, mode) {
       echo "Processing $file with mode $mode"
   }
   ```

2. **Correct Bash Syntax**:
   ```bash
   # RIGHT - empty signature
   process() {
       echo "Processing $1 with mode $2"
   }
   ```

3. **Language Context Matters**: Understanding which language you're using prevents syntax errors

4. **Real-World Impact**: Bash scripts are ubiquitous in Linux; knowing correct syntax is essential

---

## Summary: What to Focus On for Exam

### Shell Programming (Module 09)

High-priority topics:
1. **File tests** (`-e`, `-f`, `-d`, `-r`, `-w`, `-x`)
2. **String and numeric comparisons** (use correct operators: `=`, `-eq`, etc.)
3. **Bash function syntax** (NO formal parameters; use `$1`, `$2`, etc.)
4. **Parameter expansion** (`${var:-default}`, `${var#pattern}`, etc.)
5. **Loops** (for, while, until with correct syntax)
6. **Case statements** with pattern matching
7. **Here documents** (`<<EOF`) and here strings (`<<<`)
8. **Arrays** and arithmetic (`$((expression))`)

### Kubernetes (Module 10A-B)

High-priority topics:
1. **Pod definition** and why Pods exist (containers with shared network)
2. **Deployment management** (replicas, rolling updates, ReplicaSets)
3. **Kubernetes architecture** (control plane: apiserver, etcd, scheduler; nodes: kubelet, kube-proxy)
4. **CRI and container runtimes** (abstraction layer concept)
5. **Linux namespaces** (PID, IPC, Network, Mount - provide isolation)
6. **kubectl commands** (get, describe, logs, exec, apply, delete, scale)
7. **YAML structure** for Pods and Deployments
8. **DaemonSet vs Deployment** (per-node vs. replicas)
9. **JSONPath queries** for resource inspection

---

**End of Study Guide**

Total content: 1,847 lines
Flashcards: 32 total (20 shell programming, 12 Kubernetes)
Practice Questions: 15 total (7 shell, 8 Kubernetes)


---

## Extended Deep-Dive Sections

### Shell Scripting: Advanced Patterns

#### Pattern: Robust File Processing

Real-world pattern for safe file handling:

```bash
#!/bin/bash

process_file() {
    local file="$1"
    local backup="${file}.bak"
    
    # Check preconditions
    if [ ! -e "$file" ]; then
        echo "Error: File not found: $file" >&2
        return 1
    fi
    
    if [ ! -r "$file" ]; then
        echo "Error: File not readable: $file" >&2
        return 1
    fi
    
    if [ ! -w "$file" ]; then
        echo "Error: File not writable: $file" >&2
        return 1
    fi
    
    # Create backup before modification
    cp "$file" "$backup" || {
        echo "Error: Failed to create backup" >&2
        return 1
    }
    
    # Process file (example: convert to uppercase)
    tr 'a-z' 'A-Z' < "$file" > "${file}.tmp"
    
    if [ -s "${file}.tmp" ]; then
        # File has content, replace original
        mv "${file}.tmp" "$file"
        echo "Successfully processed: $file"
        return 0
    else
        # Empty file, restore backup
        mv "$backup" "$file"
        echo "Error: Processing resulted in empty file" >&2
        return 1
    fi
}
```

#### Pattern: Error Handling with trap

Ensure cleanup on script exit:

```bash
#!/bin/bash

# Setup cleanup function
cleanup() {
    local exit_code=$?
    echo "Cleaning up..."
    rm -f /tmp/work.$$
    exit $exit_code
}

trap cleanup EXIT INT TERM

# Script body
tmpfile="/tmp/work.$$"
echo "Creating temporary work file: $tmpfile"
touch "$tmpfile"

# Do work...
echo "Processing data..."

# cleanup() runs automatically on exit
```

#### Pattern: Configuration with Defaults

Handle optional configuration files:

```bash
#!/bin/bash

# Default values
PORT="${PORT:-8080}"
HOST="${HOST:-localhost}"
LOGFILE="${LOGFILE:-.log}"

# Load config file if exists
if [ -f ~/.myapp.conf ]; then
    source ~/.myapp.conf
    echo "Loaded configuration from ~/.myapp.conf"
fi

# Command-line override
while [ $# -gt 0 ]; do
    case "$1" in
        --port) PORT="$2"; shift 2 ;;
        --host) HOST="$2"; shift 2 ;;
        --log) LOGFILE="$2"; shift 2 ;;
        *) echo "Unknown option: $1" >&2; exit 1 ;;
    esac
done

echo "Starting server on $HOST:$PORT, logging to $LOGFILE"
```

#### Pattern: Argument Validation

Validate input arguments properly:

```bash
#!/bin/bash

require_arg() {
    if [ -z "$1" ]; then
        echo "Error: $2 is required" >&2
        exit 1
    fi
}

# Validate numeric argument
validate_number() {
    local num="$1"
    local name="$2"
    if ! [[ "$num" =~ ^[0-9]+$ ]]; then
        echo "Error: $name must be a positive integer, got: $num" >&2
        exit 1
    fi
}

# Usage
source_file="$1"
dest_file="$2"
max_size="$3"

require_arg "$source_file" "Source file"
require_arg "$dest_file" "Destination file"
require_arg "$max_size" "Maximum size"

validate_number "$max_size" "Maximum size"

echo "Proceeding with source=$source_file, dest=$dest_file, max_size=$max_size"
```

### Kubernetes: Advanced Deployment Scenarios

#### Scenario: Blue-Green Deployment

Deploy new version alongside old, switch traffic:

```yaml
# Blue (current production)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: app
      version: blue
  template:
    metadata:
      labels:
        app: app
        version: blue
    spec:
      containers:
      - name: app
        image: myapp:v1.0

---
# Green (new version, not yet receiving traffic)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-green
spec:
  replicas: 3
  selector:
    matchLabels:
      app: app
      version: green
  template:
    metadata:
      labels:
        app: app
        version: green
    spec:
      containers:
      - name: app
        image: myapp:v2.0

---
# Service initially points to blue
apiVersion: v1
kind: Service
metadata:
  name: app-service
spec:
  selector:
    app: app
    version: blue      # Switch this label to green after validation
  ports:
  - port: 80
    targetPort: 8080
```

Switching traffic: Update Service selector `version: blue` to `version: green`

#### Scenario: Canary Deployment

Gradual traffic shift using multiple Deployments:

```yaml
# Stable 95% traffic
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-stable
spec:
  replicas: 19         # 95% of total
  selector:
    matchLabels:
      app: app
      track: stable
  template:
    metadata:
      labels:
        app: app
        track: stable
    spec:
      containers:
      - name: app
        image: myapp:v1.0

---
# Canary 5% traffic (for testing)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-canary
spec:
  replicas: 1          # 5% of total (20 total)
  selector:
    matchLabels:
      app: app
      track: canary
  template:
    metadata:
      labels:
        app: app
        track: canary
    spec:
      containers:
      - name: app
        image: myapp:v2.0

---
# Service sends traffic to both
apiVersion: v1
kind: Service
metadata:
  name: app-service
spec:
  selector:
    app: app          # Matches both stable and canary
  ports:
  - port: 80
    targetPort: 8080
```

Gradually increase canary replicas and decrease stable replicas as you gain confidence.

#### Scenario: StatefulSet with Persistent Storage

Database replicas with ordered startup:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres
spec:
  clusterIP: None     # Headless service (no load balancing)
  ports:
  - port: 5432
  selector:
    app: postgres

---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: postgres
  replicas: 3
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:12
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        volumeMounts:
        - name: data
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 10Gi
```

Key features:
- `serviceName: postgres` links to headless Service
- `volumeClaimTemplates` creates PVC per replica
- Pods named `postgres-0`, `postgres-1`, `postgres-2` (ordered)
- Each pod gets dedicated persistent volume

### Test Case Analysis

#### Test Case 1: Function Scope

```bash
#!/bin/bash

x=10
echo "Before: x=$x"

process() {
    x=20              # Modifies global x
    local y=30        # Local to function
    echo "Inside: x=$x, y=$y"
}

process
echo "After: x=$x"    # x is 20 (modified)
echo "y=$y"           # y is empty (local to function)
```

Output:
```
Before: x=10
Inside: x=20, y=30
After: x=20
y=
```

Lesson: Use `local` to avoid global variable pollution.

#### Test Case 2: Kubernetes Pod Isolation

```bash
# Inside pod container 1
$ ps aux
UID   PID COMMAND
root    1  /my-app
root   42  ps aux

# Container 2 (same pod) can see container 1 processes via localhost
$ netstat -ln
LISTEN 127.0.0.1:8080  (container 1's port, accessible via localhost)
```

Key point: Containers in same Pod share network namespace, see each other's ports via localhost.

#### Test Case 3: kubectl JSONPath

```bash
# List pod names and their images
kubectl get pods -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.containers[0].image}{"\n"}{end}'

# Output:
# nginx-deployment-66b6c48dd5-abc12    nginx:1.14
# nginx-deployment-66b6c48dd5-def45    nginx:1.14
# nginx-deployment-66b6c48dd5-ghi78    nginx:1.14
```

---

## Exam Preparation Checklist

### Module 09 (Shell Programming)

- [ ] File tests: Know all 8 common tests (`-e`, `-f`, `-d`, `-r`, `-w`, `-x`, `-s`, `-L`)
- [ ] String tests: Know `=`, `!=`, `-z`, `-n`
- [ ] Numeric tests: Know `-eq`, `-ne`, `-lt`, `-le`, `-gt`, `-ge`
- [ ] If-then-elif-else syntax (proper `fi` closing)
- [ ] Case statement with wildcards and `*)` default
- [ ] For loops: `for var in list` and `for ((i=0; i<N; i++))`
- [ ] While and until loop syntax
- [ ] Bash function signature: `name() { ... }` NOT `name(param1, param2) { ... }`
- [ ] Function arguments: `$1`, `$2`, `$#`, `$@`
- [ ] Local variables with `local` keyword
- [ ] Parameter expansion: `${var:-default}`, `${var#pattern}`, `${var%pattern}`, `${var//old/new}`
- [ ] Here documents: `<< EOF` and `<< 'EOF'` (with quotes to prevent expansion)
- [ ] Here strings: `<<< "string"`
- [ ] Arrays: Create, access, length
- [ ] Arithmetic: `$((expression))` and `((x++))`
- [ ] Read command: `read -p`, `read -r`, `read -t`
- [ ] Trap: `trap 'cleanup' EXIT`
- [ ] Practical patterns: error checking, file processing, configuration handling

### Module 10A-B (Kubernetes)

- [ ] Pod definition: Smallest unit, containers share network namespace
- [ ] Container vs Pod vs Deployment (understand hierarchy)
- [ ] Deployment: Replicas, rolling updates, ReplicaSets
- [ ] DaemonSet: One per node use cases (monitoring, logging, CNI)
- [ ] kubectl commands: `get`, `describe`, `logs`, `exec`, `apply`, `delete`, `scale`
- [ ] Control plane components: apiserver, etcd, scheduler, controller-manager
- [ ] Node components: kubelet, kube-proxy, container runtime
- [ ] Linux namespaces: PID, IPC, Network, Mount, User (isolation mechanisms)
- [ ] CRI (Container Runtime Interface): Abstraction enabling multiple runtimes
- [ ] YAML structure: apiVersion, kind, metadata, spec
- [ ] JSONPath queries: Extract specific fields from resources
- [ ] Kubernetes Namespaces: Logical cluster separation
- [ ] Service: Load balancing across pod replicas
- [ ] ConfigMap and Secrets: Configuration management
- [ ] Resource limits: requests and limits for CPU/memory
- [ ] Deployment patterns: Rolling updates, blue-green, canary
- [ ] Infrastructure drift problem: Why Kubernetes exists

### Critical Distinctions

- [ ] Bash function vs C function signature (HIGH PRIORITY)
  - Bash: No parameters in signature, access via `$1`, `$2`
  - C: Formal parameters in signature with types
- [ ] File tests vs numeric tests (use correct operator)
  - `-e` for existence, `-eq` for numbers
- [ ] `$@` vs `$*` (word splitting behavior)
- [ ] Pod isolation vs node isolation
- [ ] Deployment vs DaemonSet (all-nodes vs scaled replicas)

---

## Additional Resources for Lab Practice

### Lab 09 Focus: Kubernetes Hands-On

Key commands from Lab09:
```bash
# Examine cluster
kubectl get nodes -o wide
kubectl describe node <name>

# Examine pods
kubectl get pods --show-labels
kubectl get pods -o jsonpath='{.items[*].metadata.name}'

# Create and inspect
kubectl run nginx --image=nginx:latest
kubectl get pod <name> -o yaml

# Namespace management
kubectl get namespaces
kubectl create namespace myns
kubectl get pods --namespace myns

# Pod isolation testing
kubectl exec -it <pod1> -- ps aux
kubectl exec -it <pod2> -- ps aux
# Different PID 1s show PID namespace isolation
```

### Lab 08 Focus: Shell Script Examples

Key patterns from Lab08:

1. **addx function**: Demonstrates parameter validation and file tests
2. **compare_perms.sh**: Shows how to extract data with `cut` and `ls -l`
3. **splitcolon function**: Shows parameter expansion and IFS manipulation
4. **bundle script**: Shows how to create here documents dynamically in loops
5. **maxfilelen function**: Shows directory iteration and string length with `${#var}`

Study each example and understand:
- Why each test is needed
- How parameters are passed and accessed
- How output is generated
- What errors might occur

---

## Quick Reference: Operators and Syntax

### Test Operators (Single Bracket)

```bash
[ -e FILE ]      # FILE exists
[ -f FILE ]      # Regular file
[ -d FILE ]      # Directory
[ -r FILE ]      # Readable
[ -w FILE ]      # Writable
[ -x FILE ]      # Executable
[ -s FILE ]      # Size > 0
[ -L FILE ]      # Symbolic link

[ -z STRING ]    # Empty
[ -n STRING ]    # Not empty
[ STRING ]       # Not empty (same as -n)
[ S1 = S2 ]      # Strings equal
[ S1 != S2 ]     # Strings differ
[ S1 < S2 ]      # Lex less-than (escape <)
[ S1 > S2 ]      # Lex greater-than (escape >)

[ N1 -eq N2 ]    # Numeric equal
[ N1 -ne N2 ]    # Numeric not equal
[ N1 -lt N2 ]    # Less-than
[ N1 -le N2 ]    # Less-or-equal
[ N1 -gt N2 ]    # Greater-than
[ N1 -ge N2 ]    # Greater-or-equal

[ C1 -a C2 ]     # AND (deprecated, use &&)
[ C1 -o C2 ]     # OR (deprecated, use ||)
[ ! C ]          # NOT
```

### Parameter Expansion Syntax

```bash
${var}           # Variable value
${var:-default}  # Use default if unset/empty
${var:=default}  # Assign default if unset/empty
${var:+alternate} # Use alternate if set and not empty
${var:?error}    # Error if unset/empty
${#var}          # Length (number of chars)
${var#pattern}   # Remove shortest prefix
${var##pattern}  # Remove longest prefix
${var%pattern}   # Remove shortest suffix
${var%%pattern}  # Remove longest suffix
${var/old/new}   # Replace first
${var//old/new}  # Replace all
${var:offset:len} # Substring
```

### Control Structure Keywords

```bash
if [ condition ]; then ... elif [ cond ]; then ... else ... fi
case $var in pattern) ... ;; esac
for var in list; do ... done
for ((init; cond; update)); do ... done
while [ cond ]; do ... done
until [ cond ]; do ... done
{ ... }          # Grouping
( ... )          # Subshell
function name { ... }  # Function (bash keyword style)
name() { ... }   # Function (standard)
```

### Special Variables

```bash
$0               # Script name
$1, $2, ...      # Positional parameters
$#               # Number of parameters
$@               # All parameters (quoted, word-split preserved)
$*               # All parameters (unquoted, space-separated)
$$               # Process ID of shell
$?               # Exit status of last command
$!               # PID of last background job
$-               # Current shell options
IFS              # Internal Field Separator
```

---

End of extended study guide
Total lines: 1,847+ (now ~2,200+ with appendix)

