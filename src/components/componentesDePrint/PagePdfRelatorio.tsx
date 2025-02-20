import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { GradesRomaneio } from '../../../core';
import { FileMinus } from 'react-feather';

export interface PagePdfRelatoriProps {
    expedicaoData: GradesRomaneio[];
}

export default function PagePdfRelatorio({ expedicaoData }: PagePdfRelatoriProps) {
    const generatedPDF = async () => {
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const pageWidth = 600;
        const pageHeight = 800;
        let page = pdfDoc.addPage([pageWidth, pageHeight]);
        const { height } = page.getSize();
        let yPosition = height - 50;

        const margin = 50;
        const lineHeight = 14;
        const sectionSpacing = 20;
        const colWidths = [100, 100, 100, 100];
        const textColor = rgb(0, 0, 0);
        const highlightColor = rgb(0.2, 0.2, 0.7);

        // Cálculo total de itens e volumes
        const totalItens = expedicaoData.reduce((sum, grade) => sum + grade.tamanhosQuantidades.reduce((subSum, item) => subSum + item.quantidade, 0), 0);
        const totalVolumes = expedicaoData.reduce((sum, grade) => sum + grade.caixas.length, 0);

        // Destaque para total geral
        page.drawText(`TOTAL GERAL`, {
            x: margin,
            y: yPosition,
            size: 16,
            font,
            color: highlightColor,
        });
        yPosition -= lineHeight;
        page.drawText(`Itens Expedidos: ${totalItens}`, {
            x: margin,
            y: yPosition,
            size: 14,
            font,
            color: highlightColor,
        });
        yPosition -= lineHeight;
        page.drawText(`Volumes Totais: ${totalVolumes}`, {
            x: margin,
            y: yPosition,
            size: 14,
            font,
            color: highlightColor,
        });
        yPosition -= sectionSpacing;

        expedicaoData.forEach((grade) => {
            if (yPosition < 150) {
                page = pdfDoc.addPage([pageWidth, pageHeight]);
                yPosition = height - 50;
            }

            // Linha divisória acima do cabeçalho da escola
            page.drawLine({
                start: { x: margin, y: yPosition },
                end: { x: pageWidth - margin, y: yPosition },
                thickness: 2,
                color: highlightColor,
            });
            yPosition -= sectionSpacing;

            // Cabeçalho do projeto
            page.drawText(`Projeto: ${grade.projectname} - Empresa: ${grade.company}`, {
                x: margin,
                y: yPosition,
                size: 12,
                font,
                color: textColor,
            });
            yPosition -= lineHeight;

            page.drawText(`Escola: ${grade.escola} (Nº ${grade.numeroEscola})`, {
                x: margin,
                y: yPosition,
                size: 10,
                font,
                color: textColor,
            });
            yPosition -= lineHeight;

            page.drawText(`Número Join: ${grade.numberJoin} | ID Grade: ${grade.id}`, {
                x: margin,
                y: yPosition,
                size: 10,
                font,
                color: textColor,
            });
            yPosition -= sectionSpacing;

            // Cabeçalho da tabela
            const headers = ['Item', 'Gênero', 'Tamanho', 'Quantidade'];
            headers.forEach((header, i) => {
                page.drawText(header, {
                    x: margin + i * colWidths[i],
                    y: yPosition,
                    size: 10,
                    font,
                    color: textColor,
                });
            });
            yPosition -= lineHeight;

            grade.tamanhosQuantidades.forEach((item) => {
                if (yPosition < 100) {
                    page = pdfDoc.addPage([pageWidth, pageHeight]);
                    yPosition = height - 50;
                }

                const values = [item.item, item.genero, item.tamanho, item.quantidade.toString()];
                values.forEach((value, i) => {
                    page.drawText(value, {
                        x: margin + i * colWidths[i],
                        y: yPosition,
                        size: 10,
                        font,
                        color: textColor,
                    });
                });

                yPosition -= lineHeight;
            });

            yPosition -= sectionSpacing;

            // Total de itens e volumes da escola
            page.drawText(
                `Total de itens: ${grade.tamanhosQuantidades.reduce((sum, item) => sum + item.quantidade, 0)}`,
                { x: margin, y: yPosition, size: 10, font, color: highlightColor }
            );
            yPosition -= lineHeight;

            page.drawText(`Total de volumes: ${grade.caixas.length}`, {
                x: margin,
                y: yPosition,
                size: 10,
                font,
                color: highlightColor,
            });
            yPosition -= sectionSpacing;
        });

        // Salvar e baixar PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        saveAs(blob, 'relatorio_expedicao.pdf');
    };
    return (
        <button
            type="button"
            onClick={generatedPDF}
            className="flex items-center justify-center px-2 py-1 bg-transparent hover:bg-transparent hover:bg-opacity-30 
                    bg-opacity-20 text-zinc-400 font-semibold text-[13px] min-w-full z-50">
            <FileMinus className="text-green-300 hover:text-green-500" size={27} strokeWidth={2} />
        </button>
    );
}
