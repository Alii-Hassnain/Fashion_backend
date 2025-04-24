const express = require("express");
const {getProducts,greetUser,getOrderStatus} = require("../controllers/botController")
const router = express.Router()
router.get("/products",getProducts).get("/greet",greetUser)
router.get("/orders",getOrderStatus)
module.exports = router
