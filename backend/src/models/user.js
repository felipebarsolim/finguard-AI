import { database } from "../config/databaseConnection.js";

const user = {
    create: async (name, email, password) => {
        const query = `INSERT INTO users (name, email, password)
                       VALUES($1, $2, $3)
                       RETURNING id, name, email, created_at`;

        const values = [name, email, password];
        const { rows } = await database.query(query, values);
        return rows[0];
    },

    findByEmail: async (email) => {
        const query = `SELECT * FROM users WHERE email = $1`;
        const { rows } = await database.query(query, [email]);
        return rows[0];
    },
};

export default user;
