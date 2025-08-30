const express = require('express');
const router = express.Router();

const {
  // canonical names in your controller
  listProducts,
  singleProduct,
  addProduct,
  removeProduct,

  // (your aliases also exist; either set works)
  // getAllProducts, getProductById, createProduct, deleteProduct
} = require('../controller/ProductController');

// Create product (admin)
router.post('/createproduct', addProduct);       // or createProduct

// Get all products (keep this BEFORE '/:id')
router.get('/getProducts', listProducts);        // or getAllProducts

// Get a single product by id (this is what the FE calls: /api/products/:id)
router.get('/:id', singleProduct);               // or getProductById

// Delete a product (admin)
router.delete('/:id', removeProduct);            // or deleteProduct

module.exports = router;
