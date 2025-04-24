const { Product } = require("../models/productModel");
const chatbotModel = require("../models/botModel");
const { Order } = require("../models/orderModel");

const greetUser = (req, res) => {
  // Check if user is logged in using req.oser
  const id = chatbotModel.userId;
  const username = chatbotModel.userName;
  
  if (!id || !username) {
    return res.json({
      message: "Hello, guest 👋 Please login first.",
      success: false,
    });
  }
  // If not logged in
  return res.json({
    message: `Hello, ${username} 👋`,
    success: true,
  });
};
const getOrderStatus = async (req, res) => {
  const id = chatbotModel.userId;
  const username = chatbotModel.userName;
  try {
    if (!id && !username) {
      return res.json({ message: "Please log in first.", success: false });
    }

    const order = await Order.find({ userId: id })
      .sort({ createdAt: -1 }) // Sort by latest (newest first)
      .limit(1);
    if (!order) {
      return res.json({ message: "Order not found.", success: false });
    }

    return res.json({
      message: `Order is currently ${order[0].status}.`,
      success: true,
    });
  } catch (err) {
    console.error("Error fetching order status:", err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find().limit(10);
//     console.log("Fetched Products:", products);

//     return res.json({ products }); // Send the products
//   } catch (error) {
//     console.error("Error fetching products:", error.message);
//     res.status(500).json({ error: "Failed to fetch products" });
//   }
// };

const getProducts = async (req, res) => {
  try {
    const { gender, category } = req.query;
    console.log("request received")
    // if (!gender || !category) {
    //   return res.status(400).json({
    //     error: "Gender and category are required",
    //     success: false,
    //   });
    // }

    const products = await Product.find(
      { gender, category },
      "title price rating product_image description category gender"
    );

    return res.json({
      products,
      success: true,
      count: products.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({
      error: "Failed to fetch products",
      success: false,
    });
  }
};









module.exports = {
  
  getProducts,
  greetUser,
  getOrderStatus,
};
