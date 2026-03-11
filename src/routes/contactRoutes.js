import { Router } from "express";
import {
  createContactMessage,
  getContactMessages
} from "../controllers/contactController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/").post(createContactMessage).get(protect, adminOnly, getContactMessages);

export default router;
