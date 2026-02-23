const mongoose=require('mongoose')

const connectDB=async () => {
    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected')
    } catch (error) {
        console.log("Error occured during mongodb connection"+error.message)
    }
}

module.exports=connectDB