import { body, query, validationResult } from "express-validator"
import {ErrorHandler} from "../utils/utility.js"

const validateHandler = (req,res,next) => {
    const errors = validationResult(req)
    const errorMessages = errors.array().map(error => error.msg).join(", ")
    if(!errors.isEmpty()){
        next(new ErrorHandler(errorMessages,400))
    }
    next()
}


const registerValidator = () => {
    return [
        body("username").notEmpty().withMessage("Username is required"),
        body("email").isEmail().withMessage("Email is required"),
        body("password").isLength({min:8}).withMessage("Password must be at least 8 characters long")
    ]
}

const loginValidator = () => {
    return [
        body("email").isEmail().withMessage("Email is required"),
        body("password").isLength({min:8}).withMessage("Password must be at least 8 characters long")
    ]
}

const createTaskValidator = () => {
    return [
        body("title").notEmpty().withMessage("Title is required"),
        body("description").notEmpty().withMessage("Description is required"),
        body("assignedTo").notEmpty().withMessage("Assigned to is required"),
        body("deadline").notEmpty().withMessage("Deadline is required")
    ]
}
const updateTaskStatusValidator = () => {
    return [
        body("status").notEmpty().withMessage("Status is required")
    ]
}

const updateRoleValidator = () => {
    return [
        body("role").notEmpty().withMessage("Role is required")
    ]
}

const sendNotificationEmailValidator = () => {
    return [
        body("id").notEmpty().withMessage("User ID is required"),
        body("email").isEmail().withMessage("User email is required"),
        body("taskDue").notEmpty().withMessage("Tasks due is required")
    ]
}

export {
    validateHandler,
    registerValidator,
    loginValidator,
    createTaskValidator,
    updateTaskStatusValidator,
    updateRoleValidator,
    sendNotificationEmailValidator
}