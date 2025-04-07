const { Order } = require("../models/orderModel");
const { Product } = require("../models/productModel");
const jwt = require("jsonwebtoken");
const sendEmail = require("../middlewares/nodeMailer");
const { sendWhatsAppMessage ,orderConfirmationMessage} = require("../Utils/whatsappClient");
// const placeOrder = async (req, res) => {
//   try {
//     const { userId, cartItems, subtotal, shipping, totalPrice, totalQuantity, shippingAddress, paymentInfo } = req.body;
//     // Validate phone number format
//     for (let item of cartItems) {
//       await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
//     }
//     const newOrder = new Order({
//       userId,
//       cartItems,
//       subtotal,
//       shipping,
//       totalPrice,
//       totalQuantity,
//       shippingAddress,
//       paymentInfo,
//     });
//     await newOrder.save();
//     res.status(201).json({ message: "Order placed successfully", success: true, order: newOrder });
//   } catch (error) {
//     res.status(500).json({ message: "Error placing order", success: false, error: error.message });
//   }
// }
// const placeOrder = async (req, res) => {
//   try {
//     const {
//       userId,
//       cartItems,
//       subtotal,
//       shipping,
//       totalPrice,
//       totalQuantity,
//       shippingAddress,
//       paymentInfo,
//     } = req.body;

//     // Validate phone number format (this seems to be extra, but ensure it's needed)
//     for (let item of cartItems) {
//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res
//           .status(400)
//           .json({
//             message: `Product with ID ${item.productId} not found`,
//             success: false,
//           });
//       }

//       // Check if sufficient stock is available
//       if (product.stock < item.quantity) {
//         return res
//           .status(400)
//           .json({
//             message: `Insufficient stock for product ${product.name}`,
//             success: false,
//           });
//       }

//       // Update the product stock
//       await Product.findByIdAndUpdate(item.productId, {
//         $inc: { stock: -item.quantity }},
//         { new: true }
//       );
//     }

//     // Create a new order document
//     const newOrder = new Order({
//       userId,
//       cartItems,
//       subtotal,
//       shipping,
//       totalPrice,
//       totalQuantity,
//       shippingAddress,
//       paymentInfo,
//     });

//     // Save the new order to the database
//     await newOrder.save();
//     res
//       .status(201)
//       .json({
//         message: "Order placed successfully",
//         success: true,
//         order: newOrder,
//       });
//   } catch (error) {
//     console.error("Error placing order:", error); // Log the error for debugging
//     res
//       .status(500)
//       .json({
//         message: "Error placing order",
//         success: false,
//         error: error.message,
//       });
//   }
// };


const placeOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      subtotal,
      shipping,
      totalPrice,
      totalQuantity,
      shippingAddress,
      paymentInfo,
    } = req.body;
    for (let item of cartItems) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(400).json({
          message: `Product with ID ${item.productId} not found`,
          success: false,
        });
      }

      // Find the variant (size) of the product
      const variantIndex = product.variants.findIndex(
        (variant) => variant.size === item.size
      );

      if (variantIndex === -1) {
        return res.status(400).json({
          message: `Size ${item.size} not available for product ${product.title}`,
          success: false,
        });
      }

      // Check if sufficient quantity is available
      if (product.variants[variantIndex].quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.title} of size ${item.size}`,
          success: false,
        });
      }

      // Decrease the stock
      product.variants[variantIndex].quantity -= item.quantity;

      await product.save();
    }

    // Create the new Order
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

    res.status(201).json({
      message: "Order placed successfully",
      success: true,
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({
      message: "Error placing order",
      success: false,
      error: error.message,
    });
  }
};
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("cartItems.productId", "title",) // Populate product name
      .sort({ createdAt: -1 }); // Get all orders sorted by latest


      
    res.status(200).json({ message: "success", success: true, orders });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching orders",
        success: false,
        error: error.message,
      });
  }
};
const updateOrders = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updatedFields = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found", success: false });
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updatedFields, {
      new: true,
    });

    res
      .status(200)
      .json({
        message: "Order updated successfully",
        success: true,
        orders: updatedOrder,
      });
  } catch (error) {
    console.error("Error updating order:", error.message);
    res
      .status(500)
      .json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res
        .status(400)
        .json({ message: "Order ID is required", success: false });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found against this id ", success: false });
    }

    res
      .status(200)
      .json({ message: "Order fetched successfully", success: true, order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res
      .status(500)
      .json({
        message: "Error fetching order against this id",
        success: false,
        error: error.message,
      });
  }
};

const getOrdersByUserId = async (req, res) => {
  console.log(req.user._id);
  try {
    // const { userId } = req.params;

    const userId = req.user?._id;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID is required", success: false });
    }

    const orders = await Order.find({ userId })
      .populate("cartItems.productId", "title")
      .lean();
    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No orders found for this user", success: false });
    }

    return res.status(200).json({
      message: "Orders fetched successfully Against this user ",
      success: true,
      userId,
      orders: orders.map((order) => ({
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
        updatedAt: order.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      message: "Server error while fetching orders",
      success: false,
      error: error.message,
    });
  }
};
const sendOrderEmail = async (req, res) => {
  try {
    // const { email, type, customerName, orderId, totalPrice, paymentStatus, trackLink } = req.body;
    const {
      email,
      customerName,
      orderId,
      totalPrice,
      paymentStatus,
      trackingLink,
      storeName,
      supportEmail,
      phoneNumber,
    } = req.body;
    console.log(
      "req body data : ",
      email,
      customerName,
      orderId,
      totalPrice,
      paymentStatus,
      trackingLink,
      storeName,
      supportEmail,
      phoneNumber
    );
    const emailData = {
      customerName,
      orderId,
      totalPrice,
      paymentStatus,
      trackingLink,
      storeName,
      supportEmail,
      phoneNumber,
    };
    const send_Email = await sendEmail(email, "order", null, null, emailData);
    if (send_Email) {
      return res
        .status(200)
        .json({ success: true, message: "Email sent successfully!" });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Failed to send email." });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return res
      .status(500)
      .json({
        message: "Server error while sending email",
        success: false,
        error: error.message,
      });
  }
};

const sendMessage = async (req, res) => {
  try {
    // const { phoneNumber, message } = req.body;
    const { phoneNumber, customerName, orderId, totalPrice, paymentStatus, trackingLink, storeName, supportEmail, phoneNumberSupport } = req.body;
console.log("phone no : ", phoneNumber);
    if(!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required ", success: false });
    }
    const message = orderConfirmationMessage(customerName, orderId, totalPrice, paymentStatus, trackingLink, storeName, supportEmail, phoneNumberSupport);

    const send_whatsapp = await sendWhatsAppMessage(phoneNumber, message);
    if (send_whatsapp) {
      return res
        .status(200)
        .json({ success: true, message: "WhatsApp message sent successfully!" });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Failed to send WhatsApp message." });
    } 
  }
  catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return res
      .status(500)
      .json({
        message: "Server error while sending WhatsApp message",
        success: false,
        error: error.message,
      });
  }
};
module.exports = {
  placeOrder,
  getAllOrders,
  updateOrders,
  getOrderById,
  getOrdersByUserId,
  sendOrderEmail,
  sendMessage
};
