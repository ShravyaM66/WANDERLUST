const Review = require("../models/review");
const Listing = require("../models/listing");

//creating review
module.exports.createReview= async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("New review saved");
    req.flash("success", "Review added");
    res.redirect(`/listings/${listing._id}`);
};

//delete review
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    console.log("Deleting review:", id, reviewId); // Add this line to debug

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
};
