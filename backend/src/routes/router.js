import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";

import { register, login } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
    getTransactions,
    addTransactions,
    addTransactionsFromIA,
    deleteTransactions,
    getBalance,
    getTransactionByDate,
} from "../controllers/transactionController.js";
import { extrairTextoPDF } from "../utils/extractPDF.js";
import { responseAI } from "../controllers/openAi.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const upload = multer({ dest: "uploads/ " });

router.post("/register", register);

router.post("/login", login);

router.post("/transactions", authenticateToken, addTransactions);

router.post(
    "/transactions/file",
    authenticateToken,
    upload.single("file"),
    async (req, res) => {
        if (!req.file) {
            console.log("arquivo não existe");
            return res.status(404).json({
                message: "File Not Found",
            });
        }

        try {
            const textPdf = await extrairTextoPDF(req.file.path);
            if (textPdf.err) {
                res.status(400).json({
                    message: "Erro ao ler o arquivo enviado",
                });
                return;
            }

            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            const promptOtimizado = `
                Aja como extrator JSON. 
                Entrada: Extrato bancário bruto.
                Regras:
                1. Extraia: data (AAAA/MM/DD), descrição, 
                valor (float positivo), tipo(income/expense), categoria, 
                saldo inicial mais antigo.
                2. Saída: APENAS um array JSON: 
                [{"inicialBalance": "saldo mais antigo"},{"date":"data","description":"desc","amount":valor, "type": "tipo(income ou expense)", "category": (exemplo: lazer, salário, pix, educação, renda extra, (não usar "outros"))}].
                3. Ignore cabeçalhos e saldos(execeto o saldo inicial mais antigo).
                4. Se texto não tiver os dados pra extração, retorne apenas: {"error": true}.

                Texto:
                ${textPdf}
                `;

            const transaction = await responseAI(promptOtimizado);

            req.body = JSON.parse(transaction);

            if (req.body.error) {
                throw new Error("Arquivo não é um extrato");
            }
            await addTransactionsFromIA(req, res);
        } catch (err) {
            if (req.file && fs.existsSync(req.file.path))
                fs.unlinkSync(req.file.path);
            console.log("ERROR in transactions/file route, " + err);
            res.status(400).json({
                message: "Erro ao ler arquivo",
            });
        }
    },
);

router.get("/profile/validate", authenticateToken, (req, res) => {
    res.status(200).json({
        user: req.user,
    });
});

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

router.get("/profile", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "..",
            "..",
            "..",
            "frontend",
            "html",
            "profile.html",
        ),
    );
});

router.get("/balance", authenticateToken, getBalance);

router.get("/transactions/filter", authenticateToken, getTransactionByDate);

router.delete("/transaction/:id", authenticateToken, deleteTransactions);

export default router;
