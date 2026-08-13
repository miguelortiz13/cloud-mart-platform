require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'production',
  
  // Azure Infrastructure Simulation Configuration (Matched 1:1 with Terraform)
  AZURE_REGION: process.env.AZURE_REGION || 'eastus',
  RESOURCE_GROUP: process.env.RESOURCE_GROUP || 'rg-cloudmart-prod',
  
  // Database Configuration (Azure Database for PostgreSQL Flexible Server)
  DB: {
    HOST: process.env.AZURE_POSTGRES_HOST || 'psql-cloudmart-prod.cloudmart.postgres.database.azure.com',
    PORT: process.env.DB_PORT || 5432,
    NAME: process.env.DB_NAME || 'cloudmart_db',
    USER: process.env.DB_USER || 'cloudmartadmin',
  },
  
  // Cache Configuration (Azure Cache for Redis)
  REDIS: {
    ENDPOINT: process.env.AZURE_REDIS_HOST || 'redis-cloudmart-prod.redis.cache.windows.net',
    PORT: process.env.REDIS_PORT || 6380,
  },
  
  // Messaging Configuration (Azure Service Bus)
  SERVICE_BUS: {
    NAMESPACE: process.env.AZURE_SERVICE_BUS_NAMESPACE || 'sb-cloudmart-prod',
    QUEUE_NAME: 'order-processing-queue',
    TOPIC_NAME: 'order-events-topic',
  },
  
  // Storage Configuration (Azure Blob Storage Account)
  STORAGE: {
    ACCOUNT_NAME: process.env.AZURE_STORAGE_ACCOUNT_NAME || 'stcloudmartprod01',
    STATIC_CONTAINER: 'static-assets',
    UPLOADS_CONTAINER: 'user-uploads',
  },
  
  // Azure Key Vault
  KEY_VAULT: {
    URI: process.env.KEY_VAULT_URI || 'https://kv-cloudmart-prod.vault.azure.net/',
  }
};
