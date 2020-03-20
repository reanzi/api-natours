const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Provide a password'],
    minLength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please Confirm your Password'],
    validate: {
      //This only works on Create and Save
      validator: function(el) {
        return el === this.password;
      },
      message: 'Password do not match!'
    }
  },
  passwordChangedAt: Date
});
// cost for hashing a password 10 - 15
function salting() {
  let value = Math.floor(Math.random() * 30);
  if (value < 10 || value >= 15) {
    value = 12;
  }
  return value;
}

userSchema.pre('save', async function(next) {
  // Only run this if password was modified
  if (!this.isModified('password')) return next();

  const value = salting();
  this.password = await bcrypt.hash(this.password, value);
  //  Delete the passwordConfirm
  this.passwordConfirm = undefined;
  next();
});

// An Incedence methods
userSchema.methods.correctPassword = async function(
  candidatePasswoord,
  userPassword
) {
  return await bcrypt.compare(candidatePasswoord, userPassword);
};
userSchema.methods.changePasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    //change date into time(seconds)
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    ); // /1000 mills to sec, 10 => base ten
    // console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp; // token issued after pass changed
  }
  //FALSE means not Changed
  return false;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
