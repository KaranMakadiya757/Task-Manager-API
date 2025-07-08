import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/errorhandler.middleware.js";
import cookieParser from "cookie-parser";

const app = express();

// USING CORS MIDDLEWARE 
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())


import taskRouter from "./routes/task.routes.js";
import userRouter from "./routes/user.routes.js";

app.use("/api/v1/tasks", taskRouter)
app.use("/api/v1/auth", userRouter)

app.use(errorHandler)

export { app };