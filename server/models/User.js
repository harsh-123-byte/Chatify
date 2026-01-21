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
   