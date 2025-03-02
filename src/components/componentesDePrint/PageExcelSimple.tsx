import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { GradesRomaneio } from "../../../core";
import { FileMinus } from "react-feather";
import { convertSPTime } from '../../../core/utils/tools';

export interface PageExcelSimpleProps {
    expedicaoData: GradesRomaneio[];
}

export default function PageExcelSimple({ expedicaoData }: PageExcelSimpleProps) {
    const generateExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Relatório");

        // Definição de estilos globais
        const headerStyle = {
            font: { bold: true, color: { argb: "FFFFFF" } }, // Cabeçalho com texto branco
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "1b1a1e" } },
            alignment: { horizontal: "center", vertical: "middle", wrapText: true },
        };

        const totalStyle = {
            font: { bold: true, color: { argb: "0d8adb" } },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "1b1a1e" } },
            alignment: { horizontal: "center", wrapText: true },
        };

        const generalStyle = {
            font: { color: { argb: "818181" } },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "1f1f1f" } },
            alignment: { horizontal: "center", wrapText: true },
        };

        //let rowIndex = 1;

        // Cabeçalho: COMPANHIA e GRADEID
        worksheet.addRow([
            "COMPANIA", "GRADEID", "", "", "", "", "", ""
        ]).eachCell((cell) => {
            Object.assign(cell, headerStyle);
        });

        worksheet.addRow([
            expedicaoData[0]?.company || "", expedicaoData[0]?.id || "", "", "", "", "", "", ""
        ]).eachCell((cell) => {
            Object.assign(cell, generalStyle);
        });

        // Linha em branco
        worksheet.addRow([]);

        // Pegando os tamanhos únicos de todos os dados
        const allSizes = new Set<string>();
        expedicaoData.forEach((grade) => {
            grade?.tamanhosQuantidades?.forEach((item) => {
                allSizes.add(item.tamanho);
            });
        });

        // Convertendo para array e ordenando os tamanhos (opcional)
        const sizeArray = Array.from(allSizes).sort();

        // Cabeçalho das escolas e tamanhos dinâmicos
        const headerRow = worksheet.addRow([
            "ESCOLA", ...sizeArray.map((size) => `TAM ${size}`), "TOTAL", "TOTAL VOLUMES"
        ]);

        headerRow.eachCell((cell) => {
            Object.assign(cell, headerStyle);
        });

        //rowIndex += 2;

        // Variáveis para totais gerais
        let totalVolumes = 0;
        const totalSizes: { [key: string]: number } = {};

        // Inicializando os totais de tamanho
        sizeArray.forEach((size) => {
            totalSizes[size] = 0;
        });

        // Dados por escola
        expedicaoData.forEach((grade) => {
            // Inicializando as quantidades de cada tamanho
            const sizeQuantities: { [key: string]: number } = {};
            sizeArray.forEach((size) => {
                sizeQuantities[size] = 0;
            });

            // A quantidade de cada tamanho
            const volumes = grade?.caixas?.length || 0;

            grade?.tamanhosQuantidades?.forEach((item) => {
                if (sizeQuantities.hasOwnProperty(item.tamanho)) {
                    sizeQuantities[item.tamanho] = item.quantidade;
                }
            });

            // Calculando o total para a escola
            const totalForSchool = Object.values(sizeQuantities).reduce((acc, val) => acc + val, 0);

            // Adiciona uma linha para a escola
            const row = worksheet.addRow([
                grade?.escola || "N/A",
                ...sizeArray.map((size) => sizeQuantities[size]),
                totalForSchool,
                volumes
            ]);

            row.eachCell((cell) => {
                Object.assign(cell, generalStyle); // Estilo geral
            });

            // Atualizando os totais gerais
            sizeArray.forEach((size) => {
                totalSizes[size] += sizeQuantities[size];
            });
            totalVolumes += volumes;
        });

        // Linha de totais gerais
        const totalRow = worksheet.addRow([
            "TOTAL GERAL",
            ...sizeArray.map((size) => totalSizes[size]),
            Object.values(totalSizes).reduce((acc, val) => acc + val, 0),
            totalVolumes
        ]);

        totalRow.eachCell((cell) => {
            Object.assign(cell, totalStyle);
        });

        // Ajustando a largura das colunas
        worksheet.columns = [
            { width: 20 },
            ...sizeArray.map(() => ({ width: 10 })),
            { width: 10 },
            { width: 15 }
        ];

        // Gerando o arquivo
        const data = new Date();
        const dataSp = convertSPTime(String(data));

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `RELATORIO_EXPEDICAO_${expedicaoData[0]?.projectname}_${dataSp}.xlsx`);
    };

    return (
        <button
            type="button"
            onClick={generateExcel}
            className="flex items-center justify-center px-2 py-1 bg-transparent hover:bg-transparent hover:bg-opacity-30 
                    bg-opacity-20 text-zinc-400 font-semibold text-[13px] min-w-full z-50 pointer-events-none">
            <FileMinus className="text-yellow-300 hover:text-yellow-500" size={27} strokeWidth={2} />
        </button>
    );
}
