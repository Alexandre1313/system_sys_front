import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import Caixa from '../../../core/interfaces/Caixa';

export interface EtiquetaNewTabularProps {
    etiquetas: Caixa[];
    classNew: string;
    len?: number;
}

const EtiquetasNewTabular = ({ etiquetas, classNew, len }: EtiquetaNewTabularProps) => {
    function concatString(nj: string, ne: string, nae: string): string {
        let description = '';
        if (nj) {
            description = `${nj} - ${ne}`;
        } else {
            description = `RM ${nae} - ${ne}`;
        }
        return description;
    }

    if (etiquetas) {
        etiquetas.sort((a, b) => parseInt(b.caixaNumber!) - parseInt(a.caixaNumber!));
    }

    const gerarPDF = async () => {
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const font2 = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Configurações da etiqueta
        const pageWidth = 215;  // Largura da etiqueta
        const pageHeight = 145; // Altura da etiqueta
        const margem = 2;      // Margem em torno do conteúdo

        // Função para dividir texto com base no limite de caracteres sem quebrar palavras
        const splitTextByCharLimit = (text: string, charLimit: number) => {
            const words = text.split(' ');
            let line = '';
            const lines = [];

            words.forEach((word) => {
                const testLine = line ? `${line} ${word}` : word;
                if (testLine.length <= charLimit) {
                    line = testLine;
                } else {
                    lines.push(line);
                    line = word;
                }
            });
            if (line) lines.push(line); // Adiciona a última linha
            return lines;
        };

        etiquetas.forEach((etiqueta) => {
            // Cria uma nova página de etiqueta
            let page = pdfDoc.addPage([pageWidth, pageHeight]);
            const { escolaNumber, numberJoin, projeto, qtyCaixa, escolaCaixa, caixaNumber, caixaItem, gradeId } = etiqueta;

            // Desenho das bordas da etiqueta
            const borderX = 5;
            const borderY = 5;
            const borderWidth = page.getWidth() - 2 * borderX;
            const borderHeight = page.getHeight() - 2 * borderY;

            page.drawRectangle({
                x: borderX,
                y: page.getHeight() - borderHeight - borderY,
                width: borderWidth,
                height: borderHeight,
                borderColor: rgb(0, 0, 0),
                borderWidth: 0.1,
            });

            // Textos de conteúdo da etiqueta
            const textX = borderX + margem;
            let textY = page.getHeight() - margem - 20;  // Começa logo abaixo do topo

            // Título maior (Escola e Projeto)
            page.drawText(`${escolaNumber} - ${projeto}`, {
                x: textX,
                y: textY,
                size: 14,
                font: font,
                color: rgb(0, 0, 0),
            });

            textY -= 15;

            // Nome da escola (Fonte menor) com quebra de linha a cada 34 caracteres, sem quebrar palavras
            const escolaLines = splitTextByCharLimit(concatString(numberJoin, escolaCaixa, escolaNumber), 37);
            escolaLines.forEach((line) => {
                page.drawText(line, {
                    x: textX,
                    y: textY,
                    size: 9,
                    font: font,
                    color: rgb(0, 0, 0),
                });
                textY -= 12;
            });

            textY -= 3;

            // Agrupar por nome/gênero
            const grouped = caixaItem.reduce((acc, item) => {
                const key = `${item.itemName} - ${item.itemGenero}`;
                if (!acc[key]) acc[key] = [];
                acc[key].push({
                    tamanho: item.itemTam,
                    quantidade: item.itemQty,
                });
                return acc;
            }, {} as Record<string, { tamanho: string; quantidade: number }[]>);

            // Para cada grupo (ex: "Camiseta - Masculino")
            Object.keys(grouped).forEach((groupKey) => {
                const items = grouped[groupKey];
                // Nome do item + gênero
                page.drawText(groupKey.toUpperCase(), {
                    x: textX,
                    y: textY,
                    size: 8,
                    font: font2,
                    color: rgb(0, 0, 0),
                });
                textY -= 10;

                // Calcular largura dinâmica das células (com base no maior tamanho ou número)
                const maxWidth = items.reduce((max, { tamanho, quantidade }) => {
                    const sizeWidth = font2.widthOfTextAtSize(tamanho, 8);
                    const quantWidth = font2.widthOfTextAtSize(String(quantidade), 8);
                    return Math.max(max, sizeWidth, quantWidth);
                }, 0) + 10;

                const breakLimit = 5; // máx. 5 quadrados por linha
                const rows = Math.ceil(items.length / breakLimit);

                for (let r = 0; r < rows; r++) {
                    const rowItems = items.slice(r * breakLimit, (r + 1) * breakLimit);

                    // TAMANHO
                    page.drawText('TAM:', {
                        x: textX,
                        y: textY + 5,
                        size: 8,
                        font: font,
                        color: rgb(0, 0, 0),
                    });

                    rowItems.forEach((item, i) => {
                        const x = textX + 40 + i * maxWidth;
                        page.drawRectangle({ x, y: textY - 2, width: maxWidth, height: 20, borderColor: rgb(0, 0, 0), borderWidth: 0.5 });
                        page.drawText(item.tamanho, { x: x + 4, y: textY + 2, size: 7, font: font2, color: rgb(0, 0, 0) });
                    });
                    textY -= 20;

                    // QUANTIDADE
                    page.drawText('QTD:', {
                        x: textX,
                        y: textY + 5,
                        size: 8,
                        font: font,
                        color: rgb(0, 0, 0),
                    });

                    let total = 0;
                    rowItems.forEach((item, i) => {
                        total += item.quantidade;
                        const x = textX + 40 + i * maxWidth;
                        page.drawRectangle({ x, y: textY - 2, width: maxWidth, height: 20, borderColor: rgb(0, 0, 0), borderWidth: 0.5 });
                        page.drawText(String(item.quantidade), { x: x + 4, y: textY + 2, size: 7, font: font2, color: rgb(0, 0, 0) });
                    });

                    // TOTAL no fim da linha
                    const totalText = `TOTAL: ${total}`;
                    const totalWidth = font.widthOfTextAtSize(totalText, 8) + 15;
                    const totalX = textX + 40 + rowItems.length * maxWidth;

                    page.drawRectangle({ x: totalX, y: textY - 2, width: totalWidth, height: 20, borderColor: rgb(0, 0, 0), borderWidth: 0.5 });
                    page.drawText(totalText, { x: totalX + 4, y: textY + 2, size: 8, font: font, color: rgb(0, 0, 0) });

                    textY -= 25; // espaçamento após o grupo
                }
            });


            textY -= 15; // Ajuste final na altura           

            // Antes de desenhar o total da caixa, verifica se ainda há espaço
            if (textY < margem + 20) { // Verifica se há espaço suficiente
                // Adiciona uma nova página se não houver espaço
                page = pdfDoc.addPage([pageWidth, pageHeight]);
                textY = page.getHeight() - margem - 20;

                // Redesenha as bordas na nova página
                page.drawRectangle({
                    x: borderX,
                    y: page.getHeight() - borderHeight - borderY,
                    width: borderWidth,
                    height: borderHeight,
                    borderColor: rgb(0, 0, 0),
                    borderWidth: 0.1,
                });
            }

            // Total da caixa
            page.drawText(`Total da caixa: ${String(qtyCaixa).padStart(2, '0')}`, {
                x: textX,
                y: textY > margem ? textY : margem, // Garante que o número fique visível
                size: 9,
                font: font,
                color: rgb(0, 0, 0),
            });
            textY -= 15; // Ajusta a posição vertical após o total da caixa

            // Número da caixa no final da etiqueta
            if (textY < margem + 20) { // Verifica se há espaço suficiente
                // Adiciona uma nova página se não houver espaço
                page = pdfDoc.addPage([pageWidth, pageHeight]);
                textY = page.getHeight() - margem - 20;

                // Redesenha as bordas na nova página
                page.drawRectangle({
                    x: borderX,
                    y: page.getHeight() - borderHeight - borderY,
                    width: borderWidth,
                    height: borderHeight,
                    borderColor: rgb(0, 0, 0),
                    borderWidth: 0.1,
                });
            }

            // REMESSA
            page.drawText(`Grade ID: ${gradeId}`, {
                x: textX,
                y: textY,
                size: 9,
                font: font,
                color: rgb(0, 0, 0),
            });

            textY -= 15;

            // Número da caixa no final da etiqueta
            const caixaNumberText = `${String(caixaNumber).padStart(2, '0')} /`; // Número da caixa
            const totalLabelsText = ` ${String(len ? len : etiquetas.length).padStart(2, '0')}`; // Texto total de etiquetas

            // Calcular a largura do texto
            const textWidth = font.widthOfTextAtSize(`Caixa: ${caixaNumberText}`, 13);

            // Desenha "Caixa" com o número da caixa em uma cor (preto)
            page.drawText(`Caixa: ${caixaNumberText}`, {
                x: textX,
                y: textY > margem ? textY : margem, // Garante que o número fique visível
                size: 13,
                font: font, // Usando a variável 'font' que você está utilizando
                color: rgb(0, 0, 0), // Cor do número da caixa (preto)
            });

            // Desenha o total de etiquetas com uma cor diferente (por exemplo, vermelho)
            page.drawText(totalLabelsText, {
                x: textX + font.widthOfTextAtSize(`Caixa ${caixaNumberText}`, 13) + 5, // Ajusta a posição X após o número da caixa
                y: textY > margem ? textY : margem, // Garante que o número fique visível
                size: 13,
                font: font2, // Usando a variável 'font' que você está utilizando
                color: rgb(1, 0, 0), // Cor do total de etiquetas (vermelho)
            });

            // Desenha a linha para simular o sublinhado
            page.drawLine({
                start: { x: textX, y: textY > margem ? textY - 3 : margem - 3 }, // Começa um pouco abaixo do texto
                end: { x: textX + textWidth, y: textY > margem ? textY - 2 : margem - 2 }, // Finaliza ao lado direito do texto
                thickness: 2, // Espessura da linha
                color: rgb(0, 0, 0), // Cor da linha (preto)
            });

        });

        // Salva e exibe o PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes.slice().buffer], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    };

    return (
        <button
            type="button"
            onClick={gerarPDF}
            className={classNew}>
            ETIQUETAS
        </button>
    );
};

export default EtiquetasNewTabular;
