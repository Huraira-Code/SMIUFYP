import express from "express";

import {
    createOrder,
    getOrders
} from "../controllers/orderController.js";
import { isVerifiedUser } from "../middlewares/tokenVerification.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/",isVerifiedUser(), getOrders);

export default router;