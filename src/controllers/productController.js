const {Product} = require("../models/productModel");

module.exports.getAllProducts = async (req, res) => {

  try {
      const products = await Product.find()
      console.log(products)
      if(!products){
        return res.status(404).json({ message: "Products not found", success: false });}

      return res.status(200).json({ message: "Products fetched successfully", data: products, success: true });

  } catch (error) {
    console.log("error in fetching products : ", error)
    res.status(500).json({ message: "Error while fetching products", error, success: false });
  }
  
  // const product = products;
  // res.status(200).json(product);

};

// module.exports.getAllProducts = async (req, res) => {
//   try {
//       console.log("product controller")
//       const products = await Product.find()
//       const productCount = await Product.countDocuments()
//       console.log("products : ", productCount)
//       return res
//           .status(200)
//           .json({ message: "Products fetched successfully", count: productCount, products, success: true });
//   } catch (error) {
//       console.log("error in fetching products : ", error)
//       res.status(500).json({ message: "Error while fetching products", error, success: false });
//   }
// }
module.exports.createProducts = async (req, res) => {
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
