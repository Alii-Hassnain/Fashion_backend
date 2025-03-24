const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // gender: {
    //   type: String,
    //   enum: ["men", "women","kids"],
    //   required: true
    // },
    verificationCode: String,
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// before saving the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


// when a password is updated
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    update.password = await bcrypt.hash(update.password, 10);
  }
  next();
});

// when user logs in it compares the plaintext password with the encrypted password and verify

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};


// this function is used to varify the tokens with the help of refresh_token_secret

userSchema.methods.verifyToken = async function (token) {
  return await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};



// this function is used to generate the new token with the help of access_token_secret
userSchema.methods.generateAccessToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },

    process.env.ACCESS_TOKEN_SECRET,
    // "secret"
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// this function is used to generate the new token with the help of refresh_token_secret
userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};



module.exports.User = mongoose.model("user", userSchema);
