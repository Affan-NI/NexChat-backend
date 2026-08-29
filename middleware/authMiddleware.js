import jwt from "jsonwebtoken";

const isAuthenticated =(req,res,next)=>{

    const token =req.cookies.token;

    if(!token){
        return res.status(401).json({
            message:"Please Login"
        });
    }

    try{

        const decoded =
        jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        
        req.userId =
        decoded.id;

        next();

    }catch(error){

        return res.status(401).json({
            message:"Invalid Token"
        });
    }
};

export default isAuthenticated;

