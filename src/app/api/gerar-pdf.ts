/*import { div } from "framer-motion/client";
import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    
    if (req.method !== "GET") return res.status(405).json({ error: "Método não permitido" });

    try {
        const browser = await puppeteer.launch({
            headless: "new", // Para Puppeteer mais recente
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();

        // URL da página que queremos converter (ajuste conforme necessário)
        const url = "http://localhost:3000/grades"; // Ajuste para o ambiente de produção
        await page.goto(url, { waitUntil: "networkidle0" });

        // Gerar PDF com estilo
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
        });

        await browser.close();

        // Retornar o PDF gerado
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment; filename="relatorio.pdf"');
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        res.status(500).json({ error: "Erro interno ao gerar o PDF" });
    }
}*/
