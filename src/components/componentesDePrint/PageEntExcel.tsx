import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { GradesRomaneio } from "../../../core";
import { Truck } from "react-feather";
import { convertSPTime } from "../../../core/utils/tools";

export interface PageEntExcelProps {
    expedicaoDataB: GradesRomaneio[];
}

export default function PageEntExcel({ expedicaoDataB }: PageEntExcelProps) {

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

            // Se as datas forem iguais, ordenar por nome da escola
            return a.escola.localeCompare(b.escola);
        });
    };

    function mergeSchools(schoolsArray: GradesRomaneio[]): GradesRomaneio[] {
        const mergedSchools: GradesRomaneio[] = [];

        // Itera sobre todas as escolas
        schoolsArray.forEach(school => {
            const existingSchool = mergedSchools.find(item => item.numeroEscola === school.numeroEscola);

            // Converte a data de 'existingSchool' e 'school' para objetos Date (sem considerar hora)
            const dateExisting = existingSchool ? new Date(existingSchool.update.split(' ')[0].split('/').reverse().join('/')) : null;
            const dateCurrent = new Date(school.update.split(' ')[0].split('/').reverse().join('/'));

            // Verifica se a data é a mesma (ignora hora)
            const isSameDate = dateExisting && dateExisting.getFullYear() === dateCurrent.getFullYear() &&
                dateExisting.getMonth() === dateCurrent.getMonth() &&
                dateExisting.getDate() === dateCurrent.getDate();

            // Verifica se o tipo é "reposicao"
           const isReposicao = school.tipo?.normalize("NFD").replace(/\p{M}/gu, "").trim().toUpperCase() === "REPOSICAO";

            // Se a escola já existe no mergedSchools
            if (existingSchool) {
                // Se as datas são iguais e o tipo não for "reposicao", mescla as caixas e tamanhos
                if (isSameDate && !isReposicao) {
                    existingSchool.caixas = [...existingSchool.caixas, ...school.caixas];
                    existingSchool.tamanhosQuantidades = [
                        ...existingSchool.tamanhosQuantidades,
                        ...school.tamanhosQuantidades
                    ];
                }
                // Se as datas são diferentes ou o tipo for "reposicao", adiciona novamente no array
                else if (!isSameDate || isReposicao) {
                    mergedSchools.push({ ...school }); // Adiciona a escola novamente no array
                }
            } else {
                // Se a escola ainda não foi encontrada no mergedSchools, adiciona ela
                mergedSchools.push({ ...school });
            }
        });

        return mergedSchools;
    }

    // Função para agrupar as escolas pela data de update e ordenar os grupos pela data de forma decrescente
    function groupSchoolsByUpdate(mergedSchools: GradesRomaneio[]): GradesRomaneio[][] {
        const groupedByUpdate: { [key: string]: GradesRomaneio[] } = {};

        // Agrupa as escolas pela data de update
        mergedSchools.forEach((school) => {
            const updateDate = school.update.split(' ')[0];  // Pegando apenas a data (sem a hora)

            // Se o grupo para essa data não existe, cria o grupo
            if (!groupedByUpdate[updateDate]) {
                groupedByUpdate[updateDate] = [];
            }

            // Adiciona a escola ao grupo correspondente
            groupedByUpdate[updateDate].push(school);
        });

        // Ordena as chaves (datas) em ordem decrescente (do mais recente para o mais antigo)
        const sortedKeys = Object.keys(groupedByUpdate).sort((a, b) => {
            const dateA = new Date(a.split('/').reverse().join('/')); // Formata a data de 'a' para comparar corretamente
            const dateB = new Date(b.split('/').reverse().join('/')); // Formata a data de 'b' para comparar corretamente

            // Ordena do mais recente para o mais antigo
            return dateB.getTime() - dateA.getTime();
        });

        // Converte o objeto agrupado em um array de arrays, ordenado pela data
        return sortedKeys.map((key) => groupedByUpdate[key]);
    }

    const mergeSchols = mergeSchools(expedicaoDataB);
    const expedicaoData = ordenarGrades(mergeSchols);

    const generateExcel = async () => {
        const workbook = new ExcelJS.Workbook();

        const groupedSchools = groupSchoolsByUpdate(expedicaoData);

        groupedSchools.forEach((group, index, arr) => {

            const worksheet = workbook.addWorksheet(`${arr.length - index}ª entrega`);

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
                    top: { style: "thin", color: { argb: "000000" } },
                    //left: { style: "thin", color: { argb: "000000" } },
                    bottom: { style: "thin", color: { argb: "000000" } },
                    //right: { style: "thin", color: { argb: "000000" } },
                },
            };

            const volumeColumnStyleGraySlightlyDarker = {
                fill: { type: "pattern", pattern: "solid", fgColor: { argb: "DCDCDC" } }, // Cinza muito suave, mais escuro
                alignment: { horizontal: "center", vertical: "middle", wrapText: true },
                border: {
                    top: { style: "thin", color: { argb: "000000" } },
                    //left: { style: "thin", color: { argb: "000000" } },
                    bottom: { style: "thin", color: { argb: "000000" } },
                    //right: { style: "thin", color: { argb: "000000" } },
                },
            };

            const itemGenderSizes: { [key: string]: Set<string> } = {};

            group.forEach((grade) => {
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
                "ESCOLA", // Coluna "ESCOLA"
                "FATURADO POR", // Coluna "FATURADO POR"
                "TÉRMINO EM",
                ...Object.keys(sortedItemGenderSizes).flatMap((key) => [
                    ...sortedItemGenderSizes[key].map((size) => `TAM ${size}`), // Tamanhos por item + gênero
                    `TOTAL ${key.toUpperCase()}`, // Total por item + gênero
                ]),
                "TOTAL", // Coluna para o total geral por escola
                "TOTAL VOLUMES", // Coluna para o total de volumes
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

            group.forEach((grade) => {
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
                            { text: `(${grade.numeroEscola}) `, font: { color: { argb: "818181" } } },
                            { text: `${!grade.tipo ? '': `(${grade.tipo})`}`, font: { color: { argb: "FF0000" } } }  // Estilo para o número da escola
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
                        Object.assign(cell, Number(cell.value) > 0 ? totalStyle2 : totalStyle); // Estilo específico para linha com essas palavras
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
                totalVolumes, // Total de volumes
                "",
            ]);

            // Aplicando o estilo de total
            totalRow.eachCell((cell, colNumber) => {
                const cellValue = worksheet.getCell(1, colNumber).value?.toString().toUpperCase() || '';
                Object.assign(cell, generalStyle2);

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

        })

        // Salvando o arquivo Excel
        const data = new Date();
        const dataSp = convertSPTime(String(data));

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(
            new Blob([buffer]),
            `RELATORIO_DE_ENTREGAS_${expedicaoData[0]?.projectname}_${dataSp}.xlsx`
        );
    }

    return (
        <button
            type="button"
            onClick={generateExcel}
            className="flex items-center justify-center w-full h-full bg-transparent hover:bg-transparent text-violet-100 font-medium text-xs transition-colors duration-200 mr-1">
            <Truck className="text-violet-100 hover:text-violet-50" size={14} strokeWidth={2} />
        </button>
    );
}
