const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {User , validateUpdateUser} = require("../Model/User");
const bcrypt = require("bcryptjs");
const  verifyToken = require("../middlewares/verifyToken")

/**
 *  @desc Update User
 *  @methode PUT
 *  @route /api/users/:id
 *  @access Private
 */

router.post('/:id',verifyToken,asyncHandler(async(req,res)=>{
    if(req.user.id !== req.params.id){
        return res.status(403).json({message:"you are not allowed , you only can update your profile"})
    }
    const { error } = validateUpdateUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password , salt);
    }
    const updateUsers = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
        }
    },{new:true}).select("-password");
    res.status(200).json(updateUsers);
}))
module.exports = router
