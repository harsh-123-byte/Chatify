// This file defines the Message model using Mongoose, which represents the structure of messages in the database. Each message has a sender, a receiver, text content, an optional image, and a seen status. The schema also includes timestamps to track when messages are created and updated.

import mongoose from "mongoose"; 
import { required } from "zod/mini";


const messageSchema=new mongoose.Schema({
    senderId:{type: mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    receiverId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    text:{type: String},
    image:{type: String}, // image url.
    seen:{type: Boolean,default:false}
},{timestamps:true});

const Message=mongoose.model("Message",messageSchema); // creating User model,iska use hoga database me collections banane ke liye,aur iske madad se hum CRUD operations karenge.

export default Message;
   