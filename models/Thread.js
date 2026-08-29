import mongoose from "mongoose";

 const MessageSchame=new mongoose.Schema({
    role:{
        type:String,
        enum:["user","model"],
        required:true
    },
    content:{
        type:String,
        required:true
    },
    timestamp:{
        type:Date,
        default:Date.now 
    }
 });

 const ThreadSchema=new mongoose.Schema({
     userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // User model ka naam
        required: true
    }, 
    threadId:{
        type:String,
        required:true,
        unique:true
    },
    title:{
        type:String,
        default:"New chat",
    },
    messages:[MessageSchame],
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type: Date,
        default:Date.now
    },

 });
 export default mongoose.model("Thread",ThreadSchema);