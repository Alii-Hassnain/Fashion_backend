const express=require('express');
const {getallProducts,createProducts}=require('../controllers/productController');
const router=express.Router();
router
.get('/products',getallProducts)
.post('/post',createProducts)

module.exports=router