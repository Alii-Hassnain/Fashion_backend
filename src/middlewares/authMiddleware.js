const { User } = require("../models/userModel");
const jwt = require("jsonwebtoken")
const ApiError = require("../Utils/ApiError")

module.exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken
        if (!token) {
            // throw new ApiError(401, "Access token not found")
            return res.status(401).json({ message: "Token not Found!, First login ", success: false })
        }
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if (!decodedToken) {
            return res.status(401).json({ message: "Token not found || Expired ", success: false })
        }
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) {
            return res.status(401).json({ message: "User not found Against this token", success: false })
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: error?.message || "Invalid access token", success: false })
    }
}