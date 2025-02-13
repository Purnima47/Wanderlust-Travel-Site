const Listing = require('./models/listingModel');
const Review = require('./models/reviewModel');
const ExpressError = require('./utils/ExpressError');
const { listingSchema, reviewSchema } = require('./schema');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to use this functionality!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "Permission Denied!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.validateListing = (req, res, next) => {
    // If no data is send then throw an error
    // Schema created through Joi should validate.
    // const result = listingSchema.validate(req.body);
    const { error } = listingSchema.validate(req.body);
    // console.log(result);
    // console.log(result.error.message);

    if (error) {
        let errorMessage = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errorMessage);
    } else {
        next();
    }
}


module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        let errorMessage = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errorMessage);
    } else {
        next();
    }
}


module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "Permission Denied!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}