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
            font: { bold: true, color: { argb: "FFFFFF" } },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "4F81BD" } },
            alignment: { horizontal: "center", vertical: "middle" },
        };

        const totalStyle = {
            font: { bold: true },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } },
            alignment: { horizontal: "center" },
        };

        let rowIndex = 1;

        // Totais Gerais
        worksheet.addRow(["TOTAL GERAL DE ITENS EXPEDIDOS:", "", "", expedicaoData.reduce((sum, grade) => sum + grade.tamanhosQuantidades.reduce((s, i) => s + i.quantidade, 0), 0)]);
        worksheet.addRow(["TOTAL GERAL DE VOLUMES:", "", "", expedicaoData.reduce((sum, grade) => sum + grade.caixas.length, 0)]);
        worksheet.addRow([]); // Linha em branco

        // Aplicando estilo aos totais gerais
        worksheet.getRow(rowIndex).font = { bold: true };
        worksheet.getRow(rowIndex + 1).font = { bold: true };
        rowIndex += 3;

        expedicaoData.forEach((grade) => {
            worksheet.addRow([`PROJETO: ${grade.projectname}`, `EMPRESA: ${grade.company}`, "", ""]).font = { bold: true };
            worksheet.addRow([`ESCOLA: ${grade.escola} (Nº ${grade.numeroEscola})`, `NÚMERO JOIN: ${grade.numberJoin}`, "", ""]).font = { bold: true };
            worksheet.addRow([`ID GRADE: ${grade.id}`, "", "", ""]).font = { bold: true };
            worksheet.addRow([]); // Linha em branco
            rowIndex += 4;

            // Cabeçalho da tabela
            const headerRow = worksheet.addRow(["ITEM", "GÊNERO", "TAMANHO", "QUANTIDADE"]);
            headerRow.eachCell((cell) => {
                Object.assign(cell, headerStyle);
            });
            rowIndex++;

            // Dados da tabela
            grade.tamanhosQuantidades.forEach((item) => {
                worksheet.addRow([item.item, item.genero, item.tamanho, item.quantidade]);
                rowIndex++;
            });

            // Totais por escola
            worksheet.addRow([]);
            const totalRow = worksheet.addRow(["TOTAL DE ITENS NA ESCOLA:", "", "", grade.tamanhosQuantidades.reduce((sum, item) => sum + item.quantidade, 0)]);
            totalRow.eachCell((cell) => Object.assign(cell, totalStyle));

            const totalVolumesRow = worksheet.addRow(["TOTAL DE VOLUMES NA ESCOLA:", "", "", grade.caixas.length]);
            totalVolumesRow.eachCell((cell) => Object.assign(cell, totalStyle));

            worksheet.addRow([]); // Linha em branco entre escolas
            rowIndex += 4;
        });

        // Ajustando largura das colunas
        worksheet.columns = [
            { width: 30 },
            { width: 20 },
            { width: 20 },
            { width: 15 },
        ];

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
            <FileMinus className="text-green-300 hover:text-green-500" size={27} strokeWidth={2} />
        </button>
    );
}
