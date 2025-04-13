const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { app } = require("./src/app");

dotenv.config({
  path: ".env",
});

// console.log(process.env)
const connectDB = require("./src/db/index");
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () =>
      console.log(`Server is running on port ${process.env.PORT}`)
    );
  })
  .catch((error) => console.log("DB connection failed : ", error));
