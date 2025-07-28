require("dotenv").config();

const config = require("./config.json")
const mongoose = require("mongoose")

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
        return res.status(400).json({error:true,messag:"Password is required"});
    }

    const isUser = await UserActivation.findOne({email:email})
    if(!isUser){
        return res.json({
            error:true,
            message: "User already exists",
        })
    }

    const user = new UserActivation({
        fullName,
        email,
        password,
    })

    await user.save();
    const accesToken = jwt.sign({
        user
    })
})
app.listen(8000);

module.exports=app;
