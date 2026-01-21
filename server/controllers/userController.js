import { success } from "zod";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

// Signup a new user
export const signup=async(req,res)=>{
    const {fullName,email,password,bio}=req.body; // destructuring the request body to get user details
    try {
        if(!fullName || !email || !password || !bio){
            return res.json({success:false,message:"Missing Details"})

        }
        // check if user already exists
        const user=await User.findOne({email}); // ye mongoose ka method hai jo database me check karega ki email already exist karta hai ya nahi.
        if(user)
        {
            return res.json({success:false,message:"Account already exists"});
        }

        // password ko hash karke store karna chahiye for security reasons
        const salt=await bcrypt.genSalt(10); // generate salt with 10 rounds,matlab jitna zyada rounds hoga utna zyada secure hoga but time bhi zyada lagega.
        const hashedPassword=await bcrypt.hash(password,salt); // hash the password with the generated salt.


        //  if user not exists create new user using the User model

        const newUser=await User.create({
            fullName,email,password:hashedPassword,bio
        });

        // generate JWT token for the user because after signup user should be logged in automatically,to wo token ke through hoga.
        const token=generateToken(newUser._id);
        res.json({success:true,userData:newUser, token,message:"Account created successfully"})


    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
    } 

    // Controller to login a user
    export const login=async (req,res)=>{
        
        try {
            const {email,password}=req.body; // destructuring the request body to get email and password
            const userData=await User.findOne({email}); // find user by email
            
            // check whether password is correct or not
            const isPasswordCorrect=await bcrypt.compare(password,userData.password); // compare the entered password with the hashed password stored in database.
            if(!isPasswordCorrect)
            {
                return res.json({success:false,message:"Invalid Credentials"});
            }

            // If credentials are correct generate JWT token
            const token=generateToken(userData._id);
            res.json({success:true,userData,token,message:"Login Successful"})

        } 
            catch (error) {
            console.log(error.message)
            res.json({success:false,message:error.message})
        }
    }

    // Controller to check if user is authenticated.
    export const checkAuth=async(req,res)=>{
        res.json({success:true,user:req.user}); // req.user is set in the auth middleware
    }

    // Controller to update user profile details---> Use of cloudinary for profile picture upload
    export const updateProfile=async(req,res)=>{
        try {
            const {profilePic,bio,fullName}=req.body;
            const userId=req.user._id;// jo user hume
            let updatedUser; 

            if(!profilePic)
            {
                updatedUser=await User.findByIdAndUpdate(userId,{bio,fullName},{new:true});

            }
            else // profie pic bhi update karo.
            {
               const upload=await cloudinary.uploader.upload(profilePic);

               updatedUser=await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullName},{new:true}) // new:true so that every time we get updated user data here.
            }
            res.json({success:true,user:updatedUser})
        } catch (error) {
            console.log(error.message)
            res.json({success:false,message:error.message})
        }
    }