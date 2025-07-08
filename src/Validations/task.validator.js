import Joi from "joi"

const taskValidationSchema = Joi.object({
    owner: Joi.string()
        .optional(),

    title: Joi.string()
        .required()
        .min(3)
        .max(100)
        .messages({
            'any.required': 'Title is required',
            'string.empty': 'Title is not allowed to be empty',
            'string.min': 'Title must be atlest 3 characters',
            'string.max': 'Title must not exceed 100 characters'
        }),

    description: Joi.string()
        .required()
        .max(500)
        .trim()
        .messages({
            'any.required': 'Description is required',
            'string.empty': 'Description is not allowed to be empty',
            'string.max': 'Description must not exceed 500 characters'
        }),

    image: Joi.string()
        .allow('')
        .optional(),

    completed: Joi.boolean()
        .optional(),

    duedate: Joi.date()
        .required()
        .greater('now')
        .messages({
            'any.required': 'Due date is required',
            'string.empty': 'Due Date is not allowed to be empty',
            'date.greater': 'Due date must be in the future'
        }),

    tags: Joi.array()
        .items(Joi.string())
        .optional()
});

const taskUpdateValidationSchema = Joi.object({
    owner: Joi.string()
        .optional(),

    title: Joi.string()
        .optional()
        .min(3)
        .max(100)
        .messages({
            'string.empty': 'Title is not allowed to be empty',
            'string.min': 'Title must be atlest 3 characters',
            'string.max': 'Title must not exceed 100 characters'
        }),

    description: Joi.string()
        .optional()
        .max(500)
        .trim()
        .messages({
            'string.empty': 'Description is not allowed to be empty',
            'any.required': 'Description is required',
            'string.max': 'Description must not exceed 500 characters'
        }),

    image: Joi.string()
        .allow('')
        .optional(),

    completed: Joi.boolean()
        .optional(),

    duedate: Joi.date()
        .optional()
        .greater('now')
        .messages({
            'string.empty': 'Due Date is not allowed to be empty',
            'date.greater': 'Due date must be in the future'
        }),

    tags: Joi.array()
        .items(Joi.string())
        .optional()
});


export {
    taskValidationSchema,
    taskUpdateValidationSchema
}