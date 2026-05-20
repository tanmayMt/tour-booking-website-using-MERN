//This User.js file contains mongoose defination for all our collections

//User Models
const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
  //What kind information we want to have inside the schema
  name: String,
  email: {type:String, unique:true},//email should be unique
  userType: String,
  password: String,
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;