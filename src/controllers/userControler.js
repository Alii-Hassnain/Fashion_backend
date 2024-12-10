const { User } = require("../models/userModel");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { sendVerificationCode } = require("../middlewares/email");
const sendEmail = require("../middlewares/nodeMailer");
const jwt = require("jsonwebtoken");
// module.exports.
const registerUser = async (req, res) => {
    const { username, email, password ,secret} = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required", success: false });
    }
    let user;
    try {
        const existedUser = await User.findOne(
            {
                $or: [
                    {
                        username

                    }, {
                        email
                    }]
            })

            if (existedUser && existedUser.isVerified===false) {
               const deletedUser = await User.findByIdAndDelete(existedUser._id);
            }
        if (existedUser && existedUser.isVerified === true) {

            return res.status(409).json({ message: "User already exists", success: false });
        }

        let role = "user"
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("verificatin code : ", verificationCode)
        console.log("secret key from client : ",secret)
        if(secret){
            if (process.env.ADMIN_SECRET === secret) {
                role = "admin";
            }  
        }
       
         user = new User(
            {
                username,
                email,
                password,
                verificationCode,
                role
            });
        try {
            console.log("secret of admin : ", req.body.secret)
            // const verify =await sendEmail("aqeelarshad811@gmail.com","verify","aqeel811",verificationCode)

            const verify = await sendEmail(user.email, "verify", user.username, verificationCode)
            console.log("verify user details : ", verify)
            if (!verify) {
                return res.status(500).json({ message: "Error while sending verification code && email account not found ! ", success: false });
            }

        } catch (error) {
            console.log("error in sending email : ", error)

            return res.status(500).json({ message: "Error while sending verification code !", success: false });
        }
        const newUser = await user.save()
        const userWithoutPassword = await User.findById(newUser._id).select("-password -refreshToken")

        return res
            .status(201)
            .json({ message: "User registered successfully", data: userWithoutPassword, success: true })

    } catch (error) {
        if (user && user._id) {
            await User.findByIdAndDelete(user._id);
        }
        console.log("error while registering user", error)
        res
            .status(500)
            .json({ message: "Error while registering user", error, success: false });
    }
}
// const otpSend=async(req,res)=>{
//     try {

//         const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
//         console.log("verificatin code : ",verificationCode)
//     } catch (error) {
//         console.log("error in otp sending : ",error)
//         res.status(500).json({message:"Error while sending otp",error,success:false})
//     }
// }
// module.exports.
const verifyUser = async (req, res) => {
    try {
        const { verificationCode } = req.body;
        if (!verificationCode) {
            return res.status(400).json({ message: "Verification code is required", success: false });
        }
        const user = await User.findOne({ verificationCode });
        if (!user) {
            return res.status(404).json({ message: "Invalid verification code or User not found ", success: false });
        }
        if (user?.isVerified === true) {
            return res
                .status(200)
                .json({ message: "User already verified", success: false });
        }
        user.isVerified = true;
        user.verificationCode = undefined;
        const updatedUser = await user.save();

        return res
            .status(200)
            .json({ message: "User verified successfully", success: true, data: updatedUser });
    } catch (error) {
        await User.findByIdAndDelete(updatedUser._id);
        console.log("error while verifying user", error)
        res
            .status(500)
            .json({ message: "Error while verifying user", error, success: false });

    }
}
// module.exports.
const forgotPassword1 = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new ApiError(400, "Email and password are required")
        }
        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(404, "Username && email not found")
        }
        await User.findOneAndUpdate({ email }, { password })
        user.password = password;
        // await user.save();
        return res
            .status(200)
            .json({ message: "Password updated successfully", success: true })

    } catch (error) {
        console.log("error in forgetting password", error)
        throw new ApiError(500, error?.message || "Something went wrong while forgot password")
    }
}
// module.exports.
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(404).json({ message: "User not Found against this email ", success: false })
        }
        const user = await User.findOne({ email });
        const token = await jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '30m' })
        const link = `${"http://localhost:5173"}/reset-password/${token}`;
        console.log("link:", link);
        const send_Email = sendEmail(email, "forgot", user.username, link);
        if (!send_Email) {
            return res.status(500).json({ message: "Error while sending email", success: false })
        }

        return res
            .status(200)
            .json({ message: "Password reset email sent successfully", success: true, link })
    } catch (error) {
        console.log("error in forgeting password", error)
        throw new ApiError(500, error?.message || "Something went wrong while forgot password")
    }
}
// module.exports.
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        // if(!token || !password){
        //     return res.status(404).json({message:"User not Fonud against this email ",success:false})
        // }
        const decodedToken = await jwt.verify(token, process.env.SECRET_KEY);
        console.log("token in reset password : ", token)
        if (!decodedToken) {
            return res.status(404).json({ message: "User not Fonud against this token  ", success: false })
        }

        const user = await User.findOne({ email: decodedToken.email });
        if (!user) {
            return res.status(404).json({ message: "User not Fonud against this email ", success: false })
        }
        user.password = password;
        const newUser = await user.save();
        return res
            .status(200)
            .json({ message: "Password updated successfully", success: true, data: newUser })


    } catch (error) {
        console.log("error in reset password", error)
        res.status(500).json({ message: "Error while resetting password", error, success: false })
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

        return { accessToken, refreshToken, accessTokenExpiresIn: accessToken.expiresIn, refreshTokenExpiresIn: refreshToken.expiresIn };

    } catch (error) {
        console.log("error in genrating token : ", error);
        throw new ApiError(
            500,
            "Something went wrong while generating access and refresh token"
        );
    }
};

