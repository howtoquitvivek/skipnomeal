import jwt from "jsonwebtoken";
import { User } from "../models/user";

export const isAuth = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({
        message: "Please Login",
      });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) throw new Error("JWT Secret not defined!");
    const decodedData = jwt.verify(token, secret);

    if (typeof decodedData === "string" || !("_id" in decodedData)) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = await User.findById(decodedData._id).select("-password"); // safer
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Login First",
    });
  }
};


export const isAdmin = (req:any, res:any, next:any) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({
        message: "You are not admin",
      });

    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    
  
  }
}};
