import { Router } from "express";
import * as authController from "../controllers/auth.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/me", authenticate, authController.me);

export default router;
