const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Listing = require("../models/listingModel");
const { isLoggedIn, isOwner, validateListing } = require('../middleware');
const multer = require('multer');
const { storage } = require("../cloudConfig");
const upload = multer({ storage });


const listingController = require("../controllers/listingController");

// INDEX AND CREATE ROUTE
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing,
        wrapAsync(listingController.createNewListing)
    );


// NEW ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm);


// SHOW, UPDATE ROUTE AND DELETE ROUTE
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,
        isOwner,
        isLoggedIn, upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );


// EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;