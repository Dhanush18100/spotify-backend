const imagekit = require("../services/imagekit")
const musicModel=require('../models/musicModel')
const album = require("../models/albumModel")
const music = require("../models/musicModel")




const createMusic=async (req,res) => {
    try {
        const {title}=req.body
        const file=req.file

        if(!file){
            return res.json({success:false,message:"Select music file"})
        }

        const fileBase64 = req.file.buffer.toString("base64");
        const result=await imagekit.upload({
            file:fileBase64,
            fileName:"music_"+Date.now(),
            folder:"music"
        })

        const music=await musicModel.create({
           uri:result.url,
           title,
           artist:req.userId 
        })

       return res.json({success:true,message:"Music created successfully",
            music:{
                id:music._id,
                uri:music.uri,
                title:music.title,
                artist:music.artist
            }
        })

    } catch (error) {
        console.log(error.message)   
    }
    
}

//album controller
const createAlbum=async (req,res) => {
    try {
        const {title,musics}=req.body

        const newalbum=await album.create({
           title,
           artist: req.userId,
           musics:musics
        })

        res.json({
            sucess:true,
            message:"Album created successfully",
            album:{
                id:newalbum._id,
                title:newalbum.title,
                artist:newalbum.artist,
                musics:newalbum.musics
            }
        })
    } catch (error) {
        console.log(error.message)
    }
    
}

const getAllMusic=async (req,res) => {
    try {
       const musics=await musicModel.find().populate("artist")
        res.json({
            message:"music fetched successfully",
            musics:musics
        })
       
    } catch (error) {
        console.log(error.message)
    }
    
}

const getAllAlbums=async (req,res) => {
    try {
        const albums=await album
        .find()
        .limit(20)
        .select("title artist")
        .populate("artist","username email")

        return res.json({
            sucess:true,
            message:"Album fetched",
            albums:albums
        })
    } catch (error) {
        console.log(error.message)
    }
}

const getAlbumById=async (req,res) => {
    try {
        const albumId=req.params.albumId;
        const new_album= await album.findById(albumId).populate("artist","username email").populate("musics")

        return res.json({
            success:true,
            album:new_album
        })
    } catch (error) {
        console.log(error.message)
    }
    
}

module.exports={
    createMusic,createAlbum,getAllMusic,getAllAlbums,getAlbumById
}