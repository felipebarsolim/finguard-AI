import bcrypt from "bcrypt";

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
