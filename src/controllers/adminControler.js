const { User } = require("../models/userModel");
const { Product } = require("../models/productModel");
const { uploadOnClouinary } = require("../Utils/Cloudnary");

// ----------------- get all users  -------------------
module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        const userCount = await User.countDocuments()
        console.log("users : ", userCount)
        return res
            .status(200)
            .json({ message: "Users fetched successfully", count: userCount, data: users, success: true });
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while fetching users");
    }
}
// ----------------- get one user  -------------------
module.exports.getOneUser=async(req,res)=>{
    try {
        const userId=req.params.id;
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: "User not found aginst this id", success: false });
        }else{
            return res.status(200).json({ message: "User fetched successfully", data: user, success: true });
        }
    } catch (error) {
        console.log("error in getting user : ",error)
        res.status(500).json({ message: "Error while getting user", error, success: false });
    }
}
// ----------------- delete user  -------------------

module.exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params.id;
        if (!userId) {
            return res
                .status(400)
                .json({ message: "User id is required", success: false });
        }
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res
                .status(404)
                .json({ message: "User not found aginst this id", success: false });
        }
        return res
            .status(200)
            .json({ message: "User deleted successfully", success: true });

    } catch (error) {
        console.log("error in delete user", error)
        return res
            .status(500)
            .json({ message: "Error while deleting user", error, success: false });
    }
}

// ----------------- get all products  -------------------
module.exports.getAllProducts = async (req, res) => {
    try {
        console.log("product controller")
        const products = await Product.find()
        const productCount = await Product.countDocuments()
        console.log("products : ", productCount)
        return res
            .status(200)
            .json({ message: "Products fetched successfully", count: productCount, data: products, success: true });
    } catch (error) {
        console.log("error in fetching products : ", error)
        res.status(500).json({ message: "Error while fetching products", error, success: false });
    }
}
module.exports.getOneProduct=async(req,res)=>{
    try {
        const productId=req.params.id;
        const product=await Product.findById(productId);
        if(!product){
            return res.status(404).json({ message: "Product not found aginst this id", success: false });
        }else{
            return res.status(200).json({ message: "Product fetched successfully", data: product, success: true });
        }

    } catch (error) {
        console.log("error in getting product : ",error)
        res.status(500).json({ message: "Error while getting product", error, success: false });
    }
}
// ----------------- delete product  -------------------
module.exports.deleteProducts = async (req, res) => {
    try {
        const  productId  = req.params.id;
        if (!productId) {
            return res.status(400).json({ message: "Product id is required", success: false });
        }
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found aginst this id", success: false });
        }
        return res.status(200).json({ message: "Product deleted successfully", success: true });
    } catch (error) {
        console.log("error in delete product", error)
        res.status(500).json({ message: "Error while deleting product", error, success: false });
    }
}
// ----------------- create product  -------------------
module.exports.createProduct=async(req,res)=>{
    try {
        const {title,price,stock,rating,description}=req.body;
        console.log("title",title);
        console.log("price",price);
        console.log("stock",stock);
        console.log("rating",rating);
        console.log("description",description);

        
        if(!title || !price || !stock || !rating || !description){
        return res.status(400).json({ message: "Please fill all the fields", success: false });
        }
        const file = req.file.path;
        console.log(file);
        const imageUrl = await uploadOnClouinary(file);
        console.log(imageUrl);
        const newProduct=new Product({
            title,
            product_image:imageUrl.url,
            price,
            stock,
            rating,
            description,
        });
        const product = await newProduct.save();
        return res
        .status(200)
        .json({ message: "Product created successfully", success: true ,data:product});
    } catch (error) {
        console.log("error in create product",error)
        return res.status(500).json({ message: "Error while creating product", error, success: false });
    }
}
// ----------------- update product  -------------------
module.exports.updateProduct=async(req,res)=>{
    try {
        const productId  = req.params.id;
        if(!productId){
            return res.status(400).json({ message: "Product id is required", success: false });}
            const product=await Product.findOneAndUpdate(
                {_id:productId},
                req.body,
                {new:true}
            )
            if (!product){
                return res.status(404).json({ message: "Product not found aginst this id", success: false });
            }
            return res
            .status(200)
            .json({ message: "Product updated successfully", success: true ,data:product});


    } catch (error) {
        console.log("error in update product",error)
        return res.status(500).json({ message: "Error while updating product", error, success: false });
    }
}






