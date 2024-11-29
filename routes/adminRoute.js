import express from "express"
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js"
import { dashBoardStats, deleteTask, deleteUser, getAllTasks, getAllUsers, updateRole } from "../controllers/adminController.js"
import { updateRoleValidator, validateHandler } from "../lib/validators.js"


const router = express.Router()


router.get("/all/users",isAuthenticated,authorizeRoles("admin"),getAllUsers)
router.get("/all/tasks",isAuthenticated,authorizeRoles("admin"),getAllTasks)
router.get("/dashboard/stats",isAuthenticated,authorizeRoles("admin"),dashBoardStats)
router.delete("/delete/user/:userId",isAuthenticated,authorizeRoles("admin"),deleteUser)
router.put("/update/role/:userId",isAuthenticated,authorizeRoles("admin"),updateRoleValidator(),validateHandler,updateRole)
router.delete("/delete/task/:taskId",isAuthenticated,authorizeRoles("admin"),deleteTask)


export default router