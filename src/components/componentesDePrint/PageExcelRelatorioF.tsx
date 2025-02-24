import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { GradesRomaneio } from "../../../core";
import { FileMinus } from "react-feather";

export interface PageExcelRelatorioProps {
    expedicaoData: GradesRomaneio[];
}

export default function PageExcelRelatorio({ expedicaoData }: PageExcelRelatorioProps) {
    const generateExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Relatório");

        // Definição de estilos globais
        const headerStyle = {
            font: { bold: true, color: { argb: "FFFFFF" } }, // Cabeçalho com texto branco
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "C9C9C9" } },
            alignment: { horizontal: "left", vertical: "middle", wrapText: true },
        };

        const totalStyle = {
            font: { bold: true, color: { argb: "000000" } }, // Total com texto preto
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } },
            alignment: { horizontal: "left", wrapText: true },
        };

        const generalStyle = {
            font: { color: { argb: "000000" } }, // Texto geral com fonte preta
            alignment: { horizontal: "left", wrapText: true },
        };

        let rowIndex = 1;

        // Totais Gerais
        worksheet.addRow(["TOTAL GERAL DE ITENS EXPEDIDOS:", "", "", expedicaoData.reduce((sum, grade) => sum + grade.tamanhosQuantidades.reduce((s, i) => s + i.previsto, 0), 0)]);
        worksheet.addRow(["TOTAL GERAL DE VOLUMES:", "", "", expedicaoData.reduce((sum, grade) => sum + grade.caixas.length, 0)]);
        worksheet.addRow([]); // Linha em branco

        // Aplicando estilo aos totais gerais
        worksheet.getRow(rowIndex).font = { bold: true };
        worksheet.getRow(rowIndex + 1).font = { bold: true };
        rowIndex += 3;

        expedicaoData.forEach((grade) => {
            // Linha de PROJETO, ESCOLA e ID GRADE com fundo igual ao do cabeçalho
            worksheet.addRow([`PROJETO: ${grade.projectname}`, `EMPRESA: ${grade.company}`, "", ""]).eachCell((cell) => {
                Object.assign(cell, { ...headerStyle, font: { color: { argb: "000000" } } }); // Alinhamento e fonte preta
            });
            worksheet.addRow([`ESCOLA: ${grade.escola} (Nº ${grade.numeroEscola})`, `NÚMERO JOIN: ${grade.numberJoin}`, "", ""]).eachCell((cell) => {
                Object.assign(cell, { ...headerStyle, font: { color: { argb: "000000" } } });
            });
            worksheet.addRow([`ID GRADE: ${grade.id}`, "", "", ""]).eachCell((cell) => {
                Object.assign(cell, { ...headerStyle, font: { color: { argb: "000000" } } });
            });
            worksheet.addRow(["", "", "", ""]).eachCell((cell) => {
                Object.assign(cell, { ...headerStyle, font: { color: { argb: "000000" } } });
            });
           
            rowIndex += 4;

            // Cabeçalho da tabela
            const headerRow = worksheet.addRow(["ITEM", "GÊNERO", "TAMANHO", "QUANTIDADE"]);
            headerRow.eachCell((cell) => {
                Object.assign(cell, headerStyle);
            });
            rowIndex++;

            // Dados da tabela
            grade.tamanhosQuantidades.forEach((item) => {
                const row = worksheet.addRow([item.item, item.genero, item.tamanho, item.previsto]);
                row.eachCell((cell) => {
                    Object.assign(cell, generalStyle); // Aplica o estilo geral (alinhamento à esquerda e fonte preta)
                });
                rowIndex++;
            });

            // Totais por escola
            worksheet.addRow([]);
            const totalRow = worksheet.addRow(["TOTAL DE ITENS NA ESCOLA:", "", "", grade.tamanhosQuantidades.reduce((sum, item) => sum + item.previsto, 0)]);
            totalRow.eachCell((cell) => Object.assign(cell, totalStyle));

            const totalVolumesRow = worksheet.addRow(["TOTAL DE VOLUMES NA ESCOLA:", "", "", grade.caixas.length]);
            totalVolumesRow.eachCell((cell) => Object.assign(cell, totalStyle));

            worksheet.addRow([]); // Linha em branco entre escolas
            rowIndex += 4;
        });

        // Ajustando largura das colunas
        worksheet.columns = [
            { width: 60, style: { alignment: { wrapText: true } } },
            { width: 40, style: { alignment: { wrapText: true } } },
            { width: 40, style: { alignment: { wrapText: true } } },
            { width: 30, style: { alignment: { wrapText: true } } },
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

        // Gerando o arquivo
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), "relatorio_expedicao.xlsx");
    };

    return (
        <button
            type="button"
            onClick={generateExcel}
            className="flex items-center justify-center px-2 py-1 bg-transparent hover:bg-transparent hover:bg-opacity-30 
                    bg-opacity-20 text-zinc-400 font-semibold text-[13px] min-w-full z-50">
            <FileMinus className="text-purple-700 hover:text-purple-600" size={27} strokeWidth={2} />
        </button>
    );
}
