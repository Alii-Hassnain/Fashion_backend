const { User } = require("../models/userModel");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { sendVerificationCode } = require("../middlewares/email");
const sendEmail = require("../middlewares/nodeMailer");
const jwt = require("jsonwebtoken");
module.exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required", success: false });
    }
    const existedUser = await User.findOne(
        {
            $or: [
                {
                    username
                    
                }, {
                    email
                }]
        })

    if (existedUser) {
        return res.status(409).json({ message: "User already exists", success: false });
    }

    try {
        let role="user"
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        if(process.env.ADMIN_SECRET===req.body.secret){
            role="admin";
        }
        const user = new User(
            {
                username,
                email,
                password,
                verificationCode,
                role
            });

            console.log("secret of admin : ",req.body.secret)
        //const verify = sendVerificationCode(user.email, verificationCode);
        const verify =await sendEmail(user.email,"verify",user.username,verificationCode)
        if (!verify) {
            return res.status(500).json({ message: "Error while sending verification code && email account not exist ! ", success: false });
        }
        await user.save()
        const userWithoutPassword = await User.findById(user._id).select("-password -refreshToken")

       return  res
        .status(201)
        .json({ message: "User registered successfully", data: userWithoutPassword, success: true })

    } catch (error) {
        console.log("error while registering user", error)
        res
            .status(500)
            .json({ message: "Error while registering user", error, success: false });
    }
} 
module.exports.verifyUser = async (req, res) => {
    try {
        const{verificationCode}=req.body;
        if(!verificationCode){
            return res.status(400).json({ message: "Verification code is required", success: false });
        }
        const user = await User.findOne({ verificationCode });
        if (!user) {
            return res.status(404).json({ message: "Invalid verification code or User not found ", success: false });
        }
        if(user?.isVerified === true){
            return res
            .status(200)
            .json({ message: "User already verified", success: false });
        }
        user.isVerified= true;
        user.verificationCode = undefined;
        const updatedUser= await user.save();

        return res
            .status(200)
            .json({ message: "User verified successfully", success: true ,data:updatedUser});
    } catch (error) {
        console.log("error while verifying user", error)
        res
            .status(500)
            .json({ message: "Error while verifying user", error, success: false });
        
    }
}   
module.exports.forgotPassword1=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            throw new ApiError(400,"Email and password are required")
        }
        const user=await User.findOne({email});
        if(!user){
            throw new ApiError(404,"Username && email not found")
        }
       await User.findOneAndUpdate({email},{password})
        user.password=password;
        // await user.save();
        return res
        .status(200)
        .json({message:"Password updated successfully",success:true})
        
    } catch (error) {
        console.log("error in forgetting password",error)
        throw new ApiError(500,error?.message || "Something went wrong while forgot password")
    }
}
module.exports.forgotPassword=async(req,res)=>{
    try {
        const {email}=req.body;
        if(!email){
            return res.status(404).json({message:"User not Found against this email ",success:false})
        }
        const user=await User.findOne({email});
        const token=await jwt.sign({email},process.env.SECRET_KEY,{expiresIn: '30m'})
        const link = `${"http://localhost:5173"}/reset-password/${token}`;
        console.log("link:",link);
const send_Email= sendEmail(email,"forgot",user.username,link);
if(!send_Email){
    return res.status(500).json({message:"Error while sending email",success:false})
}

        return res
        .status(200)
        .json({message:"Password reset email sent successfully",success:true,link})
    } catch (error) {
        console.log("error in forgeting password",error)
        throw new ApiError(500,error?.message || "Something went wrong while forgot password")
    }
}
module.exports.resetPassword=async(req,res)=>{
    try {
        const {token,password}=req.body;
        // if(!token || !password){
        //     return res.status(404).json({message:"User not Fonud against this email ",success:false})
        // }
        const decodedToken= await jwt.verify(token,process.env.SECRET_KEY);
        console.log("token in reset password : ",token  )
        if(!decodedToken){
            return res.status(404).json({message:"User not Fonud against this token  ",success:false})
        }

        const user=await User.findOne({email:decodedToken.email});
        if(!user){
            return res.status(404).json({message:"User not Fonud against this email ",success:false})
        }
        user.password=password;
        const newUser=await user.save();
        return res
        .status(200)
        .json({message:"Password updated successfully",success:true,data:newUser})


    } catch (error) {
        console.log("error in reset password",error)    
        res.status(500).json({message:"Error while resetting password",error,success:false})
    }
}

