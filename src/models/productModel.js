const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const productsSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0,
    },
    product_image: {
        type:String,
        required: true,
        minlength:1,
    },
    stock: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: true,
    },
    gender:{
        type: String,
        required: true,
        enum:["men","women","kids"]    
    },
    variants: [
        {
          size: {
            type: String,
            enum: ["S", "M", "L", "XL", "2XL"],
            required: true,
          },
          quantity: {
            type: Number,
            default: 0,
          },
        },
      ],
    description: String,

}, { timestamps: true })
// productsSchema.plugin(AutoIncrement, { id: '1', inc_field: '_id' });

const Product = mongoose.model("products", productsSchema)
module.exports = {
    Product
}
// export const Product = mongoose.model("products", productsSchema)