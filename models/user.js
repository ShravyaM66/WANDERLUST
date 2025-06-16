const mongoose = require("mongoose");
const Schema= mongoose.Schema;
const passportLocalMongoose= require("passport-local-mongoose");
 
// passportLocalMongoose automatically gives schema for username and password
const userSchema =new Schema({
        email:{
            type:String,
            required:true,
        }

});


userSchema.plugin(passportLocalMongoose);//this is used to set up the schema

module.exports = mongoose.model('User', userSchema);






