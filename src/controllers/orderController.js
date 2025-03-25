const { Order } = require("../models/orderModel");
const { Product } = require("../models/productModel");
const jwt = require("jsonwebtoken");
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

const getOrderById = async (req, res) => {
 
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required", success: false });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found against this id ", success: false });
    }

    res.status(200).json({ message: "Order fetched successfully", success: true, order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Error fetching order against this id", success: false, error: error.message });
  }
};

const getOrdersByUserId = async (req, res) => {
  console.log(req.user._id)
  try {
    // const { userId } = req.params;
    
    const userId = req.user?._id
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required", success: false });
    }

    const orders = await Order.find({ userId })
      .populate("cartItems.productId", "title") 
      .lean();
    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user", success: false });
    }

    return res.status(200).json({
      message: "Orders fetched successfully Against this user ",
      success: true,
      userId,
      orders: orders.map(order => ({
        _id: order._id,
        userId: order.userId,
        cartItems: order.cartItems,
        paymentInfo: order.paymentInfo,
        shippingAddress: order.shippingAddress,
        subtotal: order.subtotal,
        shipping: order.shipping,
        totalPrice: order.totalPrice,
        totalQuantity: order.totalQuantity,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }))
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      message: "Server error while fetching orders",
      success: false,
      error: error.message
    });
  }
};












  module.exports = {
    placeOrder,
    getAllOrders,
    updateOrders,
    getOrderById,
    getOrdersByUserId
  }