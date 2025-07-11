import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { FileMinus } from "react-feather";
import { GradesRomaneio } from "../../../core";
import { convertSPTime } from '../../../core/utils/tools';

export interface PageExcelRelatorioFProps {
    expedicaoData: GradesRomaneio[];
}

export default function PageExcelRelatorioF({ expedicaoData }: PageExcelRelatorioFProps) {
    const generateExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Relatório");

        // Definição de estilos globais
        const headerStyle = {
            font: { bold: true, color: { argb: "B1B1B1" } }, // Cabeçalho com texto branco
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "1b1a1e" } },
            alignment: { horizontal: "left", vertical: "middle", wrapText: true },
        };

        const totalStyle = {
            font: { bold: true, color: { argb: "0d8adb" } }, // Total com texto preto
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "1b1a1e" } },
            alignment: { horizontal: "left", wrapText: true },
        };

        const generalStyle = {
            font: { color: { argb: "818181" } }, // Texto geral com fonte preta
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "1f1f1f" } },
            alignment: { horizontal: "left", wrapText: true },
        };

        let rowIndex = 1;

        // Totais Gerais
        worksheet.addRow(["", "", "", "", ""]).eachCell((cell) => {
            Object.assign(cell, { ...headerStyle, font: { color: { argb: "0d8adb" } } });
        });

        const TOTiTENSeXPED = worksheet.addRow([
            "",
            "TOTAL GERAL DE ITENS FALTANTES:",
            expedicaoData.reduce((sum, grade) => sum + grade.tamanhosQuantidades.reduce((s, i) => s + (i.previsto - i.quantidade), 0), 0),
            "",
            ""
        ]);

        const textColors6 = ["000000", "FFFFFF", "0F766E", "0F766E", "06B6D4"];

        TOTiTENSeXPED.eachCell((cell, colNumber) => {
            // Aplica o estilo base primeiro
            Object.assign(cell, totalStyle);

            // Aplica a cor individualmente sem remover outras propriedades da fonte
            if (textColors6[colNumber - 1]) {
                cell.font = {
                    ...cell.font, // Mantém outras propriedades (bold, size, etc.)
                    color: { argb: textColors6[colNumber - 1] },
                    size: 17
                };
            }
        });

        worksheet.addRow(["", "TOTAL GERAL DE VOLUMES:", expedicaoData.reduce((sum, grade) => sum + grade.caixas.length, 0), "", ""]);

        worksheet.addRow(["", "", "", "", ""]).eachCell((cell) => {
            Object.assign(cell, { ...headerStyle, font: { color: { argb: "0d8adb" } } });
        });

        worksheet.addRow([]); // Linha em branco

        // Aplicando estilo aos totais gerais
        worksheet.getRow(rowIndex).font = { bold: true };
        worksheet.getRow(rowIndex + 1).font = { bold: true };
        rowIndex += 3;

        expedicaoData.forEach((grade) => {
            // Linha de PROJETO, ESCOLA e ID GRADE com fundo igual ao do cabeçalho
            worksheet.addRow(["", "", "", "", ""]).eachCell((cell) => {
                Object.assign(cell, { ...headerStyle, font: { color: { argb: "0d8adb" } } });
            });

            const addROJETORow = worksheet.addRow([
                "",
                `PROJETO: ${grade.projectname}`,
                `${grade.company}`,
                `ID GRADE:`,
                `${grade.id}`
            ]);

            const textColors3 = ["00000", "0F766E", "0F766E", "0F766E", "06B6D4"];

            addROJETORow.eachCell((cell, colNumber) => {
                Object.assign(cell, headerStyle); // Aplica o estilo padrão

                // Define uma cor de texto diferente para cada coluna
                if (textColors3[colNumber - 1]) {
                    cell.font = { color: { argb: textColors3[colNumber - 1] }, size: 17 };
                }

                if (colNumber === 4) {
                    cell.alignment = { horizontal: "right" }; // Penúltima célula alinhada à direita
                } else if (colNumber === 5) {
                    cell.alignment = { horizontal: "left" }; // Última célula alinhada à esquerda
                }
            });

            worksheet.addRow(["", `ESCOLA: ${grade.escola} (Nº ${grade.numeroEscola})`, "", "", ""]).eachCell((cell) => {
                Object.assign(cell, { ...headerStyle, font: { color: { argb: "16A33C" }, size: 16 } });
            });

            worksheet.addRow(["", `NÚMERO JOIN: ${grade.numberJoin}`, "", "", ""]).eachCell((cell) => {
                Object.assign(cell, { ...headerStyle, font: { color: { argb: "16A33C" }, size: 16 } });
            });

            worksheet.addRow(["", "", "", "", ""]).eachCell((cell) => {
                Object.assign(cell, { ...headerStyle, font: { color: { argb: "0d8adb" } } });
            });

            worksheet.addRow(["", "ITENS EXPEDIDOS", "", "", ""]).eachCell((cell) => {
                Object.assign(cell, { ...headerStyle, font: { color: { argb: "FFFFFF" }, size: 13, bold: true } });
            });

            worksheet.addRow(["", "", "", "", ""]).eachCell((cell) => {
                Object.assign(cell, { ...headerStyle, font: { color: { argb: "0d8adb" } } });
            });

            rowIndex += 4;

            // Cabeçalho da tabela
            const headerRow = worksheet.addRow(["", "ITEM", "GÊNERO", "TAMANHO", "QUANTIDADE FALTANTE"]);
            headerRow.eachCell((cell) => {
                Object.assign(cell, headerStyle);
            });
            rowIndex++;

            // Dados da tabela
            grade.tamanhosQuantidades.forEach((item) => {
                const row = worksheet.addRow(["", item.item, item.genero, item.tamanho, (item.previsto - item.quantidade)]);

                const textColors5 = ["717171", "717171", "717171", "717171", "16A33C"];

                row.eachCell((cell, colNumber) => {
                    Object.assign(cell, generalStyle); // Aplica o estilo geral (alinhamento à esquerda e fonte preta)                    

                    if (textColors5[colNumber - 1]) {
                        cell.font = { color: { argb: textColors5[colNumber - 1] } };
                    }
                });

                rowIndex++;
            });

            const row = worksheet.addRow(["", "", "", "", ""]);
            row.eachCell((cell) => {
                Object.assign(cell, generalStyle); // Aplica o estilo geral (alinhamento à esquerda e fonte preta)
            });

            worksheet.addRow(["", "", "", "", ""]).eachCell((cell) => {
                Object.assign(cell, { ...headerStyle, font: { color: { argb: "0d8adb" } } });
            });

            // Totais por escola            
            const totalRow = worksheet.addRow([
                "",
                "TOTAL DE ITENS FALTANTES PARA A ESCOLA:",
                grade.tamanhosQuantidades.reduce((sum, item) => sum + (item.previsto - item.quantidade), 0),
                "",
                ""
            ]);

            const textColors = ["00000", "0F766E", "16A33C", "00000", "00000"];

            totalRow.eachCell((cell, colNumber) => {
                Object.assign(cell, totalStyle); // Aplica o estilo padrão

                // Define uma cor de texto diferente para cada coluna
                if (textColors[colNumber - 1]) {
                    cell.font = { color: { argb: textColors[colNumber - 1] }, size: 14 };
                }
            });

            const totalVolumesRow = worksheet.addRow([
                "",
                "TOTAL DE VOLUMES PARA A ESCOLA:",
                grade.caixas.length,
                "",
                ""
            ]);

            const textColors2 = ["00000", "0F766E", "EF3C30", "00000", "00000"];

            totalVolumesRow.eachCell((cell, colNumber) => {
                Object.assign(cell, totalStyle); // Aplica o estilo padrão

                // Define uma cor de texto diferente para cada coluna
                if (textColors2[colNumber - 1]) {
                    cell.font = { color: { argb: textColors2[colNumber - 1] }, size: 14 };
                }
            });

            worksheet.addRow(["", "", "", "", ""]).eachCell((cell) => {
                Object.assign(cell, { ...headerStyle, font: { color: { argb: "0d8adb" } } });
            });

            worksheet.addRow([]); // Linha em branco entre escolas
            rowIndex += 4;
        });

        // Ajustando largura das colunas
        worksheet.columns = [
            { width: 2, style: { alignment: { wrapText: true } } },
            { width: 100, style: { alignment: { wrapText: true } } },
            { width: 40, style: { alignment: { wrapText: true } } },
            { width: 40, style: { alignment: { wrapText: true } } },
            { width: 40, style: { alignment: { wrapText: true } } },
        ];

        // Ajustando a altura das linhas automaticamente para caber o conteúdo
        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                if (cell.text) {
                    const lines = cell.text.split("\n").length;
                    row.height = Math.max(row.height || 15, lines * 20); // Ajuste de altura baseado na quantidade de linhas
                }
            });
        });

        const data = new Date()
        const dataSp = convertSPTime(String(data));

        // Gerando o arquivo
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `RELATORIO_FALTAS_${expedicaoData[0].projectname}_${dataSp}.xlsx`);
    };

    return (
        <button
            type="button"
            onClick={generateExcel}
            className="flex items-center justify-center px-2 py-1 bg-transparent hover:bg-transparent hover:bg-opacity-30 
                    bg-opacity-20 text-zinc-400 font-semibold text-[13px] min-w-full z-50">
            <FileMinus className="text-cyan-300 hover:text-cyan-500" size={27} strokeWidth={2} />
        </button>
    );
}
