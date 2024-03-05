const mongoose = require("mongoose");

const CouresSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    author:{
        type:String,
        require:true,
    },
    tags:[
        String,
    ],
    isPublished:{
        type:Boolean,
    },
},{timestamps:true});

const Coures = mongoose.model("Coures",CouresSchema);
module.exports = {Coures};