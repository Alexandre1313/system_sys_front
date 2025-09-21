import {
    Caixa,
    CaixaAjuste,
    Embalagem,
    EntryInput,
    Escola,
    EscolaGradesItems,
    ExpedicaoResumoPDGrouped,
    FinalyGrade, Grade,
    GradeOpenBySchool,
    GradesRomaneio, Grafo, Login,
    ProjectItems,
    Projeto,
    ProjetosSimp,
    ProjetoStockItems,
    QtyEmbDay, StockGenerate,
    Usuarios
} from "../../core";

import { ip, port } from "../../core/utils/tools";

const urlProjetos = `http://${ip}:${port}/projetos/projetosall`;
const urlProjetoEscolas = `http://${ip}:${port}/projetos/comescolas/`;
const urlItemsProjects = `http://${ip}:${port}/projetos/itens/`;
const urlGradesPorEscola = `http://${ip}:${port}/escolas/escolagrades/`;
const urlInserirCaixas = `http://${ip}:${port}/caixas/inserir`;
const urlFinalizarGrades = `http://${ip}:${port}/grades/finalizar`;
const urlProjetosSimp = `http://${ip}:${port}/projetos/projetossimp`;
const urlCreateEmb = `http://${ip}:${port}/embalagem`;
const urlGetEmb = `http://${ip}:${port}/embalagem`;
const urlGetEmbDay = `http://${ip}:${port}/entradas/totaldia/`;
const urlEnterStock = `http://${ip}:${port}/entradas/gerarestoque`;
const urlGetDatesOffGrades = `http://${ip}:${port}/projetos/datas/`;
const urlGetRemessasOffGrades = `http://${ip}:${port}/projetos/remessas/`;
const urlGetGradesPorData = `http://${ip}:${port}/projetos/roman/`;
const urlLogin = `http://${ip}:${port}/usuarios/login`;
const urlEstoqueSituacao = `http://${ip}:${port}/projetos/saldos/`;
const urlExcluirGradeItem = `http://${ip}:${port}/gradeitens/`;
const urlAtualizarGradeItem = `http://${ip}:${port}/gradeitens/alterarquantidade/`;
const urlStatusGrades = `http://${ip}:${port}/projetos/statusgrades/`;
const urlEBI = `http://${ip}:${port}/escolas/escolagradesByItems/`;
const urlObterGrade = `http://${ip}:${port}/grades/`;
const urlAjustarGrade = `http://${ip}:${port}/grades/ajustar/`;
const urlFilterStatus = `http://${ip}:${port}/projetos/resumeexped/`;
const urlFilterStatusPP = `http://${ip}:${port}/projetos/resumeexpedpp/`;
const urlAlterStatus = `http://${ip}:${port}/grades/alterdespachadas`;
const urlGrafics = `http://${ip}:${port}/projetos/grafs`;
const urlCaixasPorGrade = `http://${ip}:${port}/caixas/getcaixas/`;
const urlGetCaixaAjust = `http://${ip}:${port}/caixas/getcaixaajust/`;
const urlModificarItensDaCaixa = `http://${ip}:${port}/caixas/updatedbox`;
const urlConsultarRanking = `http://${ip}:${port}/usuarios/ranking/`;
const urlConsultaSaidasPorDataEProjeto = `http://${ip}:${port}/grades/saidaspdata/`;
const urlConsultaSaidasPorDataEProjetoResum = `http://${ip}:${port}/grades/saidaspdataresum/`;
const urlConsultaSaidasPorDataEProjetoComEscola = `http://${ip}:${port}/grades/saidaspdatacomescola/`;

async function getProjectsPDataSaidasResum(projectId: string, tipoDeGrade: string, remessa: string): Promise<ExpedicaoResumoPDGrouped[]> {
    const response = await fetch(`${urlConsultaSaidasPorDataEProjetoResum}${projectId}/${tipoDeGrade}/${remessa}`)
    if (!response.ok) {
        throw new Error(`Erro ao buscar dados na api: ${response.statusText}`)
    }
    const data = await response.json();
    return data;
}

async function getProjectsPDataSaidas(projectId: string, tipoDeGrade: string, remessa: string): Promise<ExpedicaoResumoPDGrouped[]> {
    const response = await fetch(`${urlConsultaSaidasPorDataEProjeto}${projectId}/${tipoDeGrade}/${remessa}`)
    if (!response.ok) {
        throw new Error(`Erro ao buscar dados na api: ${response.statusText}`)
    }
    const data = await response.json();
    return data;
}

async function getProjectsPDataSaidasComEscola(projectId: string, tipoDeGrade: string, remessa: string): Promise<ExpedicaoResumoPDGrouped[]> {
    const response = await fetch(`${urlConsultaSaidasPorDataEProjetoComEscola}${projectId}/${tipoDeGrade}/${remessa}`)
    if (!response.ok) {
        throw new Error(`Erro ao buscar dados na api: ${response.statusText}`)
    }
    const data = await response.json();
    return data;
}

