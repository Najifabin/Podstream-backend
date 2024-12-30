const mongoose = require('mongoose')

const podcastSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    desc:{
        type:String,
        required:true
    },
    tags:{
        type:[String],
        default:[]
    },
    format:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    podcastImg:{
        type:String,
        required:true
    },
    userId:{
        type : String,
        required:true
    },
    episodes:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"episodes",
        
    },
    views:{
        type:Number,
        default:0
    }
},{
    timestamps:true
})

const podcasts = mongoose.model("podcasts",podcastSchema)
module.exports = podcasts