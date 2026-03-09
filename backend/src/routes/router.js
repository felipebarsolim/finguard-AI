import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import { register, login } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
    getTransactions,
    addTransactions,
    deleteTransactions,
    getBalance,
    getTransactionByDate,
} from "../controllers/transactionController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/transactions", authenticateToken, addTransactions);

router.get("/register", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "..",
            "..",
            "..",
            "frontend",
            "html",
            "register.html",
        ),
    );
});

router.get("/login", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "..",
            "..",
            "..",
            "frontend",
            "html",
            "index.html",
        ),
    );
});

router.get("/transactions", authenticateToken, getTransactions);

router.get("/profile", authenticateToken, (req, res) => {
    res.json({
        message: "Welcome",
        userData: req.user,
    });
});

router.get("/balance", authenticateToken, getBalance);

router.get("/transactions/filter", authenticateToken, getTransactionByDate);

router.delete("/transaction/:id", authenticateToken, deleteTransactions);

export default router;
