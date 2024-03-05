const express = require("express");
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

//? conect to mongoDB:
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("conected to mongodb"))
.catch((error)=>console.log("connection failde to mongodb",error))

//?app init :

const app = express();
const CouresPath = require("./Routers/Course")
const authPath = require("./Routers/Auth");
const userPath = require('./Routers/Users')

//midllwares :
app.use(express.json());

//?Routes :
app.use("/api/Coures",CouresPath);
app.use('/api/users',userPath);
app.use("/api/auth",authPath);
//? Runing the server :
const Port = process.env.PORT || 5000;
app.listen(Port, () => {
    console.log(`the server is runing in  mode on port ${Port}`);
});
