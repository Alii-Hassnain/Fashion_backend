
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    cartItems: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
            required: true,
          },
          size: {
            type: String,
            enum: ["S", "M", "L", "XL", "2XL"],
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          }

        },
      ],
      required: true, // Ensures the field exists
      validate: {
        validator: function (value) {
          return value.length > 0; // Ensures cartItems is NOT empty
        },
        message: "cartItems cannot be empty",
      },
    },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    totalQuantity: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Payment Verification", "Pending", "Processing", "Shipped", "Delivered", "Canceled", "Completed", "Returned"],
      default: "Pending",
    },
    paymentInfo: {
      transactionId: { type: String },
      //   method: { type: String, enum: ["Card", "COD"], required: true },
      status: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
      paidAt: { type: Date },
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      mobileNumber: {
        type: String,
        required: true,
        match: [/^\+92\d{10}$/, "Invalid phone number format"], // ✅ Enforces format +92 XXXX XXXXXXX
      },
      address: { type: String, required: true },
    },
    orderNotes: { type: String },
  },
  { timestamps: true }
);

const Order = mongoose.model("order", OrderSchema);
module.exports = {
  Order,
};
