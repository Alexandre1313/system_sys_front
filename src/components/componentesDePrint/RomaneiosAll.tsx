import { PDFDocument, PDFFont, StandardFonts, rgb } from 'pdf-lib';
import { Printer } from 'react-feather';
import { GradesRomaneio } from '../../../core';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { convertSPTime } from '../../../core/utils/tools';

export interface RomaneiosProps {
    romaneios: GradesRomaneio[];
}

const RomaneiosAll = ({ romaneios }: RomaneiosProps) => {
    const gerarPDFUnic = async (romaneioAr: GradesRomaneio[]) => {
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

        function concatString(nj: string, ne: string, nae: string): string {
            let description = '';
            if (nj) {
                description = `${nj} - ${ne}`;
            } else {
                description = `RM ${nae} - ${ne}`;
            }
            return description;
        }

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

        for (const romaneio of romaneioAr) {
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
                `ENDEREÇO: ${romaneio.enderecocompany.rua || 'NÂO INFORMADO'}, Nº ${romaneio.enderecocompany.numero || 'NÂO INFORMADO'} - ${romaneio.enderecocompany.bairro || 'NÂO INFORMADO'} - ${romaneio.enderecocompany.cidade || 'NÂO INFORMADO'} - ${romaneio.enderecocompany.estado || 'NÂO INFORMADO'} - CEP: ${romaneio.enderecocompany.postalCode || 'NÂO INFORMADO'}`,
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
            const escolaLines = splitText(concatString(romaneio.numberJoin, romaneio.escola, romaneio.numeroEscola), fontBold, 12, escolaMaxWidth);

            // Desenhar as linhas quebradas do nome da escola
            escolaLines.forEach((line, index) => {
                drawText(page, line, margin + escolaWidth, currentY - index * lineHeight, fontBold, 12);
            });

            currentY -= escolaLines.length * lineHeight;

            // Dados do endereço
            const enderecoLabel = 'ENDEREÇO:';
            const enderecoWidth = fontBold.widthOfTextAtSize(enderecoLabel, 12) + 10;
            drawText(page, enderecoLabel, margin, currentY, fontBold, 12);

            // Quebrar o texto do endereço se ele ultrapassar a largura da página
            const enderecoText = `${romaneio.enderecoschool.rua || 'NÃO INFORMADO'}, Nº ${romaneio.enderecoschool.numero || 'NÃO INFORMADO'} - ${romaneio.enderecoschool.bairro || 'NÃO INFORMADO'} - ${romaneio.enderecoschool.cidade || 'NÃO INFORMADO'} - ${romaneio.enderecoschool.estado || 'NÃO INFORMADO'}`;
            const enderecoMaxWidth = pageWidth - margin * 2 - enderecoWidth;
            const enderecoLines = splitText(enderecoText, fontBold, 12, enderecoMaxWidth);

            // Desenhar as linhas quebradas do endereço
            enderecoLines.forEach((line, index) => {
                drawText(page, line, margin + enderecoWidth, currentY - index * lineHeight, fontBold, 12);
            });

            currentY -= enderecoLines.length * lineHeight;

            const foneWidth = fontBold.widthOfTextAtSize('FONE:', 12) + 10;
            drawText(page, 'FONE:', margin, currentY, fontBold, 12);
            drawText(page, romaneio.telefoneEscola || '-', margin + foneWidth, currentY, fontRegular, 12);
            currentY -= 20;

            // ROMANEIO DE DESPACHO
            const currentYear = new Date().getFullYear();
            drawText(
                page,
                `DOCUMENTO DE DESPACHO Nº ${romaneio.numeroEscola}/${currentYear} - GRADE ID: ${romaneio.id} - ${romaneio.tipo ? `${romaneio.tipo} - ` : ''}VOLUMES: ${romaneio.caixas.length}`,
                margin,
                currentY,
                fontBold,
                12,
                rgb(0, 0, 1)
            );
            currentY -= lineHeight + 1;

            // Tipagem de groupedData corrigida para um objeto (e não array)
            /*const groupedData = romaneio.tamanhosQuantidades.reduce((acc, curr) => {
                const groupKey = `${curr.item} ${curr.genero}`;

                // Verifique se o grupo já existe no acumulador, se não, crie-o
                if (!acc[groupKey]) {
                    acc[groupKey] = { items: [], composicao: curr.composicao }; // Atribuindo items e composição corretamente
                }

                // Adiciona o item ao grupo correspondente
                acc[groupKey].items.push(curr);

                return acc;
            }, {} as Record<string, { items: { tamanho: string; quantidade: number }[]; composicao: string }>);*/

            const groupedData = romaneio.tamanhosQuantidades.reduce((acc, curr) => {
                const groupKey = `${curr.item} ${curr.genero}`;

                // Verifique se o projeto é "SANTO ANDRÉ"
                if (romaneio.projectname.trim().toUpperCase() === "SANTO ANDRÉ") {
                    if (curr.item === "KIT UNIFORME") {
                        // Criando o grupo para "KIT INVERNO" com composição "XXX"
                        const groupInvernoKey = `KIT INVERNO ${curr.genero}`;
                        if (!acc[groupInvernoKey]) {
                            acc[groupInvernoKey] = { items: [], composicao: "01 CALÇA, 01 JAQUETA" }; // Novo grupo "KIT INVERNO"
                        }
                        acc[groupInvernoKey].items.push(curr);

                        // Criando o grupo para "KIT VERÃO" com composição "XXX"
                        const groupVeraoKey = `KIT VERÃO ${curr.genero}`;
                        if (!acc[groupVeraoKey]) {
                            acc[groupVeraoKey] = { items: [], composicao: "02 BERMUDAS, 01 CAMISETA GOLA POLO, 02 CAMISETAS DECOTE V" }; // Novo grupo "KIT VERÃO"
                        }
                        acc[groupVeraoKey].items.push(curr);
                    } else {
                        // Se não for "KIT UNIFORME", mantém o item original no grupo
                        acc[groupKey] = acc[groupKey] || { items: [], composicao: curr.composicao };
                        acc[groupKey].items.push(curr);
                    }
                } else {
                    // Se o projeto não for "SANTO ANDRÉ", mantém o item original
                    acc[groupKey] = acc[groupKey] || { items: [], composicao: curr.composicao };
                    acc[groupKey].items.push(curr);
                }

                return acc;
            }, {} as Record<string, { items: { tamanho: string; quantidade: number }[]; composicao: string }>);

            Object.keys(groupedData).forEach((groupKey) => {
                const { composicao } = groupedData[groupKey];
                let { items } = groupedData[groupKey];

                // Ordenar os itens por tamanho
                items = items.sort((a, b) => sortTamanhos(a.tamanho, b.tamanho));

                // Título do grupo
                page.drawLine({
                    start: { x: margin, y: currentY },
                    end: { x: pageWidth - margin, y: currentY },
                    color: rgb(149 / 255, 149 / 255, 149 / 255), // Cor cinza discreto
                    thickness: 0.01 // Linha fina
                });

                currentY -= 15;

                // Exibe o nome do grupo
                if (composicao) {
                    drawText(page, `${groupKey.toUpperCase()} - KIT COMPOSTO POR:`, margin, currentY, fontBold, 10);
                    currentY -= lineHeight + 0.5;
                }

                if (!composicao) {
                    drawText(page, `${groupKey.toUpperCase()}`, margin, currentY, fontBold, 10);
                    currentY -= lineHeight + 0.5;
                    currentY -= 15;
                }

                // **Composição**: Verificar se existe e mostrar acima da linha de separação
                if (composicao) {
                    const composicaoMaxWidth = pageWidth - margin * 2;

                    // Dividir a composição em várias linhas, se necessário
                    const composicaoLines = splitText(composicao, fontRegular, 9, composicaoMaxWidth);

                    /* Exibe "COMPOSIÇÃO:" uma vez
                    drawText(page, "COMPOSIÇÃO DO KIT:", margin, currentY, fontBold, 9);
                    currentY -= lineHeight;*/

                    // Exibe cada linha da composição
                    composicaoLines.forEach((line) => {
                        drawText(page, line, margin, currentY, fontRegular, 8); // Exibe o conteúdo da composição
                        currentY -= lineHeight; // Ajusta a posição para a próxima linha
                    });
                    currentY -= 15; // Ajuste o espaço após a linha
                }

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
        };

        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
    };

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

        function concatString(nj: string, ne: string, nae: string): string {
            let description = '';
            if (nj) {
                description = `${nj} - ${ne}`;
            } else {
                description = `RM ${nae} - ${ne}`;
            }
            return description;
        }

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

        const zip = new JSZip();
        const data = new Date()
        const dataSp = convertSPTime(String(data));

        for (const romaneio of romaneios) {
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
                `ENDEREÇO: ${romaneio.enderecocompany.rua || 'NÂO INFORMADO'}, Nº ${romaneio.enderecocompany.numero || 'NÂO INFORMADO'} - ${romaneio.enderecocompany.bairro || 'NÂO INFORMADO'} - ${romaneio.enderecocompany.cidade || 'NÂO INFORMADO'} - ${romaneio.enderecocompany.estado || 'NÂO INFORMADO'} - CEP: ${romaneio.enderecocompany.postalCode || 'NÂO INFORMADO'}`,
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
            const escolaLines = splitText(concatString(romaneio.numberJoin, romaneio.escola, romaneio.numeroEscola), fontBold, 12, escolaMaxWidth);

            // Desenhar as linhas quebradas do nome da escola
            escolaLines.forEach((line, index) => {
                drawText(page, line, margin + escolaWidth, currentY - index * lineHeight, fontBold, 12);
            });

            currentY -= escolaLines.length * lineHeight;

            // Dados do endereço
            const enderecoLabel = 'ENDEREÇO:';
            const enderecoWidth = fontBold.widthOfTextAtSize(enderecoLabel, 12) + 10;
            drawText(page, enderecoLabel, margin, currentY, fontBold, 12);

            // Quebrar o texto do endereço se ele ultrapassar a largura da página
            const enderecoText = `${romaneio.enderecoschool.rua || 'NÃO INFORMADO'}, Nº ${romaneio.enderecoschool.numero || 'NÃO INFORMADO'} - ${romaneio.enderecoschool.bairro || 'NÃO INFORMADO'} - ${romaneio.enderecoschool.cidade || 'NÃO INFORMADO'} - ${romaneio.enderecoschool.estado || 'NÃO INFORMADO'}`;
            const enderecoMaxWidth = pageWidth - margin * 2 - enderecoWidth;
            const enderecoLines = splitText(enderecoText, fontBold, 12, enderecoMaxWidth);

            // Desenhar as linhas quebradas do endereço
            enderecoLines.forEach((line, index) => {
                drawText(page, line, margin + enderecoWidth, currentY - index * lineHeight, fontBold, 12);
            });

            currentY -= enderecoLines.length * lineHeight;

            const foneWidth = fontBold.widthOfTextAtSize('FONE:', 12) + 10;
            drawText(page, 'FONE:', margin, currentY, fontBold, 12);
            drawText(page, romaneio.telefoneEscola || '-', margin + foneWidth, currentY, fontRegular, 12);
            currentY -= 20;

            // ROMANEIO DE DESPACHO
            const currentYear = new Date().getFullYear();
            drawText(
                page,
                `DOCUMENTO DE DESPACHO Nº ${romaneio.numeroEscola}/${currentYear} - GRADE ID: ${romaneio.id} - ${romaneio.tipo ? `${romaneio.tipo} - ` : ''}VOLUMES: ${romaneio.caixas.length}`,
                margin,
                currentY,
                fontBold,
                12,
                rgb(0, 0, 1)
            );
            currentY -= lineHeight + 1;

            // Tipagem de groupedData corrigida para um objeto (e não array)
            /*const groupedData = romaneio.tamanhosQuantidades.reduce((acc, curr) => {
                const groupKey = `${curr.item} ${curr.genero}`;

                // Verifique se o grupo já existe no acumulador, se não, crie-o
                if (!acc[groupKey]) {
                    acc[groupKey] = { items: [], composicao: curr.composicao }; // Atribuindo items e composição corretamente
                }

                // Adiciona o item ao grupo correspondente
                acc[groupKey].items.push(curr);

                return acc;
            }, {} as Record<string, { items: { tamanho: string; quantidade: number }[]; composicao: string }>);*/

            const groupedData = romaneio.tamanhosQuantidades.reduce((acc, curr) => {
                const groupKey = `${curr.item} ${curr.genero}`;

                // Verifique se o projeto é "SANTO ANDRÉ"
                if (romaneio.projectname.trim().toUpperCase() === "SANTO ANDRÉ") {
                    if (curr.item === "KIT UNIFORME") {
                        // Criando o grupo para "KIT INVERNO" com composição "XXX"
                        const groupInvernoKey = `KIT INVERNO ${curr.genero}`;
                        if (!acc[groupInvernoKey]) {
                            acc[groupInvernoKey] = { items: [], composicao: "01 CALÇA, 01 JAQUETA" }; // Novo grupo "KIT INVERNO"
                        }
                        acc[groupInvernoKey].items.push(curr);

                        // Criando o grupo para "KIT VERÃO" com composição "XXX"
                        const groupVeraoKey = `KIT VERÃO ${curr.genero}`;
                        if (!acc[groupVeraoKey]) {
                            acc[groupVeraoKey] = { items: [], composicao: "02 BERMUDAS, 01 CAMISETA GOLA POLO, 02 CAMISETAS DECOTE V" }; // Novo grupo "KIT VERÃO"
                        }
                        acc[groupVeraoKey].items.push(curr);
                    } else {
                        // Se não for "KIT UNIFORME", mantém o item original no grupo
                        acc[groupKey] = acc[groupKey] || { items: [], composicao: curr.composicao };
                        acc[groupKey].items.push(curr);
                    }
                } else {
                    // Se o projeto não for "SANTO ANDRÉ", mantém o item original
                    acc[groupKey] = acc[groupKey] || { items: [], composicao: curr.composicao };
                    acc[groupKey].items.push(curr);
                }

                return acc;
            }, {} as Record<string, { items: { tamanho: string; quantidade: number }[]; composicao: string }>);

            Object.keys(groupedData).forEach((groupKey) => {
                const { composicao } = groupedData[groupKey];
                let { items } = groupedData[groupKey];

                // Ordenar os itens por tamanho
                items = items.sort((a, b) => sortTamanhos(a.tamanho, b.tamanho));

                // Título do grupo
                page.drawLine({
                    start: { x: margin, y: currentY },
                    end: { x: pageWidth - margin, y: currentY },
                    color: rgb(149 / 255, 149 / 255, 149 / 255), // Cor cinza discreto
                    thickness: 0.01 // Linha fina
                });

                currentY -= 15;

                // Exibe o nome do grupo
                if (composicao) {
                    drawText(page, `${groupKey.toUpperCase()} - KIT COMPOSTO POR:`, margin, currentY, fontBold, 10);
                    currentY -= lineHeight + 0.5;
                }

                if (!composicao) {
                    drawText(page, `${groupKey.toUpperCase()}`, margin, currentY, fontBold, 10);
                    currentY -= lineHeight + 0.5;
                    currentY -= 15;
                }

                // **Composição**: Verificar se existe e mostrar acima da linha de separação
                if (composicao) {
                    const composicaoMaxWidth = pageWidth - margin * 2;

                    // Dividir a composição em várias linhas, se necessário
                    const composicaoLines = splitText(composicao, fontRegular, 9, composicaoMaxWidth);

                    /* Exibe "COMPOSIÇÃO:" uma vez
                    drawText(page, "COMPOSIÇÃO DO KIT:", margin, currentY, fontBold, 9);
                    currentY -= lineHeight;*/

                    // Exibe cada linha da composição
                    composicaoLines.forEach((line) => {
                        drawText(page, line, margin, currentY, fontRegular, 8); // Exibe o conteúdo da composição
                        currentY -= lineHeight; // Ajusta a posição para a próxima linha
                    });
                    currentY -= 15; // Ajuste o espaço após a linha
                }

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

            const pdfBytes = await gerarPDFUnic([romaneio]);

            // Adiciona o PDF ao arquivo ZIP
            const safeFileName = `${concatString(romaneio.numberJoin, romaneio.escola, romaneio.numeroEscola)} - ${dataSp}.pdf`.replace(/[\/:*?"<>|]/g, "_");
            zip.file(safeFileName, pdfBytes);
        };

        const zipBytes = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBytes, 'Romaneios.zip');

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
            bg-opacity-20 text-zinc-400 font-semibold text-[13px] min-w-full z-50">
            <Printer className="text-green-300 hover:text-green-500" size={27} strokeWidth={2} />
        </button>
    );
};

export default RomaneiosAll;
