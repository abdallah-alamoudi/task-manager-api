const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./Task");
const usersSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [20, "Username cannot be more than 20 characters long"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    avatar: {
      type: Buffer,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  }
  // { timestamps: true }
);
usersSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "author",
});

usersSchema.set("toObject", { virtuals: true });
usersSchema.set("toJSON", { virtuals: true });
// hashing password
usersSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// delete all tasks of a user when a user deleted
usersSchema.pre("deleteOne", async function (next) {
  await Task.deleteMany({ author: this.getFilter()._id });
  next();
});
// generate auth and save it on user document
usersSchema.methods.generateAuth = async function () {
  const token = jwt.sign({ id: this.id }, process.env.JWT_SECRET);
  this.tokens.push({ token });
  await this.save();
  return token;
};
usersSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.tokens;
  delete user.id;
  return user;
};
// static method on User (findByCredentials)
usersSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("incorrect email or password");
  }
  const isValidPass = await bcrypt.compare(password, user.password);
  if (!isValidPass) {
    throw new Error("incorrect email or password");
  }

  return user;
};

const User = mongoose.model("User", usersSchema);
module.exports = User;
