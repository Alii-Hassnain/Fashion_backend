const { User } = require("../models/userModel");
const jwt = require("jsonwebtoken")
const ApiError = require("../utils/ApiError")

module.exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken
        if (!token) {
            throw new ApiError(401, "Access token not found")
        }
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if (!decodedToken) {
            throw new ApiError(401, "The access token is invalid")
        }
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "Token not found")
        }

        req.user = user;
        next();

    }
    catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
}