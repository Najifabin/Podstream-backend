const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilePic:{
        type:String
    },favorites:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"podcasts",
        default:[]
    }
})

const users = mongoose.model("users",userSchema)
module.exports = users