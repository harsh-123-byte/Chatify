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
   