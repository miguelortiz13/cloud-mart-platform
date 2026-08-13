# Diagrama de Componentes del Proyecto Ficticio (Software Architecture)

Este documento detalla la estructura modular de código de la aplicación Node.js / Express y cómo interactúa cada componente de software con la infraestructura de Azure.

---

## 🧩 Diagrama de Componentes de Software (Mermaid)

```mermaid
classDiagram
    class DashboardUI {
        +HTML5 / CSS / Vanilla JS
        +renderHealthStatus()
        +submitOrder()
        +fetchProducts()
    }

    class ExpressApp {
        +index.js
        +routes/apiRoutes.js
        +middleware (CORS, Morgan, JSON)
    }

    class Controllers {
        +healthController
        +productController
        +orderController
        +getHealth()
        +getProducts()
        +createOrder()
    }

    class ServiceLayer {
        <<Interface / Services>>
    }

    class DBService {
        +connectionString: String
        +getAllProducts()
        +getProductById()
        +createOrder()
        +getHealthStatus()
    }

    class CacheService {
        +endpoint: String
        +get(key)
        +set(key, val, ttl)
        +del(key)
        +getHealthStatus()
    }

    class QueueService {
        +publishOrderEvent(order)
        +getRecentEvents()
        +getHealthStatus()
    }

    class AzureInfra {
        <<Azure PaaS / IaaS>>
    }

    DashboardUI --> ExpressApp : HTTP REST API Requests
    ExpressApp --> Controllers : Route Dispatch
    Controllers --> ServiceLayer : Calls Business Logic
    ServiceLayer <|-- DBService
    ServiceLayer <|-- CacheService
    ServiceLayer <|-- QueueService

    DBService --> AzureInfra : SQL TCP/5432 (Azure PostgreSQL)
    CacheService --> AzureInfra : RESP TCP/6380 (Azure Redis)
    QueueService --> AzureInfra : AMQP/HTTPS (Azure Service Bus)
```

---

## 🔄 Flujo de Trabajo de las Operaciones Clave

### 1. Patrón Cache-Aside en Consulta de Productos (`GET /api/products`)
```mermaid
sequenceDiagram
    autonumber
    actor Client as Cliente / Dashboard
    participant API as ProductController
    participant Cache as CacheService (Azure Redis)
    participant DB as DBService (Azure PostgreSQL)

    Client->>API: GET /api/products
    API->>Cache: get("products:all")
    alt Cache Hit
        Cache-->>API: Devuelve productos cacheados
        API-->>Client: 200 OK (Fuente: Azure Redis)
    else Cache Miss
        Cache-->>API: null
        API->>DB: getAllProducts()
        DB-->>API: Devuelve lista desde PostgreSQL
        API->>Cache: set("products:all", products, TTL=120)
        API-->>Client: 200 OK (Fuente: Azure PostgreSQL)
    end
```

### 2. Creación de Orden Asíncrona (`POST /api/orders`)
```mermaid
sequenceDiagram
    autonumber
    actor Client as Cliente / Dashboard
    participant API as OrderController
    participant DB as DBService (Azure PostgreSQL)
    participant Cache as CacheService (Azure Redis)
    participant Bus as QueueService (Azure Service Bus)

    Client->>API: POST /api/orders { email, totalAmount }
    API->>DB: createOrder(orderData)
    DB-->>API: Retorna Orden Creada (ID: ord-xxxx)
    API->>Cache: del("orders:all") [Invalidación de Cache]
    API->>Bus: publishOrderEvent(order)
    Bus-->>API: Retorna ServiceBusMessageId
    API-->>Client: 201 Created { order, asyncInfrastructure }
```
