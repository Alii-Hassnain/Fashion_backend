const { User } = require("../models/userModel");
const jwt = require("jsonwebtoken")
const ApiError = require("../utils/ApiError")

module.exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken
        if (!token) {
            // throw new ApiError(401, "Access token not found")
            return res.status(401).json({ message: "Access token not found", success: false })
        }
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if (!decodedToken) {
            return res.status(401).json({ message: "The access token is invalid", success: false })
        }
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) {
            return res.status(401).json({ message: "Token not found", success: false })
        }

        req.user = user;
        next();

    }
    catch (error) {
        return res.status(401).json({ message: error?.message || "Invalid access token", success: false })
    }
}