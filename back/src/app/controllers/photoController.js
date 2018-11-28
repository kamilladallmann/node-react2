const express = require('express');
const authMiddleware = require('../middleware/auth');
const Photo = require('../models/Photo');
const multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    
    if(file.mimetype === 'image/jpeg' || 
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/gif'
    ){
        cb(null, true); //accept a file
    }else {//reject a file
        cb(null, false);        
    }
}

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try{
        const photos = await Photo.find().populate('user');

        return res.send({photos});
    }catch(err){
        return res.status(400).send({error: 'Error loading photos'});
    }
});

/* router.get('/:photoId', async(req, res) => {
    try{
        const photo = await Photo.findById(req.params.photoId).populate('user');

        return res.send({photo});
    }catch(err){
        return res.status(400).send({error: 'Error loading photo'});
    }
});  */

router.post('/', upload.single('image'), async(req, res) => {
    console.log(req.file);
    try{
        const photo = await new Photo({
            user: req.userId,
            title: req.body.title,
            description: req.body.description,
            fileImage: req.file.path
        });
        photo.save();
        
        return res.send({photo});

    }catch(err){
        return res.status(400).send({error: 'Error creating new photo'});
    }
});

router.get('/:photoTitle', async(req, res) => {
    try{
        const photo = await Photo.find({title: req.params.photoTitle}).populate('user');
        return res.send({photo});
    }catch(err){
        return res.status(400).send({error: 'Error finding photo'})
    }
})

router.delete('/:photoTitle', async(req, res) => {
    try{
        const photo = await Photo.findOneAndDelete({title: req.params.photoTitle});

        return res.send({success: 'Photo deleted'});
    }catch(err){
        return res.status(400).send({error: 'Error removing photo'});
    }
});

module.exports = app => app.use('/photos', router);