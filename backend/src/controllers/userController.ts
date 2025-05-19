import { User } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMail, sendForgotMail } from "../middleware/sendMail";
import TryCatch from "../middleware/tryCatch";
import { Request, Response, NextFunction } from "express";
import {
  calculateBMR,
  calculateTDEE,
  adjustCaloriesForGoal,
  calculateMacros,
} from '../helpers/calculator';
import dotenv from 'dotenv';
dotenv.config();

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    name: string;
  };
}

interface JwtPayload {
  user?: {
    name: string;
    email: string;
    password: string;
  };
  otp?: number;
  email?: string;
  _id?: string;
}

const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

export const getUserProfileStats = (req: Request, res: Response) => {
  try {
    const userInput = req.body;
    const bmr = calculateBMR(userInput);
    const tdee = calculateTDEE(bmr, userInput.activityLevel);
    const goalCalories = adjustCaloriesForGoal(tdee, userInput.goal);
    const macros = calculateMacros(goalCalories);

    res.json({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      goalCalories: Math.round(goalCalories),
      macros,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating profile stats', error });
  }
};

export const register = TryCatch(async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "User already exists" });

  const hashPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

  const activationToken = jwt.sign(
    { user: { name, email, password: hashPassword }, otp },
    getEnvVar("JWT_ACTIVATION_SECRET"),
    { expiresIn: "5m" }
  );

  await sendMail(email, "E learning", { name, otp });

  return res.status(200).json({
    message: "OTP sent to your email",
    activationToken,
  });
});

export const verifyUser = TryCatch(async (req: Request, res: Response) => {
  const { otp } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1]; // Extract token after "Bearer "

  const verify = jwt.verify(token, getEnvVar("JWT_ACTIVATION_SECRET")) as JwtPayload;

  if (!verify || verify.otp !== Number(otp)) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  if (!verify.user) {
    return res.status(400).json({ message: "Invalid token payload" });
  }

  const existingUser = await User.findOne({ email: verify.user.email });
  if (existingUser) return res.status(400).json({ message: "User already exists" });

  await User.create(verify.user);
  return res.json({ message: "User registered successfully" });
});


export const loginUser = TryCatch(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { _id: user._id },
    getEnvVar("JWT_SECRET"),
    { expiresIn: "15d" }
  );

  const { password: _, ...userData } = user.toObject();

  return res.status(200).json({
    message: `Welcome back ${user.name}`,
    token,
    user: userData
  });
});

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  return res.json({ user });
});

export const forgotPassword = TryCatch(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "No user with this email" });

  const token = jwt.sign({ email }, getEnvVar("JWT_FORGOT_SECRET"), { expiresIn: "5m" });

  await sendForgotMail("E learning", { email, token });

  user.resetPasswordExpire = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  return res.json({ message: "Reset password link sent to your email" });
});

export const resetPassword = TryCatch(async (req: Request, res: Response) => {
  const token = req.query.token as string;
  const decoded = jwt.verify(token, getEnvVar("JWT_FORGOT_SECRET")) as JwtPayload;

  const user = await User.findOne({ email: decoded.email });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (!user.resetPasswordExpire || user.resetPasswordExpire.getTime() < Date.now()) {
    return res.status(400).json({ message: "Token expired" });
  }

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordExpire = null;
  await user.save();

  return res.json({ message: "Password reset successfully" });
});

export const changePassword = TryCatch(async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { currentPassword, newPassword } = req.body;

  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return res.status(200).json({ message: "Password changed successfully" });
});

export const updateProfile = TryCatch(async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name, age, gender, height, weight } = req.body;

  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  if (age && (typeof age !== 'number' || age < 1 || age > 120)) {
    return res.status(400).json({ message: "Invalid age" });
  }
  if (gender && !["Male", "Female", "Other"].includes(gender)) {
    return res.status(400).json({ message: "Invalid gender" });
  }
  if (height && (typeof height !== 'number' || height < 30 || height > 300)) {
    return res.status(400).json({ message: "Invalid height" });
  }
  if (weight && (typeof weight !== 'number' || weight < 1 || weight > 500)) {
    return res.status(400).json({ message: "Invalid weight" });
  }

  const updateFields: Partial<{
    name: string;
    age: number;
    gender: string;
    height: number;
    weight: number;
  }> = {};

  if (name) updateFields.name = name.trim();
  if (age) updateFields.age = age;
  if (gender) updateFields.gender = gender;
  if (height) updateFields.height = height;
  if (weight) updateFields.weight = weight;

  const user = await User.findByIdAndUpdate(req.user._id, updateFields, {
    new: true,
    runValidators: true
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  return res.status(200).json({
    message: "Profile updated successfully",
    user: {
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      height: user.height,
      weight: user.weight,
    }
  });
});
