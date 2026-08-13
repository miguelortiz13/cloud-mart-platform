const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const config = require('./config/env');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Serve static frontend assets (Dashboard UI)
app.use(express.static(path.join(__dirname, 'public')));

// Mount API routes
app.use('/api', apiRoutes);

// Root fallback to dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.path });
});

// Start HTTP Server
const server = app.listen(config.PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 CloudMart Microservice Platform Running on Port ${config.PORT}`);
  console.log(`🌐 Dashboard URL: http://localhost:${config.PORT}`);
  console.log(`⚡ Health Endpoint: http://localhost:${config.PORT}/api/health`);
  console.log(`=======================================================`);
});

module.exports = { app, server };
