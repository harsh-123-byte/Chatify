import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute=async(req,res,next)=>{
    try {
        const token=req.headers.token; // getting token from request headers,matlab client ne jo token bheja hai wo yaha milega.

        // token ko decode karna hoga to verify the user
        const decodeed=jwt.verify(token,process.env.JWT_SECRET); // jwt ka verify method use karenge to decode the token.

        // decoded token me userId milega jo humne token generate karte waqt dala tha,jisme se hum password ko hata denge for security reasons.
        const user=await User.findById(decodeed.userId).select("-password"); // select("-password") ka matlab hai ki password field ko exclude kar do.
        if(!user)
        {
            return res.json({success:false,message:"User not found"});
        }

        // agar sab kuch thik hai to request me user ki details attach kar denge taaki aage ke controllers me use kar sake.


        req.user=user; // ye bahut important hai har gajah use hoga.


        next(); // call the next middleware or controller
        
    } catch (error) {
        res.json({success:false,message:error.message});
    }
}