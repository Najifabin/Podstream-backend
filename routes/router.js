const express = require('express')
const userController = require('../controllers/userController')
const podcastController = require('../controllers/podcastController')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const multerMiddleware = require('../middlewares/multerMiddleware')

const router = new express.Router()
// register - post
router.post('/register',userController.registerController)

// login
router.post('/login',userController.loginController)

// add-podcast
router.post('/add-podcast',jwtMiddleware,multerMiddleware.any(),podcastController.createPodcastController)

// get dashboard
router.get('/dashboard',podcastController.getDashboardpodcastController)

// get userpodacsts
router.get('/user-podcasts',jwtMiddleware,podcastController.getUserpodcastController

)

// get allpodacsts
router.get('/all-podcasts',podcastController.getAllpodcastController

)
// get podcast by id 
router.get('/get/:id',podcastController.getPodcastById
)

// get podcast by tag 
router.get('/tags',podcastController.getByTag
)

// get podcast by category 
router.get('/category',podcastController.getByCategory
)
// get podcast by search 
router.get('/search',podcastController.getBySearch
)
// delete podcast
router.delete('/podcasts/:id',jwtMiddleware,podcastController.deletePodcast
)
// edit profile
router.put('/user/edit',jwtMiddleware,multerMiddleware.single("profilePic"),userController.editProfilePicController)

// favorite podcast
router.post('/podcasts/favorite',jwtMiddleware,podcastController.favoritePodcastController)

// get favourite podcasts
router.get('/favorites',jwtMiddleware,podcastController.getFavoritePodcastController)

// add view 
router.post('/addview/:id',podcastController.addViewController)


module.exports = router