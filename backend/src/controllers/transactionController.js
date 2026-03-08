import { database } from "../config/databaseConnection.js";

export const getTransactions = async (req, res) => {
    const userId = req.user.id;

    try {
        const query = `
        SELECT * FROM transactions
        WHERE user_id = $1
        ORDER BY date DESC, created_at DESC`;

        const { rows } = await database.query(query, [userId]);

        res.status(200).json({
            count: rows.length,
            transactions: rows,
        });
    } catch (err) {
        console.error(
            "ERROR in transactionController.js in getTransactions function, " +
                err,
        );
        res.status(500).json({
            error: "Error at search data",
        });
    }
};

export const addTransactions = async (req, res) => {
    const userId = req.user.id;

    const { description, amount, type, category, date } = req.body;
    const values = [userId, description, amount, type, category, date];

    try {
        const query = `
        INSERT INTO transactions (user_id, description, amount, type, category, date)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`;

        const { rows } = database.query(query, values);

        res.status(200).json({
            message: "Transaction created",
            transaction: rows,
        });
    } catch (err) {
        console.error(
            "ERROR in transactionController.js in addTransaction function, " +
                err,
        );
        res.status(401).json({
            message: "Internal Error",
        });
    }
};
