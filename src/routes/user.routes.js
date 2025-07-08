import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import {
    changepasswordValidationSchema,
    loginValidationSchema,
    userUpdateValidationSchema,
    userValidationSchema
} from "../Validations/user.validator.js";
import {
    changePassword,
    getCurrentUser,
    loginUser,
    logout,
    refreshAccessToken,
    registerUser,
    updateAccountDetails
} from "../controllers/user.controller.js";

const userRouter = Router();

// Register User
userRouter.route('/register').post(validate(userValidationSchema), registerUser);

// User Login
userRouter.route('/login').post(validate(loginValidationSchema), loginUser);

// Refresh Access Token
userRouter.route('/refresh-token').post(refreshAccessToken);

// secured routes
userRouter.use(verifyJWT);

// Get Curent User
userRouter.route('/currentuser').get(getCurrentUser);

// Logout User
userRouter.route('/logout').post(logout);

// Update Account Details
userRouter.route('/updateaccount').patch(validate(userUpdateValidationSchema), updateAccountDetails);

// Change Password
userRouter.route('/changepassword').patch(validate(changepasswordValidationSchema), changePassword);

export default userRouter;