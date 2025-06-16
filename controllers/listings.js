const Listing = require('../models/listing');

module.exports = {
    index: async (req, res) => {
        let allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    },

    renderNewForm: (req, res) => {
        console.log(req.user);
        res.render("listings/new.ejs");
    },

    showListing: async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id)
            .populate({
                path: "reviews",
                populate: {
                    path: "author"
                }
            })
            .populate("owner");
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist!");
            res.redirect("/listings");
        }
        console.log(listing);
        res.render("listings/show.ejs", { listing });
    },

    createListing: async (req, res) => { 
        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing); 
        newListing.owner = req.user._id;
        newListing.image = { url, filename };

        await newListing.save();
        req.flash("success", "Successfully created a new listing!"); 
        res.redirect("/listings");
    },

    // renderEditForm: async (req, res) => {
    //     let { id } = req.params;
    //     const listing = await Listing.findById(id);
    //     if (!listing) {
    //         req.flash("error", "Listing you requested for does not exist!");
    //         res.redirect("/listings");
    //     }

    //     let originalImageUrl = listing.image.url;
    //     originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    //     res.render("listings/edit.ejs", { listing , originalImageUrl });
    // },
    renderEditForm: async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist!");
            res.redirect("/listings");
        }
    
        // Adjust the image URL to set the width to 250px (optional: you can modify other properties)
        let originalImageUrl = listing.image.url.replace("/upload", "/upload/w_250");
    
        res.render("listings/edit.ejs", { listing, originalImageUrl });
    },

    updateListing: async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id);

        // Update listing fields from the request body
        listing.title = req.body.listing.title;
        listing.description = req.body.listing.description;
        listing.price = req.body.listing.price;
        listing.country = req.body.listing.country;
        listing.location = req.body.listing.location;

        // If a new image is uploaded, update the image URL
        if (req.file) {
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = { url, filename };
        }

        // Save the updated listing
        await listing.save();
        req.flash("success", "Successfully updated");
        res.redirect(`/listings/${id}`);
    },

    destroyListing: async (req, res) => {
        let { id } = req.params;
        let deleteListing = await Listing.findByIdAndDelete(id);
        console.log(deleteListing);
        req.flash("success", "Successfully deleted");
        res.redirect("/listings");
    }
};
