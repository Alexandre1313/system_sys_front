import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { GradesRomaneio } from "../../../core";
import { Download } from "react-feather";
import { convertMilharFormatCUB, convertMilharFormatKG, convertSPTime } from "../../../core/utils/tools";

export interface PageExcelNewProps {
    expedicaoDataB: GradesRomaneio[];
}

export default function PageExcelNew({ expedicaoDataB }: PageExcelNewProps) {

    // Função para ordenar tamanhos
    const ordenarTamanhos = (tamanhos: string[]): string[] => {
        const numTamanhos = tamanhos.filter(tamanho => /^[0-9]+$/.test(tamanho)); // Filtra tamanhos numéricos
        const letraTamanhos = tamanhos.filter(tamanho => !/^[0-9]+$/.test(tamanho)); // Filtra tamanhos com letras

        // Ordena tamanhos numéricos (convertendo para inteiro)
        numTamanhos.sort((a, b) => parseInt(a) - parseInt(b));

        // Ordena tamanhos com letras conforme a ordem desejada
        const ordem = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'EG', 'EX', 'EGG', 'EXG', 'XGG', 'G1', 'G2', 'G3', 'EG/LG'];
        letraTamanhos.sort((a, b) => ordem.indexOf(a) - ordem.indexOf(b));

        return [...numTamanhos, ...letraTamanhos];
    };

    const formatarData = (data: string | undefined): string => {
        if (!data) return "N/A"; // Caso não tenha data, retorna "N/A"

        // Regex para capturar datas no formato dd/mm/yyyy hh:mm:ss
        const regex = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;
        const match = data.match(regex);

        if (!match) return "N/A"; // Se a data não tem o formato esperado, retorna "N/A"

        // Desestrutura a data capturada pela regex (não precisamos do primeiro valor)
        const [, dia, mes, ano] = match;

        // Retorna a data no formato dd/mm/yyyy (sem as horas)
        return `${dia}/${mes}/${ano}`;
    };

    const ordenarGrades = (grades: GradesRomaneio[]): GradesRomaneio[] => {
        return grades.sort((a, b) => {
            // Converte as datas de 'a' e 'b' para objetos Date, ignorando a hora
            const dateA = new Date(a.update.split(' ')[0].split('/').reverse().join('/')); // Formata a data para ser comparada
            const dateB = new Date(b.update.split(' ')[0].split('/').reverse().join('/')); // Formata a data para ser comparada    
            // Comparação das datas
            if (dateA > dateB) return -1; // Mais recente primeiro
            if (dateA < dateB) return 1;  // Mais antiga primeiro    
            const numeroEscolaA = parseInt(a.numeroEscola, 10);
            const numeroEscolaB = parseInt(b.numeroEscola, 10);
            return numeroEscolaA - numeroEscolaB;
        });
    };

    function mergeSchools(schoolsArray: GradesRomaneio[]) {
        const mergedSchools: GradesRomaneio[] = [];

        schoolsArray.forEach(school => {
            const existingSchool = mergedSchools.find(item => item.numeroEscola === school.numeroEscola);

            if (existingSchool) {
                // Mescla os arrays
                existingSchool.caixas = [...existingSchool.caixas, ...school.caixas];
                existingSchool.tamanhosQuantidades = [
                    ...existingSchool.tamanhosQuantidades,
                    ...school.tamanhosQuantidades
                ];

                // Soma o peso e a cubagem corretamente
                existingSchool.peso = (existingSchool.peso || 0) + (school.peso || 0);
                existingSchool.cubagem = (existingSchool.cubagem || 0) + (school.cubagem || 0);
            } else {
                // Cria cópia do objeto para evitar mutações indesejadas
                mergedSchools.push({ ...school });
            }
        });

        return mergedSchools;
    }

    const expedicaoDataFilterNormal = expedicaoDataB.filter((grade) => !grade.tipo);
    const mergeSchols = mergeSchools(expedicaoDataFilterNormal);
    const expedicaoData = ordenarGrades(mergeSchols);

    const expedicaoDataFilterRepo = expedicaoDataB.filter((grade) => grade.tipo?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() === "REPOSICAO");
    const mergeSchols2 = mergeSchools(expedicaoDataFilterRepo);
    const expedicaoDataRepo = ordenarGrades(mergeSchols2);

    const generateExcel = async () => {
        const workbook = new ExcelJS.Workbook();

        const totalVolumes2 = {
            font: {
                bold: true,
                color: { argb: "000000" } // Cor da fonte branca
            },
            fill: {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "A8D08D" } // Cor de fundo verde claro
            },
            alignment: {
                horizontal: "center",
                vertical: "middle",
                wrapText: true
            },
            border: {
                top: { style: "thin", color: { argb: "000000" } },
                //left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "000000" } },
                //right: { style: "thin", color: { argb: "000000" } },
            },
        };

        const totalVolumes3 = {
            font: {
                bold: true,
                color: { argb: "000000" } // Cor da fonte branca
            },
            fill: {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "B1A0C7" } // Cor de fundo verde claro
            },
            alignment: {
                horizontal: "center",
                vertical: "middle",
                wrapText: true
            },
            border: {
                top: { style: "thin", color: { argb: "000000" } },
                //left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "000000" } },
                //right: { style: "thin", color: { argb: "000000" } },
            },
        };

        const totalVolumes4 = {
            font: {
                bold: true,
                color: { argb: "000000" } // Cor da fonte branca
            },
            fill: {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "538DD5" } // Cor de fundo verde claro
            },
            alignment: {
                horizontal: "center",
                vertical: "middle",
                wrapText: true
            },
            border: {
                top: { style: "thin", color: { argb: "000000" } },
                //left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "000000" } },
                //right: { style: "thin", color: { argb: "000000" } },
            },
        };

        const generalStyle = {
            font: { color: { argb: "a1a1a1" }, size: 13 },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "000000" } },
            alignment: { horizontal: "center", vertical: "middle", wrapText: true },
            border: {
                top: { style: "thin", color: { argb: "000000" } },
                //left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "000000" } },
                //right: { style: "thin", color: { argb: "000000" } },
            },
        };

        const generalStyle2 = {
            font: { color: { argb: "A8D08D" }, size: 13 },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "000000" } },
            alignment: { horizontal: "center", vertical: "middle", wrapText: true },
            border: {
                top: { style: "thin", color: { argb: "000000" } },
                //left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "000000" } },
                //right: { style: "thin", color: { argb: "000000" } },
            },
        };

        const generalStyle3 = {
            font: { color: { argb: "00FFFF" }, size: 13 },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "000000" } },
            alignment: { horizontal: "center", vertical: "middle", wrapText: true },
            border: {
                top: { style: "thin", color: { argb: "000000" } },
                //left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "000000" } },
                //right: { style: "thin", color: { argb: "000000" } },
            },
        };

        const generalStyle4 = {
            font: { color: { argb: "00FFFF" }, size: 13 },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "000000" } },
            alignment: { horizontal: "center", vertical: "middle", wrapText: true },
            border: {
                top: { style: "thin", color: { argb: "000000" } },
                //left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "000000" } },
                //right: { style: "thin", color: { argb: "000000" } },
            },
        };

        const generalStyle5 = {
            font: { color: { argb: "00FFFF" }, size: 13 },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "000000" } },
            alignment: { horizontal: "center", vertical: "middle", wrapText: true },
            border: {
                top: { style: "thin", color: { argb: "000000" } },
                //left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "000000" } },
                //right: { style: "thin", color: { argb: "000000" } },
            },
        };

        const generalStyle6 = {
            font: { color: { argb: "00FFFF" }, size: 13 },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "000000" } },
            alignment: { horizontal: "center", vertical: "middle", wrapText: true },
            border: {
                top: { style: "thin", color: { argb: "000000" } },
                //left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "000000" } },
                //right: { style: "thin", color: { argb: "000000" } },
            },
        };

        const totalStyle2 = {
            font: { bold: true, color: { argb: "A8D08D" } },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "4c4c4c" } },
            alignment: { horizontal: "center", vertical: "middle", wrapText: true },
            border: {
                top: { style: "thin", color: { argb: "000000" } },
                //left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "000000" } },
                //right: { style: "thin", color: { argb: "000000" } },
            },
        };

        const totalStyle = {
            font: { bold: true, color: { argb: "818181" } },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "4c4c4c" } },
            alignment: { horizontal: "center", vertical: "middle", wrapText: true },
            border: {
                top: { style: "thin", color: { argb: "000000" } },
                //left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "000000" } },
                //right: { style: "thin", color: { argb: "000000" } },
            },
        };

        const schoolStyle = {
            font: { color: { argb: "FFFFFF" }, size: 12 },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "2e2e2e" } },
            alignment: { horizontal: "center", vertical: "middle", wrapText: true },
            border: {
                top: { style: "thin", color: { argb: "000000" } },
                //left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "000000" } },
                //right: { style: "thin", color: { argb: "000000" } },
            },
        };

        const genderHeaderStyle = {
            font: { bold: true, color: { argb: "FFFFFF" } },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "7f7f7f" } },
            alignment: { horizontal: "center", vertical: "middle", wrapText: true },
            border: {
                top: { style: "thin", color: { argb: "000000" } },
                //left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "000000" } },
                //right: { style: "thin", color: { argb: "000000" } },
            },
        };

        const volumeTotalStyle = {
            font: { bold: true, color: { argb: "FFFFFF" }, size: 12 },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "f5a623" } },
            alignment: { horizontal: "center", vertical: "middle", wrapText: true },
            border: {
                top: { style: "thin", color: { argb: "000000" } },
                //left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "000000" } },
                //right: { style: "thin", color: { argb: "000000" } },
            },
        };

        // Novo estilo para TOTAL GÊNERO com uma cor diferente
        const genderTotalStyle = {
            font: { bold: true, color: { argb: "FFFFFF" }, size: 12 },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "ffffff" } },
            alignment: { horizontal: "center", vertical: "middle", wrapText: true },
            border: {
                top: { style: "thin", color: { argb: "000000" } },
                //left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "000000" } },
                //right: { style: "thin", color: { argb: "000000" } },
            },
        };

        // Estilos para os tons de cinza ultra-sutis
        const volumeColumnStyleGrayLightest = {
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "F8F8F8" } }, // Cinza quase branco
            alignment: { horizontal: "center", vertical: "middle", wrapText: true },
            border: {
                top: { style: "thin", color: { argb: "F8F8F8" } },
                //left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "F8F8F8" } },
                //right: { style: "thin", color: { argb: "000000" } },
            },
        };

        const volumeColumnStyleGraySlightlyDarker = {
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "EFEFEF" } }, // Cinza muito suave, mais escuro
            alignment: { horizontal: "center", vertical: "middle", wrapText: true },
            border: {
                top: { style: "thin", color: { argb: "EFEFEF" } },
                //left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "EFEFEF" } },
                //right: { style: "thin", color: { argb: "000000" } },
            },
        };

        if (expedicaoData.length > 0) {
            const worksheet = workbook.addWorksheet("EXPEDIÇÃO");
            worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

            const itemGenderSizes: { [key: string]: Set<string> } = {};

            expedicaoData.forEach((grade) => {
                grade?.tamanhosQuantidades?.forEach((item) => {
                    if (item.item && item.genero) {
                        // Criando uma chave composta (item + genero)
                        const key = `${item.item}_${item.genero}`;

                        // Se ainda não existir a chave para essa combinação, cria um Set vazio
                        if (!itemGenderSizes[key]) {
                            itemGenderSizes[key] = new Set<string>();
                        }

                        // Adicionando o tamanho ao Set correspondente
                        itemGenderSizes[key].add(item.tamanho);
                    }
                });
            });

            const sortedItemGenderSizes: { [key: string]: string[] } = {};

            Object.keys(itemGenderSizes).forEach((key) => {
                // Use a função ordenarTamanhos para garantir a ordem correta
                sortedItemGenderSizes[key] = ordenarTamanhos(Array.from(itemGenderSizes[key]));
            });

            const headerRow = worksheet.addRow([
                "", // Coluna vazia inicial
                "UNIDADE ESCOLAR", // Coluna "ESCOLA"
                "FATURADO POR", // Coluna "FATURADO POR"
                "TÉRMINO EM",
                ...Object.keys(sortedItemGenderSizes).flatMap((key) => [
                    ...sortedItemGenderSizes[key].map((size) => `TAM ${size}`), // Tamanhos por item + gênero
                    `TOTAL ${key.toUpperCase()}`, // Total por item + gênero
                ]),
                "TOTAL", // Coluna para o total geral por escola
                "TOTAL VOLUMES",
                "TOTAL PESO Kg",
                "TOTAL CUBAGEM m³",
                "",
            ]);

            // Aplicando os estilos nas células do cabeçalho
            headerRow.eachCell((cell, colNumber) => {
                const cellValue = cell.value?.toString().toUpperCase() || '';

                if (colNumber === 1) {
                    Object.assign(cell, generalStyle); // Estilo para a primeira coluna (vazia ou "ESCOLA")
                } else if (colNumber === 2) {
                    Object.assign(cell, generalStyle); // Estilo para "ESCOLA"
                } else if (colNumber === 3) {
                    Object.assign(cell, generalStyle); // Estilo para "FATURADO POR"
                } else if (colNumber === 4) {
                    Object.assign(cell, generalStyle); // Estilo para "FATURADO POR"
                } else if (colNumber <= headerRow.cellCount) {
                    Object.assign(cell, generalStyle); // Estilo para as colunas de tamanhos
                } else if (colNumber === headerRow.cellCount - 4) {
                    Object.assign(cell, generalStyle); // Estilo para a coluna "TOTAL"
                } else if (colNumber === headerRow.cellCount - 3) {
                    Object.assign(cell, generalStyle); // Estilo para a última coluna "TOTAL VOLUMES"
                } else if (colNumber === headerRow.cellCount - 2) {
                    Object.assign(cell, generalStyle); // Estilo para a última coluna "TOTAL VOLUMES"
                } else if (colNumber === headerRow.cellCount - 1) {
                    Object.assign(cell, generalStyle); // Estilo para a última coluna "TOTAL VOLUMES"
                } else if (colNumber === headerRow.cellCount) {
                    Object.assign(cell, generalStyle); // Estilo para a última coluna "TOTAL VOLUMES"
                }

                if (cellValue.includes('FEMININO') || cellValue.includes('MASCULINO') || cellValue.includes('UNISSEX')) {
                    Object.assign(cell, genderHeaderStyle); // Estilo específico para FEMININO, UNISSEX ou MASCULINO
                }

            });

            let totalVolumes = 0;
            let totalGeral = 0;
            let totalPeso = 0;
            let totalCubagem = 0

            const totalSizes: { [key: string]: number } = {};

            // Inicializando o totalSizes para cada combinação de item + gênero + tamanho
            Object.keys(sortedItemGenderSizes).forEach((key) => {
                sortedItemGenderSizes[key].forEach((size) => {
                    totalSizes[`${key}_${size}`] = 0;
                });
            });

            expedicaoData.forEach((grade) => {
                const sizeQuantities: { [key: string]: number } = {};

                // Inicializando sizeQuantities para cada combinação de item + gênero + tamanho
                Object.keys(sortedItemGenderSizes).forEach((key) => {
                    sortedItemGenderSizes[key].forEach((size) => {
                        sizeQuantities[`${key}_${size}`] = 0;
                    });
                });

                const volumes = grade?.caixas?.length || 0;
                const cubagem = grade.cubagem || 0;
                const peso = Math.ceil(grade.peso || 0);

                totalPeso += peso;
                totalCubagem += cubagem;

                // Contabilizando as quantidades de tamanhos (somando valores corretamente)
                grade?.tamanhosQuantidades?.forEach((item) => {
                    const key = `${item.item}_${item.genero}`;  // Usando item + genero como chave
                    const sizeKey = `${key}_${item.tamanho}`;  // Tamanho dentro do item + genero
                    if (sizeQuantities.hasOwnProperty(sizeKey)) {
                        sizeQuantities[sizeKey] += item.quantidade;
                    }
                });

                // Calculando os totais por escola
                const totalForSchool = Object.values(sizeQuantities).reduce((acc, val) => acc + val, 0);

                // Calculando os totais por item + gênero
                Object.keys(sortedItemGenderSizes).reduce((acc, key) => {
                    const totalItemGenderSize = sortedItemGenderSizes[key].reduce(
                        (accSize, size) => accSize + sizeQuantities[`${key}_${size}`],
                        0
                    );
                    totalSizes[`${key}`] = totalItemGenderSize;
                    totalGeral += totalItemGenderSize;  // Somando ao total geral
                    return acc + totalItemGenderSize;
                }, 0);

                // Adicionando uma nova linha na planilha
                const row = worksheet.addRow([
                    "", // Coluna vazia inicial
                    {
                        richText: [
                            { text: `${grade.escola} `, font: { color: { argb: "FFFFFF" } } }, // Estilo para a escola
                            { text: `(${grade.numeroEscola})`, font: { color: { argb: "818181" } } } // Estilo para o número da escola
                        ],
                        alignment: { horizontal: 'left' } // Alinhamento à esquerda
                    }, // Coluna "ESCOLA"
                    grade?.company || "N/A", // Coluna "FATURADO POR" (se tiver a propriedade "faturadoPor")
                    formatarData(grade.update),
                    ...Object.keys(sortedItemGenderSizes).flatMap((key) => [
                        ...sortedItemGenderSizes[key].map((size) => sizeQuantities[`${key}_${size}`] || 0), // Tamanhos
                        totalSizes[`${key}`] || 0, // Total por item + gênero
                    ]),
                    totalForSchool, // Total por escola
                    volumes,
                    Math.ceil(peso),
                    convertMilharFormatCUB(cubagem),
                    "",
                ]);

                // Aplicando estilos nas células da linha
                row.eachCell((cell, colNumber) => {
                    const firstCellValue = worksheet.getCell(1, colNumber).value?.toString().toUpperCase() || '';

                    // Estilo para as colunas de tamanhos, com alternância de cor
                    const isOddRow = row.number % 2 !== 0; // Verifica se a linha é ímpar                
                    if (isOddRow) {
                        Object.assign(cell, volumeColumnStyleGrayLightest); // Azul Claro para linhas ímpares
                    }
                    if (!isOddRow) {
                        Object.assign(cell, volumeColumnStyleGraySlightlyDarker); // Azul Escuro para linhas pares
                    }
                    if (Number(cell.value) > 0) {
                        cell.style = {
                            ...cell.style,
                            fill: {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'B0C4DE' }, // Cor verde discreta (mais claro)
                            },
                        };
                    }

                    if (colNumber === 1) {
                        Object.assign(cell, generalStyle); // Estilo para a coluna vazia inicial
                    }
                    if (colNumber === 2) {
                        Object.assign(cell, schoolStyle); // Estilo para a coluna "ESCOLA"
                    }
                    if (colNumber === 3) {
                        Object.assign(cell, totalStyle); // Estilo para a coluna "FATURADO POR"
                    }
                    if (colNumber === 4) {
                        Object.assign(cell, generalStyle); // Estilo para "FATURADO POR"
                    }
                    if (colNumber === headerRow.cellCount - 4) {
                        Object.assign(cell, volumeTotalStyle); // Estilo para "TOTAL"
                    }
                    if (colNumber === headerRow.cellCount - 3) {
                        Object.assign(cell, genderTotalStyle); // Estilo para TOTAL GÊNERO
                    }

                    if (colNumber === headerRow.cellCount) {
                        Object.assign(cell, generalStyle); // Estilo para "FATURADO POR"
                    }

                    // Aplicação do estilo específico para gêneros
                    if (firstCellValue.includes('FEMININO') || firstCellValue.includes('MASCULINO') || firstCellValue.includes('UNISSEX')) {
                        Object.assign(cell, Number(cell.value) > 0 ? totalStyle2 : totalStyle); // Estilo específico para linha com essas palavras
                    }

                    // Aplicação do estilo para volumes
                    if (firstCellValue.includes('VOLUMES')) {
                        Object.assign(cell, totalVolumes2); // Estilo específico para linha com essas palavras
                    }

                    // Aplicação do estilo para total peso
                    if (firstCellValue.includes('PESO')) {
                        Object.assign(cell, totalVolumes3); // Estilo específico para linha com essas palavras
                    }

                    // Aplicação do estilo para total cubagem
                    if (firstCellValue.includes('CUBAGEM')) {
                        Object.assign(cell, totalVolumes4); // Estilo específico para linha com essas palavras
                    }
                });

                // Atualizando os totais de tamanho
                Object.keys(sortedItemGenderSizes).forEach((key) => {
                    sortedItemGenderSizes[key].forEach((size) => {
                        totalSizes[`${key}_${size}`] += sizeQuantities[`${key}_${size}`];
                    });
                });
                totalVolumes += volumes;
            });

            const totalRow = worksheet.addRow([
                "", // Coluna vazia inicial
                "TOTAL GERAL", // Título da linha
                "==>",
                "==>", // Coluna vazia para "FATURADO POR"
                ...Object.keys(sortedItemGenderSizes).flatMap((key) => {
                    // Filtrar chaves que contém o tamanho e somar os valores
                    //const sizeKeys = Object.keys(totalSizes).filter((totalKey) => totalKey.startsWith(key));
                    //const totalForKey = sizeKeys.reduce((acc, sizeKey) => acc + (totalSizes[sizeKey] || 0), 0);
                    return [
                        ...sortedItemGenderSizes[key].map((size) => totalSizes[`${key}_${size}`] || 0), // Totais de cada tamanho
                        "", // Total por item + gênero (somando os tamanhos)
                    ];
                }),
                // Soma total geral (somente itens que possuem tamanho devem ser considerados)
                /*Object.keys(totalSizes)
                    .filter((key) => key.includes('_')) // Considera apenas chaves que possuem sufixo de tamanho
                    .reduce((acc, key) => acc + (totalSizes[key] || 0), 0), // Soma somente os totais com tamanho*/
                totalGeral,
                totalVolumes,
                convertMilharFormatKG(totalPeso),
                convertMilharFormatCUB(totalCubagem),
                "",
            ]);

            // Aplicando o estilo de total
            totalRow.eachCell((cell, colNumber) => {
                const cellValue = worksheet.getCell(1, colNumber).value?.toString().toUpperCase() || '';
                Object.assign(cell, Number(cell.value) > 0 ? generalStyle2 : generalStyle);

                if (cellValue.includes('FEMININO') || cellValue.includes('MASCULINO') || cellValue.includes('UNISSEX')) {
                    Object.assign(cell, genderHeaderStyle); // Estilo específico para FEMININO, UNISSEX ou MASCULINO
                }

                if (cellValue === "TOTAL") {
                    Object.assign(cell, Number(cell.value) > 0 ? generalStyle3 : generalStyle);
                }

                if (cellValue === "TOTAL VOLUMES") {
                    Object.assign(cell, Number(cell.value) > 0 ? generalStyle4 : generalStyle);
                }

                if (cellValue === "TOTAL PESO") {
                    Object.assign(cell, String(cell.value).trim().replace(/\s+/g, '') !== "0,000Kg" ? generalStyle5 : generalStyle);
                }

                if (cellValue === "TOTAL CUBAGEM") {
                    Object.assign(cell, String(cell.value).trim().replace(/\s+/g, '') !== "0,000m³" ? generalStyle6 : generalStyle);
                }
            });

            // Ajustando a largura das colunas
            worksheet.columns = [
                { width: 2 }, // Coluna vazia inicial
                { width: 47 }, // Coluna "ESCOLA"
                { width: 30 }, // Coluna "FATURADO POR"
                { width: 17 }, // Coluna "SAÌDA"
                ...Object.keys(sortedItemGenderSizes).flatMap((key) => [
                    ...sortedItemGenderSizes[key].map(() => ({ width: 11 })), // Tamanhos
                    { width: 18 }, // Total por item + gênero
                ]),
                { width: 15 }, // Total geral
                { width: 15 }, // Total volumes
                { width: 20 }, // Total peso
                { width: 20 }, // Total cubagem
                { width: 2 }, // Total volumes
            ];
        }

        if (expedicaoDataRepo.length > 0) {
            const worksheetr = workbook.addWorksheet("REPOSIÇÃO");
            worksheetr.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

            const itemGenderSizes: { [key: string]: Set<string> } = {};

            expedicaoDataRepo.forEach((grade) => {
                grade?.tamanhosQuantidades?.forEach((item) => {
                    if (item.item && item.genero) {
                        // Criando uma chave composta (item + genero)
                        const key = `${item.item}_${item.genero}`;

                        // Se ainda não existir a chave para essa combinação, cria um Set vazio
                        if (!itemGenderSizes[key]) {
                            itemGenderSizes[key] = new Set<string>();
                        }

                        // Adicionando o tamanho ao Set correspondente
                        itemGenderSizes[key].add(item.tamanho);
                    }
                });
            });

            const sortedItemGenderSizes: { [key: string]: string[] } = {};

            Object.keys(itemGenderSizes).forEach((key) => {
                // Use a função ordenarTamanhos para garantir a ordem correta
                sortedItemGenderSizes[key] = ordenarTamanhos(Array.from(itemGenderSizes[key]));
            });

            const headerRow = worksheetr.addRow([
                "", // Coluna vazia inicial
                "UNIDADE ESCOLAR", // Coluna "ESCOLA"
                "FATURADO POR", // Coluna "FATURADO POR"
                "TÉRMINO EM",
                ...Object.keys(sortedItemGenderSizes).flatMap((key) => [
                    ...sortedItemGenderSizes[key].map((size) => `TAM ${size}`), // Tamanhos por item + gênero
                    `TOTAL ${key.toUpperCase()}`, // Total por item + gênero
                ]),
                "TOTAL", // Coluna para o total geral por escola
                "TOTAL VOLUMES",
                "TOTAL PESO Kg",
                "TOTAL CUBAGEM m³",
                "",
            ]);

            // Aplicando os estilos nas células do cabeçalho
            headerRow.eachCell((cell, colNumber) => {
                const cellValue = cell.value?.toString().toUpperCase() || '';

                if (colNumber === 1) {
                    Object.assign(cell, generalStyle); // Estilo para a primeira coluna (vazia ou "ESCOLA")
                } else if (colNumber === 2) {
                    Object.assign(cell, generalStyle); // Estilo para "ESCOLA"
                } else if (colNumber === 3) {
                    Object.assign(cell, generalStyle); // Estilo para "FATURADO POR"
                } else if (colNumber === 4) {
                    Object.assign(cell, generalStyle); // Estilo para "FATURADO POR"
                } else if (colNumber <= headerRow.cellCount) {
                    Object.assign(cell, generalStyle); // Estilo para as colunas de tamanhos
                } else if (colNumber === headerRow.cellCount - 4) {
                    Object.assign(cell, generalStyle); // Estilo para a coluna "TOTAL"
                } else if (colNumber === headerRow.cellCount - 3) {
                    Object.assign(cell, generalStyle); // Estilo para a última coluna "TOTAL VOLUMES"
                } else if (colNumber === headerRow.cellCount - 2) {
                    Object.assign(cell, generalStyle); // Estilo para a última coluna "TOTAL VOLUMES"
                } else if (colNumber === headerRow.cellCount - 1) {
                    Object.assign(cell, generalStyle); // Estilo para a última coluna "TOTAL VOLUMES"
                } else if (colNumber === headerRow.cellCount) {
                    Object.assign(cell, generalStyle); // Estilo para a última coluna "TOTAL VOLUMES"
                }

                if (cellValue.includes('FEMININO') || cellValue.includes('MASCULINO') || cellValue.includes('UNISSEX')) {
                    Object.assign(cell, genderHeaderStyle); // Estilo específico para FEMININO, UNISSEX ou MASCULINO
                }

            });

            let totalVolumes = 0;
            let totalGeral = 0;
            let totalPeso = 0;
            let totalCubagem = 0

            const totalSizes: { [key: string]: number } = {};

            // Inicializando o totalSizes para cada combinação de item + gênero + tamanho
            Object.keys(sortedItemGenderSizes).forEach((key) => {
                sortedItemGenderSizes[key].forEach((size) => {
                    totalSizes[`${key}_${size}`] = 0;
                });
            });

            expedicaoDataRepo.forEach((grade) => {
                const sizeQuantities: { [key: string]: number } = {};

                // Inicializando sizeQuantities para cada combinação de item + gênero + tamanho
                Object.keys(sortedItemGenderSizes).forEach((key) => {
                    sortedItemGenderSizes[key].forEach((size) => {
                        sizeQuantities[`${key}_${size}`] = 0;
                    });
                });

                const volumes = grade?.caixas?.length || 0;
                const cubagem = grade.cubagem || 0;
                const peso = Math.ceil(grade.peso || 0);

                totalPeso += peso;
                totalCubagem += cubagem;

                // Contabilizando as quantidades de tamanhos (somando valores corretamente)
                grade?.tamanhosQuantidades?.forEach((item) => {
                    const key = `${item.item}_${item.genero}`;  // Usando item + genero como chave
                    const sizeKey = `${key}_${item.tamanho}`;  // Tamanho dentro do item + genero
                    if (sizeQuantities.hasOwnProperty(sizeKey)) {
                        sizeQuantities[sizeKey] += item.quantidade;
                    }
                });

                // Calculando os totais por escola
                const totalForSchool = Object.values(sizeQuantities).reduce((acc, val) => acc + val, 0);

                // Calculando os totais por item + gênero
                Object.keys(sortedItemGenderSizes).reduce((acc, key) => {
                    const totalItemGenderSize = sortedItemGenderSizes[key].reduce(
                        (accSize, size) => accSize + sizeQuantities[`${key}_${size}`],
                        0
                    );
                    totalSizes[`${key}`] = totalItemGenderSize;
                    totalGeral += totalItemGenderSize;  // Somando ao total geral
                    return acc + totalItemGenderSize;
                }, 0);

                // Adicionando uma nova linha na planilha
                const row = worksheetr.addRow([
                    "", // Coluna vazia inicial
                    {
                        richText: [
                            { text: `${grade.escola} `, font: { color: { argb: "FFFFFF" } } }, // Estilo para a escola
                            { text: `(${grade.numeroEscola}) `, font: { color: { argb: "818181" } } },
                            { text: `(REPOSIÇÃO)`, font: { color: { argb: "FF0000" } } },
                        ],
                        alignment: { horizontal: 'left' } // Alinhamento à esquerda
                    }, // Coluna "ESCOLA"
                    grade?.company || "N/A", // Coluna "FATURADO POR" (se tiver a propriedade "faturadoPor")
                    formatarData(grade.update),
                    ...Object.keys(sortedItemGenderSizes).flatMap((key) => [
                        ...sortedItemGenderSizes[key].map((size) => Math.abs(sizeQuantities[`${key}_${size}`] || 0)), // Tamanhos
                        Math.abs(totalSizes[`${key}`] || 0), // Total por item + gênero
                    ]),
                    Math.abs(totalForSchool), // Total por escola
                    volumes, // Total de volumes
                    Math.ceil(peso),
                    convertMilharFormatCUB(cubagem),
                    "",
                ]);

                // Aplicando estilos nas células da linha
                row.eachCell((cell, colNumber) => {
                    const firstCellValue = worksheetr.getCell(1, colNumber).value?.toString().toUpperCase() || '';

                    // Estilo para as colunas de tamanhos, com alternância de cor
                    const isOddRow = row.number % 2 !== 0; // Verifica se a linha é ímpar                
                    if (isOddRow) {
                        Object.assign(cell, volumeColumnStyleGrayLightest); // Azul Claro para linhas ímpares
                    }
                    if (!isOddRow) {
                        Object.assign(cell, volumeColumnStyleGraySlightlyDarker); // Azul Escuro para linhas pares
                    }
                    if (Number(cell.value) < 0) {
                        cell.style = {
                            ...cell.style,
                            fill: {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: '90EE90' }, // Cor verde discreta (mais claro)
                            },
                        };
                    }
                    if (Number(cell.value) > 0) {
                        cell.style = {
                            ...cell.style,
                            fill: {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'B0C4DE' }, // Cor verde discreta (mais claro)
                            },
                        };
                    }
                    if (colNumber === 1) {
                        Object.assign(cell, generalStyle); // Estilo para a coluna vazia inicial
                    }
                    if (colNumber === 2) {
                        Object.assign(cell, schoolStyle); // Estilo para a coluna "ESCOLA"
                    }
                    if (colNumber === 3) {
                        Object.assign(cell, totalStyle); // Estilo para a coluna "FATURADO POR"
                    }
                    if (colNumber === 4) {
                        Object.assign(cell, generalStyle); // Estilo para "FATURADO POR"
                    }
                    if (colNumber === headerRow.cellCount - 4) {
                        Object.assign(cell, volumeTotalStyle); // Estilo para "TOTAL"
                    }
                    if (colNumber === headerRow.cellCount - 3) {
                        Object.assign(cell, genderTotalStyle); // Estilo para TOTAL GÊNERO
                    }

                    if (colNumber === headerRow.cellCount) {
                        Object.assign(cell, generalStyle); // Estilo para "FATURADO POR"
                    }

                    // Aplicação do estilo específico para gêneros
                    if (firstCellValue.includes('FEMININO') || firstCellValue.includes('MASCULINO') || firstCellValue.includes('UNISSEX')) {
                        Object.assign(cell, Number(cell.value) > 0 ? totalStyle2 : totalStyle); // Estilo específico para linha com essas palavras
                    }

                    // Aplicação do estilo para volumes
                    if (firstCellValue.includes('VOLUMES')) {
                        Object.assign(cell, totalVolumes2); // Estilo específico para linha com essas palavras
                    }

                    // Aplicação do estilo para total peso
                    if (firstCellValue.includes('PESO')) {
                        Object.assign(cell, totalVolumes3); // Estilo específico para linha com essas palavras
                    }

                    // Aplicação do estilo para total cubagem
                    if (firstCellValue.includes('CUBAGEM')) {
                        Object.assign(cell, totalVolumes4); // Estilo específico para linha com essas palavras
                    }
                });

                // Atualizando os totais de tamanho
                Object.keys(sortedItemGenderSizes).forEach((key) => {
                    sortedItemGenderSizes[key].forEach((size) => {
                        totalSizes[`${key}_${size}`] += sizeQuantities[`${key}_${size}`];
                    });
                });
                totalVolumes += volumes;
            });

            const totalRow = worksheetr.addRow([
                "", // Coluna vazia inicial
                "TOTAL GERAL", // Título da linha
                "==>",
                "==>", // Coluna vazia para "FATURADO POR"
                ...Object.keys(sortedItemGenderSizes).flatMap((key) => {
                    // Filtrar chaves que contém o tamanho e somar os valores
                    //const sizeKeys = Object.keys(totalSizes).filter((totalKey) => totalKey.startsWith(key));
                    //const totalForKey = sizeKeys.reduce((acc, sizeKey) => acc + (totalSizes[sizeKey] || 0), 0);
                    return [
                        ...sortedItemGenderSizes[key].map((size) => totalSizes[`${key}_${size}`] || 0), // Totais de cada tamanho
                        "", // Total por item + gênero (somando os tamanhos)
                    ];
                }),
                // Soma total geral (somente itens que possuem tamanho devem ser considerados)
                /*Object.keys(totalSizes)
                    .filter((key) => key.includes('_')) // Considera apenas chaves que possuem sufixo de tamanho
                    .reduce((acc, key) => acc + (totalSizes[key] || 0), 0), // Soma somente os totais com tamanho*/
                totalGeral,
                totalVolumes,
                convertMilharFormatKG(totalPeso),
                convertMilharFormatCUB(totalCubagem),
                "",
            ]);

            // Aplicando o estilo de total
            totalRow.eachCell((cell, colNumber) => {
                const cellValue = worksheetr.getCell(1, colNumber).value?.toString().toUpperCase() || '';
                Object.assign(cell, Number(cell.value) > 0 ? generalStyle2 : generalStyle);

                if (cellValue.includes('FEMININO') || cellValue.includes('MASCULINO') || cellValue.includes('UNISSEX')) {
                    Object.assign(cell, genderHeaderStyle); // Estilo específico para FEMININO, UNISSEX ou MASCULINO
                }

                if (cellValue === "TOTAL") {
                    Object.assign(cell, Number(cell.value) > 0 ? generalStyle3 : generalStyle);
                }

                if (cellValue === "TOTAL VOLUMES") {
                    Object.assign(cell, Number(cell.value) > 0 ? generalStyle4 : generalStyle);
                }

                if (cellValue === "TOTAL PESO") {
                    Object.assign(cell, String(cell.value).trim().replace(/\s+/g, '') !== "0,000Kg" ? generalStyle5 : generalStyle);
                }

                if (cellValue === "TOTAL CUBAGEM") {
                    Object.assign(cell, String(cell.value).trim().replace(/\s+/g, '') !== "0,000m³" ? generalStyle6 : generalStyle);
                }
            });

            // Ajustando a largura das colunas
            worksheetr.columns = [
                { width: 2 }, // Coluna vazia inicial
                { width: 47 }, // Coluna "ESCOLA"
                { width: 30 }, // Coluna "FATURADO POR"
                { width: 17 }, // Coluna "SAÌDA"
                ...Object.keys(sortedItemGenderSizes).flatMap((key) => [
                    ...sortedItemGenderSizes[key].map(() => ({ width: 11 })), // Tamanhos
                    { width: 18 }, // Total por item + gênero
                ]),
                { width: 15 }, // Total geral
                { width: 15 }, // Total volumes
                { width: 20 }, // Total peso
                { width: 20 }, // Total cubagem
                { width: 2 }, // Total volumes
            ];
        }

        // Salvando o arquivo Excel
        const data = new Date();
        const dataSp = convertSPTime(String(data));

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(
            new Blob([buffer]),
            expedicaoDataRepo.length === 0 ? `RELATORIO_EXPEDICAO_${expedicaoData[0]?.projectname}_${dataSp}.xlsx` : `RELATORIO_EXPEDICAO_REPOSICAO_${expedicaoData[0]?.projectname}_${dataSp}.xlsx`
        );
    }

    return (
        <button
            type="button"
            onClick={generateExcel}
            className="flex items-center justify-center px-2 py-1 bg-transparent hover:bg-transparent hover:bg-opacity-30 
              bg-opacity-20 text-zinc-400 font-semibold text-[13px] min-w-full z-50 pointer-events-auto"
        >
            <Download className="text-emerald-600 hover:text-emerald-400" size={27} strokeWidth={2} />
        </button>
    );
}
