import express from "express";
import dotenv from "dotenv";
import { connectDatabase } from "./lib/helper.js";
import {errorMiddleware} from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import cors from "cors"

//routes import
import userRoutes from "./routes/userRoute.js"
import taskRoutes from "./routes/taskRoute.js"
import adminRoutes from "./routes/adminRoute.js"
import moderatorRoutes from "./routes/moderatorRoute.js"
import { corsOptions } from "./constants/config.js";

// configuration
dotenv.config({
    path:"./.env"
})

// variables [normal + env]
const PORT = process.env.PORT
const MONGODB_URL = process.env.MONGODB_URL

// making app
const app = express()


// middlewares
app.use(express.json()) // to pass json data in request body
app.use(cookieParser({
    sameSite:"none",
    secure:true,
    httpOnly:true
})) // to parse cookie from frontend
app.use(cors(corsOptions))

// connecting to database

connectDatabase(MONGODB_URL)


// routes
app.use("/api/v1/user",userRoutes)
app.use("/api/v1/task",taskRoutes)  
app.use("/api/v1/admin",adminRoutes)  
app.use("/api/v1/moderator",moderatorRoutes)  


// home routes
app.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Everything is fine 👌"
    })
})


// error middleware
app.use(errorMiddleware)

// starting server
app.listen(PORT,()=>{
    console.log(`Server is running 👊 on port ${PORT}`)
})




