const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true // SETS UP AN INDEX
  },
});

UserSchema.plugin(passportLocalMongoose)

const user = mongoose.model('User', UserSchema);

module.exports = user;