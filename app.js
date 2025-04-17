if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/userModel');


const listingsRouter = require('./routes/listingRouter');
const reviewsRouter = require('./routes/reviewRouter');
const userRouter = require('./routes/userRouter');


const dbUrl = process.env.ATLAS_DB_URL;

main().then(() => {
    console.log("Connect to Wanderlust DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    client: mongoose.connection.getClient(),
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in Mongo Session Store");
})


const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "student"
//     });

//     let registeredUser = await User.register(fakeUser, "12345");
//     res.send(registeredUser);
// })

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


// Page Not Found Error
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
})


// ERROR HANDLING MIDDLEWARE   
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Some error occurred!" } = err;
    res.status(statusCode).render("error.ejs", { err });
    // res.status(statusCode).send(message);
    // res.send("Some error occurred!");
});


app.listen(8080, () => {
    console.log("server is on at 8080");
});



// app.get("/testListing", async (req, res) => {
//     let sampleListings = new Listing({
//         title: "jnsn",
//         description: "gjns",
//         price: 500,
//         location: "gjjer",
//         country: "ahbf"
//     });

//     await sampleListings.save();
//     console.log("sample saved");
//     res.send("success");
// })