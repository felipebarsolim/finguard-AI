import express from "express";

import { register, login } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/profile", authenticateToken, (req, res) => {
    res.json({
        message: "Welcome",
        userData: req.user,
    });
});

export default router;
