// middleware/validateProduct.js
const { body } = require('express-validator');

const validateProduct = [
  body('title').notEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be at least 1')
];

module.exports = { validateProduct }