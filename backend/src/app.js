import "dotenv/config";
import express from "express";
import cors from "cors";

import router from "./routes/router.js";
import initDatabase from "./config/init.js";

const app = express();

const port = process.env.PORT || 8081;

const startServer = async () => {
    try {
        app.use(express.json());
        app.use(cors());
        app.use("/", router);

        await initDatabase();

        app.listen(port, () => {
            console.log(`Server online in ${port}`);
        });
    } catch (err) {
        console.log("ERROR in app.js start server, " + err);
    }
};

startServer();
