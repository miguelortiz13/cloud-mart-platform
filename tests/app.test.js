const test = require('node:test');
const assert = require('node:assert');
const { app, server } = require('../src/index.js');

test('GET /api/health should return UP status and Azure infrastructure metadata', async (t) => {
  const response = await fetch('http://localhost:3000/api/health');
  assert.strictEqual(response.status, 200);
  const data = await response.json();
  assert.strictEqual(data.status, 'UP');
  assert.ok(data.infrastructure);
  assert.strictEqual(data.infrastructure.compute.platform, 'Azure Container Apps (Serverless Microservices)');
});

test('GET /api/products should return product list', async (t) => {
  const response = await fetch('http://localhost:3000/api/products');
  assert.strictEqual(response.status, 200);
  const data = await response.json();
  assert.ok(Array.isArray(data.data));
  assert.strictEqual(data.data.length, 5);
});

test('POST /api/orders should create order and queue Azure Service Bus event', async (t) => {
  const response = await fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerEmail: 'azure-user@example.com', totalAmount: 149.99 })
  });
  assert.strictEqual(response.status, 201);
  const data = await response.json();
  assert.strictEqual(data.order.customerEmail, 'azure-user@example.com');
  assert.ok(data.asyncInfrastructure.serviceBusMessageId);
  
  server.close();
});
