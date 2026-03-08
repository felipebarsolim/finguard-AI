import { database } from "./databaseConnection.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initDatabase = async () => {
    try {
        //to read sql file and use as text in database.query
        const sqlPath = path.join(__dirname, "../models/schema.sql");
        const sql = fs.readFileSync(sqlPath, "utf8");

        await database.query(sql);
        console.log("init database sucess");
    } catch (err) {
        console.log("ERROR in init.js, " + err);
    }
};

export default initDatabase;
