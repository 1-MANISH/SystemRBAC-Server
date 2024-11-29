
const errorMiddleware = (err, req, res, next) => {

    err.message = err.message || "Internal Server Error"
    err.statusCode = err.statusCode || 500

    // may it be JSON web token error

    // Handle invalid JWT error
    if(err.name === "JsonWebTokenError"){
        err.statusCode = 401;
        err.message = "Invalid Token. Please log in again"
    }
    if(err.name === "TokenExpiredError"){
        err.statusCode = 401
        err.message = "Token has expired log in again"
    }

    // may it mongoose error

    // validation error
    if(err.name === "ValidationError"){
        err.statusCode = 400
        err.message = Object.values(err.errors).map((error) => error.message).join(",")
    }
    // duplication key error
    if(err.code === 11000){
        err.statusCode = 400
        err.message =  `Duplicate ${Object.keys(err.keyValue)} entered`
    }
    //mongoose cast error
    if(err.name === "CastError"){
        err.statusCode = 400
        err.message = `Invalid ${err.path}: ${err.value}.`;
    }

    return res.status(err.statusCode)  
    .json({
        success:false,
        message:err.message
    })
}

export {
    errorMiddleware
}