async function getRanking(month: string): Promise<{ rankingPorMes: Record<string, any[]>; rankingGeral: any[]; }> {
    try {
        const response = await fetch(`${urlConsultarRanking}${month}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar ranking dos usuários: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Erro ao buscar ranking dos usuários: ${error}`);
    }
}

async function modificarCaixa(caixa: CaixaAjuste): Promise<CaixaAjuste | null> {
    try {
        const response = await fetch(urlModificarItensDaCaixa, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(caixa),
        });
        if (!response.ok) {
            throw new Error(`Erro ao modificar os itens da caixa: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Erro ao modificar itens da caixa: ${error}`);
    }
}

async function getCaixaParaAjuste(id: string): Promise<CaixaAjuste | null> {
    const response = await fetch(`${urlGetCaixaAjust}${id}`);
    if (!response.ok) {
        throw new Error(`Erro ao buscar dados da caixa solicitada: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}

async function alterarPDespachadas(ids: number[]): Promise<number[] | null> {
    try {
        const response = await fetch(urlAlterStatus, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ids),
        });
        if (!response.ok) {
            throw new Error(`Erro ao atualizar o status das grades: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Erro ao buscar grades para atualização: ${error}`);
    }
}

async function siginn(credentials: Login): Promise<Usuarios | null> {
    try {
        const response = await fetch(urlLogin, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) {
            throw new Error(`Erro ao buscar usuário: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Erro ao buscar usuário: ${error}`);
    }
}

async function getGrafico(): Promise<Grafo[]> {
    const response = await fetch(urlGrafics);
    if (!response.ok) {
        throw new Error(`Erro ao buscar dados dos projetos: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}

async function get(): Promise<Projeto[]> {
    const response = await fetch(urlProjetos);
    if (!response.ok) {
        throw new Error(`Erro ao buscar projetos: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}

async function getCaixasPorGrade(id: string): Promise<Caixa[]> {
    const response = await fetch(`${urlCaixasPorGrade}${id}`);
    if (!response.ok) {
        throw new Error(`Erro ao buscar caixas: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}

async function getProjectsItemsSaldos(id: string): Promise<ProjetoStockItems | null> {
    const response = await fetch(`${urlEstoqueSituacao}${id}`)
    if (!response.ok) {
        throw new Error(`Erro ao buscar estoques e saldos: ${response.statusText}`)
    }
    const data = await response.json();
    return data;
}

async function getProjetosComEscolas(id: number): Promise<Projeto | null> {
    const response = await fetch(`${urlProjetoEscolas}${id}`);
    if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}

async function getGradesPorEscolas(id: number): Promise<Escola | null> {
    const response = await fetch(`${urlGradesPorEscola}${id}`)
    if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.statusText}`)
    }
    const data = await response.json();
    return data;
}

async function getProjectsItems(id: number): Promise<ProjectItems> {
    const response = await fetch(`${urlItemsProjects}${id}`)
    if (!response.ok) {
        throw new Error(`Erro ao buscar projeto e itens: ${response.statusText}`)
    }
    const data = await response.json();
    return data;
}

async function getProjectsSimp(): Promise<ProjetosSimp[]> {
    const response = await fetch(`${urlProjetosSimp}`)
    if (!response.ok) {
        throw new Error(`Erro ao buscar projetos: ${response.statusText}`)
    }
    const data = await response.json();
    return data;
}

async function getProdEmbDay(embalagemId: string, itemTamanhoId: string): Promise<QtyEmbDay> {
    const response = await fetch(`${urlGetEmbDay}${embalagemId}/${itemTamanhoId}`)
    if (!response.ok) {
        throw new Error(`Erro ao buscar dados na api: ${response.statusText}`)
    }
    const data = await response.json();
    return data;
}

async function getDatesGrades(projectId: number | null): Promise<Date[]> {
    const response = await fetch(`${urlGetDatesOffGrades}${projectId}`)
    if (!response.ok) {
        throw new Error(`Erro ao buscar grades para o projeto: ${response.statusText}`)
    }
    const data = await response.json();
    return data;
}

async function getRemessasGrades(projectId: number | null): Promise<number[]> {
    const response = await fetch(`${urlGetRemessasOffGrades}${projectId}`)
    if (!response.ok) {
        throw new Error(`Erro ao buscar remessas para o projeto: ${response.statusText}`)
    }
    const data = await response.json();
    return data;
}

async function getEmb(): Promise<Embalagem[]> {
    const response = await fetch(`${urlGetEmb}`)
    if (!response.ok) {
        throw new Error(`Erro ao buscar dados das embalagens: ${response.statusText}`)
    }
    const data = await response.json();
    return data;
}

async function inserirEmb(embalagem: Embalagem): Promise<Embalagem | null> {
    try {
        const response = await fetch(urlCreateEmb, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(embalagem),
        });
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function inserirCaixa(caixa: Caixa | null): Promise<Caixa | null> {
    try {
        const response = await fetch(urlInserirCaixas, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(caixa),
        });
        if (!response.ok) {
            throw new Error(`Erro ao inserir a caixa: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Erro ao inserir a caixa: ${error}`);
    }
}

async function finalizarGrades(finalyGrade: FinalyGrade | null): Promise<Grade | null> {
    try {
        const response = await fetch(urlFinalizarGrades, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(finalyGrade),
        });
        if (!response.ok) {
            throw new Error(`Erro ao finalizar a grade: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Erro ao finalizar a grade: ${error}`);
    }
}

async function stockGenerate(stock: StockGenerate): Promise<EntryInput | null> {
    try {
        const response = await fetch(urlEnterStock, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stock),
        });
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function getGradesRoman(projectId: string, dateStr: string): Promise<GradesRomaneio[]> {
    const response = await fetch(`${urlGetGradesPorData}${projectId}/${dateStr}`)
    if (!response.ok) {
        throw new Error(`Erro ao buscar dados nas grades: ${response.statusText}`)
    }
    const data: GradesRomaneio[] = await response.json();
    return data;
}

async function gradeItemModify(id: any, quantidadeExpedida: any): Promise<string | null> {
    try {
        let response: Response | null = null;

        if (quantidadeExpedida === 0) {
            response = await fetch(`${urlExcluirGradeItem}${String(id)}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        if (quantidadeExpedida > 0) {
            response = await fetch(urlAtualizarGradeItem, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, quantidadeExpedida }),
            });
        }

        // Verificar se a resposta não foi bem-sucedida
        if (response && !response.ok) {
            return null; // Se a resposta for inválida (não OK), retornamos uma string vazia
        }

        // Verificação explícita para garantir que 'response' não é null
        if (response) {
            const data = await response.json(); // Acessa o JSON somente se 'response' não for null
            return data; // Retorna os dados da resposta
        }

        // Se a resposta for nula, retornamos null
        return null;
    } catch (error) {
        console.log(error);
        return null; // Retorna null em caso de erro
    }
}

