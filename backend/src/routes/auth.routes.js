import express from 'express';
import { signup, login, logout, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes
router.post("/update-profile", protectRoute, updateProfile);
router.get("/check-auth", protectRoute, checkAuth);  

export default router;
