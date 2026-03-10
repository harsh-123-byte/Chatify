import express from "express";
import { login, signup, updateProfile, checkAuth } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";


const userRouter=express.Router();

userRouter.post("/signup",signup);
userRouter.post("/login",login);
userRouter.put("/update-profile",protectRoute,updateProfile);
userRouter.get("/check",protectRoute,checkAuth); // ye route sirf check karne ke liye hai ki user authenticated hai ya nahi, agar user authenticated hai to ye route successfully response dega, otherwise error message dega.

export default userRouter;