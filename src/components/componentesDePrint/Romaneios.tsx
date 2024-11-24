import React from 'react';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { GradesRomaneio } from '../../../core';
import { Printer } from 'react-feather';

export interface RomaneiosProps {
    romaneios: GradesRomaneio[];
}

const Romaneios = ({ romaneios }: RomaneiosProps) => {
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
        <button
            type="button"
            onClick={gerarPDF}
            className="flex items-center justify-center px-2 py-1 bg-transparent hover:bg-transparent hover:bg-opacity-30 
            bg-opacity-20 text-zinc-400 font-semibold text-[13px] min-w-full z-50">
            <Printer className="text-green-700 hover:text-green-500" size={17} strokeWidth={2} />
        </button>          
    );
};

export default Romaneios;
