const mongoose = require("mongoose");
const intializeData = require("./data.js");
const Listing = require("../models/listingModel.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("Connect to Wanderlust DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const intializeDb = async () => {
    await Listing.deleteMany({});
    intializeData.data = intializeData.data.map((obj) => ({ ...obj, owner: '672378dab031853b53f1073d' }));
    await Listing.insertMany(intializeData.data);
    console.log("Data was intialized");
}

intializeDb();