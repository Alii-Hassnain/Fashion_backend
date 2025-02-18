const express = require("express")
const router = express.Router();

const {createCart,getCart} =  require("../controllers/cartController")

router.post("/cart",createCart)
router.get("/cart/:userId",getCart)
module.exports = router