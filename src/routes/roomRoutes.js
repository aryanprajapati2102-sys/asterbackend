import { Router } from "express";
import {
  createRoom,
  deleteRoom,
  getRoomById,
  getRooms,
  updateRoom
} from "../controllers/roomController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.route("/").get(getRooms).post(protect, adminOnly, upload.array("images", 6), createRoom);
router
  .route("/:id")
  .get(getRoomById)
  .put(protect, adminOnly, upload.array("images", 6), updateRoom)
  .delete(protect, adminOnly, deleteRoom);

export default router;
