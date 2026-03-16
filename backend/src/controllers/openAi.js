import OpenAI from "openai";
const client = new OpenAI({
    apiKey: process.env.API_KEY,
});

export const responseAI = async (input) => {
    const response = await client.responses.create({
        model: "gpt-5-mini",
        input,
    });

    return response.output_text;
};
