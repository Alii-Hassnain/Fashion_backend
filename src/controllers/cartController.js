const { Cart } = require("../models/cartModel");
const createCart = async (req, res) => {
  try {
    console.log(req.body);

    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res
        .status(400)
        .json({ error: "userId and productId are required" });
    }

    console.log(req.body);
    let cart = await Cart.findOne({ userId });
    console.log(cart);

    if (!cart) {
      cart = new Cart({ userId, cartItems: [{ productId, quantity: 1 }] });
    } else {
      const existingProduct = cart.cartItems.find(
        (item) => item.productId.toString() === productId
      );
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.cartItems.push({ productId, quantity: 1 });
      }
    }
    await cart.save();
    const updatedCart = await Cart.findOne({ userId })
      .populate("cartItems.productId")
      .lean();
    res.status(200).json(updatedCart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate(
      "cartItems.productId"
    );
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCart,
  getCart,
};
