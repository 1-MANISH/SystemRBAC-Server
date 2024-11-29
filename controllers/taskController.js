import { TryCatch } from "../lib/helper.js";
import { ErrorHandler } from "../utils/utility.js";
import {Task} from "../models/taskModel.js"

const createTask = TryCatch(async (req,res,next) => {

    const {title,description,assignedTo,deadline} = req.body

    // initial required handling by express validator

    // Check if the deadline is in the future
    const now = new Date(); 
    const taskDeadline = new Date(deadline); 

    if (isNaN(taskDeadline)) 
        return next(new ErrorHandler("Invalid deadline format.", 400));
    
    if (taskDeadline <= now) 
        return next(new ErrorHandler("Deadline must be in the future.", 400));
    
    await Task.create({
        title,
        description,
        assignedBy:req.user._id,
        assignedTo,
        deadline
    })

    res.status(200).json({
        success:true,
        message:"Task created successfully 👍"
    })
})

const allTaskAssigned = TryCatch(async(req,res,next)=>{

    const userId = req.params.userId

    const tasks = await Task.find({assignedTo:userId})


    return res.status(200).json({
        success:true,
        tasks
    })
})

const updateTaskStatus = TryCatch(async(req,res,next)=>{

    const taskId = req.params.taskId
    const {status} = req.body

    // initial required handling by express validator

    const task = await Task.findById(taskId)

    if(!task) 
        return next(new ErrorHandler("Task not found",404))

    if(task.assignedTo.toString() !== req.user._id.toString()) 
        return next(new ErrorHandler("You are not allowed to update this task",403))

    if(task.status == "completed")
        return next(new ErrorHandler("Task already completed",400))
    
    task.status = status

    await task.save()

    return res.status(200).json({
        success:true,
        message:"Task updated successfully 👍"
    })
})

export {
    createTask,
    allTaskAssigned,
    updateTaskStatus
}