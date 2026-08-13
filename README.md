# CloudMart Platform - Azure Infrastructure & Microservices Fictional Project

Repositorio de ejemplo funcional que simula una aplicación web real de comercio electrónico en **Microsoft Azure** con **Infrastructure as Code (IaC) en Terraform**, diseñada para que un agente externo pueda analizar la infraestructura y generar un diagrama automático de dependencias, componentes y arquitectura.

---

## 📁 Estructura del Repositorio

```text
cloud-mart-platform/
├── README.md                           # Documentación principal del repositorio
├── package.json                        # Dependencias de la aplicación Node.js / Express
├── src/                                # Código fuente funcional de la aplicación
│   ├── index.js                        # Punto de entrada del servidor HTTP Express
│   ├── config/env.js                   # Variables de entorno emparejadas 1:1 con Terraform
│   ├── controllers/                    # Controladores de la API (Health, Products, Orders)
│   ├── services/                       # Servicios de conexión a Azure DB, Redis, Service Bus
│   ├── routes/apiRoutes.js             # Definición de endpoints REST
│   └── public/                         # Frontend Dashboard interactivo (HTML/CSS/JS)
├── infrastructure/
│   └── terraform/                      # IaC en Azure (Validado con Terraform v1.15)
│       ├── main.tf                     # Configuración del proveedor AzureRM (~> 3.90)
│       ├── variables.tf                # Definición de variables de entorno
│       ├── resource_group.tf           # Grupo de Recursos principales
│       ├── vnet.tf                     # Red Virtual (VNet), Subredes y NSG
│       ├── container_apps.tf           # Azure Container Apps & ACR Registry
│       ├── postgresql.tf               # Azure Database for PostgreSQL Flexible Server
│       ├── redis.tf                    # Azure Cache for Redis
│       ├── service_bus.tf              # Azure Service Bus (Topics & Queues)
│       ├── storage.tf                  # Azure Storage Account (Blob Containers)
│       ├── app_gateway.tf              # Azure Application Gateway (WAF_v2)
│       ├── identity.tf                 # User-Assigned Managed Identity & Key Vault
│       ├── monitoring.tf               # Log Analytics & Application Insights
│       └── outputs.tf                  # Salidas formateadas del despliegue
├── docs/                               # Diagramas y Documentación para el Agente
│   ├── ARCHITECTURE.md                 # Diagrama visual de arquitectura Cloud (Mermaid)
│   ├── COMPONENTS.md                   # Diagrama de componentes de software (Mermaid)
│   └── IAC_DEPENDENCIES.md             # Mapeo y Grafo de recursos Terraform para IA
└── tests/
    └── app.test.js                     # Suite de pruebas automatizadas (Node test runner)
```

---

## ⚡ Inicio Rápido / Ejecución Local

Para ejecutar la aplicación localmente y ver el Dashboard interactivo:

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar la aplicación en modo desarrollo / producción
npm start

# 3. Abrir en el navegador: http://localhost:3000
```

Para correr las pruebas unitarias automatizadas:
```bash
npm test
```

Para validar el código Terraform:
```bash
cd infrastructure/terraform
terraform init -backend=false
terraform validate
```

---

## 🤖 Uso con el Agente Lector de Infraestructura

Este repositorio ha sido estructurado para ser analizado por agentes de IA de generación de diagramas:
1. **Analizar la Infraestructura**: Indique al agente que lea la carpeta `infrastructure/terraform/`.
2. **Generar Diagrama de Arquitectura**: El agente puede extraer la topología de red (`vnet.tf`), los servicios de cómputo (`container_apps.tf`), almacenamiento (`postgresql.tf`, `redis.tf`, `storage.tf`) y seguridad (`app_gateway.tf`, `identity.tf`).
3. **Revisar Diagramas de Referencia**: Consulte [docs/ARCHITECTURE.md](file:///home/miguel/Proyectos/cloud-mart-platform/docs/ARCHITECTURE.md), [docs/COMPONENTS.md](file:///home/miguel/Proyectos/cloud-mart-platform/docs/COMPONENTS.md) y [docs/IAC_DEPENDENCIES.md](file:///home/miguel/Proyectos/cloud-mart-platform/docs/IAC_DEPENDENCIES.md).
