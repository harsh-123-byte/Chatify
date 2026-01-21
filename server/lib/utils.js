// We will generate utility functions here in the future

import jwt from "jsonwebtoken";

// Function to generate JWT token
export const generateToken=(userId)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET);
    return token;
}