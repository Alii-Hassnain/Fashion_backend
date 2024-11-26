const express = require("express");
const router = express.Router();
const  adminController  = require("../controllers/adminControler");

// users route
router.get("/get-users", adminController.getAllUsers);
router.delete("/delete-user/:id", adminController.deleteUser);

// products route
router.get("/get-products", adminController.getAllProducts);
router.delete("/delete-product/:id", adminController.deleteProducts);
router.post("/create-product",adminController.createProduct)
router.patch("/update-product/:id",adminController.updateProduct)

module.exports = router;