import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const verifyJWT = asyncHandler(async function (req, res, next) {
    try {
        // get the access token from the cookie or the request header
        const token = req?.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // throw error is there is no token provided
        if (!token) {
            throw new ApiError(401, "Unauthorized request !!");
        }

        // verigy the token
        const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // fetch user from databse
        const user = await User.findById(decodedtoken?._id).select("-password -refereshToken");

        // throw error if token is invalid
        if (!user) {
            throw new ApiError(401, "Invalid Access Token !!");
        }

        req.user = user;
        next();

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
})