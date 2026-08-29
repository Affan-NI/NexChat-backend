import User from "../models/User.js";
import bcrypt from "bcryptjs";


export const signup = async (
    req,
    res
) => {
    try {

        const {name,email, password} = req.body;
        const userExists =await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword =await bcrypt.hash(password,10);

        await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: "Signup successful"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

import jwt from "jsonwebtoken"; 

export const login = async ( req, res)=>{
    try{

        const {email,password} = req.body;

        const user =await User.findOne({email});

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid Credentials"
            });
        }

        const isMatch =await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Invalid Credentials"
            });
        }

        const token =jwt.sign(
            {
                id:user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        );

        const isProd = process.env.NODE_ENV === 'production';
        const cookieOptions = {
            httpOnly: true,
            secure: isProd, // must be true in production (HTTPS)
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: isProd ? 'none' : 'lax',
            path: '/'
        };

        res.cookie('token', token, cookieOptions);

        res.status(200).json({
            success:true,
            message:"Login Success"
        });

    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};


export const profile =
async(req,res)=>{

    const user =
    await User.findById(
        req.userId
    ).select("-password");

    res.json(user);
};


// export const logout =
// (req,res)=>{

//     res.cookie(
//         "token",
//         "",
//         {
//             expires:
//             new Date(0)
//         }
//     );

//     res.json({
//         success:true,
//         message:"Logout Success"
//     });
// };

export const logout = (req,res)=>{
    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        path: '/'
    };

    // Clear cookie using the same attributes that were used when setting it
    res.clearCookie('token', cookieOptions);

    res.status(200).json({
        success: true,
        message: 'Logout Success'
    });
};