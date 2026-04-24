import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  getMe,
  uploadAvatar,
  deleteAvatar,
} from "../controllers/user.controller";
import { auth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.get("/me", auth, getMe);
router.post("/me/avatar", auth, upload.single("avatar"), uploadAvatar);
router.delete("/me/avatar", auth, deleteAvatar);
router.get("/", auth, requireRole("ADMIN"), getAllUsers);
router.get("/:id", auth, requireRole("ADMIN"), getUserById);

export default router;
