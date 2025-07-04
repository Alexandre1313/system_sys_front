import { Copy } from 'react-feather';
import Caixa from '../../../core/interfaces/Caixa';

export interface EtiquetasLblProps {
    etiquetas: Caixa[];
}

const EtiquetasLbl = ({ etiquetas }: EtiquetasLblProps) => {
    const gerarLBL = () => {
        let lblContent = '';

        // Função para dividir o texto para caber na etiqueta
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
            const { escolaNumber, projeto, qtyCaixa, escolaCaixa, caixaNumber, caixaItem } = etiqueta;

            lblContent += `^XA\n`;  // Início da etiqueta

            // Texto principal (Escola e Projeto)
            lblContent += `^FO50,50\n`; // Posição X,Y
            lblContent += `^A0N,50,50\n`; // Fonte e tamanho
            lblContent += `^FD${escolaNumber} - ${projeto}^FS\n`; // Texto

            // Nome da escola (dividido se for muito longo)
            const escolaLines = splitTextByCharLimit(escolaCaixa, 34);
            let yPosition = 150;
            escolaLines.forEach((line) => {
                lblContent += `^FO50,${yPosition}\n`;
                lblContent += `^A0N,30,30\n`; // Fonte e tamanho
                lblContent += `^FD${line}^FS\n`;
                yPosition += 50;
            });

            // Itens da caixa
            caixaItem.forEach((item) => {
                const itemText = `${item.itemName} - ${item.itemGenero} - ${`TAM: ${item.itemTam}`}`;
                const itemLines = splitTextByCharLimit(itemText, 39);
                itemLines.forEach((line) => {
                    lblContent += `^FO50,${yPosition}\n`;
                    lblContent += `^A0N,30,30\n`;
                    lblContent += `^FD${line}^FS\n`;
                    yPosition += 50;
                });

                // Quantidade do item
                lblContent += `^FO50,${yPosition}\n`;
                lblContent += `^A0N,30,30\n`;
                lblContent += `^FDQuantidade: ${item.itemQty} ${item.itemQty > 1 ? 'unidades' : 'unidade'}^FS\n`;
                yPosition += 50;
            });

            // Total da caixa
            lblContent += `^FO50,${yPosition}\n`;
            lblContent += `^A0N,50,50\n`;
            lblContent += `^FDTotal da caixa: ${String(qtyCaixa).padStart(2, '0')}^FS\n`;
            yPosition += 60;

            // Número da caixa
            lblContent += `^FO50,${yPosition}\n`;
            lblContent += `^A0N,50,50\n`;
            lblContent += `^FDCaixa ${String(caixaNumber).padStart(2, '0')} / ${String(etiquetas.length).padStart(2, '0')}^FS\n`;

            lblContent += `^XZ\n\n`; // Fim da etiqueta
        });

        // Criar o arquivo .LBL
        const blob = new Blob([lblContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'etiquetas.lbl';  // Nome do arquivo a ser baixado
        link.click(); // Baixar o arquivo
    };

    return (
        <button
            type="button"
            onClick={gerarLBL}
            className="flex items-center justify-center px-2 py-1 bg-transparent hover:bg-transparent hover:bg-opacity-30 bg-opacity-20 text-zinc-400 font-semibold text-[13px] w-auto z-50"
        >
            <Copy className="text-orange-300 hover:text-orange-500" size={17} strokeWidth={2} />
        </button>
    );
};

export default EtiquetasLbl;