// module.exports.
const loginUser = async (req, res) => {
    const { email, username, password } = req.body
    try {

        if (!(email || username)) {
            throw new ApiError(400, "username or email  are required")
        }
        const user = await User.findOne({
            $or: [{ username }, { email }]
        })
        if (!user) {
            throw new ApiError(404, "User not found");
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
            maxAge: 24 * 60 * 60 * 1000
            // maxAge:60*2
        }
        // console.log("Tokens after generating ", accessToken, "\n ", refreshToken);

        const userWithoutPassword = await User.findById(user._id).select("-password")
        const userName=userWithoutPassword.username
        console.log("after login user : ", userWithoutPassword);

        res
            .status(200)
            .cookie("refreshToken", refreshToken, option)
            .cookie("accessToken", accessToken, option)
            .cookie("username",userWithoutPassword.username,option)
            .json(
                {
                    message: "User logged in successfully",
                    data: userWithoutPassword,
                    username: userWithoutPassword.username,
                    token: accessToken,
                    success: true,
                }
            )
    } catch (error) {
        console.log("error in login user", error.message)
        return res.status(500).json({ message: error?.message || "Invalid access token ", success: false })
    }
}

// module.exports.
const logoutUser = async (req, res) => {
    try {

        const { refreshToken, accessToken, userName } = req?.cookies
        if (!(refreshToken && accessToken)) {
            res.redirect("/login")
            // throw new ApiError(404, "User not found first login ")
            return res.status(404).json({ message: "User not found first login ", success: false })
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
            .clearCookie("userName", userName, { maxAge: 0, httpOnly: true })

            .json({ message: "User logged out successfully", success: true })
    } catch (error) {
        console.log("error in logout user", error)
res.status(500).json({ message: error?.message || "Invalid access token ", success: false } )
        // throw new ApiError(401, error?.message || "Invalid access token ")
    }

}

const verifySession = async (req, res) => {
    try {
      const { refreshToken ,accessToken} = req.cookies ;
      if (! accessToken) {
        return res.status(401).json({ success: false, message: "No active session" });
      }
  
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      console.log("DECODED : ",decoded)
      if (!decoded) {
        return res.status(401).json({ success: false, message: "Invalid session" });
      }
  
      const user = await User.findById(decoded._id);
      console.log("login in user : ",user)
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      return res.status(200).json({ success: true, message: "User is logged in" });
    } catch (error) {
      console.error("Session verification error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  

module.exports = {
    registerUser,
    verifyUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    generateAccessAndRefreshToken,
    verifySession
};