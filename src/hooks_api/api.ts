import { Escola, Projeto } from "../../core";
import { ip } from "../../core/utils/tools";

const urlProjetos = `http://${ip}:4997/projetos`;
const urlEscolas = `http://${ip}:4997/escolas`;

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

    // Realiza a requisição
    const response = await fetch(urlParaConsulta);
    if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}

export { get };
