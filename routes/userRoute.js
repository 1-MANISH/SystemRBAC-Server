import express from "express"
import {  getMyProfile, getMyTask, login, logout, register } from "../controllers/userController.js"
import { loginValidator, registerValidator, validateHandler } from "../lib/validators.js"
import { isAuthenticated } from "../middlewares/auth.js"

const router = express.Router()


// routes for user to register and login
router.post("/register",registerValidator(),validateHandler,register)
router.post("/login",loginValidator(),validateHandler,login)


router.get("/logout",isAuthenticated,logout)

router.get('/myTask',isAuthenticated,getMyTask)
router.get('/me',isAuthenticated,getMyProfile)


export default router


