import Task from "../models/tasks.model.js"
import { ApiError } from "../utils/apiError.js"

const ownerHandler = async function (req, res, next) {
    // get the task id from params
    const { taskId } = req.params;

    // find the task from DB
    const task = await Task.findById(taskId);

    // throw error if task is not found
    if (!task) {
        throw new ApiError(404, "Task Not Found !!");
    }

    // check the ownership of the task
    if (task.owner?.toString() !== req.user._id?.toString()) {
        throw new ApiError(403, "You Don't have access to this Task !!!");
    }

    // set task in the req
    req.task = task;

    // move to next 
    next();

}

export default ownerHandler