---
id: 4911-topic-message-driven-beans-low-priority
title: Message-Driven Beans (LOW priority)
pillar: tech
priority: low
chapter: Ch 8
tags:
  - mdb
  - tech
---

Async JMS consumers. Bruce: "low question count, skip if tight on time." Know the basics.

#### Two JMS models

-   **Point-to-Point (Queue)** — one message, one consumer. Guaranteed delivery.
-   **Publish-Subscribe (Topic)** — one message, many subscribers. Non-durable loses messages if offline.

```java
@MessageDriven(activationConfig = {
    @ActivationConfigProperty(propertyName="destinationType",
                              propertyValue="javax.jms.Queue"),
    @ActivationConfigProperty(propertyName="destination",
                              propertyValue="jms/OrderQueue"),
    @ActivationConfigProperty(propertyName="acknowledgeMode",
                              propertyValue="Auto-acknowledge")
})
public class OrderProcessorMDB implements MessageListener {
    @Override
    public void onMessage(Message m) {
        TextMessage tm = (TextMessage) m;
        // process
    }
}
```

Lifecycle = SLSB (DoesNotExist → Method-Ready Pool, no passivation). Container pools multiple instances for concurrency.
