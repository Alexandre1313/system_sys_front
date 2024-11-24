import React from 'react';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { GradesRomaneio } from '../../../core';
import BotaoPrinter from '../componentes_Interface/BotaoPrinter';

export interface RomaneiosAllProps {
    romaneios: GradesRomaneio[];
}

const RomaneiosAll = ({ romaneios }: RomaneiosAllProps) => {
    const gerarPDF = async () => {
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        // Configurações da etiqueta
        const pageWidth = 215;  // Largura da etiqueta
        const pageHeight = 145; // Altura da etiqueta
        const margem = 10;      // Margem em torno do conteúdo      

        // Salva e exibe o PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    };

    return (
      <BotaoPrinter stringButtton={"IMPRIMIR TODOS"} iconSize={19} bgColor={"bg-green-800"}
      bgHoverColor={"hover:bg-green-700"} onClick={gerarPDF}/>     
    );
};

export default RomaneiosAll;
