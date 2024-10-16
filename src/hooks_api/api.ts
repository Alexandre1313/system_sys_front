import { Escola, Projeto } from "../../core";
import { ip, port } from "../../core/utils/tools";

const urlProjetos = `http://${ip}:${port}/projetos`;
const urlEscolas = `http://${ip}:${port}/escolas`;
const urlProjetoEscolas = `http://${ip}:${port}/projetos/comescolas/`;

async function get(option: 'P' | 'E'): Promise<Projeto[] | Escola[] | any[]> {
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
    if(!response.ok){
        throw new Error(`Erro ao buscar dados: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}

export { get, getProjetosComEscolas };
