import { asyncHandler } from '../utils/asyncHandler.js';
import Task from '../models/tasks.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { fileUpload } from '../utils/fileUpload.js';


// fetch task list
const getTasksList = asyncHandler(async (req, res) => {

    // get the task list from databse
    const tasks = await Task.find({
        owner: req.user._id
    }).select('-__v');

    // throw error
    if (!tasks) {
        throw new ApiError(500, "Something went wrong while fetching tasks");
    }

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
})

// get task by id
const getTasksById = asyncHandler(async (req, res) => {
    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, req.task, "Tasks fetched successfully"));
})

// create task
const createTask = asyncHandler(async (req, res) => {
    // get image local file path
    const imagepath = req?.file?.path

    // if image is addd then upload it to cloudinary and add the url in paylaod
    if (imagepath) {
        // upload image to coludinary
        const image = await fileUpload(imagepath)

        // throw error if image is not uploaded 
        if (!image) {
            throw new ApiError(500, "Something went wrong while uploading the image");
        } else {
            req.body.image = image?.url
        }
    }

    // add user id as owner in the payload
    req.body.owner = req.user._id

    // create task
    const task = await Task.create(req.body);

    // throw error
    if (!task) {
        throw new ApiError(500, "Something went wrong while creating task");
    }

    // return response
    return res
        .status(201)
        .json(new ApiResponse(201, task, "Task created successfully"));
})

// update task
const updateTask = asyncHandler(async (req, res) => {
    // get image local file path
    const imagepath = req?.file?.path

    if (imagepath) {
        // upload image to coludinary
        const uploadedImage = await fileUpload(imagepath)

        // throw error if image is not uploaded 
        if (!uploadedImage) {
            throw new ApiError(500, "Something went wrong while uploading the image");
        } else {
            req.body.image = uploadedImage?.url
        }
    }

    // find and update the task
    const updatedTask = await Task.findByIdAndUpdate(
        req.task._id,
        req.body,
        {
            new: true
        }
    );

    // throw error
    if (!updatedTask) {
        throw new ApiError(500, "Something went wrong while updating task");
    }

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, updatedTask, "Task Updated successfully"));
})

// toggle task status
const toggleTask = asyncHandler(async (req, res) => {
    // get title and description from request body
    const { completed } = req.body;

    // throw error is title and description are not provided
    if (!String(completed).trim()) {
        throw new ApiError(400, "Status is required");
    }

    // find and update the task
    const updatedTask = await Task.findByIdAndUpdate(
        req.task._id,
        req.body,
        {
            new: true
        }
    );

    // throw error
    if (!updatedTask) {
        throw new ApiError(500, "Something went wrong while updating task");
    }

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, updatedTask, "Task created successfully"));
})

// delete task
const deleteTask = asyncHandler(async (req, res) => {
    // delete task by id
    const deletedTask = Task.findByIdAndDelete(req.task._id);

    // throw error
    if (deletedTask) {
        throw new ApiError(500, 'Internal Server Error');
    }

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Task Deleted Successfully'))
})


export {
    getTasksList,
    getTasksById,
    createTask,
    updateTask,
    toggleTask,
    deleteTask
};