async function getProjectsGradesSaldos(projectId: string, dateStr: string): Promise<GradeOpenBySchool[] | null> {
    const response = await fetch(`${urlStatusGrades}${projectId}/${dateStr}`)
    if (!response.ok) {
        console.log(`Erro ao buscar dados: ${response.statusText}`)
        return null
    }
    const data = await response.json();
    return data;
}

async function getGradesPorEscolasByItems(id: string): Promise<EscolaGradesItems | null> {
    const response = await fetch(`${urlEBI}${id}`);
    if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.statusText}`)
    }
    const data = await response.json();
    return data;
}

async function getGrade(id: string): Promise<Grade> {
    const response = await fetch(`${urlObterGrade}${id}`)
    if (!response.ok) {
        throw new Error(`Erro ao buscar garde: ${response.statusText}`)
    }
    const data = await response.json();
    return data;
}

async function ajust(id: string): Promise<Grade | null> {
    try {
        const response = await fetch(`${urlAjustarGrade}${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            return null;
        }
        const data: Grade = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao ajustar grade:', error);
        return null;
    }
}

async function getFilterGrades(projectId: string, remessa: string, status: string, tipo: string): Promise<GradesRomaneio[] | null> {
    const response = await fetch(`${urlFilterStatus}${projectId}/${remessa}/${status}/${tipo}`)
    if (!response.ok) {
        console.log(`Erro ao buscar dados: ${response.statusText}`)
        return null
    }
    const data = await response.json();
    return data;
}

async function getFilterGradesPP(projectId: string, remessa: string, status: string, tipo: string): Promise<GradesRomaneio[] | null> {
    const response = await fetch(`${urlFilterStatusPP}${projectId}/${remessa}/${status}/${tipo}`)
    if (!response.ok) {
        console.log(`Erro ao buscar dados: ${response.statusText}`)
        return null
    }
    const data = await response.json();
    return data;
}

export {
    ajust, alterarPDespachadas, finalizarGrades, get, getCaixaParaAjuste,
    getCaixasPorGrade, getDatesGrades, getEmb, getFilterGrades, getGrade,
    getGradesPorEscolas, getGradesPorEscolasByItems, getGradesRoman, getGrafico, getProdEmbDay,
    getProjectsGradesSaldos, getProjectsItems, getProjectsItemsSaldos, getProjectsSimp,
    getProjetosComEscolas, getRemessasGrades, gradeItemModify, inserirCaixa, inserirEmb,
    modificarCaixa, siginn, stockGenerate, getRanking, getFilterGradesPP, getProjectsPDataSaidas,
    getProjectsPDataSaidasResum, getProjectsPDataSaidasComEscola,
};
