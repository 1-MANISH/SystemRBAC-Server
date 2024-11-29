import { SYSTEM_RBAC_TOKEN } from "../constants/config.js";
import { TryCatch } from "../lib/helper.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { ErrorHandler } from "../utils/utility.js";

const isAuthenticated = TryCatch(async (req,res,next) => {

    const token = req.cookies[SYSTEM_RBAC_TOKEN]

    if(!token) 
        return next(new ErrorHandler("Please log in to access this resource",401))

    const decodedData = jwt.verify(
        token
        ,process.env.JWT_SECRET
    )

    const user = await User.findById(decodedData._id)

    if(!user) 
        return next(new ErrorHandler("User not found",404))

    req.user = user

    next()
})

const authorizeRoles = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)) 
            return next(new ErrorHandler("You are not allowed to access this resource",403))
        next()
    }
}


export {
    isAuthenticated,
    authorizeRoles,

}