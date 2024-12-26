import {
    Caixa,
    Escola, FinalyGrade, Grade,
    GradeOpenBySchool,
    GradesRomaneio, Login,
    ProjectItems,
    Projeto,
    ProjetosSimp,
    ProjetoStockItems,
    QtyEmbDay, StockGenerate,
    Usuarios
} from "../../core";
import Embalagem from "../../core/interfaces/Embalagem";
import EntryInput from "../../core/interfaces/EntryInput";
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
const urlGetGradesPorData = `http://${ip}:${port}/projetos/roman/`;
const urlLogin = `http://${ip}:${port}/usuarios/login`;
const urlEstoqueSituacao = `http://${ip}:${port}/projetos/saldos/`;
const urlExcluirGradeItem = `http://${ip}:${port}/gradeitens/`;
const urlAtualizarGradeItem = `http://${ip}:${port}/gradeitens/alterarquantidade/`;
const urlStatusGrades = `http://${ip}:${port}/projetos/statusgrades/`;


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

async function get(): Promise<Projeto[]> {
    const response = await fetch(urlProjetos);
    if (!response.ok) {
        throw new Error(`Erro ao buscar projetos: ${response.statusText}`);
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

async function getProjectsGradesSaldos(projectId: string, dateStr: string): Promise<GradeOpenBySchool[]>{
    const response = await fetch(`${urlStatusGrades}${projectId}/${dateStr}`)
    if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.statusText}`)
    }
    const data = await response.json();
    return data;
}

export {
    finalizarGrades, get, getDatesGrades, getEmb, getGradesPorEscolas, getGradesRoman, getProdEmbDay, getProjectsItems, getProjectsItemsSaldos, getProjectsSimp, getProjetosComEscolas, gradeItemModify, inserirCaixa, inserirEmb, siginn, stockGenerate, getProjectsGradesSaldos
};
