import { Router } from "express";
import { createTask, deleteTask, getTasksById, getTasksList, toggleTask, updateTask } from "../controllers/tasks.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import ownerHandler from "../middlewares/taskowner.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { taskUpdateValidationSchema, taskValidationSchema } from "../Validations/task.validator.js";
import validate from "../middlewares/validation.middleware.js";

const taskRouter = Router();

taskRouter.use(verifyJWT)

taskRouter.route('/')
    .get(getTasksList)
    .post(upload.single("image"), validate(taskValidationSchema), createTask);

taskRouter.route('/:taskId')
    .get(ownerHandler, getTasksById)
    .patch(ownerHandler, upload.single("image"), validate(taskUpdateValidationSchema), updateTask)
    .delete(ownerHandler, deleteTask);

taskRouter.route('/toggle/:taskId')
    .patch(ownerHandler, toggleTask);

export default taskRouter