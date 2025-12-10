import Joi from "joi";

const userValidationSchema = Joi.object({
  username: Joi.string()
    .required()
    .lowercase()
    .trim()
    .min(3)
    .max(10)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .messages({
      "string.empty": "Username cannot be empty",
      "string.min": "Username must be at least 3 characters long",
      "string.max": "Username must not exceed 10 characters",
      "string.pattern.base":
        "Username may only contain alphanumeric characters and underscore",
      "any.required": "Username is required",
    }),

  email: Joi.string().required().email().lowercase().trim().messages({
    "string.empty": "Email cannot be empty",
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),

  dob: Joi.date().required().less("now").messages({
    "date.base": "Date of birth must be a valid date",
    "any.required": "Date of birth is required",
    "date.less": "Date of birth must be in the past",
  }),

  mobilenumber: Joi.string()
    .required()
    .pattern(/^(\+91)?\s?\d{10}$/)
    .messages({
      "string.empty": "Mobile number cannot be empty",
      "string.pattern.name": "Invalid mobile number",
      "any.required": "Mobile number is required",
    }),

  gender: Joi.string()
    .required()
    .lowercase()
    .valid("male", "female", "other")
    .messages({
      "string.empty": "Gender cannot be empty",
      "any.required": "Gender is required",
      "any.only": "Gender must be one of 'male', 'female', or 'other'",
    }),

  password: Joi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/)
    .messages({
      "string.empty": "Password cannot be empty",
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.name":
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      "any.required": "Password is required",
    }),
});

const userUpdateValidationSchema = Joi.object({
  username: Joi.string()
    .lowercase()
    .trim()
    .min(3)
    .max(10)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .messages({
      "string.empty": "Username cannot be empty",
      "string.min": "Username must be at least 3 characters long",
      "string.max": "Username must not exceed 10 characters",
      "string.pattern.base":
        "Only alphanumeric characters and underscore are allowed",
    }),

  email: Joi.string().email().lowercase().trim().messages({
    "string.empty": "Email cannot be empty",
    "string.email": "Please provide a valid email address",
  }),

  dob: Joi.date().less("now").messages({
    "date.base": "Date of birth must be a valid date",
    "date.less": "Date of birth must be in the past",
  }),

  mobilenumber: Joi.string()
    .pattern(/^(\+91)?\s?\d{10}$/)
    .messages({
      "string.empty": "Mobile number cannot be empty",
      "string.pattern.name": "Invalid mobile number",
    }),

  gender: Joi.string().lowercase().valid("male", "female", "other").messages({
    "any.only": "Gender must be one of 'male', 'female', or 'other'",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided to update the user.",
  });

const loginValidationSchema = Joi.object({
  email: Joi.string().required().email().lowercase().trim().messages({
    "string.empty": "Email cannot be empty",
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),

  password: Joi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/)
    .messages({
      "string.empty": "Password cannot be empty",
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.name":
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      "any.required": "Password is required",
    }),
});

const changepasswordValidationSchema = Joi.object({
  oldPassword: Joi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/)
    .messages({
      "string.empty": "Old Password cannot be empty",
      "string.min": "Old Password must be at least 8 characters long",
      "string.pattern.base":
        "Old Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      "any.required": "Old Password is required",
    }),

  newPassword: Joi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/)
    .invalid(Joi.ref("oldPassword"))
    .messages({
      "string.empty": "New Password cannot be empty",
      "string.min": "New Password must be at least 8 characters long",
      "string.pattern.base":
        "New Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      "any.invalid": "New Password must not be the same as the Old Password",
      "any.required": "New Password is required",
    }),
});

export {
  userValidationSchema,
  userUpdateValidationSchema,
  changepasswordValidationSchema,
  loginValidationSchema,
};
