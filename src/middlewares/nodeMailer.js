const nodemailer = require("nodemailer");
const {verification_Email_Template}=require("../utils/emailTemplate")
//require("dotenv").config({ path: "../../.env" });
//console.log(process.env.EMAIL_NAME);


const  transporter = nodemailer.createTransport({
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

const sendEmail=async(email,type,username,link)=>{
  try {
    let subject='',text='',html ='';
    if(type==="verify"){
        subject="Hello ✔ Verify your email";
        text="verify your email";
        html=verification_Email_Template.replace("{verificationCode}",link); 
    }else if(type==="forgot"){
      subject = "Hello ✔ Reset your password";
      text = "reset your password";
      html = `
      <h3>Hello ${username || 'User'},</h3>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <a href="${link}" style="color: blue;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `;
    }
    else {

      throw new Error('Invalid email type'); 
    }

    await transporter.sendMail({
      from: '"CoderByArkamides 👻" <fashionfyp144171@gmail.com>', // sender address
      to:email, // sender address
      subject,
      html,
    });
    // .then(()=>
    //   console.log(`Email successfully sent to ${email}`)).catch((error) => {
    //     console.log("Error in sending email: ", error);
     
    //   });
    console.log(`email send successfully to ${email}`)
    return true
  } catch (error) {
    console.log("error in sending mail : ",error )
    return false
  }
}


module.exports=sendEmail ;

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

