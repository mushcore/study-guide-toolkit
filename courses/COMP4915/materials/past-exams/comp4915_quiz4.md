# Comp 4915 Quiz 4 2026

**MULTIPLE CHOICE.** Choose the one alternative that best completes the statement or answers the question.

1) What is the agent that runs on cluster nodes to implement control-plane commands?
   - A) DaemonSet
   - B) Deployment
   - C) Kubelet
   - D) OCI
   - E) kubectl

2) What executable image format is used in kubernetes?
   - A) container
   - B) pod
   - C) CNCF
   - D) OCI
   - E) OKD

3) Which of the following is true of Kubernetes?
   - A) Exposes a cloud-neutral API
   - B) Integrates with all majoor cloud and hypervisor platforms
   - C) Is a fault-tolerant framework
   - D) Can create services with load balancing
   - E) All of the above

4) The most common way of running a kubernetes application is to create a/an
   - A) deployment
   - B) pod
   - C) daemonset
   - D) StatefulSet
   - E) container

5) What does kubernetes use to maintain its state?
   - A) kube-controller-manager
   - B) kube-scheduler
   - C) kubelet
   - D) kubectl
   - E) pods

6) What section of a yaml file is used to specify a container image for a Kubernetes pod?
   - A) spec
   - B) kind
   - C) metadata
   - D) labels
   - E) status

7) Kubectl continually checks if
   - A) there is a pod needing to be created or deleted
   - B) if a namespace needs to be created
   - C) if a namespace needs to be deleted
   - D) if a control group needs to be created
   - E) if a control group needs to be deleted

8) Which Kubernetes object runs a pod on every node of a cluster?
   - A) Node
   - B) StatefulSet
   - C) Job
   - D) DaemonSet
   - E) DNS

9) Which of the following happen(s) when a Kubernetes node fails?
   - A) kubelet stops updating the api that the node is healthy
   - B) new pods are not scheduled on the noe
   - C) pods on the node are scheduled for deletion
   - D) pods on the node are rescheduled to other nodes
   - E) all of the above happen

10) What is the reason for the pause container?
    - A) helps set up Linux namespaces and cgroups for a pod
    - B) allows running the pause service
    - C) allows each pod to use the pause service
    - D) allows the pod it is with to use the pause service
    - E) allows kubernetes to pause the pod it is in
