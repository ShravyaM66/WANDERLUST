const User = require("../models/user");


//render signup form
module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};
//signup
module.exports.signup = async(req,res)=>{
try{
    let{username,email,password}= req.body;
    const newUser = new User({username,email});
    const registeredUser= await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
             return next(err);
        }
        req.flash("success","Welcome to Wanderlust!");
        res.redirect("/listings");
    })
}
catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
}
   
};

//render login form
module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
};
//login 

module.exports.login= async(req,res)=>{

req.flash("success","Welcome back! Logged in successfully");
let redirectUrl = res.locals.redirectUrl || "/listings";
res.redirect(redirectUrl);
};


//render logout form
module.exports.logout = (req,res,next)=>{

    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out!");
        res.redirect("/listings");
    });
};

