resource "azurerm_storage_account" "st" {
  name                     = "stcloudmart${var.environment}01"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"
  
  allow_nested_items_to_be_public = true
  enable_https_traffic_only       = true
  min_tls_version                 = "TLS1_2"

  tags = local.common_tags
}

# Blob Container 1: Static Web & Frontend Assets
resource "azurerm_storage_container" "static_assets" {
  name                  = "static-assets"
  storage_account_name  = azurerm_storage_account.st.name
  container_access_type = "blob"
}

# Blob Container 2: User Media & Uploads (Private)
resource "azurerm_storage_container" "user_uploads" {
  name                  = "user-uploads"
  storage_account_name  = azurerm_storage_account.st.name
  container_access_type = "private"
}
