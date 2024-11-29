import express from "express"
import { allTaskAssigned, createTask, updateTaskStatus } from "../controllers/taskController.js"
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js"
import {  createTaskValidator, updateTaskStatusValidator, validateHandler } from "../lib/validators.js"


const router = express.Router()

router.post("/create",isAuthenticated,authorizeRoles("admin"),createTaskValidator(),validateHandler,createTask)

router.get("/all/taskAssigned/:userId",isAuthenticated,authorizeRoles("moderator","user"),allTaskAssigned)

router.put("/update/:taskId",isAuthenticated,authorizeRoles("moderator","user"),updateTaskStatusValidator(),validateHandler,updateTaskStatus)

export default router