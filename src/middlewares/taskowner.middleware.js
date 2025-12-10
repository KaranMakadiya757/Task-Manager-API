import { ObjectId } from "mongodb";
import Task from "../models/tasks.model.js";
import { ApiError } from "../utils/apiError.js";

const ownerHandler = async function (req, res, next) {
  // get the task id from params
  const { taskId } = req.params;

  // Check if id is valid
  if (!ObjectId.isValid(taskId)) {
    throw new ApiError(400, "Task ID is invalid");
  }

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

  // remove unnecessary fields
  task.__v = undefined;
  task.owner = undefined;

  // set task in the req
  req.task = task;

  // move to next
  next();
};

export default ownerHandler;
