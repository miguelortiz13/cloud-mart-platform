const dbService = require('../services/dbService');
const cacheService = require('../services/cacheService');

exports.getProducts = async (req, res) => {
  try {
    const cacheKey = 'products:all';
    const cacheResult = await cacheService.get(cacheKey);

    if (cacheResult.hit) {
      return res.json({
        source: 'ElastiCache Redis',
        cached: true,
        data: cacheResult.value
      });
    }

    // Cache miss - Fetch from PostgreSQL RDS
    const products = await dbService.getAllProducts();
    await cacheService.set(cacheKey, products, 120);

    return res.json({
      source: 'RDS PostgreSQL (Cache Miss - Stored to Redis)',
      cached: false,
      data: products
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `product:${id}`;
    const cacheResult = await cacheService.get(cacheKey);

    if (cacheResult.hit) {
      return res.json({
        source: 'ElastiCache Redis',
        cached: true,
        data: cacheResult.value
      });
    }

    const product = await dbService.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await cacheService.set(cacheKey, product, 300);

    return res.json({
      source: 'RDS PostgreSQL',
      cached: false,
      data: product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
