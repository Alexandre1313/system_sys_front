import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { GradesRomaneio } from "../../../core";
import { FileMinus } from "react-feather";
import { convertSPTime } from "../../../core/utils/tools";

export interface PageExcelSimpleProps {
  expedicaoData: GradesRomaneio[];
}

export default function PageExcelSimple({ expedicaoData }: PageExcelSimpleProps) {
  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("EXPEDIÇÃO");

    // Estilos para colunas específicas  
    const totalStyle = {
      font: { bold: true, color: { argb: "FFFFFF" }, size: 14 },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "4c4c4c" } },
      alignment: { horizontal: "center", vertical: "middle", wrapText: true },
      border: {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      },
    };

    const schoolStyle = {
      font: { color: { argb: "FFFFFF" }, size: 12 },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "4b92db" } },
      alignment: { horizontal: "center", vertical: "middle", wrapText: true },
      border: {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      },
    };

    const volumeColumnStyle = {
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "f9c0c0" } },
      alignment: { horizontal: "center", vertical: "middle", wrapText: true },
      border: {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      },
    };

    const sizeHeaderStyle = {
      font: { bold: true, color: { argb: "FFFFFF" } },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "7f7f7f" } },
      alignment: { horizontal: "center", vertical: "middle", wrapText: true },
      border: {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      },
    };

    const volumeTotalStyle = {
      font: { bold: true, color: { argb: "FFFFFF" }, size: 12 },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "f5a623" } },
      alignment: { horizontal: "center", vertical: "middle", wrapText: true },
      border: {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      },
    };

    // Novo estilo para TOTAL GÊNERO com uma cor diferente
    const genderTotalStyle = {
      font: { bold: true, color: { argb: "FFFFFF" }, size: 12 },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "4b8e8e" } },
      alignment: { horizontal: "center", vertical: "middle", wrapText: true },
      border: {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      },
    };   

    const genderSizes: { [key: string]: Set<string> } = {};

    expedicaoData.forEach((grade) => {
      grade?.tamanhosQuantidades?.forEach((item) => {
        if (item.genero) {
          if (!genderSizes[item.genero]) {
            genderSizes[item.genero] = new Set<string>();
          }
          genderSizes[item.genero].add(item.tamanho);
        }
      });
    });

    const sortedGenderSizes: { [key: string]: string[] } = {};
    Object.keys(genderSizes).forEach((gender) => {
      sortedGenderSizes[gender] = Array.from(genderSizes[gender]).sort();
    });

    const headerRow = worksheet.addRow([
      "ESCOLA",
      ...Object.keys(sortedGenderSizes).flatMap((gender) => [
        ...sortedGenderSizes[gender].map((size) => `TAM ${size}`),
        `TOTAL ${gender.toUpperCase()}`,
      ]),
      "TOTAL",
      "TOTAL VOLUMES",
    ]);

    headerRow.eachCell((cell, colNumber) => {
      if (colNumber === 1) {
        Object.assign(cell, schoolStyle);
      } else if (colNumber <= headerRow.cellCount - 2) {
        Object.assign(cell, sizeHeaderStyle);
      } else if (colNumber === headerRow.cellCount - 1) {
        Object.assign(cell, volumeColumnStyle);
      }else if (colNumber === headerRow.cellCount) {
        Object.assign(cell, volumeColumnStyle);
      }
    });

    let totalVolumes = 0;
    const totalSizes: { [key: string]: number } = {};

    Object.keys(sortedGenderSizes).forEach((gender) => {
      sortedGenderSizes[gender].forEach((size) => {
        totalSizes[`${gender}_${size}`] = 0;
      });
    });

    expedicaoData.forEach((grade) => {
      const sizeQuantities: { [key: string]: number } = {};
      Object.keys(sortedGenderSizes).forEach((gender) => {
        sortedGenderSizes[gender].forEach((size) => {
          sizeQuantities[`${gender}_${size}`] = 0;
        });
      });

      const volumes = grade?.caixas?.length || 0;

      grade?.tamanhosQuantidades?.forEach((item) => {
        const key = `${item.genero}_${item.tamanho}`;
        if (sizeQuantities.hasOwnProperty(key)) {
          sizeQuantities[key] = item.quantidade;
        }
      });

      const totalForSchool = Object.values(sizeQuantities).reduce((acc, val) => acc + val, 0);
      Object.keys(sortedGenderSizes).reduce((acc, gender) => {
        const totalGenderSize = sortedGenderSizes[gender].reduce(
          (accSize, size) => accSize + sizeQuantities[`${gender}_${size}`],
          0
        );
        totalSizes[`${gender}`] = totalGenderSize;
        return acc + totalGenderSize;
      }, 0);

      const row = worksheet.addRow([
        grade?.escola || "N/A",
        ...Object.keys(sortedGenderSizes).flatMap((gender) => [
          ...sortedGenderSizes[gender].map((size) => sizeQuantities[`${gender}_${size}`] || 0),
          totalSizes[`${gender}`] || 0,
        ]),
        totalForSchool,
        volumes,
      ]);

      row.eachCell((cell, colNumber) => {
        if (colNumber === 1) {
          Object.assign(cell, schoolStyle);
        } else if (colNumber === headerRow.cellCount - 1) {
          Object.assign(cell, volumeTotalStyle);
        } else if (colNumber > 1 && colNumber <= headerRow.cellCount - 2) {
          Object.assign(cell, volumeColumnStyle);
        } else if (colNumber === headerRow.cellCount - 2) {
          Object.assign(cell, genderTotalStyle); // Aplica o estilo correto para TOTAL GÊNERO
        }
      });

      Object.keys(sortedGenderSizes).forEach((gender) => {
        sortedGenderSizes[gender].forEach((size) => {
          totalSizes[`${gender}_${size}`] += sizeQuantities[`${gender}_${size}`];
        });
      });
      totalVolumes += volumes;
    });

    const totalRow = worksheet.addRow([
      "TOTAL GERAL",
      ...Object.keys(sortedGenderSizes).flatMap((gender) => [
        ...sortedGenderSizes[gender].map((size) => totalSizes[`${gender}_${size}`] || 0),
        totalSizes[`${gender}`] || 0,
      ]),
      Object.values(totalSizes).reduce((acc, val) => acc + val, 0),
      totalVolumes,
    ]);

    totalRow.eachCell((cell) => {
      Object.assign(cell, totalStyle);
    });

    // Ajustando a largura das colunas
    worksheet.columns = [
      { width: 55 }, // Maior largura para a coluna ESCOLA
      ...Object.keys(sortedGenderSizes).flatMap((gender) => [
        ...sortedGenderSizes[gender].map(() => ({ width: 10 })), // Tamanhos
        { width: 7 }, // Total por gênero
      ]),
      { width: 12 }, // Total geral
      { width: 12 }, // Total volumes, um pouco maior
      { width: 12 },
    ];

    const data = new Date();
    const dataSp = convertSPTime(String(data));

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer]),
      `RELATORIO_EXPEDICAO_${expedicaoData[0]?.projectname}_${dataSp}.xlsx`
    );
  };

  return (
    <button
      type="button"
      onClick={generateExcel}
      className="flex items-center justify-center px-2 py-1 bg-transparent hover:bg-transparent hover:bg-opacity-30 
              bg-opacity-20 text-zinc-400 font-semibold text-[13px] min-w-full z-50 pointer-events-auto"
    >
      <FileMinus className="text-yellow-300 hover:text-yellow-500" size={27} strokeWidth={2} />
    </button>
  );
}