// const generateAccessAndRefreshToken=async(userId)=>{
//     try {
//         const user=await User.findById(userId);
//         if(!user){
//             throw new ApiError(404, "User not found");
//         }
//         const accessToken=user.generateAccessToken();
//         const refreshToken=user.generateRefreshToken();
//         user.refreshToken = refreshToken;
//        const updatedUser= await user.save({
//            validateBeforeSave: false,
//         });
//         console.log("login in user : ",user._id);
//         const dbToken=user.refreshToken
//         console.log("dbtoken of user :",dbToken)
//         console.log("accessToken ",accessToken ,"refreshToken ",refreshToken);
//         return {accessToken,refreshToken};  
//     } catch (error) {
//         console.log("Error in generating token : ",error)
//         throw new ApiError(500, "Something went wrong while generating access and refresh token")
//     }

// }

const generateAccessAndRefreshToken = async (userId) => {
    try {

        const user = await User.findById(userId);
        console.log(user);

        const accessToken = await user.generateAccessToken();

        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({
            validateBeforeSave: false,
        });

        // console.log(user._id);
        // console.log(accessToken);

        return { accessToken, refreshToken };

    } catch (error) {
        console.log("error in genrating token : ", error);
        throw new ApiError(
            500,
            "Something went wrong while generating access and refresh token"
        );
    }
};

module.exports.loginUser = async (req, res) => {
    const { email, username, password } = req.body
    try {

        if (!(email || username)) {
            throw new ApiError(400, "username or email  are required")
        }
        const user = await User.findOne({
            $or: [{ username }, { email }]
        })
        if (!user) {
            throw new ApiError(404,  "User not found");
        }
        const isPasswordValid = await user.isPasswordCorrect(password)
        if (!isPasswordValid) {
            // throw new ApiError(401,"Password Is In-Corect ");
            return res.status(401).json({ message: "Password Is In-Corect ", success: false });
        }
        
        const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id)
        const option = {
            httpOnly: true,
            // secure:true,
            sameSite: "strict",
        }
        // console.log("Tokens after generating ", accessToken, "\n ", refreshToken);

        const userWithoutPassword = await User.findById(user._id).select("-password")
        console.log("after login user : ", userWithoutPassword);
        res
            .status(200)
            .cookie("refreshToken", refreshToken, option)
            .cookie("accessToken", accessToken, option)
            .json(
                {
                    message: "User logged in successfully",
                    data: userWithoutPassword,
                    success: true,
                    token: accessToken,
                }
            )
    } catch (error) {
        console.log("error in login user", error.message)
        throw new ApiError(401, error?.message || "Invalid access token ")

    }
}

module.exports.logoutUser = async (req, res) => {
    try {

        const { refreshToken, accessToken } = req?.cookies || ""
        if (!(refreshToken && accessToken)) {
            res.redirect("/login")
            throw new ApiError(404, "User not found first login ")
        }
        console.log("refresh token of login user :  ", refreshToken)
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { refreshToken: "" } },
            { new: true }
        )
        return res
            .status(200)
            .clearCookie("refreshToken", refreshToken, { maxAge: 0, httpOnly: true })
            .clearCookie("accessToken", accessToken, { maxAge: 0, httpOnly: true })

            .json({ message: "User logged out successfully", success: true })
    } catch (error) {
        console.log("error in logout user", error)
        throw new ApiError(401, error?.message || "Invalid access token ")
    }

}