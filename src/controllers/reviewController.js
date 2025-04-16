const { get } = require("mongoose");
const { Review } = require("../models/reviewModel");
const { Product } = require("../models/productModel");
const { User } = require("../models/userModel");
const express = require('express');
const { Product } = require('../models/productModel');

const updateAverageRating = async (productId) => {
    console.log("updateAverageRating is called");
    try {
        // Step 1: Get all reviews for the product
        const reviews = await Review.find({ productId });
        // Step 2: Calculate the average rating
        const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = reviews.length ? totalRatings / reviews.length : 0;
        // Step 3: Update the product's averageRating field
        await Product.findByIdAndUpdate(productId, { rating:averageRating }, { new: true });
        console.log(`Average rating for product ${productId} updated to ${averageRating}`);
    } catch (error) {
        console.error("Error updating average rating:", error);
    }
};
const createReview= async (req, res) => {
    try {
        const { productId, comment, rating } = req.body;
        console.log("req.body : ", req.body)
        if (!productId || !rating || !comment) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }
        //   const review = await Review.create({
        //     userId: req.user._id,
        //     productId,
        //     comment,
        //     rating,
        //   });

        const review = await Review.create({
            userId: req.user._id,
            productId,
            comment,
            rating,
          });
          await updateAverageRating(productId);
            if (!review) {
                return res.status(400).json({ message: "Unable to create review" , success : false});
            }
            return res.status(200).json({ message: "Review created successfully" , review , success : true});

    } catch (error) {
        console.log("error in creating review", error);
        res.status(500).json({ message: "Internal server error while creating review", success: false });

    }
}
const getReview = async (req, res) => {
    try {
        const { productId } = req.params;
        // const reviews = await Review.find({ productId });
        const reviews = await Review.find({ productId }).populate("userId", "username email");
        if (!reviews) {
            return res.status(404).json({ message: "No reviews found for this product", success: false });
        }
        return res.status(200).json({ success: true, message: "Reviews fetched successfully", reviews, success: true });
    } catch (error) {
        console.log("error in getting review", error);
        res.status(500).json({ message: "Internal server error while getting reviews", success: false });
    }

}

const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        console.log("reviews : ", reviews)
        if (!reviews) {
            return res.status(404).json({ message: "No reviews found", success: false });
        }
        return res.status(200).json({ message: "Reviews fetched successfully", reviews, success: true });
    } catch (error) {
        console.log("error in getting review", error);
        res.status(500).json({ message: "Internal server error while getting reviews", success: false });
    }
}
const getUserReviews = async (req, res) => {
    try {
        const { userId } = req.params;
        const reviews = await Review.find({ userId })
        const reviewsCount = await Review.find({ userId }).countDocuments()

        if (!reviews) {
            return res.status(404).json({ message: "No reviews found for this user", success: false });
        }
        return res.status(200).json({ message: "Reviews fetched successfully", reviews, count: reviewsCount, success: true });
    }
    catch (error) {
        console.log("error in getting review", error);
        res.status(500).json({ message: "Internal server error while getting reviews", success: false });
    }
}
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await Review.findByIdAndDelete(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found", success: false });
        }
        return res.status(200).json({ message: "Review deleted successfully", success: true });
    }
    catch (error) {
        console.log("error in deleting review", error);
        res.status(500).json({ message: "Internal server error while deleting review", success: false });
    }
}


const getUserReviewBYProductName = async (req, res) => {
    try {
        const { title } = req.params;

        if (!title) {
            return res.status(400).json({ message: 'Product Name is Required' });
        }

        // Find Product by Name
        const product = await Product.findOne({
            title: { $regex: new RegExp(title, 'i') } // Case Insensitive
        });

        if (!product) {
            return res.status(404).json({ message: 'Product Not Found' });
        }

        // Find Reviews by productId
        const reviews = await Review.find({ productId: product._id });

        if (reviews.length === 0) {
            return res.status(404).json({ message: 'No Reviews Found for this Product' });
        }

        res.status(200).json({
            success: true,
            totalReviews: reviews.length,
            reviews,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const getReviewBYProductId = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required", success: false });
        }
        const reviews = await Review.find({ productId }).populate("userId", "username email");
        if (!reviews) {
            return res.status(404).json({ message: "No reviews found for this product", success: false });
        }
        return res.status(200).json({ message: "Reviews fetched successfully", reviews, count: reviews.length, success: true });
    } catch (error) {
        console.log("error in getting review", error);
        res.status(500).json({ message: "Internal server error while getting reviews", success: false });
    }
}


const getReviewByUserEmailOrUsername = async (req, res) => {
    try {
        const { emailOrUsername } = req.params;

        if (!emailOrUsername) {
            return res.status(400).json({ message: "Email or Username is required", success: false });
        }
        let user;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailRegex.test(emailOrUsername)) {
            // Search by Email
            user = await User.findOne({ email: emailOrUsername });
            if (!user) {
                return res.status(404).json({ message: "User not found against this email", success: false });
            }
        } else {
            // Search by Username
            user = await User.findOne({ username: emailOrUsername });
            if (!user) {
                return res.status(404).json({ message: "User not found against this username", success: false });
            }
        }
        const reviews = await Review.find({ userId: user._id }).populate('productId', 'title')
            .populate('userId', 'username');
        const reviewsCount = await Review.find({ userId: user._id }).countDocuments()
        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this user", success: false });
        }
        return res.status(200).json({ message: "Reviews fetched successfully", reviews, count: reviewsCount, success: true });
    }
    catch (error) {
        console.log("error in getting review", error);
        res.status(500).json({ message: "Internal server error while getting reviews", success: false });
    }
}







module.exports = {
    createReview,
    getReview,
    getAllReviews,
    getUserReviews,
    deleteReview,
    getUserReviewBYProductName,
    getReviewByUserEmailOrUsername,
    getReviewBYProductId
}