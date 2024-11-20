const {transporter} = require("./nodeMailer")
const {verification_Email_Template}=require("../utils/emailTemplate")
const sendVerificationCode=async(email,verificationCode)=>{
    try {
        const response = await transporter.sendMail({
            from: '"CodeBy -> Akeel badsha ( full ee ) 👻" <fashionfyp144171@gmail.com>',
            // <${process.env.EMAIL_NAME}>', // sender address
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