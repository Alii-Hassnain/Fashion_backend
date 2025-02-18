const express = require("express");
const router = express.Router();
const  userController  = require("../controllers/userController");
const { verifyToken }=require("../middlewares/authMiddleware");

router.post("/register",userController.registerUser );
router.post("/verify-user", userController.verifyUser);
router.post("/login", userController.loginUser);
router.post("/logout", verifyToken,userController.logoutUser);
router.post("/forgot-password",userController.forgotPassword);
router.post("/reset-password",userController.resetPassword);
router.get("/verify-session", userController.verifySession);


module.exports = router;