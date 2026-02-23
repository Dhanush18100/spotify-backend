const cookieParser = require('cookie-parser');
const express=require('express');
const router = require('./routes/authRoutes');

const app=express()


app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',router)

module.exports=app