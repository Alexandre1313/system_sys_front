import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { FileText } from "react-feather";
import { GradesRomaneio } from "../../../core";
import { convertSPTime } from "../../../core/utils/tools";

export interface PageExcelRelatorioPedidoProps {
    expedicaoDataB: GradesRomaneio[];
}

export default function PageExcelRelatorioPedido({ expedicaoDataB }: PageExcelRelatorioPedidoProps) {

    // Função para ordenar tamanhos
    const ordenarTamanhos = (tamanhos: string[]): string[] => {
        const numTamanhos = tamanhos.filter(tamanho => /^[0-9]+$/.test(tamanho)); // Filtra tamanhos numéricos
        const letraTamanhos = tamanhos.filter(tamanho => !/^[0-9]+$/.test(tamanho)); // Filtra tamanhos com letras

        // Ordena tamanhos numéricos (convertendo para inteiro)
        numTamanhos.sort((a, b) => parseInt(a) - parseInt(b));

        // Ordena tamanhos com letras conforme a ordem desejada
        const ordem = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'EG', 'EX', 'EGG', 'EXG', 'XGG', 'EXGG', 'G1', 'G2', 'G3', 'EG/LG'];
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
            // Calcula a soma das diferenças (quantidade - previsto) para todos os itens do array 'tamanhosQuantidades' de 'a'
            const somaDiferencaA = a.tamanhosQuantidades.reduce((total, item) => total + (item.quantidade - item.previsto), 0);
            // Calcula a soma das diferenças (quantidade - previsto) para todos os itens do array 'tamanhosQuantidades' de 'b'
            const somaDiferencaB = b.tamanhosQuantidades.reduce((total, item) => total + (item.quantidade - item.previsto), 0);

            // Primeiro, ordenar as escolas com diferença maior que zero
            if (somaDiferencaA > 0 && somaDiferencaB <= 0) return 1; // 'a' vem antes de 'b' se 'a' tem diferença positiva e 'b' não
            if (somaDiferencaA <= 0 && somaDiferencaB > 0) return -1;  // 'b' vem antes de 'a' se 'b' tem diferença positiva e 'a' não

            // Se ambos têm diferença positiva ou ambos têm diferença igual a zero, ordenar pela soma da diferença (maior para menor)
            if (somaDiferencaA > somaDiferencaB) return 1; // 'a' vem antes de 'b' se somaDiferencaA for maior
            if (somaDiferencaA < somaDiferencaB) return -1;  // 'b' vem antes de 'a' se somaDiferencaB for maior

            // Se a soma das diferenças for igual, ordenar pelo número da escola (de menor para maior)
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
                // Mescla os arrays de "caixas" e "tamanhosQuantidades"
                existingSchool.caixas = [...existingSchool.caixas, ...school.caixas];
                existingSchool.tamanhosQuantidades = [
                    ...existingSchool.tamanhosQuantidades,
                    ...school.tamanhosQuantidades
                ];
            } else {
                // Se a escola não existir no mergedSchools, adiciona ela ao array
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
        const worksheet = workbook.addWorksheet("EXPEDIÇÃO FALTAS");

        // Estilos para colunas específicas
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
                top: { style: "thin", color: { argb: "4F4F4F" } },
                //left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "4F4F4F" } },
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
            font: { color: { argb: "FFD700" }, size: 13 },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "000000" } },
            alignment: { horizontal: "center", vertical: "middle", wrapText: true },
            border: {
                top: { style: "thin", color: { argb: "000000" } },
                //left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "000000" } },
                //right: { style: "thin", color: { argb: "000000" } },
            },
        };

        const totalStyle3 = {
            font: { bold: true, color: { argb: "FFD700" } },
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
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "B22222" } },
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
            "ÚLTIMA MOVIMENTAÇÃO",
            ...Object.keys(sortedItemGenderSizes).flatMap((key) => [
                ...sortedItemGenderSizes[key].map((size) => `TAM ${size}`), // Tamanhos por item + gênero
                `PEDIDO ${key.toUpperCase()}`, // Total por item + gênero
            ]),
            "TOTAL PEDIDO", // Coluna para o total geral por escola
            "VOLUMES JÁ GERADOS", // Coluna para o total de volumes
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
            } else if (colNumber === headerRow.cellCount - 2) {
                Object.assign(cell, generalStyle); // Estilo para a coluna "TOTAL"
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

            // Contabilizando as quantidades de tamanhos (somando valores corretamente)
            grade?.tamanhosQuantidades?.forEach((item) => {
                const key = `${item.item}_${item.genero}`;  // Usando item + genero como chave
                const sizeKey = `${key}_${item.tamanho}`;  // Tamanho dentro do item + genero
                if (sizeQuantities.hasOwnProperty(sizeKey)) {
                    sizeQuantities[sizeKey] += (item.previsto);
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
                    ...sortedItemGenderSizes[key].map((size) => Math.abs(sizeQuantities[`${key}_${size}`] || 0)), // Tamanhos
                    Math.abs(totalSizes[`${key}`] || 0), // Total por item + gênero
                ]),
                Math.abs(totalForSchool), // Total por escola
                volumes, // Total de volumes
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
                if (Number(cell.value) < 0) {
                    cell.style = {
                        ...cell.style,
                        fill: {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'B0C4DE' }, // Cor verde discreta (mais claro)
                        },
                    };
                }
                if (Number(cell.value) > 0) {
                    cell.style = {
                        ...cell.style,
                        fill: {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'F4CCCC' }, // Cor verde discreta (mais claro)
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
                if (colNumber === headerRow.cellCount - 2) {
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
                    Object.assign(cell, Number(cell.value) > 0 ? totalStyle3 : totalStyle); // Estilo específico para linha com essas palavras
                }

                // Aplicação do estilo para volumes
                if (firstCellValue.includes('VOLUMES')) {
                    Object.assign(cell, totalVolumes2); // Estilo específico para linha com essas palavras
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
            "TOTAL GERAL FALTANTE", // Título da linha
            "==>",
            "==>", // Coluna vazia para "FATURADO POR"
            ...Object.keys(sortedItemGenderSizes).flatMap((key) => {
                const totalPerKey = sortedItemGenderSizes[key].reduce(
                    (acc, size) => acc + (totalSizes[`${key}_${size}`] || 0),
                    0
                );
                return [
                    ...sortedItemGenderSizes[key].map((size) => Math.abs(totalSizes[`${key}_${size}`] || 0)),
                    Math.abs(totalPerKey), // Aqui soma os tamanhos desse item + gênero
                ];
            }),
            Math.abs(totalGeral),
            totalVolumes, // Total de volumes
            "",
        ]);

        // Aplicando o estilo de total
        totalRow.eachCell((cell, colNumber) => {
            const cellValue = worksheet.getCell(1, colNumber).value?.toString().toUpperCase() || '';
            Object.assign(cell, Number(cell.value) > 0 ? generalStyle2 : generalStyle);

            if (cellValue.includes('FEMININO') || cellValue.includes('MASCULINO') || cellValue.includes('UNISSEX')) {
                Object.assign(cell, genderHeaderStyle); // Estilo específico para FEMININO, UNISSEX ou MASCULINO
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
            { width: 2 }, // Total volumes
        ];

        if (expedicaoDataRepo.length > 0) {
            const worksheetr = workbook.addWorksheet("REPOSIÇÃO FALTAS");

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
                "REPOSIÇÕES POR", // Coluna "FATURADO POR"
                "ÚLTIMA MOVIMENTAÇÃO",
                ...Object.keys(sortedItemGenderSizes).flatMap((key) => [
                    ...sortedItemGenderSizes[key].map((size) => `TAM ${size}`), // Tamanhos por item + gênero
                    `TOTAL ${key.toUpperCase()}`, // Total por item + gênero
                ]),
                "TOTAL PEDIDO", // Coluna para o total geral por escola
                "VOLUMES JÁ GERADOS", // Coluna para o total de volumes
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
                } else if (colNumber === headerRow.cellCount - 2) {
                    Object.assign(cell, generalStyle); // Estilo para a coluna "TOTAL"
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

                // Contabilizando as quantidades de tamanhos (somando valores corretamente)
                grade?.tamanhosQuantidades?.forEach((item) => {
                    const key = `${item.item}_${item.genero}`;  // Usando item + genero como chave
                    const sizeKey = `${key}_${item.tamanho}`;  // Tamanho dentro do item + genero
                    if (sizeQuantities.hasOwnProperty(sizeKey)) {
                        if ((item.previsto) === 0) {
                            sizeQuantities[sizeKey] += 0;
                        } else {
                            sizeQuantities[sizeKey] += (item.previsto);
                        }
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
                                fgColor: { argb: 'F4CCCC' }, // Cor verde discreta (mais claro)
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
                    if (colNumber === headerRow.cellCount - 2) {
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
                        Object.assign(cell, Number(cell.value) > 0 ? totalStyle3 : totalStyle); // Estilo específico para linha com essas palavras
                    }

                    // Aplicação do estilo para volumes
                    if (firstCellValue.includes('VOLUMES')) {
                        Object.assign(cell, totalVolumes2); // Estilo específico para linha com essas palavras
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
                "TOTAL GERAL FALTANTE", // Título da linha
                "==>",
                "==>", // Coluna vazia para "FATURADO POR"
                ...Object.keys(sortedItemGenderSizes).flatMap((key) => {
                    const totalPerKey = sortedItemGenderSizes[key].reduce(
                        (acc, size) => acc + (totalSizes[`${key}_${size}`] || 0),
                        0
                    );
                    return [
                        ...sortedItemGenderSizes[key].map((size) => Math.abs(totalSizes[`${key}_${size}`] || 0)),
                        Math.abs(totalPerKey), // Aqui soma os tamanhos desse item + gênero
                    ];
                }),
                Math.abs(totalGeral),
                totalVolumes, // Total de volumes
                "",
            ]);

            // Aplicando o estilo de total
            totalRow.eachCell((cell, colNumber) => {
                const cellValue = worksheetr.getCell(1, colNumber).value?.toString().toUpperCase() || '';
                Object.assign(cell, Number(cell.value) > 0 ? generalStyle2 : generalStyle);

                if (cellValue.includes('FEMININO') || cellValue.includes('MASCULINO') || cellValue.includes('UNISSEX')) {
                    Object.assign(cell, genderHeaderStyle); // Estilo específico para FEMININO, UNISSEX ou MASCULINO
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
                { width: 2 }, // Total volumes
            ];
        }
        const data = new Date();
        const dataSp = convertSPTime(String(data));

        const nameV = expedicaoDataRepo[0]?.projectname || expedicaoData[0]?.projectname;

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(
            new Blob([buffer]),
            expedicaoDataRepo.length === 0 ? `RELATORIO_PEDIDO_GERAL_DO_PROJETO_${nameV}_${dataSp}.xlsx` : expedicaoData.length === 0 ?
                `RELATORIO_REPOSICOES_GERADAS_NO_PROJETO_${nameV}_${dataSp}.xlsx` : `RELATORIO_EXPEDICAO_REPOSICAO_DO_PROJETO_${nameV}_${dataSp}.xlsx`
        );
    }

    return (
        <button
            type="button"
            onClick={generateExcel}
            className="flex items-center justify-center w-full h-full bg-transparent hover:bg-transparent text-amber-100 font-medium text-xs transition-colors duration-200 mr-1">
            <FileText className="text-amber-100 hover:text-amber-50" size={14} strokeWidth={2} />
        </button>
    );
}
