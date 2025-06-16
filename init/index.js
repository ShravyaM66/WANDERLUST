const mongoose = require("mongoose");
const initData = require("./data.js");  // Importing as initData
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner:"677192767b2b9c06d4eb2933"
    }));
    await Listing.insertMany(initData.data);  // Accessing data property
    console.log("Data was inserted");
};

initDB();
