const user = require("../models/userModel")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")


const registerUser=async (req,res) => {
    try {
        const {username,email,password, role="user"}=req.body
        if(!username || !email || !password){
            return res.json({success:false,message:"All fields required"})
        }
        const isUserExist=await user.findOne({
            // username:username,
            // email:email

            $or:[
                {username},
                {email}
            ]
        })

        if(isUserExist){
            return res.json({success:false,message:"User allready exists"})
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt)

        const newUser=await user.create({
            username,
            email,
            password:hashedPassword,
            role
        })

        const token=jwt.sign({id:newUser._id,
            role:newUser.role
        },process.env.JWT_SECRET)

        res.cookie("token",token)

        res.json({success:true,message:"User registered successfully",
            user:{
                id:newUser._id,
                username:newUser.username,
                email:newUser.email,
                role:newUser.role
            }
        })

    } catch (error) {
        console.log(error.message)
    }
    
}

const loginUser=async (req,res) => {
    try {
        const {username,email,password}=req.body;
      

        const userCheck=await user.findOne({
            $or:[
                {username},
                {email}
            ]
        });
        if(!userCheck){
            return res.json({success:false,message:"User not exist"})
        }

        const passwordCheck=await bcrypt.compare(password,userCheck.password);

        if(!passwordCheck){
            return res.json({success:false,message:"Invalid credential"})
        }

        const token=jwt.sign({id:userCheck._id, role: userCheck.role},process.env.JWT_SECRET)

        res.cookie("token",token)

        res.json({
            success:true,
            message:"Login successfull",
            userCheck:{
                id:userCheck.id,
                username:userCheck.username,
                email:userCheck.email,
                role:userCheck.role
            }
        })


    } catch (error) {
        
    }
}


module.exports={
    registerUser, loginUser
}