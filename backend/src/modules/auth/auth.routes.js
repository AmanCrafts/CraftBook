import { Router } from "express";
import * as authController from "./auth.controller.js";

const router = Router();

// POST /api/auth/register - Register new user
router.post("/register", authController.register);

// POST /api/auth/login - Login user
router.post("/login", authController.login);

// GET /api/auth/me - Get current user
router.get("/me", authController.getCurrentUser);

// PUT /api/auth/email - Change email
router.put("/email", authController.changeEmail);

// PUT /api/auth/password - Change password
router.put("/password", authController.changePassword);

export default router;
