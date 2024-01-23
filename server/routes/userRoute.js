import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import {
  OTPVerification,
  followWriter,
  getWriter,
  resendOTP,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/verify/:userId/:otp", OTPVerification);
router.post("/resend-link/:id", resendOTP);

// user routes
router.post("/follow/:id", userAuth, followWriter);
router.put("/update-user", userAuth, updateUser);

router.get("/user/:id?", getWriter);

export default router;
