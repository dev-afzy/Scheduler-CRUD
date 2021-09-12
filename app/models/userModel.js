const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const slug = require('mongoose-url-slugs');
const ScheduleSchema = require('./schedule');
const ErrorHandler = require('../helpers/ErrorHandler');
const { labelList } = require('../../utilities/constant');
var { Schema } = mongoose;

var userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      minlength: 4,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      maxlength: 255,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new ErrorHandler('Password cannot contain "password"', 500);
        }
      },
    },
    designation: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new ErrorHandler(labelList.invalidEmail, 500);
        }
      },
    },
    company: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    resetToken: {
      type: String,
      default: '',
      expires: '20m',
    },
  },
  {
    timestamps: true,
  }
);

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.isModified('name')) {
    this.name = this.name
      .split(' ')
      .map((text) => text[0].toUpperCase() + text.substr(1).toLowerCase())
      .join(' ');
  }
  next();
});

// Remove password from json response
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.resetToken;
  return userObject;
};

// Delete user Schedules when user removed
userSchema.pre('remove', { document: true }, async function (next) {
  const user = this;

  await ScheduleSchema.deleteMany({ user: user._id });
  next();
});

// Validate Password
userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new ErrorHandler(labelList.incorrectPassword, 400);
  }
};

userSchema.plugin(slug('name'));
module.exports = mongoose.model('User', userSchema, 'users');
