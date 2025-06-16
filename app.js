if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
//
app.use(methodOverride('_method'));

const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



//routers
const listingRouter= require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

//connecting with mongodb atlas
const dburl = process.env.ATLASDB_URL;

// Connecting to database
async function main() {
    try {
        await mongoose.connect(dburl);
        console.log("Connected to DB"); // Debugging: Log success message
    } catch (err) {
        console.error("Error connecting to DB:", err); // Debugging: Log error
    }
}

main();

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60 // 1 day  
});

store.on("error",()=>{
    console.log("Error in mongo session store",err);
})

const sessionOptions = {
     store,
    secret:  process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");  
    res.locals.currentUser = req.user;

    next();
});

//demo user
app.get("/demouser",async(req,res)=>{
    let fakeUser = new User({
        email:"fake@gmail.com",
        username:"fake"
    });
   let registeredUser= await User.register(fakeUser,"helloworld");//method ===>register(username,password,callback(optional))
    res.send(registeredUser);
});


//using routers

app.use("/listings", listingRouter);

app.use("/listings/:id/reviews", reviewRouter);

app.use("/",userRouter);


// //basic route
// app.get("/", (req, res) => {
//     res.redirect("/listings");
// });

app.use("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("listings/error", { message });
});



app.listen(8080, () => {
    console.log("Server is running on port 8080"); // Debugging: Log server start
});

