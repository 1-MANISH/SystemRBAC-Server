import pkg from "mongoose"
const {Schema,model,models} = pkg
import bcrypt from "bcrypt"


const userSchema = new Schema({
    username:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    role:{
        type:String,
        default:"user",
        enum:["user","moderator","admin"]
    }
},{
    timestamps:true
})

// before saving use the password will be hashed

userSchema.pre("save",async function(next){

    if(!this.isModified("password")){
        return next()
    }
    this.password = await bcrypt.hash(this.password,10)

})

export const User = models.User || model("User",userSchema)
