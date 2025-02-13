const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
// passportLocalMongoose automatically defines the username and hashed pass and salt value 
// therefore we are defining only email in our schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);