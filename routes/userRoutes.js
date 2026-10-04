import express from "express";
import {
    signUp,
    signIn,
    sendOTP,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/send-otp", sendOTP);


export default router;