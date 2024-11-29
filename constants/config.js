
const SYSTEM_RBAC_TOKEN = "SYSTEM_RBAC_TOKEN"

const  cookieOptions = {
    httpOnly:true,
    maxAge:1000*60*60*24*1, // 1 days
    sameSite:"none",
    secure:true
}

const corsOptions = {
    origin:[
        "http://localhost:5173",
        "https://localhost:4173",
    ],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}


export { 
    SYSTEM_RBAC_TOKEN ,
    cookieOptions,
    corsOptions
}