const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "products",
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    }
}, { timestamps: true });
const Review = mongoose.model("reviews", reviewSchema);
module.exports = {
    Review
}