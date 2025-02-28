const express = require("express")
const router = express.Router();

const {placeOrder,getAllOrders} = require("../controllers/orderController")

router.post("/order",placeOrder).get("/order",getAllOrders);
// router.get("/order/:userId",getCart)
// router.delete("/cart/:userId/:productId",deleteCartItem)
// router.put("/cart/decrease", decreaseCartItemQuantity);

module.exports = router