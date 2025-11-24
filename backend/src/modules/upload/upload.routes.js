import express from "express";
import uploadController from "./upload.controller.js";
import { upload } from "../../config/multer.js";

const router = express.Router();

/**
 * Upload Routes
 */

// POST /api/upload - Upload image
router.post("/", upload.single("image"), uploadController.uploadImage);

// DELETE /api/upload/:id - Delete image
router.delete("/:id", uploadController.deleteImage);

export default router;
