const {transporter} = require("./nodeMailer")
const {verification_Email_Template}=require("../Utils/emailTemplate")
const sendVerificationCode=async(email,verificationCode)=>{
    try {
        const response = await transporter.sendMail({
            from: '"Ali Hassnain Founder 👻" <fashionshop@gmail.com>',
            to: email, // list of receivers
            subject: "Hello ✔ Verify your email", // Subject line
            text: "verify your email", // plain text body
            html: verification_Email_Template.replace("{verificationCode}",verificationCode), // html body
          });
          console.log("email send successfully",response.messageId);
        
    } catch (error) {
        console.log("error in sending email",error) 
    }
}

 module.exports={sendVerificationCode}