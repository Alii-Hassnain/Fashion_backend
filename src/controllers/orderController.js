const { Order } = require("../models/orderModel");

const placeOrder = async (req,res)=>{
  try {
    const { userId, cartItems, subtotal, shipping, totalPrice, totalQuantity, shippingAddress, paymentInfo } = req.body;
    // Validate phone number format
    const phoneRegex = /^\+92\s\d{4}\s\d{7}$/;
    if (!phoneRegex.test(shippingAddress.mobileNumber)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }
    const newOrder = new Order({
      userId,
      cartItems,
      subtotal,
      shipping,
      totalPrice,
      totalQuantity,
      shippingAddress,
      paymentInfo,
    });
    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully",success:true, order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Error placing order",success:false, error: error.message });
  }
}


const getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find().sort({ createdAt: -1 }); // Get all orders sorted by latest
      res.status(200).json({message:"success" , success:true , orders});
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders",success:false, error: error.message });
    }
  };

  module.exports = {
    placeOrder,
    getAllOrders
  }