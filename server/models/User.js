// This file defines the User model using Mongoose, which represents the structure of user data in the database. Each user has an email, full name, password, profile picture, and bio. The schema also includes timestamps to track when users are created and updated.

import mongoose from "mongoose"; 
import { minLength } from "zod";

const userSchema=new mongoose.Schema({
    email:{type:String, required:true, unique:true},
    fullName:{type:String, required:true},
    password:{type:String, required:true,minLength:6},
    profilePic:{type:String,default:""},
    bio:{type:String}
},{timestamps:true});

const User=mongoose.model("User",userSchema); // creating User model,iska use hoga database me collections banane ke liye,aur iske madad se hum CRUD operations karenge.

export default User;
   