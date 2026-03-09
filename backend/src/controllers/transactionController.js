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

    const data = Array.isArray(req.body) ? req.body : [req.body];
    //req.body é um array? se sim, retorne ele. se não, retorne ele como array

    try {
        const query = `
        INSERT INTO transactions (user_id, description, amount, type, category, date)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`;

        const createdTransactions = [];

        for (const item of data) {
            const { description, amount, type, category, date } = item;

            const values = [userId, description, amount, type, category, date];

            const { rows } = await database.query(query, values);

            createdTransactions.push(rows[0]);
        }

        res.status(201).json({
            message:
                data.length > 1
                    ? "transactions created"
                    : "transaction created",
            count: createdTransactions.length,
            transaction: createdTransactions,
        });
    } catch (err) {
        console.error(
            "ERROR in transactionController.js in addTransaction function, " +
                err,
        );
        res.status(500).json({
            message: "Internal Error",
        });
    }
};

export const deleteTransactions = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const query = `
        DELETE FROM transactions
        WHERE id = $1 AND user_id = $2
        Returning *`;

        const { rows } = await database.query(query, [id, userId]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Transaction not found",
            });
        }

        res.status(200).json({
            message: "Transaction deleted",
            deletedTransaction: rows[0],
        });
    } catch (err) {
        console.error(
            "ERROR in deleteTransactions function by transactionController.js, " +
                err,
        );
        res.status(500).json({
            error: "Internal ERROR",
        });
    }
};

export const getBalance = async (req, res) => {
    const userId = req.user.id;
    try {
        const query = `
        SELECT
            COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0) as total_income,
            COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0) as total_expense,
            (COALESCE(SUM(amount) FILTER (WHERE type = 'income'),0)) - 
            (COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0)) as balance
        FROM transactions
        WHERE user_id = $1`;

        const { rows } = await database.query(query, [userId]);

        res.status(200).json({
            userId,
            summary: {
                income: parseFloat(rows[0].total_income),
                expense: parseFloat(rows[0].total_expense),
                balance: parseFloat(rows[0].balance),
            },
        });
    } catch (err) {
        console.error(
            "ERROR in getBalance funcion from transactionController.js, " + err,
        );
        res.status(500).json({
            error: "not possible process balance",
        });
    }
};
