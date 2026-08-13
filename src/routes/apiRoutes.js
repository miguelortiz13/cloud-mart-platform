const express = require('express');
const router = express.Router();

const healthController = require('../controllers/healthController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');

// Health & Infrastructure Metadata
router.get('/health', healthController.getHealth);
router.get('/architecture', healthController.getArchitectureMeta);

// Products API (Cache-Aside Pattern with Redis & RDS)
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);

// Orders API (Mutates RDS, Invalidates Redis Cache, Dispatches to SQS Queue)
router.post('/orders', orderController.createOrder);
router.get('/orders', orderController.getOrders);

module.exports = router;
