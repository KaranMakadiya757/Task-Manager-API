import { cookieOption } from "../constants.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// register user
const registerUser = asyncHandler(async function (req, res) {
    // get user details from frontend
    const { username, email } = req.body

    // check if user already exists: username, email
    const existinguser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existinguser) {
        throw new ApiError(409, "User with this email or username already exists")
    }

    // create user object - create entry in db
    const user = await User.create(req.body)

    // remove password and refresh token field from response
    const createduser = await User.findById(user?._id).select("-password -refereshToken")

    // check for user creation
    if (!createduser) {
        throw new ApiError(500, "Something went wrong while creating User")
    }

    // return res
    return res
        .status(201)
        .json(new ApiResponse(201, createduser, "User Created successfully"))
})

// generate accessToken and refreshToken
const generateTokens = async (user) => {
    try {
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating the referesh and access tokens");
    }
}

// Login user
const loginUser = asyncHandler(async function (req, res) {

    // get data from body
    const { email, password } = req.body;

    // find user based on username or email
    const user = await User.findOne({
        $or: [{ email }]
    });

    if (!user) {
        throw new ApiError(404, "User not found !!");
    }

    // check wheather the password if correct or wrong
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Password !!");
    }

    // generate access and refresh tokens
    const { accessToken, refreshToken } = await generateTokens(user);

    // get the logged in user
    const loggedinuser = await User.findById(user?._id).select("-password -refreshToken");

    // return the response
    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOption)
        .cookie("refreshToken", refreshToken, cookieOption)
        .json(new ApiResponse(
            200,
            {
                user: loggedinuser,
                accessToken,
                refreshToken
            },
            "Logged in successfully !!"
        ))

})

// logout user
const logout = asyncHandler(async function (req, res) {

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .clearCookie("accessToken", cookieOption)
        .clearCookie("refreshToken", cookieOption)
        .json(new ApiResponse(200, {}, "Logged Out Successfully !!"))
})

// refresh access token
const refreshAccessToken = asyncHandler(async function (req, res) {
    // get the refresh token from cookir or request body
    const token = req.cookies.refreshToken || req.body.refreshToken

    // throw error if there is no token
    if (!token) {
        throw new ApiError(401, "No Token Provided !!")
    }

    // verify the refresh token
    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)

    // find the user by user id
    const user = await User.findById(decodedToken?._id)

    // throw error is user is not found
    if (!user) {
        throw new ApiError(401, "Unauthorized !!")
    }

    // generate new aceess and refresh tokens
    const { accessToken, refreshToken } = await generateTokens(user)

    // return the response
    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOption)
        .cookie("refreshToken", refreshToken, cookieOption)
        .json(new ApiResponse(
            200,
            { accessToken, refreshToken },
            "Access token refreshed successfully"
        ));

})

// get current user
const getCurrentUser = asyncHandler(async function (req, res) {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User Details Fetched Successfully"))

})

// update account details
const updateAccountDetails = asyncHandler(async function (req, res) {
    // find the user and update the details
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        req.body,
        {
            new: true
        }
    ).select("-password -refreshToken")

    // throw error is something goes wrong
    if (!updatedUser) {
        throw new ApiError(500, "Something went wrong while updating the user")
    }

    // return nresponse
    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "User Details Updated successfully !!"))


})

// change password
const changePassword = asyncHandler(async function (req, res) {
    // get old password and new password from the request body
    const { oldPassword, newPassword } = req.body

    // find the current user
    const user = await User.findById(req.user._id)

    // validate the password
    const isPasswordValid = await user.isPasswordCorrect(oldPassword)

    // throw error is password does not match
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid Password !!")
    }

    // update the password
    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    // return the response
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password Changed Successfully"))
})


export {
    registerUser,
    loginUser,
    logout,
    refreshAccessToken,
    getCurrentUser,
    updateAccountDetails,
    changePassword
}