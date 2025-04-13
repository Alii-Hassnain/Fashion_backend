const express = require('express');
const {getAllProducts,getSingleProduct,createProducts,searchProduct,getRecommendedProduct}=require('../controllers/productController');
const router=express.Router();
router.get('/products',searchProduct)
router.get('/product/:id',getSingleProduct)
router.get('/recommendedproducts/:id',getRecommendedProduct)
module.exports = router