import express from "express";

import {
    addItem,
    deleteItem,
    editItem,
    getItems
} from "../controllers/itemController.js";
import { isVerifiedUser } from "../middlewares/tokenVerification.js";

const router = express.Router();

router.post("/", addItem);
router.put("/:id",isVerifiedUser(), editItem);
router.get("/", getItems);
router.delete("/:id",isVerifiedUser(), deleteItem);

export default router;