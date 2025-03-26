const express = require("express")
const router = express.Router();

const {createCart,getCart,deleteCartItem,decreaseCartItemQuantity,clearCart} =  require("../controllers/cartController")

router.post("/cart",createCart)
router.get("/cart/:userId",getCart)
router.delete("/cart/:userId/:productId/:size",deleteCartItem)
router.put("/cart/decrease", decreaseCartItemQuantity)
router.delete("/cart/:userId",clearCart)

module.exports = router