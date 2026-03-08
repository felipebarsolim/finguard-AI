import express from "express";

import { register, login } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
    getTransactions,
    addTransactions,
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/transactions", authenticateToken, addTransactions);

router.get("/transactions", authenticateToken, getTransactions);

router.get("/profile", authenticateToken, (req, res) => {
    res.json({
        message: "Welcome",
        userData: req.user,
    });
});

export default router;
