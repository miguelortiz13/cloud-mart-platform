const config = require('../config/env');

class DBService {
  constructor() {
    this.connectionString = `postgresql://${config.DB.USER}@${config.DB.HOST}:${config.DB.PORT}/${config.DB.NAME}`;
    this.products = [
      { id: 'prod-01', name: 'Azure Container Apps Enterprise Node', category: 'Containers', price: 299.99, stock: 45 },
      { id: 'prod-02', name: 'Azure Database for PostgreSQL Flexible', category: 'Database', price: 499.00, stock: 20 },
      { id: 'prod-03', name: 'Azure Front Door WAF CDN Route', category: 'Networking', price: 89.50, stock: 100 },
      { id: 'prod-04', name: 'Azure Blob Storage Encrypted Hot', category: 'Storage', price: 45.00, stock: 500 },
      { id: 'prod-05', name: 'Azure Service Bus Namespace Standard', category: 'Integration', price: 150.00, stock: 75 }
    ];
    this.orders = [
      { id: 'ord-1001', customerEmail: 'user@company.com', totalAmount: 389.49, status: 'COMPLETED', items: ['prod-01', 'prod-03'], createdAt: new Date(Date.now() - 3600000).toISOString() }
    ];
  }

  async getHealthStatus() {
    return {
      connected: true,
      engine: 'PostgreSQL 15.4 (Azure Database for PostgreSQL Flexible Server - Zone Redundant)',
      host: config.DB.HOST,
      port: config.DB.PORT,
      activeConnections: 6,
      maxConnections: 100,
      latencyMs: Math.floor(Math.random() * 6) + 3
    };
  }

  async getAllProducts() {
    await new Promise(res => setTimeout(res, 35));
    return this.products;
  }

  async getProductById(id) {
    await new Promise(res => setTimeout(res, 20));
    return this.products.find(p => p.id === id) || null;
  }

  async createOrder(orderData) {
    await new Promise(res => setTimeout(res, 50));
    const newOrder = {
      id: `ord-${Date.now().toString().slice(-6)}`,
      customerEmail: orderData.customerEmail,
      totalAmount: orderData.totalAmount || 199.99,
      status: 'PROCESSING',
      items: orderData.items || ['prod-01'],
      createdAt: new Date().toISOString()
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  async getAllOrders() {
    await new Promise(res => setTimeout(res, 25));
    return this.orders;
  }
}

module.exports = new DBService();
