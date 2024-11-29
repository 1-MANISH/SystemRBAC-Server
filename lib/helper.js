import mongoose from "mongoose"
import jwt from "jsonwebtoken";
import { SYSTEM_RBAC_TOKEN, cookieOptions } from "../constants/config.js";

const connectDatabase = async (url) => {
    try {
       const database = await mongoose.connect(url,{dbName:"SystemRBAC"})
       console.log(`MongoDB connected 👌 with ${database.connection.host}`);
           
    } catch (error) {
        console.log(`🤣 MongoDB connection error : ${error} `);
    }
}

const TryCatch = (passedFunction)=> async (req,res,next)=>{
    try {
        await passedFunction(req,res,next)
    } catch (error) {
        next(error)
    }
} 

const generateToken = (_id) => {
    return jwt.sign(
        {_id},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )
}

const sendToken = (res,user,statusCode,message) => {
    
    const token = generateToken(user._id)

    return res.status(statusCode)
    .cookie(SYSTEM_RBAC_TOKEN,token,cookieOptions)
    .json({
        success:true,
        message,
        user,
    })
}

export {
    connectDatabase,
    TryCatch,
    sendToken
}