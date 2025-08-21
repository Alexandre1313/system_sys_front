import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ChevronsRight } from 'react-feather';
import Caixa from '../../../core/interfaces/Caixa';

export interface EtiquetaProps {
    etiquetas: Caixa[];
}

const Etiquetas = ({ etiquetas }: EtiquetaProps) => {
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

            // Itens (Fonte ainda menor) com quebra de linha a cada 39 caracteres, sem quebrar palavras
            caixaItem.forEach((item) => {
                // Checa se a posição atual estouraria o limite da página
                if (textY < margem + 30) { // Ajusta para evitar encavalamento ao trocar de página
                    // Adiciona uma nova página e reinicia o textY para o topo da nova etiqueta
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

                // Monta o texto sem o TAM
                const itemBase = `${item.itemName} - ${item.itemGenero}`;
                const tamText = `TAM: ${item.itemTam}`;

                // Quebra o texto base (sem TAM)
                const itemLines = splitTextByCharLimit(itemBase, 52);

                // Verifica se cabe adicionar o TAM na última linha
                const lastLine = itemLines[itemLines.length - 1];
                if ((lastLine.length + tamText.length + 3) <= 52) {
                    // Adiciona o TAM na mesma linha, com " - "
                    itemLines[itemLines.length - 1] += ` - ${tamText}`;
                } else {
                    // TAM não cabe, adiciona em nova linha
                    itemLines.push(tamText);
                }

                // Renderiza tudo
                itemLines.forEach((line) => {
                    page.drawText(line, {
                        x: textX,
                        y: textY,
                        size: 6,
                        font: font,
                        color: rgb(0, 0, 0),
                    });
                    textY -= 9;
                });

                // Renderiza a quantidade do item
                page.drawText(`Quantidade: ${item.itemQty} ${item.itemQty > 1 ? 'unidades' : 'unidade'}`, {
                    x: textX,
                    y: textY,
                    size: 6,
                    font: font,
                    color: rgb(0, 0, 0),
                });
                textY -= 11; // Ajusta a posição vertical após a quantidade
            });

            textY -= 4;

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
            const totalLabelsText = ` ${String(etiquetas.length).padStart(2, '0')}`; // Texto total de etiquetas

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
            className="flex items-center justify-center mt-3 px-3 py-1 bg-blue-500 hover:bg-green-500 hover:bg-opacity-10 
            bg-opacity-30 text-white font-normal text-[13px] rounded-md min-w-[200px]">
            ETIQUETAS <ChevronsRight className="pl-2 animate-bounceX" size={25} strokeWidth={2} />
        </button>
    );
};

export default Etiquetas;
