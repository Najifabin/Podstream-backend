const mongoose = require('mongoose')

const episodeSchema = new mongoose.Schema({
    podcast: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'podcasts',
         required: true },
    title:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true,
    },
    podcastFile:{
        type:String,
        required:true
    },
    duration:{
        type:String,
        default:""
    },
    userId:{
        type : String,
        required:true
    }
},
{
    timestamps:true,
})

const episodes = mongoose.model("episodes",episodeSchema)
module.exports = episodes