const express = require('express');
const router = express.Router();

const { authenticate, authorizeAdmin} = require('../Middlewares/authMiddleware')
const productsController = require('../controllers/products.controller');
const { validateProduct } = require('../Middlewares/validateProduct');

// Public routes
router.get('/products', productsController.getAllProduct);
router.get('/products/:id', productsController.getProduct);

// Admin-only routes
router.post('/products', authenticate, authorizeAdmin, validateProduct, productsController.addProduct);
router.put('/products/:id', authenticate, authorizeAdmin, validateProduct, productsController.updateProduct);
router.delete('/products/:id', authenticate, authorizeAdmin, validateProduct, productsController.deleteProduct);

module.exports = router;