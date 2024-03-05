const mongoose = require("mongoose");
const Joi = require("joi");

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true,
        trim:true,
        unique:true
    },
    username:{
        type:String,
        unique:true,
        require:true,
    },
    password:{
        type:String,
        require:true,
        minlenght:6,
    },
    isAdmin:{
        type:Boolean,
        default:false,
    }

},{timestamps:true})

const User = mongoose.model("User",UserSchema);

//validation function :
//?validate user:
function validateUser(obj){
    const Schema = Joi.object({
        email:Joi.string().required().email().trim(),
        username:Joi.string().required().trim(),
        password:Joi.string().required().trim(),
        isAdmin:Joi.boolean()
    })
    return Schema.validate(obj)
}

//?validate login user:
function validateLoginUser(obj){
    const Schema = Joi.object({
        email:Joi.string().required().email().trim(),
        password:Joi.string().required().trim(),
    })
    return Schema.validate(obj)
}

//?validate update user:
function validateUpdateUser(obj){
    const Schema = Joi.object({
        email:Joi.string().email().trim(),
        username:Joi.string().trim(),
        password:Joi.string().trim(),
        isAdmin:Joi.boolean()
    })
    return Schema.validate(obj)
}
module.exports={User,validateLoginUser,validateUpdateUser,validateUser}