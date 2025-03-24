const { Cart } = require("../models/cartModel");
const { Product } = require("../models/productModel");
// const createCart = async (req, res) => {
//   try {
//     console.log(req.body);
//     const { userId, productId } = req.body;
//     if (!userId || !productId) {
//       return res
//         .status(400)
//         .json({ error: "userId and productId are required" });
//     }
//     console.log(req.body);
//     let cart = await Cart.findOne({ userId });
//     console.log(cart);

//     if (!cart) {
//       cart = new Cart({ userId, cartItems: [{ productId, quantity: 1 }] });
//     } else {
//       const existingProduct = cart.cartItems.find(
//         (item) => item.productId.toString() === productId
//       );
//       if (existingProduct) {
//         existingProduct.quantity += 1;
//       } else {
//         cart.cartItems.push({ productId, quantity: 1 });
//       }
//     }
//     // await cart.save();
//     await cart.calculateCartTotals();
//     const updatedCart = await Cart.findOne({ userId })
//       .populate("cartItems.productId")
//       .lean();
//     res.status(200).json(updatedCart);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error.message });
//   }
// };

const createCart = async (req, res) => {
  try {
    console.log(req.body);
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ error: "userId and productId are required" });
    }
    //  Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.log(product);
    
    //  Check stock availability
    if (product.stock <= 0) {
      return res.status(400).json({ message: "Product is out of stock" });
    }

    console.log("this is after the product");
    
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, cartItems: [{ productId, quantity: 1 }] });
    } else {
      const existingProduct = cart.cartItems.find(
        (item) => item.productId.toString() === productId
      );
      if (existingProduct) {
        //  Ensure quantity doesn't exceed stock
        if (existingProduct.quantity + 1 > product.stock) {
          return res.status(400).json({ message: "Not enough stock available" });
        }
        existingProduct.quantity += 1;
      } else {
        cart.cartItems.push({ productId, quantity: 1 });
      }
    }
    //  Save the updated cart
    await cart.save();
    //  Recalculate totals
    await cart.calculateCartTotals();
    //  Return updated cart with product details
    const updatedCart = await Cart.findOne({ userId })
      .populate({
        path: "cartItems.productId",
      })
      .lean();
    
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    // Clear cart items
    cart.cartItems = [];
    // Reset cart totals
    cart.totalQuantity = 0;
    cart.totalPrice = 0;
    cart.subtotal = 0;
    cart.shipping = 0;

    // Save changes
    await cart.save();
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to clear cart", error: error.message });
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

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.cartItems = cart.cartItems.filter(
      (item) => item.productId.toString() !== productId
    );

    // await cart.save();
    await cart.calculateCartTotals();
    const updatedCart = await Cart.findOne({ userId }).populate(
      "cartItems.productId"
    );
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const decreaseCartItemQuantity = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const existingProduct = cart.cartItems.find(
      (item) => item.productId.toString() === productId
    );

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    if (existingProduct.quantity > 1) {
      existingProduct.quantity -= 1;
    } else {
      // Remove item if quantity is 1
      cart.cartItems = cart.cartItems.filter(
        (item) => item.productId.toString() !== productId
      );
    }

    // await cart.save();
    await cart.calculateCartTotals();
    const updatedCart = await Cart.findOne({ userId }).populate(
      "cartItems.productId"
    );
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCart,
  getCart,
  deleteCartItem,
  decreaseCartItemQuantity,
  clearCart,
};
