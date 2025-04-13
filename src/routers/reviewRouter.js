const express = require('express');
const router = express.Router();
const { Review } = require('../models/reviewModel');
const reviewController = require('../controllers/reviewController');
// const { createReview } = require("../controllers/reviewController");
const { verifyToken } = require('../middlewares/authMiddleware');
const adminAuth = require('../middlewares/adminMiddleware');


router.post('/create-review', verifyToken, reviewController.createReview);
router.get('/get-review/:productId', reviewController.getReview);
router.get('/get-allReviews', reviewController.getAllReviews);


// protected route for admin only 
router.get('/get-userReviews/:userId',adminAuth, reviewController.getUserReviews);
router.delete('/delete-review/:reviewId',adminAuth, reviewController.deleteReview);
router.get('/get-userReview/:title',reviewController.getUserReviewBYProductName);
router.get('/review-byNameEmail/:emailOrUsername', reviewController.getReviewByUserEmailOrUsername);
router.get('/review-byProductId/:productId', reviewController.getReviewBYProductId);


module.exports = router;





