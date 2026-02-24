const jwt = require("jsonwebtoken");
const user = require("../models/userModel");


const protect = async (req, res, next) => {
    try {

        const token = req.cookies.token;

        if (!token) {
            return res.json({ success: false, message: "Unauthorized access" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const existingUser = await user.findById(decoded.id);

        if (!existingUser) {
            return res.json({ success: false, message: "User not found" })
        }

        if (existingUser.role !== "artist") {
            return res.json({ success: false, message: "Forbidden" })
        }

        req.userId = existingUser._id;
        req.userRole = existingUser.role;

        next()

    } catch (error) {
        return res.json({ success: false, message: "Unauthorized" })
    }

}

const authUser = async (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.json({
            success: false,
            message: "Unauthorized"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.role !== "user" && decoded.role !== "artist") {
            return res.json({
                success: false,
                message: "Unauthorized"
            })
        }
        
        req.user = decoded;
        next()
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    protect, authUser
}

