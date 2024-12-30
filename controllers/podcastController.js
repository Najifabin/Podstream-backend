const podcasts = require('../models/podcastModel')
const Episode = require('../models/episodeModel');
const users = require('../models/userModel');
const mongoose = require('mongoose');
// create podcast

exports.createPodcastController = async (req,res)=>{
    console.log("inside createPodcastController");
    const userId = req.userId
    console.log(userId);
    // console.log(req.body);
    try{
        const { title, desc, tags, format, category } = req.body;

        // Handle the podcast image
        const podcastImg = req.files.find(file => file.fieldname === 'podcastImg')?.filename || null;
        const existingPodcast = await podcasts.findOne({title})
        if(existingPodcast){
            res.status(406).json("Podcastname already exists..")
        }else{
            // Create the podcast document
             const newPodcast = new podcasts({
            title,desc,tags,format,category,podcastImg,userId
        });

        const savedPodcast = await newPodcast.save();
        // console.log('Saved Podcast:', savedPodcast);

        // Process and save episodes
        const episodes = [];
        // const episodeFiles = req.files.filter(file => file.fieldname.startsWith('episodes['));
        //  const episodeCount = Math.max(
        //     ...episodeFiles.map(file =>
        //         parseInt(file.fieldname.match(/episodes\[(\d+)\]\[podcastFile\]/)?.[1] || 0, 10)
        //     )
        // );
        // console.log(episodeCount);
        
        for (let i = 0; i < req.body.episodes.length; i++) {
            const episodeData = req.body.episodes[i];
            const podcastFile = req.files.find(file => file.fieldname === `episodes[${i}][podcastFile]`)?.filename || null;
            // console.log(`episodetitle:${episodeData.title} ,episodeDesc:${episodeData.desc} ,podcastFile: ${podcastFile}`);
            
            if (episodeData.title && episodeData.desc && podcastFile) {
                // console.log("inside if condition");
                
                const newEpisode = new Episode({
                    podcast: savedPodcast._id,
                    title: episodeData.title,
                    desc: episodeData.desc,
                    podcastFile,
                    userId
                });
                const savedEpisode = await newEpisode.save();
                // console.log('Saved Episode:', savedEpisode);
                episodes.push(savedEpisode._id);
            }else {
        console.log(`Skipping Episode ${i} due to missing data`);
        }
        }

        // Link episodes to the podcast
        savedPodcast.episodes = episodes;
        await savedPodcast.save();
        // console.log('Final Podcast with Episodes:', savedPodcast);
        res.status(200).json(savedPodcast)

        }
        
       
    }catch(err){
        res.status(401).json(err)
    }
    
    
}

// get Dashboard podcasts
exports.getDashboardpodcastController = async (req,res)=>{
    // console.log("inside getDashboardpodcastController");
    try{
        const getDashboardPodcasts = await podcasts.find().limit(10).lean()
        const userIds = getDashboardPodcasts.map((podcast)=>{try {
        return new mongoose.Types.ObjectId(podcast.userId);
    } catch (err) {
        console.error('Invalid userId:', podcast.userId, err);
        return null; // Skip invalid IDs
    }}).filter((id)=>id)
        // console.log("userIds",userIds);
        
        const allUsers = await users.find({ _id: { $in:userIds } })
        // console.log("allUsers",allUsers);
        const podcastWithUsers = getDashboardPodcasts.map((podcast)=>{
            const user = allUsers.find((user)=>user._id.toString() === podcast.userId.toString())
            return {
                ...podcast,
                creator:user,
            }
    })
        // console.log("podcastWithUsers",podcastWithUsers);
        
        res.status(200).json(podcastWithUsers)
    }catch(err){
        res.status(401).json(err)
    }
    
}

// get user podcasts
exports.getUserpodcastController = async (req,res)=>{
    console.log("inside getuserpodcastController");
    const userId = req.userId
    try{
        const allUserPodcasts = await podcasts.find({userId})
        const user = await users.findById(userId)
        console.log(user);
        
        res.status(200).json({allUserPodcasts,user})
    }catch(err){
        res.status(401).json(err)
    }
    
}

// get all podcasts
exports.getAllpodcastController = async (req,res)=>{
    // console.log("inside getuserpodcastController");
    try{
        const allPodcasts = await podcasts.find().populate("episodes").lean()
        const userIds = allPodcasts.map((podcast)=>{try {
        return new mongoose.Types.ObjectId(podcast.userId);
    } catch (err) {
        console.error('Invalid userId:', podcast.userId, err);
        return null; // Skip invalid IDs
    }}).filter((id)=>id)
        console.log("userIds",userIds);
        
        const allUsers = await users.find({ _id: { $in:userIds } })
        console.log("allUsers",allUsers);
        const podcastWithUsers = allPodcasts.map((podcast)=>{
            const user = allUsers.find((user)=>user._id.toString() === podcast.userId.toString())
            return {
                ...podcast,
                creator:user,
            }
    })
        // console.log("podcastWithUsers",podcastWithUsers);
        res.status(200).json(podcastWithUsers)
    }catch(err){
        res.status(401).json(err)
    }
    
}

// get podcast by id
exports.getPodcastById = async (req,res)=>{
    try{
        console.log("inside By Id");
        
        const podcastById = await podcasts.findById(req.params.id).populate("episodes")
        const id = podcastById.userId
        const user = await users.findById(id)
        res.status(200).json({podcastById,user})
    }catch(err){
        res.status(401).json(err)
    }
}

