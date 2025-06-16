const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage }); // Configure multer to use Cloudinary storage

// Controller for routes
const listingController = require("../controllers/listings.js");

// New listing form
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

// Create and list all listings
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("image"), // Handle file upload
        validateListing,
        wrapAsync(listingController.createListing)
    );

// Show, update, and delete specific listing
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single("image"), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit form for a listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;

