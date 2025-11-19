import express from "express";
import {
  getAllItems,
  getItem,
  addItem,
  addReview,
  deleteReview
} from "../controllers/itemController.js";

import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllItems);
router.get("/:id", getItem);
router.post("/", addItem);
router.post("/:id/review", addReview);
router.delete("/:itemId/review/:reviewId", auth, deleteReview);

export default router;
