import express from 'express';
import Thread from '../models/Thread.js';
import getAiApiResponse from '../utils/aiStudio.js';
import mongoose from 'mongoose';
import isAuthenticated from '../middleware/authMiddleware.js';
const router=express.Router();


//
router.post('/test',async (req,res)=>{
    try{
        const thread=new Thread({
            userId: new mongoose.Types.ObjectId(
        "6a2f1735e8bc07c4f6bf4f96"
    ),
            threadId:"pqrs",
            title:"Test thread2",
        }); 
        const response=await thread.save();
        res.json(response);
    }catch(error){
    console.error(error);
    res.status(500).json({error:"faild to save in db"});
    }
});
// to get all threads     
router.get("/thread",isAuthenticated,async(req,res)=>{
    try{
        const threads=await Thread.find({userId:req.userId}).sort({updatedAt:-1});// desending order
        res.json(threads);
    }
    catch(error){
        console.error(error);
        res.status(500).json({error:"Failed to fetch threads"});
    }
});

router.get("/thread/:threadId",isAuthenticated,async(req,res)=>{
    const {threadId}=req.params;
    try{
        const thread=await Thread.findOne({threadId,userId: req.userId});
        if(!thread){
            return res.status(404).json({error:"Thread not found"});
        }
        res.json(thread.messages);
    }catch(error){
        console.error(error);
        res.status(500).json({error:"Failed to fetch thread"});
    }
});

router.delete("/thread/:threadId",isAuthenticated,async(req,res)=>{
    const {threadId}=req.params;
    try{
        const deletedthread=await Thread.findOneAndDelete({threadId,userId: req.userId});
        if(!deletedthread){
            return res.status(404).json({error:"Thread not found"});
        }
        res.json({message:"Thread deleted successfully"});
    }catch(error){
        console.error(error);
        res.status(500).json({error:"Failed to delete thread"});
    }
});

router.post("/chat",isAuthenticated,async(req,res)=>{
    const{threadId,message}=req.body;
    if(!threadId || !message){
        return res.status(400).json({error:"missing required fields"});
    }
    try{
        let thread=await Thread.findOne({threadId,userId: req.userId});
        if(!thread){
            //creat new thread
            thread =new Thread({
                userId: req.userId,
                threadId,
                title:message,
                messages:[{
                    role:"user",
                    content:message,
                }]
            });
            
        }
        else{
            //update existing thread
            thread.messages.push({
                role:"user",
                content:message,
            });
                
            }
        //get ai response
        const aiResponse=await getAiApiResponse(message);
        thread.messages.push({
            role:"model",
            content:aiResponse,
        });
        thread.updatedAt=Date.now();
        await thread.save();
        res.json({reply:aiResponse});
    }catch(error){
        console.error(error); 
        res.status(500).json({error:"something went wrong"});
    }
});

export default router;