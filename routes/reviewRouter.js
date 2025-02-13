const express = require("express");
// mergeParams: true for id of listings since app.js limits its access.
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
// const Listing = require("../models/listingModel");
// const Review = require('../models/reviewModel');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

const reviewController = require("../controllers/reviewController");

// Reviews
// POST ROUTE
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);


// Reviews
// DELETE ROUTE
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);


module.exports = router;