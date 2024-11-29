import { TryCatch } from "../lib/helper.js"
import { Task } from "../models/taskModel.js"
import { User } from "../models/userModel.js"
import moment from "moment/moment.js"
import { ErrorHandler } from "../utils/utility.js"


const getAllUsers = TryCatch(async(req,res,next)=>{

    
    const users = await User.find({_id:{$ne:req.user._id}})


    const allPromises1 = []
    const allPromises2 = []
    const allPromises3 = []

    users.forEach((user)=>{
        allPromises1.push(
            Task.countDocuments({assignedTo:user._id})
        )
        allPromises2.push(
            Task.countDocuments({assignedTo:user._id,status:"pending"})
        )
        allPromises3.push(
            Task.countDocuments({assignedTo:user._id,status:"completed"})
        )
    })

    const tasksCount = await Promise.all(allPromises1)
    const pendingTaskCount = await Promise.all(allPromises2)
    const completedTaskCount = await Promise.all(allPromises3)

    const transFormedUsers = users.map((user,index)=>{
        return {
            ...user._doc,
            taskCount:tasksCount[index],
            taskPending:pendingTaskCount[index],
            taskCompleted:completedTaskCount[index],
            taskWorking:tasksCount[index] - (pendingTaskCount[index] + completedTaskCount[index]),
            joined:moment(user.createdAt).fromNow()
        }
    })


    res.status(200).json({
        success:true,
        users:transFormedUsers
    })
})

const getAllTasks = TryCatch(async(req,res,next)=>{
    const tasks = await Task.find()
    .populate("assignedBy","username email")
    .populate("assignedTo","username email")

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

const dashBoardStats = TryCatch(async(req,res,next)=>{

    const [usersCount,tasksCount,taskCompleted] = await Promise.all([
        User.countDocuments(),
        Task.countDocuments(),
        Task.countDocuments({status:"completed"})
    ])


    // finding or creating array to show that how many task completed in last 7 days

    const today = new Date()
    const last7Days = new Date()
    last7Days.setDate(last7Days.getDate() - 7)

    const taskInLast7Days = await Task.find({
        status:"completed",
        createdAt:{$gte:last7Days,$lte:today}
    })

    // transformation

    const taskCompletedIn7days = new Array(7).fill(0)
    const dayInMiliSeconds = 1000*60*60*24

    taskInLast7Days.forEach((task)=>{
        const indexApprox = (today.getTime() - task.createdAt.getTime()) // dayInMiliSeconds
        const index = Math.floor(indexApprox / dayInMiliSeconds)
        taskCompletedIn7days[6-index]++
    })
    

    return res.status(200).json({
        success:true,
        usersCount,
        tasksCount,
        taskCompleted,
        taskChart :taskCompletedIn7days
    })

})

const updateRole = TryCatch(async(req,res,next)=>{

    const userId = req.params.userId
    const {role} = req.body

    const user = await User.findById(userId)

    if(!user) 
        return next(new ErrorHandler("User not found",404))

    if(user.role === "admin") 
        return next(new ErrorHandler("You are not allowed to update admin role",403))

    user.role = role

    await user.save()


    

    return res.status(200).json({
        success:true,
        message:"Role updated successfully"
    })

})

const deleteUser = TryCatch(async(req,res,next)=>{

    const userId = req.params.userId

    const user = await User.findById(userId)

    if(!user) 
        return next(new ErrorHandler("User not found",404))

    // update his task status to pending if not completed and assigned to another user
    const allUser = await User.find({_id:{$ne:req.user._id}})
    await Task.updateMany({assignedTo:userId},{$set:{status:"pending",assignedTo:allUser[Math.floor(Math.random() * allUser.length)]._id}})

    await User.findByIdAndDelete(userId)
    
    return res.status(200).json({
        success:true,
        message:"User deleted successfully"
    })
})

const deleteTask = TryCatch(async(req,res,next)=>{

    const taskId = req.params.taskId

    const task = await Task.findById(taskId)

    if(!task) 
        return next(new ErrorHandler("Task not found",404))

    if(task.status === "working" || task.status === "pending"){
        return next(new ErrorHandler("Tasks is not completed so you can't delete",403))
    }   

    await Task.findByIdAndDelete(taskId)

    return res.status(200).json({
        success:true,
        message:"Task deleted successfully"
    })
})

export {
    getAllUsers,
    getAllTasks,
    dashBoardStats,
    deleteUser,
    updateRole,
    deleteTask
}