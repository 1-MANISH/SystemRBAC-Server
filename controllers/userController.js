import { cookieOptions, SYSTEM_RBAC_TOKEN } from "../constants/config.js"
import { sendToken, TryCatch } from "../lib/helper.js"
import { Task } from "../models/taskModel.js"
import { User } from "../models/userModel.js"
import { ErrorHandler } from "../utils/utility.js"
import bcrypt from "bcrypt"
import moment from "moment/moment.js"


const register = TryCatch(async (req,res,next) => {
    
    const {username,email,password} = req.body

    // initial required handling by express validator
    
    // password bcrypt already as we save it in database

    const user = await User.create({
        username,
        email,
        password
    })

    // send token in cookie and response 

    sendToken(res,user,201,"User registered successfully 👊")
})

const login = TryCatch(async (req,res,next) => {

    const {email,password} = req.body

    // initial required handling by express validator

    const user = await User.findOne({email}).select("+password")

    if(!user) 
        return next(new ErrorHandler("Invalid email",404))

    const isPasswordMatched = await bcrypt.compare(password,user.password)

    if(!isPasswordMatched) 
        return next(new ErrorHandler("Invalid password",404))

    // send token in cookie and response

    sendToken(res,user,200,`Welcome back , ${user.username}`)
})

const logout = TryCatch(async (req,res,next) => {

    res.cookie(SYSTEM_RBAC_TOKEN,null,{
        ...cookieOptions,
        maxAge:0    
    })

    return res.status(200).json({
        success:true,
        message:"Logged out successfully 👋"
    })
})

const getMyProfile = TryCatch(async(req,res,next)=>{
    const user = await User.findById(req.user._id)
    res.status(200).json({
        success:true,
        user
    })
})

const getMyTask = TryCatch(async(req,res,next)=>{
    const tasks = await Task.find({assignedTo:req.user._id}).populate("assignedBy","username email")
    const transFormedTasks = tasks.map((task)=>{
        return {
            ...task._doc,
            deadline:moment(task.deadline).format("MMMM Do YYYY, h:mm:ss a"),
            createdAt:moment(task.createdAt).format("MMMM Do YYYY, h:mm:ss a")
        }
    })
    res.status(200).json({
        success:true,
        tasks:transFormedTasks
    })
})



export {
    register,
    login,
    logout,
    getMyTask,
    getMyProfile
}