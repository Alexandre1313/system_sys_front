import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ChevronsRight } from 'react-feather';
import Caixa from '../../../core/interfaces/Caixa';

export interface EtiquetaProps {
    etiquetas: Caixa[];
}

const Etiquetas = ({ etiquetas }: EtiquetaProps) => {
    if(etiquetas){
        etiquetas.sort((a, b) => parseInt(a.caixaNumber!) - parseInt(b.caixaNumber!));
    }    
    const gerarPDF = async () => {
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        // Configurações da etiqueta
        const pageWidth = 215;  // Largura da etiqueta
        const pageHeight = 145; // Altura da etiqueta
        const margem = 3;      // Margem em torno do conteúdo

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
            const { escolaNumber, projeto, qtyCaixa, escolaCaixa, caixaNumber, caixaItem, gradeId } = etiqueta;

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
                size: 18,
                font: font,
                color: rgb(0, 0, 0),
            });

            textY -= 18;           

            // Nome da escola (Fonte menor) com quebra de linha a cada 34 caracteres, sem quebrar palavras
            const escolaLines = splitTextByCharLimit(escolaCaixa, 34);
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

                // Renderiza o item com quebra de linha a cada 39 caracteres, sem quebrar palavras
                const itemText = `${item.itemName} - ${item.itemGenero} - tamanho: ${item.itemTam}`;
                const itemLines = splitTextByCharLimit(itemText, 39);
                itemLines.forEach((line) => {
                    page.drawText(line, {
                        x: textX,
                        y: textY,
                        size: 7,
                        font: font,
                        color: rgb(0, 0, 0),
                    });
                    textY -= 9;
                });

                // Renderiza a quantidade do item
                page.drawText(`Quantidade: ${item.itemQty} ${item.itemQty > 1 ? 'unidades' : 'unidade'}`, {
                    x: textX,
                    y: textY,
                    size: 7,
                    font: font,
                    color: rgb(0, 0, 0),
                });
                textY -= 16; // Ajusta a posição vertical após a quantidade
            });

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
            textY -= 18; // Ajusta a posição vertical após o total da caixa

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

            textY -= 18;

            // Número da caixa no final da etiqueta
            page.drawText(`Caixa ${String(caixaNumber).padStart(2, '0')} / ${String(etiquetas.length).padStart(2, '0')}`, {
                x: textX,
                y: textY > margem ? textY : margem, // Garante que o número fique visível
                size: 14,
                font: font,
                color: rgb(0, 0, 0),
            });
        });

        // Salva e exibe o PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
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
