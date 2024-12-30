const multer = require('multer')

const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'./uploads')
    },
    filename:(req,file,callback)=>{
        const timestamp = Date.now();
        const extension = file.originalname.split('.').pop();
        callback(null,`${file.fieldname}-${timestamp}.${extension}`)
    }
})

const fileFilter = (req, file, callback) => {
    if (file.fieldname === 'podcastImg' || file.fieldname === 'profilePic') {
        // Allow only image files for the podcast image
        if (file.mimetype.startsWith('image/')) {
            callback(null, true);
        } else {
            callback(new Error('Only image files are allowed for the podcastImg field!'), false);
        }
    } else if (file.fieldname.startsWith('episodes[') && file.fieldname.endsWith('][podcastFile]')) {
        // Allow video or audio files for episodes
        if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('audio/')) {
            callback(null, true);
        } else {
            callback(new Error('Only video or audio files are allowed for episode files!'), false);
        }
    } else {
        callback(new Error('Invalid field name!'), false);
    }
};
const multerMiddleware = multer({storage,fileFilter})
module.exports = multerMiddleware