import express from "express";

import {
    createCategory,
    getCategories,
    editCategory,
    deleteCategory
} from "../controllers/categoryController.js";
import { isVerifiedUser } from "../middlewares/tokenVerification.js";

const router = express.Router();

router.post("/",isVerifiedUser(), createCategory);
router.get("/",getCategories);
router.put("/:id",isVerifiedUser(), editCategory);
router.delete("/:id",isVerifiedUser(), deleteCategory);

export default router;