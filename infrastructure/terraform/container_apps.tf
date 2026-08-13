# Azure Container Registry
resource "azurerm_container_registry" "acr" {
  name                = "acrcloudmart${var.environment}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Standard"
  admin_enabled       = true
  tags                = local.common_tags
}

# Azure Container Apps Managed Environment
resource "azurerm_container_app_environment" "env" {
  name                       = "cae-${local.name_prefix}"
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.logs.id
  infrastructure_subnet_id   = azurerm_subnet.snet_app.id
  tags                       = local.common_tags
}

# Azure Container App (API Microservice)
resource "azurerm_container_app" "api" {
  name                         = "ca-${local.name_prefix}-api"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.app_identity.id]
  }

  template {
    container {
      name   = "cloudmart-api"
      image  = "mcr.microsoft.com/azuredocs/aci-helloworld:latest" # Fictional initial image, to be updated by CI/CD
      cpu    = 0.5
      memory = "1.0Gi"

      env {
        name  = "NODE_ENV"
        value = "production"
      }
      env {
        name  = "PORT"
        value = "3000"
      }
      env {
        name  = "AZURE_POSTGRES_HOST"
        value = azurerm_postgresql_flexible_server.postgres.fqdn
      }
      env {
        name  = "AZURE_REDIS_HOST"
        value = azurerm_redis_cache.redis.hostname
      }
      env {
        name  = "AZURE_SERVICE_BUS_NAMESPACE"
        value = azurerm_servicebus_namespace.sb.name
      }
      env {
        name  = "AZURE_STORAGE_ACCOUNT_NAME"
        value = azurerm_storage_account.st.name
      }
      env {
        name  = "APPINSIGHTS_INSTRUMENTATIONKEY"
        value = azurerm_application_insights.appinsights.instrumentation_key
      }
    }

    min_replicas = 2
    max_replicas = 10
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = 3000

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  tags = local.common_tags
}
