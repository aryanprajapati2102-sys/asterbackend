import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getBlogBySlug,
  getBlogs,
  updateBlog
} from "../controllers/blogController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.route("/").get(getBlogs).post(protect, adminOnly, upload.single("featuredImage"), createBlog);
router.route("/:slug").get(getBlogBySlug);
router.route("/:id").put(protect, adminOnly, upload.single("featuredImage"), updateBlog);
router.route("/:id").delete(protect, adminOnly, deleteBlog);

export default router;
