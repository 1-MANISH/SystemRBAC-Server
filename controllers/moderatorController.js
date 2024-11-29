import { TryCatch } from "../lib/helper.js";
import { Task } from "../models/taskModel.js";
import {User} from "../models/userModel.js"
import { sendEmail } from "../utils/sendEmail.js";

const notifyUserList  = TryCatch(async(req,res,next)=>{
    
    
    const now = new Date()
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)

   
    const tasksDueSoon = await Task.find({
        deadline: { $gte: now, $lt: next24Hours }
    })
    .populate("assignedTo", "username email") 
    .populate("assignedBy", "username email")

    // Extract only unique userIDs
    const uniqueUsers = tasksDueSoon.map((task) => ({
        userId: task.assignedTo._id,
        userEmail: task.assignedTo.email
    })).filter(
        (user, index, self) =>
            index ===
            self.findIndex(
                (u) => u.userId.toString() === user.userId.toString()
            )
    );

    // now creating an array where we have object of array which has key as user id and value as array of tasks
    
    const arrayOfUsers = []

    uniqueUsers.forEach(({userId,userEmail}) => {
        const userTasks = tasksDueSoon.filter((task) => task.assignedTo._id.toString() === userId.toString());
        arrayOfUsers.push({ userId,userEmail, tasks: userTasks });
    });

    return res.status(200).json({
        success: true,
        notifications:arrayOfUsers,
    });

    
})


const sendNotificationEmail = TryCatch(async(req,res,next)=>{

    const {id,email,taskDue} = req.body

    const message = `\nYou have been assigned a task by ${req.user.username} , email: ${req.user.email}.\nYou have a task due in ${taskDue} days.`

    try {

        await sendEmail({
            email:email,
            subject:"Task Notification",
            message,
            cc:req.user.email
        })

        return res.status(200).json({
            success: true,
            message:`Email sent to ${email} successfully.`
        })
        
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
    }

})

export {
    notifyUserList,
    sendNotificationEmail
}