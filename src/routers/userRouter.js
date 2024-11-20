const express = require("express");
const router = express.Router();
const  userController  = require("../controllers/userControler");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/register",userController.registerUser );
router.post("/verify-user", userController.verifyUser);
router.post("/login", userController.loginUser);
router.post("/logout", verifyToken,userController.logoutUser);

module.exports = router;