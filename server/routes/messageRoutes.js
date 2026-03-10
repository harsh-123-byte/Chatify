import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";


const messageRouter=express.Router();

messageRouter.get("/users",protectRoute,getUsersForSidebar); // ye route sidebar me users ko dikhane ke liye hai, jisme se user apne contacts dekh sakta hai aur unke sath chat kar sakta hai. is route ko protectRoute middleware se protect kiya gaya hai taaki sirf authenticated users hi is route ko access kar sake.
messageRouter.get("/:id",protectRoute,getMessages);// ye route specific user ke messages ko fetch karne ke liye hai, jisme :id se hum user ka id lete hai jiske sath chat karna hai. is route ko bhi protectRoute middleware se protect kiya gaya hai taaki sirf authenticated users hi is route ko access kar sake.
messageRouter.put("/mark/:id",protectRoute,markMessageAsSeen);// ye route messages ko seen mark karne ke liye hai, jisme :id se hum message ka id lete hai jise seen mark karna hai. is route ko bhi protectRoute middleware se protect kiya gaya hai taaki sirf authenticated users hi is route ko access kar sake.
messageRouter.post("/send/:id",protectRoute,sendMessage);// ye route messages ko send karne ke liye hai, jisme :id se hum receiver ka id lete hai jise message bhejna hai. is route ko bhi protectRoute middleware se protect kiya gaya hai taaki sirf authenticated users hi is route ko access kar sake.

export default messageRouter;