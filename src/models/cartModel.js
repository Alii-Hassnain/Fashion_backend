const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    cartItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    subtotal: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
    totalQuantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CartSchema.methods.calculateCartTotals = async function () {
  const cart = this;
  await cart.populate("cartItems.productId");
  cart.subtotal = cart.cartItems.reduce((sum, item) => {
    return sum + item.productId.price * item.quantity;
  }, 0);
  cart.shipping = cart.subtotal > 0 ? 500 : 0;
  cart.totalPrice = cart.subtotal + cart.shipping;
  cart.totalQuantity = cart.cartItems.reduce((total, item) => total + item.quantity, 0);
  await cart.save();
};

const Cart = mongoose.model("cart", CartSchema);

module.exports = {
  Cart,
};