exports.getByTag = async (req,res)=>{
    const tags = req.query.tags.split(",")
    try{
        const podcastByTag = await podcasts.find({tags:{$in:tags}}).populate("episodes")
        res.status(200).json(podcastByTag)
    }catch(err){
        res.status(401).json(err)
    }
}

exports.getByCategory = async (req,res)=>{
    const query = req.query.q
    try{
        const podcastByCategory = await podcasts.find({category:{$regex:query,$options:"i"}}).populate("episodes").lean()
        const userIds = podcastByCategory.map((podcast)=>{try {
        return new mongoose.Types.ObjectId(podcast.userId);
    } catch (err) {
        console.error('Invalid userId:', podcast.userId, err);
        return null; // Skip invalid IDs
    }}).filter((id)=>id)
        console.log("userIds",userIds);
        
        const allUsers = await users.find({ _id: { $in:userIds } })
        console.log("allUsers",allUsers);
        const podcastWithUsers = podcastByCategory.map((podcast)=>{
            const user = allUsers.find((user)=>user._id.toString() === podcast.userId.toString())
            return {
                ...podcast,
                creator:user,
            }
    })
        res.status(200).json(podcastWithUsers)
    }catch(err){
        res.status(401).json(err)
    }
}

exports.getBySearch = async(req,res)=>{
    const query = req.query.search
    try{
        const Podcast = await podcasts.find({title:{$regex:query,$options:"i"}}).populate("episodes").limit(40).lean()
          const userIds = Podcast.map((podcast)=>{try {
        return new mongoose.Types.ObjectId(podcast.userId);
    } catch (err) {
        console.error('Invalid userId:', podcast.userId, err);
        return null; // Skip invalid IDs
    }}).filter((id)=>id)
        console.log("userIds",userIds);
        
        const allUsers = await users.find({ _id: { $in:userIds } })
        console.log("allUsers",allUsers);
        const podcastWithUsers = Podcast.map((podcast)=>{
            const user = allUsers.find((user)=>user._id.toString() === podcast.userId.toString())
            return {
                ...podcast,
                creator:user,
            }
    })
        res.status(200).json(podcastWithUsers)
    }
    catch(err){
        res.status(401).json(err)
    }
}

// delete podcasts
exports.deletePodcast = async (req,res)=>{
    console.log("inside delete Controller");
    const {id} = req.params
    try{
        const podcast = await podcasts.findById(id).populate("episodes")
        if (!podcast) {
        res.status(404).json({ error: "Podcast not found" })}
        const episodeIds = podcast.episodes.map((episode) => episode._id);
        await Episode.deleteMany({ _id: { $in: episodeIds } })
        const removePodcast = await podcasts.findByIdAndDelete({_id:id})
        res.status(200).json(removePodcast)
    }catch(err){
        console.log(err);
    }       
}

// favorite podcast
exports.favoritePodcastController = async (req,res)=>{
    try{
    console.log("inside favorite controller");
    
    const userId = req.userId
    const user = await users.findById(userId)
    console.log(user);
    const podcast = await podcasts.findById(req.body.id)
    console.log("podcast",podcast);
    
    let found = false
    if(user._id.toString()==podcast.userId.toString()){
        console.log("You can't favorite your own podcast");
        
        return res.status(403).json("You can't favorite your own podcast")
    }
    const favorites = user.favorites || []
    const foundIndex = favorites.findIndex((fav)=>fav.toString()===req.body.id)
    if(foundIndex!== -1){
        const updatedUser = await users.findByIdAndUpdate(userId,{
            $pull:{favorites:req.body.id}
        },{new:true})
        console.log("Updated User:", updatedUser);
        res.status(200).json(updatedUser)
    }else{
        const updatedUser = await users.findByIdAndUpdate(userId,{
            $push:{favorites:req.body.id}
        },{new:true})
        console.log("Updated User (Added):", updatedUser);
        res.status(200).json(updatedUser);
    }
    }catch(err){
        console.log("error in favorites controller");
        res.status(401).json(err)    
    }
    
}

exports.getFavoritePodcastController = async (req,res)=>{
    console.log("inside getFavoritePodcastController");
    const userId = req.userId
    try{
        const user = await users.findById(userId)
        const favoritePodcasts = await podcasts.find({_id:{$in:user.favorites}}).lean()
        const userIds = favoritePodcasts.map((podcast)=>
        {try {
        return new mongoose.Types.ObjectId(podcast.userId);
        } 
        catch (err) {
        console.error('Invalid userId:', podcast.userId, err);
        return null; // Skip invalid IDs
    }}).filter((id)=>id)
        console.log("userIds",userIds);
        
        const allUsers = await users.find({ _id: { $in:userIds } })
        // console.log("allUsers",allUsers);
        const podcastWithUsers = favoritePodcasts.map((podcast)=>{
            const user = allUsers.find((user)=>user._id.toString() === podcast.userId.toString())
                return {
                ...podcast,
                creator:user,
                }
    })
    console.log("podcastWithUsers",podcastWithUsers);
    
        res.status(200).json(podcastWithUsers)
    }catch(err){
        res.status(401).json(err) 
    }
    
}

// add view
exports.addViewController = async (req,res)=>{
    try{
        await podcasts.findByIdAndUpdate(req.params.id,{$inc:{views:1}})
        res.status(200).json("the view has been increased")
    }catch(err){
        res.status(401).json(err)
    }
}
