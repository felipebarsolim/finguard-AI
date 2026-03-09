import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import user from "../models/user.js";

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await user.findByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: "user already signed up" });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUser = await user.create(name, email, password_hash);

        console.log("user created. name: " + name);

        res.status(201).json({
            message: "User Created",
            user: newUser,
        });
    } catch (err) {
        console.error("ERROR in authController.js, " + err);
        res.status(500).json({ error: "Internal error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({
            message: "Invalid email or password",
        });
    }

    try {
        const client = await user.findByEmail(email);

        if (!client) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, client.password);

        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: client.id, name: client.name },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" },
        );

        res.status(200).json({
            message: "login sucessful",
            token,
            user: {
                id: client.id,
                name: client.name,
                email: client.email,
            },
        });
    } catch (err) {
        console.error("ERROR in authController.js login function, " + err);
    }
};
