const dbService = require('../services/dbService');
const queueService = require('../services/queueService');
const cacheService = require('../services/cacheService');

exports.createOrder = async (req, res) => {
  try {
    const { customerEmail, totalAmount, items } = req.body;

    if (!customerEmail) {
      return res.status(400).json({ error: 'customerEmail is required' });
    }

    // 1. Write order to RDS database
    const order = await dbService.createOrder({ customerEmail, totalAmount, items });

    // 2. Invalidate order list cache
    await cacheService.del('orders:all');

    // 3. Dispatch notification event to SNS -> SQS Queue for asynchronous processing
    const queueDispatch = await queueService.publishOrderEvent(order);

    return res.status(201).json({
      message: 'Order placed successfully and dispatched to SQS queue',
      order,
      asyncInfrastructure: queueDispatch
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await dbService.getAllOrders();
    const queueEvents = await queueService.getRecentEvents();

    return res.json({
      orders,
      infrastructureQueueState: queueEvents
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
