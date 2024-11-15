 const mongoose=require('mongoose');
 const connectDB=async()=>{
    try {
       const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log(`Connected ! \nDB Name : ${process.env.DB_NAME} `);
    } catch (error) {
        console.log("Database connection failed : ",error)
        process.exit(1)
    }
} 

module.exports=connectDB