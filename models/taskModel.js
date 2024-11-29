import pkg from "mongoose"
const {Schema,model,models} = pkg


const taskSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"pending",
        enum:["pending","working","completed"]
    },
    assignedBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    assignedTo:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    deadline:{
        type:Date,
        required:true
    },
    completedAt:{
        type:Date
    }

},{
    timestamps:true
})

export const Task = models.Task || model("Task",taskSchema)
