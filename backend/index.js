require("dotenv").config();

const config = require("./config.json")
const mongoose = require("mongoose")
const User = require("./models/user.model");


const express = require("express");
const cors = require ("cors");
const app = express();

const jwt = require("jsonwebtoken");
const {authenticationToken}= require("./utilities");

app.use(express.json());
app.use(
    cors({
        origin:"*",
    })
)

app.post("/create-account",async(req,res)=>{
    const{fullName,email,password}=req.body;

    if(!fullName){

        return res.status(400).json({error:true,message:"Full Name is required"});

    }
    if(!email){
        return res.status(400).json({error:true,message:"Email is required"});
    }
    if(!password){
        return res.status(400).json({error:true,message:"Password is required"});
    }

    const isUser = await User.findOne({email:email})
    if(isUser){
        return res.json({
            error:true,
            message: "User already exists",
        })
    }

    const user = new User({
        fullName,
        email,
        password,
    })

    await user.save();

    const accessToken = jwt.sign({
        user
    }, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:"36000m",
    })
    return res.json({
        error: false,
        user,
        accessToken, 
        message:"Registration Succesful",
    })
})
app.get("/", (req, res) => {
  res.send("Welcome to InkPin backend!");
});
mongoose.connect(config.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected");
  app.listen(8000, () => {
    console.log("🚀 Server running at http://localhost:8000");
  });
})
.catch((err) => {
  console.error("❌ MongoDB connection failed:", err);
});


app.listen(8000);

module.exports=app;
