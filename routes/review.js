const express =require("express");
const router =express.Router({mergeParams:true});
const wrapAsync =require("../utils/wrapAsync.js");
const Review= require("../models/review.js");
const Listing= require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");


const revewController = require("../controllers/reviews.js");

router.post("/",isLoggedIn,validateReview, wrapAsync(revewController.createReview));


router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(revewController.destroyReview));




   module.exports=router;
