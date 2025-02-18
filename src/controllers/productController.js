// const products = require("../dummyData/productsTestData.js");
const { Product } = require("../models/productModel");
  
// router.get('/api/products', 
const 
searchProduct = async (req, res) => {
  try {
    const { search, category, priceMin, priceMax } = req.query;
    let query = {};
    
    
    // Filter by search term in description (case-insensitive)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ];
    }
    // Filter by category
    if (category) {
      query.category = category;
    }
    // Filter by price range
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) {
        query.price.$gte = Number(priceMin);
      }
      if (priceMax) {
        query.price.$lte = Number(priceMax);
      }
    }
    const products = await Product.find(query).exec();
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching products",
      error: error.message
    });
  }
}

const getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(productId);
    const singleProduct = await Product.findById(productId);
    if (!singleProduct) {
      return res.status(404).json({
        message: "product not found",
        success: false,
      });
    } else {
      return res.status(200).json({
        message:"product fetched successfully",
        data:singleProduct, 
        success:true
      })
    }
  } catch (error) {
    console.log("error fetching product", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().exec();
    const productCount = await Product.countDocuments().exec();
    return res
      .status(200)
      .json({
        message: "Products fetched successfully",
        count: productCount,
        products,
        success: true,
      });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({
        message: "Error while fetching products",
        error,
        success: false,
      });
  }
};
const createProducts = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({ message: "Please fill all the fields" });
    }
    const localPath = req.file.path;
    console.log(localPath);
    const { title, price, stock, rating, description, category } = req.body;
    const product = new Product({
      title,
      price,
      stock,
      rating,
      description,
      category,
    });
    const newProduct = await product.save();
    console.log(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  createProducts,
  searchProduct
};
