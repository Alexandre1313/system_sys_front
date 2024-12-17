import { PDFDocument, PDFFont, StandardFonts, rgb } from 'pdf-lib';
import { Printer } from 'react-feather';
import { GradesRomaneio } from '../../../core';

export interface RomaneiosProps {
    romaneios: GradesRomaneio[];
}

const Romaneios = ({ romaneios }: RomaneiosProps) => {
    const gerarPDF = async () => {
        const pdfDoc = await PDFDocument.create();
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const pageWidth = 842; // A4 em paisagem
        const pageHeight = 595;
        const margin = 40;
        const lineHeight = 13;

        const footerHeight = margin; // Garantindo a mesma margem entre o rodapé e a borda inferior

        const drawText = (
            page: any,
            text: string,
            x: number,
            y: number,
            font: PDFFont,
            size: number = 10,
            color: any = rgb(0, 0, 0)
        ) => {
            page.drawText(text, { x, y, size, font, color });
        };

        const drawRect = (
            page: any,
            x: number,
            y: number,
            width: number,
            height: number,
            borderColor = rgb(0.85, 0.85, 0.85)
        ) => {
            page.drawRectangle({
                x,
                y,
                width,
                height,
                borderWidth: 1,
                borderColor,
            });
        };

        const drawLine = (
            page: any,
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            color: any = rgb(0, 0, 1)
        ) => {
            page.drawLine({
                start: { x: x1, y: y1 },
                end: { x: x2, y: y2 },
                thickness: 1,
                color,
            });
        };

        const splitText = (
            text: string,
            font: PDFFont,
            fontSize: number,
            maxWidth: number
        ): string[] => {
            const words = text.split(' ');
            const lines: string[] = [];
            let currentLine = '';

            words.forEach((word) => {
                const testLine = currentLine ? `${currentLine} ${word}` : word;
                const testWidth = font.widthOfTextAtSize(testLine, fontSize);

                if (testWidth <= maxWidth) {
                    currentLine = testLine;
                } else {
                    if (currentLine) {
                        lines.push(currentLine);
                    }
                    currentLine = word;
                }
            });

            if (currentLine) {
                lines.push(currentLine);
            }

            return lines;
        };

        // Função para ordenar tamanhos
        const sortTamanhos = (a: string, b: string): number => {
            const numericRegex = /^\d+$/; // Verifica se é numérico
            const sizeOrder = ['PP', 'P', 'M', 'G', 'GG', 'EG', 'EGG', 'XGG', 'EXG']; // Ordem para tamanhos literais

            if (numericRegex.test(a) && numericRegex.test(b)) {
                return parseInt(a, 10) - parseInt(b, 10);
            } else if (numericRegex.test(a)) {
                return -1; // Numéricos vêm antes de literais
            } else if (numericRegex.test(b)) {
                return 1;
            } else if (sizeOrder.includes(a) && sizeOrder.includes(b)) {
                return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
            } else if (sizeOrder.includes(a)) {
                return -1; // Literais vêm antes de outros
            } else if (sizeOrder.includes(b)) {
                return 1;
            } else {
                return a.localeCompare(b); // Ordem alfabética para outros
            }
        };

        romaneios.forEach((romaneio) => {
            const page = pdfDoc.addPage([pageWidth, pageHeight]);
            let currentY = pageHeight - margin;

            // Nome da empresa em azul
            drawText(
                page,
                `${romaneio.company.toUpperCase()}`,
                margin,
                currentY,
                fontBold,
                18,
                rgb(0, 0, 1)
            );
            currentY -= 15; // Ajusta a posição vertical para a próxima linha

            // Adiciona o CNPJ em fonte menor
            drawText(
                page,
                `CNPJ: ${romaneio.cnpjCompany || 'NÂO INFORMADO'}`, // Substitua `romaneio.cnpj` pela propriedade correta
                margin,
                currentY,
                fontRegular, // Fonte regular
                10, // Fonte menor
                rgb(0, 0, 0) // Cor preta
            );
            currentY -= 10; // Ajusta a posição vertical novamente

            // Adiciona o endereço em fonte menor
            drawText(
                page,
                `ENDEREÇO: RUA ${romaneio.enderecocompany.rua || 'NÂO INFORMADO'}, Nº ${romaneio.enderecocompany.numero || 'NÂO INFORMADO'} - ${romaneio.enderecocompany.bairro || 'NÂO INFORMADO'} - ${romaneio.enderecocompany.cidade || 'NÂO INFORMADO'} - ${romaneio.enderecocompany.estado || 'NÂO INFORMADO'} - CEP: ${romaneio.enderecocompany.postalCode || 'NÂO INFORMADO'}`,
                margin,
                currentY,
                fontRegular, // Fonte regular
                10, // Fonte menor
                rgb(0, 0, 0) // Cor preta
            );

            currentY -= 10; // Espaço reduzido entre o nome da empresa e a linha abaixo

            // Linha azul abaixo do nome da empresa
            drawLine(page, margin, currentY, pageWidth - margin, currentY, rgb(0, 0, 1));
            currentY -= 20; // Espaço reduzido antes do cabeçalho

            // Cabeçalho
            drawText(page, `PREFEITURA DO MUNICÍPIO DE ${romaneio.projectname.toUpperCase()}`, margin, currentY, fontRegular, 14);
            currentY -= lineHeight;
            drawText(page, 'SECRETARIA MUNICIPAL DE EDUCAÇÃO', margin, currentY, fontRegular, 14);
            currentY -= lineHeight;

            // Dados da escola
            const escolaWidth = fontBold.widthOfTextAtSize('UNIDADE ESCOLAR:', 12) + 10;
            drawText(page, 'UNIDADE ESCOLAR:', margin, currentY, fontBold, 12);

            // Quebrar o texto da escola se ele ultrapassar a largura da página
            const escolaMaxWidth = pageWidth - margin * 2 - escolaWidth;
            const escolaLines = splitText(romaneio.escola, fontBold, 12, escolaMaxWidth);

            // Desenhar as linhas quebradas do nome da escola
            escolaLines.forEach((line, index) => {
                drawText(page, line, margin + escolaWidth, currentY - index * lineHeight, fontBold, 12);
            });

            currentY -= escolaLines.length * lineHeight;

            const enderecoWidth = fontBold.widthOfTextAtSize('ENDEREÇO:', 12) + 10;
            drawText(page, `ENDEREÇO: RUA ${romaneio.enderecoschool.rua || 'NÂO INFORMADO'}, Nº ${romaneio.enderecoschool.numero || 'NÂO INFORMADO'} - ${romaneio.enderecoschool.bairro || 'NÂO INFORMADO'}`,
                margin, currentY,
                fontBold, 12);

            drawText(page, romaneio.enderecoschool.rua || '-', margin + enderecoWidth, currentY, fontRegular, 12);
            currentY -= lineHeight;

            const foneWidth = fontBold.widthOfTextAtSize('FONE:', 12) + 10;
            drawText(page, 'FONE:', margin, currentY, fontBold, 12);
            drawText(page, romaneio.telefoneEscola || '-', margin + foneWidth, currentY, fontRegular, 12);
            currentY -= 20;

            // ROMANEIO DE DESPACHO
            const currentYear = new Date().getFullYear();
            drawText(
                page,
                `ROMANEIO DE DESPACHO Nº ${romaneio.numeroEscola}/${currentYear} - GRADE ID: ${romaneio.id} - ${romaneio.tipo ? `${romaneio.tipo} - ` : ''}VOLUMES: ${romaneio.caixas.length}`,
                margin,
                currentY,
                fontBold,
                12,
                rgb(0, 0, 1)
            );
            currentY -= lineHeight + 1;

            // Processar os itens agrupados por item e gênero
            const groupedData = romaneio.tamanhosQuantidades.reduce((acc, curr) => {
                const groupKey = `${curr.item} ${curr.genero}`;
                if (!acc[groupKey]) {
                    acc[groupKey] = [];
                }
                acc[groupKey].push(curr);
                return acc;
            }, {} as Record<string, { tamanho: string; quantidade: number }[]>);

            Object.keys(groupedData).forEach((groupKey) => {
                let items = groupedData[groupKey];

                // Ordenar os itens por tamanho
                items = items.sort((a, b) => sortTamanhos(a.tamanho, b.tamanho));

                // Título do grupo
                page.drawLine({
                    start: { x: margin, y: currentY },
                    end: { x: pageWidth - margin, y: currentY },
                    color: rgb(149 / 255, 149 / 255, 149 / 255), // Cor cinza discreto
                    thickness: 0.01 // Tornando a linha mais fina
                });

                currentY -= 15;

                drawText(page, groupKey.toUpperCase(), margin, currentY, fontBold, 10);
                currentY -= lineHeight + 10;

                // Calcular largura dinâmica das células
                const maxWidth = items.reduce((max, { tamanho, quantidade }) => {
                    const sizeWidth = fontRegular.widthOfTextAtSize(tamanho, 8);
                    const quantWidth = fontRegular.widthOfTextAtSize(quantidade.toString(), 8);
                    return Math.max(max, sizeWidth, quantWidth);
                }, 0) + 10; // Padding

                // Renderizar tamanhos
                drawText(page, 'TAMANHO:', margin, currentY + 5, fontBold, 10);
                items.forEach((item, index) => {
                    drawRect(page, margin + 80 + index * maxWidth, currentY - 2, maxWidth, 20);
                    drawText(page, item.tamanho, margin + 85 + index * maxWidth, currentY + 2, fontRegular, 8);
                });
                currentY -= 20;

                // Renderizar quantidades
                drawText(page, 'QUANTIDADE:', margin, currentY + 5, fontBold, 10);
                let totalQuantidade = 0;
                items.forEach((item, index) => {
                    totalQuantidade += item.quantidade;
                    drawRect(page, margin + 80 + index * maxWidth, currentY - 2, maxWidth, 20);
                    drawText(page, item.quantidade.toString(), margin + 85 + index * maxWidth, currentY + 2, fontRegular, 8);
                });

                // Renderizar o TOTAL
                const totalText = `TOTAL: ${totalQuantidade}`;
                const totalWidth = fontBold.widthOfTextAtSize(totalText, 10) + 20;

                drawRect(page, margin + 80 + items.length * maxWidth, currentY - 2, totalWidth, 20);
                drawText(page, totalText, margin + 85 + items.length * maxWidth, currentY + 2, fontBold, 10);

                currentY -= 10;
            });

            // Garantir espaço para o rodapé e assinatura no final da página
            if (currentY < footerHeight + margin) {
                currentY = footerHeight + margin;
            }

            // Assinatura e Data
            drawText(page, 'DATA: ______/______/__________', margin, footerHeight + 25, fontBold, 10, rgb(0, 0, 1));
            drawText(
                page,
                'ASSINATURA / CARIMBO: ____________________________',
                margin + 250,
                footerHeight + 25,
                fontBold,
                10,
                rgb(0, 0, 1)
            );

            // Linha azul acima do rodapé
            drawLine(page, margin, footerHeight + 15, pageWidth - margin, footerHeight + 15, rgb(0, 0, 1)); // Ajustado mais próximo do rodapé

            // Rodapé centralizado
            const rodapeY = margin;
            drawText(page, 'Email:', pageWidth / 2 - 72, rodapeY, fontBold, 10, rgb(0, 0, 1));
            drawText(page, romaneio.emailCompany, pageWidth / 2 - 37, rodapeY, fontRegular, 10, rgb(0, 0, 1));

            drawText(page, 'Fone:', pageWidth / 2 - 72, rodapeY - 12, fontBold, 10, rgb(0, 0, 1));
            drawText(page, romaneio.telefoneCompany, pageWidth / 2 - 37, rodapeY - 12, fontRegular, 10, rgb(0, 0, 1));
        });

        // Salvar e exibir o PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    };

    return (
        <button
            type="button"
            onClick={gerarPDF}
            className="flex items-center justify-center px-2 py-1 bg-transparent hover:bg-transparent hover:bg-opacity-30 
            bg-opacity-20 text-zinc-400 font-semibold text-[13px] w-auto z-50">
            <Printer className="text-green-300 hover:text-green-500" size={17} strokeWidth={2} />
        </button>
    );
};

export default Romaneios;
