import React from 'react';
import { Caixa } from '../../../core';
import { Copy } from 'react-feather';

// Define o tipo para as propriedades da etiqueta
export interface EtiquetaProps {
    etiquetas: Caixa[];
}

const EtiquetasZpl = ({ etiquetas }: EtiquetaProps) => {

    // Função para gerar o ZPL com base nas etiquetas
    const gerarZPL = (etiquetas: Caixa[]): string => {
        let zpl = '';

        etiquetas.forEach((etiqueta) => {
            const { escolaNumber, projeto, qtyCaixa, escolaCaixa, caixaNumber, caixaItem } = etiqueta;

            zpl += `^XA\n`;  // Início de uma nova etiqueta
            zpl += `^FO50,50^B3N,N,100,Y,N^FD>:123456^FS\n`; // Exemplo de código de barras
            zpl += `^FO50,150^A0N,50,50^FD${escolaNumber} - ${projeto}^FS\n`; // Título

            // Nome da escola (com quebra de linha a cada 34 caracteres)
            const escolaLines = splitTextByCharLimit(escolaCaixa, 34);
            escolaLines.forEach((line, index) => {
                zpl += `^FO50,${200 + (index * 50)}^A0N,30,30^FD${line}^FS\n`;
            });

            // Itens da caixa
            caixaItem.forEach((item, index) => {
                const itemText = `${item.itemName} - ${item.itemGenero} - Tamanho: ${item.itemTam}`;
                zpl += `^FO50,${250 + (index * 50)}^A0N,30,30^FD${itemText}^FS\n`;
                zpl += `^FO50,${300 + (index * 50)}^A0N,30,30^FDQuantidade: ${item.itemQty} unidades^FS\n`;
            });

            // Total da caixa
            zpl += `^FO50,${350 + (caixaItem.length * 50)}^A0N,30,30^FDTotal da caixa: ${qtyCaixa}^FS\n`;

            // Número da caixa
            zpl += `^FO50,${400 + (caixaItem.length * 50)}^A0N,30,30^FDCaixa ${caixaNumber} / ${etiquetas.length}^FS\n`;

            zpl += `^XZ\n`;  // Fim de uma etiqueta
        });

        return zpl;
    };

    // Função para dividir o texto em várias linhas, sem ultrapassar o limite de caracteres
    const splitTextByCharLimit = (text: string, charLimit: number): string[] => {
        const words = text.split(' ');
        let line = '';
        const lines: string[] = [];

        words.forEach((word) => {
            const testLine = line ? `${line} ${word}` : word;
            if (testLine.length <= charLimit) {
                line = testLine;
            } else {
                lines.push(line);
                line = word;
            }
        });
        if (line) lines.push(line);
        return lines;
    };

    // Função para enviar o ZPL para a API
    const enviarParaAPI = async (zpl: string) => {        
        try {
            const response = await fetch('/api/impressao', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ etiquetas: zpl }),
            });

            const data = await response.json();

            if (data.error) {
                alert('Erro ao imprimir: ' + data.error);
            } else {
                alert('Impressão enviada com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao comunicar com a API de impressão:', error);
            alert('Erro ao comunicar com a API de impressão.');
        }
    };

    // Função chamada ao clicar no botão
    const gerarEImprimirEtiquetas = () => {
        const zpl = gerarZPL(etiquetas);       
        enviarParaAPI(zpl);
    };

    return (
        <button
            type="button"
            onClick={gerarEImprimirEtiquetas}
            className="flex items-center justify-center px-2 py-1 bg-transparent hover:bg-transparent hover:bg-opacity-30 
            bg-opacity-20 text-zinc-400 font-semibold text-[13px] w-auto z-50"
        >
            <Copy className="text-orange-300 hover:text-orange-500" size={17} strokeWidth={2} />
        </button>
    );
};

export default EtiquetasZpl;
