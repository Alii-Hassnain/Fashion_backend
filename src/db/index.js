
//mongodb and db_name is imported
// here only two things are use from the .env 
// 1. MongoDb full url which is MONGODB_URI
// 2. db_name which is DB_NAME


const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGODB_URI}${process.env.DB_NAME}`
    );
    console.log(`Connected ! \nDB Name : ${process.env.DB_NAME} `);
    console.log(`DB Host : ${connection.connection.host}`);
  } catch (error) {
    console.log("Database connection failed : ", error);
    process.exit(1);
  }
};
module.exports = connectDB;
