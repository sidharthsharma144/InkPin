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
// for login
app.post("/login", async (req,res)=>{
    const {email,password}=req.body;

    if(!email){
        return res.status(400).json({message:"Email is required"});

    }
    if(!password){
        return res.status(400).json({message:"Passowrd is required"});
    }
    const userInfo = await User.findOne({email:email});

    if(!userInfo){
        return res.status(400).json({message:"User not found"});
    }
    if(userInfo.email == email && userInfo.password==password){
        const user = {user:userInfo};
        const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"36000m",
        })
        return res.json({
            error:false,
            message:"Login Succesful",
            email,
            accessToken,
        })
    }
    else{
        return res.status(400).json({
            error:false,
            message:"Invalid Credentials",
        })
    }
}
)
// for adding notes
app.post("/add-note", authenticationToken, async (req,res)=>{
    
})
app.listen(8000);

module.exports=app;
