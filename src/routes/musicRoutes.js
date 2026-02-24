const express=require('express')
const {protect , authUser} = require('../middlewares/authMiddleware')
const { createMusic, createAlbum, getAllMusic, getAllAlbums, getAlbumById } = require('../controllers/musicController')

const multer=require('multer')

const upload=multer({
    storage:multer.memoryStorage()
})

const music=express.Router()

music.post('/upload',protect,upload.single('music'),createMusic)
music.post('/album',protect,createAlbum)
music.get("/",authUser,getAllMusic)
music.get("/albums",authUser,getAllAlbums)
music.get("/albums/:albumId",authUser,getAlbumById)





module.exports=music