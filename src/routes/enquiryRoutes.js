import { Router } from "express";
import {
  createEnquiry,
  deleteEnquiry,
  getEnquiries
} from "../controllers/enquiryController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/").post(createEnquiry).get(protect, adminOnly, getEnquiries);
router.route("/:id").delete(protect, adminOnly, deleteEnquiry);

export default router;
