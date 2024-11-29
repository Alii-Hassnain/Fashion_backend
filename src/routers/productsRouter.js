const express = require('express');
const {getAllProducts,createProducts}=require('../controllers/productController');
const router=express.Router();
router
.get('/products',getAllProducts)
.post('/post',createProducts)

module.exports=router