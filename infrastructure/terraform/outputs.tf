output "resource_group_name" {
  value       = azurerm_resource_group.rg.name
  description = "Resource Group Name"
}

output "vnet_id" {
  value       = azurerm_virtual_network.vnet.id
  description = "Virtual Network Resource ID"
}

output "application_gateway_public_ip" {
  value       = azurerm_public_ip.appgw_ip.ip_address
  description = "Public IP address of Azure Application Gateway WAF"
}

output "container_app_fqdn" {
  value       = azurerm_container_app.api.ingress[0].fqdn
  description = "Fully Qualified Domain Name of Azure Container App API"
}

output "postgresql_server_fqdn" {
  value       = azurerm_postgresql_flexible_server.postgres.fqdn
  description = "PostgreSQL Flexible Server FQDN"
}

output "redis_hostname" {
  value       = azurerm_redis_cache.redis.hostname
  description = "Azure Cache for Redis Hostname"
}

output "service_bus_namespace" {
  value       = azurerm_servicebus_namespace.sb.name
  description = "Azure Service Bus Namespace Name"
}

output "storage_account_name" {
  value       = azurerm_storage_account.st.name
  description = "Azure Storage Account Name"
}

output "key_vault_uri" {
  value       = azurerm_key_vault.kv.vault_uri
  description = "Azure Key Vault Vault URI"
}
