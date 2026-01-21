import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { connect } from 'http2';
import {connectDB} from "./lib/db.js";
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import {Server} from "socket.io";

// create Express app and HTTP server
const app=express();
const server=http.createServer(app); // create HTTP server because some libraries need it.

// Initialize socket.io server.
export const io=new Server(server,{
    cors:{origin: "*"} // '*' means to all origins
})

// store online users
export const userSocketMap={};  // {userId:socketId} // we will store data of all online users in the form of userId and socketId.

// Socket.io connection handler
io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId;
    console.log("User Connected",userId);

    if(userId) userSocketMap[userId]=socket.id;

    //Emit online users to all connected clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap)); // we will use this io in messageController.js file.

    socket.on("disconnect", ()=>{
        console.log("User Disconnected",userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
})


// Middlewares setup
app.use(express.json({ limit: "4mb" }));

app.use(cors());

// Routes setup.
app.use("/api/status", (req,res)=>res.send("Server is live"));
app.use("/api/auth",userRouter)
app.use("/api/messages",messageRouter)

// mogoDB connection
await connectDB();

if(process.env.NODE_ENV !== "production")
{
const PORT=process.env.PORT || 5000; // default port 5000 if not specified in environment variables.
server.listen(PORT, ()=>console.log(`Server running on port ${PORT}`)); 
}


// export server for vercel
export default server;