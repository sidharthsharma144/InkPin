require("dotenv").config();

const config = require("./config.json")
const mongoose = require("mongoose")
const User = require("./models/user.model");
const Note = require("./models/note.model");

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
    const{title,content,tags}=req.body;
    const{user}=req.user;
    if(!title){
        return res.status(400).json({error:true,message:"Title is required"});

    }
    if(!content){
        return res.status(400).json({error:true, message:"Content is required"})
    }

    try{
        const note = new Note({
            title,
            content,
            tags:tags||[],
            userId:user._id,
        })

        await note.save();
        return res.json({
            error:false,
            note,
            message:"Note added succesfully ",
        })
    }
        catch(error){
            return res.status(500).json({
                error:true,
                message:"Internal Server Error",
            })
        }
    

})
// EDIT NOTE
app.put("/edit-note/:noteId", authenticationToken, async(req,res)=>{
    const noteId = req.params.noteId;
    const {title , content, tags, isPinned} = req.body;
    const {user} = req.user;

    if(!title && !content && !tags && typeof isPinned === "undefined"){
        return res.status(400).json({error:true,message:"No Change Provided"});
    }

    try {
        const note = await Note.findOne({_id: noteId, userId: user._id});
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        if(title) note.title = title;
        if(content) note.content = content;
        if(tags) note.tags = tags;
        if(typeof isPinned !== "undefined") note.isPinned = isPinned;

        await note.save();
        return res.json({
            error: false,
            note,
            message: "Note Updated Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});
// GET ALL NOTES
app.get("/get-all-notes/", authenticationToken, async(req,res)=>{
    const {user}= req.user;
    try{
        const notes = await Note.find({userId:user._id}).sort({
            isPinned: -1
        })

        return res.json({
            error:false,
            notes,
            message:"All Notes retrieved succesfully",
        }) 

    }
    catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal Server Error",
        })
    }

})
// DELETE NOTE
app.delete("/delete-note/:noteId", authenticationToken, async(req,res)=>{
    const noteId=req.params.noteId;
    const{user}=req.user;

    try{
        const note = await Note.findOne({_id:noteId, userId:user._id})

        if(!note){
            return res.status(400).json({error:true,message:"Note Not Found"});
        }
        await Note.deleteOne({_id:noteId, userId:user._id})
        return res.json({
            error:false,
            message:"Note deleted succesfully"
        })
    }
    catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal Server Error",
        })
    }


}) 
//UPDATE NOTE PINNED
app.put("/update-note-pinned/:noteId", authenticationToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

            note.isPinned = isPinned;
        

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

app.listen(8000);

module.exports=app;
