import { PdfReader } from "pdfreader";

export const extrairTextoPDF = (caminhoArquivo) => {
    try {
        return new Promise((resolve, reject) => {
            let textoFinal = "";
            let ultimaLinhaY = null;

            new PdfReader().parseFileItems(caminhoArquivo, (err, item) => {
                if (err) return reject(err);
                if (!item) return resolve(textoFinal);

                if (item.text) {
                    if (ultimaLinhaY !== null && item.y !== ultimaLinhaY) {
                        textoFinal += "\n";
                    }
                    textoFinal += item.text + " ";
                    ultimaLinhaY = item.y;
                }
            });
        });
    } catch (err) {
        return { err, sucess: false };
    }
};
