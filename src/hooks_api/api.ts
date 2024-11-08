import { Escola, FinalyGrade, Grade, Projeto, Caixa, ProjectItems, ProjetosSimp } from "../../core";
import Embalagem from "../../core/interfaces/Embalagem";
import { ip, port } from "../../core/utils/tools";

const urlProjetos = `http://${ip}:${port}/projetos`;
const urlEscolas = `http://${ip}:${port}/escolas`;
const urlProjetoEscolas = `http://${ip}:${port}/projetos/comescolas/`;
const urlItemsProjects = `http://${ip}:${port}/projetos/itens/`;
const urlGradesPorEscola = `http://${ip}:${port}/escolas/escolagrades/`;
const urlInserirCaixas = `http://${ip}:${port}/caixas/inserir/`;
const urlFinalizarGrades = `http://${ip}:${port}/grades/finalizar`;
const urlProjetosSimp = `http://${ip}:${port}/projetos/projetossimp`;
const urlCreateEmb = `http://${ip}:${port}/embalagem`;
const urlGetEmb = `http://${ip}:${port}/embalagem`;

async function get(option: 'P' | 'E'): Promise<Projeto[] | Escola[] | unknown[]> {
    let urlParaConsulta = "";
    switch (option) {
        case 'P':
            urlParaConsulta = urlProjetos;
            break;
        case 'E':
            urlParaConsulta = urlEscolas;
            break;
        default:
            throw new Error('Opção inválida. Use "P" para Projetos ou "E" para Escolas.');
    }
    const response = await fetch(urlParaConsulta);
    if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.statusText}`);
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
        const response = await fetch( urlCreateEmb, {
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
        throw new Error(`Erro ao inserir a embalagem: ${error}`);
    }
}

async function inserirCaixa(caixa: Caixa | null): Promise<Caixa | null> {
    try {
        const response = await fetch( urlInserirCaixas, {
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
        const response = await fetch( urlFinalizarGrades, {
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

export { get, getProjetosComEscolas, getGradesPorEscolas, inserirCaixa,
         finalizarGrades, getProjectsItems, getProjectsSimp, getEmb, inserirEmb };
