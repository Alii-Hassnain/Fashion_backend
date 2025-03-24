const { Order } = require("../models/orderModel");
const { Product } = require("../models/productModel");

const placeOrder = async (req,res)=>{
  try {
    const { userId, cartItems, subtotal, shipping, totalPrice, totalQuantity, shippingAddress, paymentInfo } = req.body;
    // Validate phone number format
    for (let item of cartItems) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
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
    const orders = await Order.find()
      .populate("cartItems.productId", "title") // Populate product name
      .sort({ createdAt: -1 }); // Get all orders sorted by latest

    res.status(200).json({ message: "success", success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", success: false, error: error.message });
  }
};
const updateOrders = async (req, res) => {
  try {
    const {orderId} = req.params;
    const updatedFields = req.body; 
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found", success: false });
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updatedFields, { new: true });

    res.status(200).json({ message: "Order updated successfully", success: true, orders: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error.message);
    res.status(500).json({ message: "Internal server error", success: false, error: error.message });
  }
};



  module.exports = {
    placeOrder,
    getAllOrders,
    updateOrders
  }