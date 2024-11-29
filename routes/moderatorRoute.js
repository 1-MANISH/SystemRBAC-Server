import express from "express"
import { notifyUserList, sendNotificationEmail } from "../controllers/moderatorController.js"
import {isAuthenticated, authorizeRoles} from "../middlewares/auth.js"
import { sendNotificationEmailValidator, validateHandler } from "../lib/validators.js"

const router = express.Router()


router.get("/notifyUserList",isAuthenticated,authorizeRoles("moderator"),notifyUserList)
router.post("/sendNotificationEmail",isAuthenticated,authorizeRoles("moderator"),sendNotificationEmailValidator(),validateHandler,sendNotificationEmail)

export default router