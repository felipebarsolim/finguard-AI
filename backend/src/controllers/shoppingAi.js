import { catalog } from "../utils/catalog.js";
import { responseAI } from "./openAi.js";

export const shoppingAi = async (req, res) => {
    const costumerType = req.body;

    if (costumerType) {
        try {
            const prompt = `
            Aja como um consultor de compras. 
            Baseado nesse perfil de compras: ${JSON.stringify(costumerType)},
            Escolha um produto de ${JSON.stringify(catalog)} que mais se adeque ao perfil de compra do usuario, extraia 
            os valores : link, name, image. coloque as vantagens do usuário comprar 
            esse produto(comece com "notei que você...", 2 linha) na variavel
            reason, coloque o preço do produto na variável price(R$) e 
            crie o objeto{link, name, image, reason, price}, e retorne em JSON`;

            const response = await responseAI(prompt);

            if (response) {
                res.status(200).json({ response });
            }
        } catch (err) {
            return res.status(400).json({ error: "error" });
        }
    } else {
        const error = new error("Erro");
        return res.status(400).json({ error });
    }
};
