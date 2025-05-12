import express from "express";
import { getUsersForSidebar, getMessages, sendMessage } from "../controllers/message.controller.js";
import { uploadFilesToCloudinary } from "../middleware/cloudinaryUpload.middleware.js";
import upload from "../middleware/multer.middleware.js";
import {protectRoute} from "../middleware/auth.middleware.js"

const router = express.Router();

router.get('/users', protectRoute, getUsersForSidebar);
router.get('/:id', protectRoute, getMessages);

// Accept multiple files
router.post(
  '/send/:receiverId',
  protectRoute,
  upload.array("files", 10), // max 10 files
  uploadFilesToCloudinary,
  sendMessage
);

export default router;
