import "dotenv/config";
import express from "express";
import cors from "cors";

import router from "./routes/router.js";
import { database } from "./config/databaseConnection.js";

const app = express();

const port = process.env.PORT || 8081;

const startServer = async () => {
    try {
        app.use(cors);
        app.use(express.json());
        app.use(cors);
        app.use("/", router);

        const connectionDatabase = await database.query("SELECT 1");
        if (connectionDatabase) console.log("Database connected");
        else console.error("ERROR in database Connection");

        app.listen(port, () => {
            console.log(`Server online in ${port}`);
        });
    } catch (err) {
        console.log("ERROR in app.js start server, " + err);
    }
};

startServer();
