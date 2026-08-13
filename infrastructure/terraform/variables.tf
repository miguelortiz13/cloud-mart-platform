variable "azure_region" {
  type        = string
  description = "The Azure region where resources will be deployed"
  default     = "eastus"
}

variable "environment" {
  type        = string
  description = "Deployment environment (dev, staging, prod)"
  default     = "prod"
}

variable "vnet_cidr" {
  type        = string
  description = "CIDR block for Azure Virtual Network"
  default     = "10.0.0.0/16"
}

variable "db_admin_user" {
  type        = string
  description = "Administrator login username for Azure PostgreSQL Flexible Server"
  default     = "cloudmartadmin"
}

variable "db_admin_password" {
  type        = string
  description = "Administrator password for Azure PostgreSQL Flexible Server"
  sensitive   = true
  default     = "P@ssw0rdCloudMart2026!"
}

variable "redis_sku" {
  type        = string
  description = "SKU for Azure Cache for Redis"
  default     = "Standard"
}
