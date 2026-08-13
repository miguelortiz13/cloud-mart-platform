terraform {
  required_version = ">= 1.5.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.90.0"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 2.47.0"
    }
  }
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
    key_vault {
      purge_soft_delete_on_destroy = true
    }
  }
}

locals {
  name_prefix = "cloudmart-${var.environment}"
  location    = var.azure_region
  common_tags = {
    Environment = var.environment
    Project     = "CloudMart-Platform"
    ManagedBy   = "Terraform"
    Cloud       = "Azure"
  }
}
