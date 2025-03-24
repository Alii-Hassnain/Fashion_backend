const express = require("express")
const router = express.Router();

const {placeOrder,getAllOrders,updateOrders} = require("../controllers/orderController")

router
.post("/place-Order",placeOrder)
.get("/get-Order",getAllOrders)
.put("/update-Order/:orderId",updateOrders)

// router.get("/order/:userId",getCart)
// router.delete("/cart/:userId/:productId",deleteCartItem)
// router.put("/cart/decrease", decreaseCartItemQuantity);

module.exports = router