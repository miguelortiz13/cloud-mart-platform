# Azure Cloud Infrastructure Architecture

Este documento describe la arquitectura cloud en **Microsoft Azure** para el proyecto ficticio **CloudMart Platform**, configurada mediante Infrastructure as Code (IaC) en Terraform.

---

## 🏛️ Diagrama de Arquitectura Cloud (Mermaid)

```mermaid
flowchart TB
    subgraph ClientLayer ["🌐 Capa de Clientes & Ingress"]
        Users["👥 Usuarios / Clientes Web"]
        AppGW["🛡️ Azure Application Gateway (WAF_v2)\nPublic IP: 20.120.45.10"]
    end

    subgraph AzureVNet ["🔷 Azure Virtual Network (10.0.0.0/16)"]
        
        subgraph SubnetAppGw ["Subnet: snet-appgateway (10.0.1.0/24)"]
            AppGW
        end

        subgraph SubnetApp ["Subnet: snet-container-apps (10.0.2.0/23)"]
            subgraph ContainerEnv ["Azure Container Apps Environment"]
                ContainerApp["📦 Azure Container App (API Microservice)\nreplica min: 2, max: 10"]
            end
        end

        subgraph SubnetDB ["Subnet: snet-postgresql (10.0.10.0/24)"]
            PostgreSQL["🐘 Azure Database for PostgreSQL Flexible\n(Zone Redundant - High Availability)"]
        end

        subgraph SubnetCache ["Subnet: snet-redis (10.0.20.0/24)"]
            Redis["⚡ Azure Cache for Redis\n(Standard Tier - In-Memory Cache)"]
        end
    end

    subgraph AzurePaaS ["☁️ Azure PaaS Services & Security"]
        ServiceBus["📩 Azure Service Bus Namespace\n(Topics & Queues)"]
        StorageAccount["💾 Azure Storage Account\n(Blob Containers: assets & uploads)"]
        KeyVault["🔑 Azure Key Vault\n(Secrets & Certificates)"]
        ManagedIdentity["🆔 User-Assigned Managed Identity"]
        AppInsights["📊 Azure Log Analytics & App Insights"]
    end

    %% Flow Connections
    Users -->|HTTP/HTTPS| AppGW
    AppGW -->|Reverse Proxy / WAF| ContainerApp
    
    ContainerApp -->|Lee/Escribe Datos| PostgreSQL
    ContainerApp -->|Cache-Aside (Lectura Rápida)| Redis
    ContainerApp -->|Publica Eventos de Orden| ServiceBus
    ContainerApp -->|Guarda/Lee Archivos| StorageAccount
    ContainerApp -->|Autenticación Segura| ManagedIdentity
    ManagedIdentity -->|Obtiene Credenciales| KeyVault
    
    ContainerApp -.->|Envía Telemetría| AppInsights
    PostgreSQL -.->|Métricas| AppInsights
    Redis -.->|Métricas| AppInsights
```

---

## 🔒 Decisiones de Diseño & Seguridad

1. **Aislamiento de Red (VNet Injection & Subnet Delegation)**:
   - Los componentes de cómputo y base de datos se ejecutan en subredes privadas dedicadas (`10.0.2.0/23` y `10.0.10.0/24`).
   - El acceso externo se limita al **Azure Application Gateway WAF v2** en la subred pública `10.0.1.0/24`.

2. **Alta Disponibilidad (Multi-Zone / Zone Redundant)**:
   - PostgreSQL Flexible Server utiliza redundancia de zonas para conmutación por error automática.
   - Azure Container Apps escala dinámicamente de 2 a 10 réplicas basadas en tráfico HTTP y carga.

3. **Identidad Gestionada e Integración con Key Vault**:
   - Eliminación de contraseñas codificadas mediante **User-Assigned Managed Identity**.
   - Credenciales sensibles almacenadas en **Azure Key Vault**.
