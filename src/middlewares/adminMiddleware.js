const {User}=require("../models/userModel");
const jwt=require("jsonwebtoken");

const adminAuth=async(req,res,next)=>{
    try {
            const token=req.cookies?.accessToken||req.headers.authorization.split(" ")[1];
            if(!token){
                return res.status(400).json({ message: "unAuthorized request Access denied", success: false });
            }
            const decodedToken=await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
            if(!decodedToken){
                return res.status(400).json({ message: "Access denied: Admins only ,Invalid token! ", success: false });
            }
            const admin=await User.findOne({email:decodedToken.email});
            console.log("admin : ",admin)
            if(!admin){
                return res.status(400).json({ message: "Invalid token or admin not found", success: false });
            }
            if(admin.role!=="admin"){
                return res.status(400).json({ message: "You are not an admin", success: false });
            }
            req.admin=admin;
            next();
    } catch (error) {
        console.log("error in admin auth : ",error)
        res.status(500).json({ message: "Invalid & expired  token or admin not found", error, success: false });
    }

}


module.exports=adminAuth