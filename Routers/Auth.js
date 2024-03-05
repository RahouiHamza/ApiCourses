const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { User, validateLoginUser, validateUser } = require("../Model/User")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")


/**
 *  @desc Register New User
 *  @methode Post
 *  @route /api/auth/register
 *  @access Public
 */
router.post("/register", asyncHandler(async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    let user = await User.findOne({email:req.body.email})
    if(user){
        return res.status(400).json({ message: "this use have already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password , salt)


    user = new User({
        email:req.body.email,
        username:req.body.username,
        password:req.body.password,
        isAdmin:req.body.isAdmin,
    })
    const result = await user.save()
    const Token = jwt.sign({id:user._id , isAdmin:user.isAdmin},process.env.JWT_SECRET_KEY);


    const {password , ...other} = result._doc;

    res.status(201).json({...other,Token});

}));



/**
 *  @desc Login User
 *  @methode Post
 *  @route /api/auth/login
 *  @access Public
 */
router.post("/login", asyncHandler(async (req, res) => {
    const { error } = validateLoginUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    let user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(400).json({ message: "invalid email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password ,user.password )
    if(!isPasswordMatch){
        return res.status(400).json({ message: "invalid email or password" });
    }
    

    const Token = jwt.sign({id:user._id , isAdmin:user.isAdmin},process.env.JWT_SECRET_KEY);
    const {password , ...other} = user._doc;

    res.status(200).json({...other,Token});

}));

module.exports = router;
