const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productsSchema = new Schema({
    // _id:{
    //     type:Number,
    //     index:true,
    // },
    title: {
        type: String,
        required: true,
        index: true
    },
    price: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0
    },
    description: String,
    catogery: String,
}, { timestamps: true })

module.exports = mongoose.model("products", productsSchema)