import { Schema, model } from "mongoose";

const taskSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String
        },
        completed: {
            type: Boolean,
            default: false
        },
        duedate: {
            type: Date,
            required: true
        },
        tags: {
            type: [String]
        }
    },
    {
        timestamps: true
    }
)

const Task = model("Task", taskSchema);

export default Task;