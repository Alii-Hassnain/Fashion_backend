const express = require('express');
const {getAllProducts,getSingleProduct,createProducts,searchProduct}=require('../controllers/productController');
const router=express.Router();
router.get('/products',searchProduct)
router.get('/product/:id',getSingleProduct)
module.exports = router