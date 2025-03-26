const { Cart } = require("../models/cartModel");
const { Product } = require("../models/productModel");

const createCart = async (req, res) => {
  try {
    console.log(req.body);
    const { userId, productId, size, quantity } = req.body;

    if (!userId || !productId || !size || !quantity) {
      return res
        .status(400)
        .json({ error: "userId, productId, size, and quantity are required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("Product found:", product);

    const variant = product.variants.find((v) => v.size === size);
    if (!variant) {
      return res
        .status(400)
        .json({ error: `Size ${size} is not available for this product` });
    }

    if (variant.quantity < quantity) {
      return res
        .status(400)
        .json({
          message: `Only ${variant.quantity} available for size ${size}`,
        });
    }

    console.log(`Stock available for size ${size}: ${variant.quantity}`);

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        cartItems: [{ productId, size, quantity }],
        subtotal: 0,
        shipping: 500,
        totalPrice: 500,
        totalQuantity: 0,
      });
    } else {
      const existingItem = cart.cartItems.find(
        (item) => item.productId.toString() === productId && item.size === size
      );

      if (existingItem) {
        if (existingItem.quantity + quantity > variant.quantity) {
          return res.status(400).json({
            message: `Only ${variant.quantity} available for size ${size}`,
          });
        }
        existingItem.quantity += quantity;
        existingItem.price += product.price * quantity;
      } else {
        cart.cartItems.push({
          productId,
          size,
          quantity,
          price: product.price * quantity,
        });
      }
    }
    cart.totalQuantity += quantity;
    cart.subtotal += product.price * quantity;
    cart.totalPrice = cart.subtotal + cart.shipping;

    // // Deduct stock from product variants
    // variant.quantity -= quantity;
    // await product.save({ validateBeforeSave: false });

    await cart.save();

    const updatedCart = await Cart.findOne({ userId })
      .populate({
        path: "cartItems.productId",
        select:
          "title price rating product_image description category gender variants",
      })
      .lean();

    updatedCart.cartItems = updatedCart.cartItems.map((item) => {
      return {
        ...item,
        productId: {
          ...item.productId,
          variants: [
            {
              size: item.size,
              quantity: item.quantity,
            },
          ],
        },
      };
    });

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
    cart.cartItems = [];
    cart.totalQuantity = 0;
    cart.totalPrice = 0;
    cart.subtotal = 0;
    cart.shipping = 0;

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
    const cart = await Cart.findOne({ userId: req.params.userId })
      .populate({
        path: "cartItems.productId",
        select:
          "title price rating product_image description category gender variants",
      })
      .lean();
    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    cart.cartItems = cart.cartItems.map((item) => ({
      ...item,
      productId: {
        ...item.productId,
        variants: [{ size: item.size, quantity: item.quantity }],
      },
    }));

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId, size } = req.params;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.cartItems = cart.cartItems.filter(
      (item) => !(item.productId.toString() === productId && item.size === size)
    );

    await cart.calculateCartTotals();
    await cart.save();

    let updatedCart = await Cart.findOne({ userId })
      .populate({
        path: "cartItems.productId",
        select:
          "title price rating product_image description category gender variants",
      })
      .lean();

    if (!updatedCart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    updatedCart.cartItems = updatedCart.cartItems.map((item) => {
      let filteredVariants = item.productId.variants.filter(
        (variant) => variant.size !== size
      );

      return {
        ...item,
        productId: {
          ...item.productId,
          variants: filteredVariants,
        },
      };
    });

    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const decreaseCartItemQuantity = async (req, res) => {
  try {
    const { userId, productId, size } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Find the cart item
    const existingProduct = cart.cartItems.find(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (!existingProduct) {
      return res
        .status(404)
        .json({ error: `Product with size ${size} not found in cart` });
    }

    // Check if the product exists in the database and has the requested size variant
    const product = await Product.findById(productId).lean();
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const variantExists = product.variants.some(
      (variant) => variant.size === size
    );
    if (!variantExists) {
      return res
        .status(400)
        .json({
          error: `Variant size ${size} does not exist for this product`,
        });
    }

    // If quantity is more than 1, decrease by 1
    if (existingProduct.quantity > 1) {
      existingProduct.quantity -= 1;
    } else {
      // If quantity is 1, remove the item from the cart
      cart.cartItems = cart.cartItems.filter(
        (item) =>
          !(item.productId.toString() === productId && item.size === size)
      );
    }

    await cart.calculateCartTotals();
    await cart.save();

    // ✅ Fetch updated cart with selected variant
    const updatedCart = await Cart.findOne({ userId })
      .populate({
        path: "cartItems.productId",
        select:
          "title price rating product_image description category gender variants",
      })
      .lean();

    if (!updatedCart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // ✅ Keep only the selected variant in the response
    updatedCart.cartItems = updatedCart.cartItems.map((item) => {
      const updatedVariants = item.productId.variants.filter(
        (variant) => variant.size === item.size
      );

      return {
        ...item,
        productId: {
          ...item.productId,
          variants: updatedVariants.length > 0 ? updatedVariants : "Deleted",
        },
      };
    });

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
