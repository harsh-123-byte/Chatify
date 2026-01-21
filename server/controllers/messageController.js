import Message from "../models/Message.js";
import User from "../models/User.js"
import cloudinary from "../lib/cloudinary.js"
import {io,userSocketMap} from "../server.js";

// Yaha hum message control karne ke liye saare api banayenge, jise baad me hum frontend se connect kar denge.

// Get all users except the logged in User

export const getUsersForSidebar=async(req,res)=>{
    // sidebar me saare users show hote hain shiwaay us user ke jiska account hai,wo jinse baat karta hai wo saare waha pe show honge.
    try {
        const userId=req.user._id; // ye wo user hai jiska account hai.
        const filteredUsers=await User.find({_id: {$ne: userId}}).select("-password"); //ne-->not equal to user whose id=userId, filter out all of them.

        // count number of messages not seen
        const unseenMessages={}
        const promises=filteredUsers.map(async (user)=>{ // this function will tell Har user ke liye database query,Jo bataye ki us user ke kitne unseen messages hain.

            const messages=await Message.find({senderId: user._id,receiverId:userId,seen:false}) // senderId uska hai jisne message bheja jai. //"Mujhe wo saare messages do"--> jo user ne bheje ho,jo userId ko gaye ho,jo abhi tak seen nahi hue ho

            if(messages.length>0) // messages array ka length. // because Message.find()  method mongodb ka ek function hai wo array return karta hai.
            {
                unseenMessages[user._id]=messages.length; //
            }
        })
        await Promise.all(promises); // await ensures Saara unseen message calculation complete ho jaaye, tab response bhejo
        res.json({success:true,users:filteredUsers,unseenMessages})
        
    } catch (error) {
        console.log(error.Message);
        res.json({success:false,message:error.message})
    }
}


// Get all messages for selected users.---> matlab jis user ko ham select krein unke saare chats hume show ho.

export const getMessages=async (req,res)=>{
    try {
        const {id:selectedUserId}=req.params;
        const myId=req.user._id;

        const messages=await Message.find({
            $or: [
                {senderId:myId, receiverId:selectedUserId},
                {senderId:selectedUserId, receiverId: myId},
            ]
        })
        await Message.updateMany({senderId:selectedUserId, receiverId:myId},{seen:true}); // kyuki jab chat kholenge to saare messages seen ho jayenge.
        res.json({success:true,messages})
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}


// Api to mark message as seen using message id.

export const markMessageAsSeen=async (req,res)=>{
    try {
        const {id}=req.params;
        await Message.findByIdAndUpdate(id, {seen:true})
        res.json({success:true})
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}



// Send message to selected user.

export const sendMessage=async (req,res)=>{
    try {
        const {text,image}=req.body;
        const receiverId=req.params.id;
        const senderId=req.user._id;

        // jo image hai usko cloudinary me store kara ke url lena padega.
         let imageUrl;
         if(image)
         {
            const uploadResponse=await cloudinary.uploader.upload(image) // function to store image at cloudinary.
            imageUrl=uploadResponse.secure_url; // url hume mil gaya.
         }

         // ab in sab ko db me store kara do.
         const newMessage=await Message.create({
            senderId,
            receiverId,
            text,
            image:imageUrl  // image me jo url hume cloudinary ne diya hai wo store hoga.
         })

         // SOCKET.IO COMES IN PICTURE

         //Emit the new meaage to the receiver's socket
         // server.js me iska pura functional code hai,waha se dekh sakte ho.
         // Receiver will instantally see the sent message using this socket.io

         const receiverSocketId=userSocketMap[receiverId];
         if(receiverSocketId)
         {
            io.to(receiverSocketId).emit("newMessage",newMessage)
         }
          

         // after that we will create the response
         res.json({success:true,newMessage});
         // but we want to display this message in receiver's chat in realtime thats why here we will use socket.io.
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}