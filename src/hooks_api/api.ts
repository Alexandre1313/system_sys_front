import { Escola, Projeto } from "../../core";
import Caixa from "../../core/interfaces/Caixa";
import { ip, port } from "../../core/utils/tools";

const urlProjetos = `http://${ip}:${port}/projetos`;
const urlEscolas = `http://${ip}:${port}/escolas`;
const urlProjetoEscolas = `http://${ip}:${port}/projetos/comescolas/`;
const urlGradesPorEscola = `http://${ip}:${port}/escolas/escolagrades/`
const urlInserirCaixas = `http://${ip}:${port}/caixas/inserir/`

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

export { get, getProjetosComEscolas, getGradesPorEscolas, inserirCaixa };
