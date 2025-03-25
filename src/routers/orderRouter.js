const express = require("express")
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");

const {placeOrder,getAllOrders,updateOrders,getOrdersByUserId} = require("../controllers/orderController");
const { Order } = require("../models/orderModel");
// router.use(verifyToken)
router
.post("/place-Order",placeOrder)
.get("/get-Order",getAllOrders)
.put("/update-Order/:orderId",updateOrders)
.get("/getOrderById",verifyToken,getOrdersByUserId)

// router.get("/order/:userId",getCart)
// router.delete("/cart/:userId/:productId",deleteCartItem)
// router.put("/cart/decrease", decreaseCartItemQuantity);

module.exports = router