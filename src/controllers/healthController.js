const config = require('../config/env');
const dbService = require('../services/dbService');
const cacheService = require('../services/cacheService');
const queueService = require('../services/queueService');

exports.getHealth = async (req, res) => {
  try {
    const dbStatus = await dbService.getHealthStatus();
    const cacheStatus = await cacheService.getHealthStatus();
    const queueStatus = await queueService.getHealthStatus();

    return res.json({
      status: 'UP',
      service: 'CloudMart API (Azure Container App Service)',
      environment: config.NODE_ENV,
      region: config.AZURE_REGION,
      resourceGroup: config.RESOURCE_GROUP,
      timestamp: new Date().toISOString(),
      infrastructure: {
        compute: {
          platform: 'Azure Container Apps (Serverless Microservices)',
          environment: 'cae-cloudmart-prod',
          appName: 'ca-cloudmart-prod-api',
          containerPort: config.PORT
        },
        database: dbStatus,
        cache: cacheStatus,
        messaging: queueStatus,
        storage: {
          accountName: config.STORAGE.ACCOUNT_NAME,
          staticContainer: config.STORAGE.STATIC_CONTAINER,
          uploadsContainer: config.STORAGE.UPLOADS_CONTAINER
        },
        security: {
          keyVaultUri: config.KEY_VAULT.URI
        }
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'DOWN', error: error.message });
  }
};

exports.getArchitectureMeta = (req, res) => {
  res.json({
    appName: 'CloudMart Platform (Azure Architecture)',
    version: '1.0.0',
    iacProvider: 'Terraform v1.x (AzureRM Provider ~> 3.90)',
    layers: [
      { name: 'Ingress / WAF', component: 'Azure Application Gateway WAF_v2' },
      { name: 'Compute Environment', component: 'Azure Container Apps (VNet Integrated)' },
      { name: 'Container Registry', component: 'Azure Container Registry (ACR)' },
      { name: 'Database', component: 'Azure Database for PostgreSQL Flexible Server (Zone Redundant)' },
      { name: 'Cache', component: 'Azure Cache for Redis (Standard Tier)' },
      { name: 'Messaging', component: 'Azure Service Bus Namespace (Topics & Queues)' },
      { name: 'Object Storage', component: 'Azure Storage Account (Blob Containers)' },
      { name: 'Secrets & IAM', component: 'Azure Key Vault & User-Assigned Managed Identity' },
      { name: 'Monitoring', component: 'Log Analytics Workspace & Application Insights' }
    ]
  });
};
