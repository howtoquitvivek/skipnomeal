import express from "express";
import {
  forgotPassword,
  loginUser,
  myProfile,
  register,
  resetPassword,
  verifyUser,
  changePassword,
  updateProfile,
} from "../controllers/userController";
import { isAuth } from "../middleware/isAuth";

const router = express.Router();

router.post("/user/register", register);
router.post("/user/verify", verifyUser);
router.post("/user/login", loginUser);
router.get("/user/me", isAuth, myProfile);
router.post("/user/forgot", forgotPassword);
router.post("/user/reset", resetPassword);
router.post("/user/change-password", isAuth, changePassword);
router.patch("/user/update", isAuth, updateProfile);

export default router;
