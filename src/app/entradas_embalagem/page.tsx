'use client'

import { getProjectsItems } from '@/hooks_api/api';  // A função que retorna os itens do projeto
import useSWR from 'swr';  // Hook SWR para buscar dados
import { ProjectItems } from '../../../core';  // O tipo dos itens do projeto
import IsLoading from '@/components/Componentes_Interface/IsLoading';  // Componente de loading

// Função fetcher que será usada pelo SWR
const fetcher = async (): Promise<ProjectItems[]> => {
  const resp = await getProjectsItems();  // Chama a função para buscar os itens
  return resp;  // Retorna os dados ou um array vazio caso falhe
};

export default function EntradasEmbalagem() {
  // Usando SWR para obter os itens dos projetos
  const { data: projetosItens, error, isValidating } = useSWR<ProjectItems[]>('projetos-itens', fetcher, {
    revalidateOnFocus: false,  // Revalida quando a janela ganha o foco
    refreshInterval: 5 * 60 * 60 * 1000,   // Atualiza os dados a cada 5 horas
  });

  if (isValidating) {
    return <IsLoading />  // Exibe o componente de loading enquanto valida
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[100%] w-[100%]">
        <p style={{ color: 'red', fontSize: '25px', fontWeight: '700' }}>
          Erro: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-w-screen min-h-screen justify-start items-start p-5 gap-x-3">
      <div className="flex flex-col max-w-[400px] min-w-[400px] bg-zinc-900 rounded-md p-5 justify-start items-start min-h-[95.7vh]">
        <select className="outline-none flex bg-transparent border cursor-pointer rounded-md p-2 w-full border-zinc-700" name="" id="">
          <option value="">SELECIONE O PROJETO</option>
          {/* Você pode preencher os projetos aqui usando os dados de `projetosItens` */}
        </select>
      </div>
      <div className="flex border border-zinc-700 flex-1 rounded-md p-5 justify-start items-start min-h-[95.7vh]">
        {/* Exibe os itens do projeto */}
        <div>{JSON.stringify(projetosItens)}</div> 
      </div>
    </div>
  );
}
