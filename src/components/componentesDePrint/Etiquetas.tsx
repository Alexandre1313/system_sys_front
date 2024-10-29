import React from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import Caixa from '../../../core/interfaces/Caixa';
import { ChevronsRight } from 'react-feather';

export interface EtiquetaProps {
    etiquetas: Caixa[];
}

const Etiquetas = ({ etiquetas }: EtiquetaProps) => {
    const gerarPDF = async () => {
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        // Configurações da etiqueta
        const pageWidth = 215;  // Largura da etiqueta
        const pageHeight = 145; // Altura da etiqueta
        const margem = 10;      // Margem em torno do conteúdo

        etiquetas.forEach((etiqueta) => {
            // Cria uma nova página de etiqueta
            let page = pdfDoc.addPage([pageWidth, pageHeight]);
            const { escolaNumber, projeto, escolaCaixa, caixaNumber, caixaItem } = etiqueta;

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

            textY -= 18;

            // Nome da escola (Fonte menor)
            page.drawText(escolaCaixa, {
                x: textX,
                y: textY,
                size: 9,
                font: font,
                color: rgb(0, 0, 0),
            });

            textY -= 12;

            // Itens (Fonte ainda menor)
            caixaItem.forEach((item, itemIndex) => {
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

                // Renderiza o item e quantidade
                page.drawText(`${item.itemName} - ${item.itemGenero} - tamanho: ${item.itemTam}`, {
                    x: textX,
                    y: textY,
                    size: 7,
                    font: font,
                    color: rgb(0, 0, 0),
                });
                textY -= 9;

                page.drawText(`Quantidade: ${item.itemQty} ${item.itemQty > 1 ? 'unidades' : 'unidade'}`, {
                    x: textX,
                    y: textY,
                    size: 7,
                    font: font,
                    color: rgb(0, 0, 0),
                });
                textY -= 12;
            });

            // Número da caixa no final da etiqueta
            page.drawText(`Caixa ${String(caixaNumber).padStart(2, '0')} / ${String(etiquetas.length).padStart(2, '0')}`, {
                x: textX,
                y: textY > margem ? textY : margem, // Garante que o número fique visível
                size: 9,
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
            bg-opacity-30 text-white font-normal text-[14px] rounded-md min-w-[200px]">
                ETIQUETAS <ChevronsRight className="pl-2 animate-bounceX" size={25} strokeWidth={2}
            />
        </button>          
    );
};

export default Etiquetas;
