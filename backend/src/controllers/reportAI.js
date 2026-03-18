import { responseAI } from "./openAi.js";
import { catalog } from "../utils/catalog.js";
import { database } from "../config/databaseConnection.js";

export const reportAI = async (req, res) => {
    const transactionsToIA = req.body;
    const userId = req.user.id;

    try {
        if (transactionsToIA) {
            const prompt = `
            Aja com analista financeiro e consultor de compras inteligente. Com base nessas transações ${JSON.stringify(transactionsToIA)}, 
            retorne APENAS JSON com as chaves: 
            {categoryAnalysis: Texto detalhado (máx 4 linhas) explicando onde o usuário mais gastou e se isso é normal,
            habbitsAnalysis: Texto detalhado (máx 3 linhas) dando uma dica prática para economizar baseada nos hábitos dele,
            costumerType: perfil de compra detalhado do usuário,
            ads: Escolha um produto de ${JSON.stringify(catalog)} que mais se adeque ao perfil de compra do usuario, extraia 
            os valores : link, name, image. coloque as vantagens do usuário comprar esse produto(comece com "notei que você...", 2 linha) na variavel
            reason, coloque o preço do produto na variável price(R$) e crie o objeto{link, name, image, reason, price}`;

            const response = await responseAI(prompt);

            const query = `
            INSERT INTO open_ai_report (user_id, report)
            VALUES ($1, $2)
            RETURNING *`;

            const { rows } = await database.query(query, [userId, response]);

            if (rows[0]) {
                return res.status(200).json({
                    response: JSON.parse(response),
                });
            } else {
                throw new Error("ERROR in insert into database");
            }
        }
    } catch (err) {
        console.error("ERROR in reportAI.js, " + err);
        res.status(400).json({
            error: "Internal Error",
        });
    }
};

export const getReports = async (req, res) => {
    const userId = req.user.id;

    try {
        const query = `
        SELECT * FROM open_ai_report
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 1`;

        const { rows } = await database.query(query, [userId]);

        if (rows[0]) {
            return res.status(200).json({
                response: rows[0].report,
            });
        } else {
            throw new Error("Error in getReports, ");
        }
    } catch (err) {
        console.error("Error in OpenAI.js, " + err);
        return res.status(400).json({
            error: "Internal Error",
        });
    }
};
