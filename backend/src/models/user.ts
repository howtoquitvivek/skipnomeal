import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },

    email: { 
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: { 
      type: String,
      unique: true,
      partialFilterExpression: { phone: { $exists: true, $ne: null } },
      trim: true,
    },

    age: {
      type: Number,
      min: 1,
      max: 120,
      // Not required anymore
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      // Not required anymore
    },

    height: {
      type: Number, // height in cm or inches (decide your unit)
      min: 30,
      max: 300,
      // Not required anymore
    },

    weight: {
      type: Number, // weight in kg or lbs (decide your unit)
      min: 1,
      max: 500,
      // Not required anymore
    },

    password: {
      type: String,
      required: true,
    },

    avatar: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

export const User = model("User", UserSchema);
export default User;
