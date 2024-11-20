const nodemailer = require("nodemailer");
//require("dotenv").config({ path: "../../.env" });
//console.log(process.env.EMAIL_NAME);


module.exports. transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
     // user: process.env.EMAIL_NAME,
     // pass: process.env.EMAIL_PASSWORD,
       user: "fashionfyp144171@gmail.com",
       pass: "zxzw vzjj fmyp jyra",
  },
});


// const sendEmail=async()=>{
//   try {
      
//   const info = await transporter.sendMail({
//       from: '"CodeByAqeel 👻" <${process.env.EMAIL_NAME}>', // sender address
//       // <fashionfyp144171@gmail.com>',
//       to: "aqeelarshad856@gmail.com", // list of receivers
//       subject: "Hello ✔", // Subject line
//       text: "Hello world?", // plain text body
//       html: "<b>Hello world?</b>", // html body
//     });
//     console.log(info)
//   } catch (error) {
//     console.log(error);
//     console.log("error in sending mail : ",error.message);

//   }
// }
// sendEmail();

