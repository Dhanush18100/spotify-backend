const cookieParser = require('cookie-parser');
const express=require('express');
const router = require('./routes/authRoutes');
const music = require('./routes/musicRoutes');


const app=express()


app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',router)
app.use('/api/music',music)

module.exports=app