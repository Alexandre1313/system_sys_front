'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { getProjectsItems, getProjectsSimp } from '@/hooks_api/api'; 
import IsLoading from '@/components/Componentes_Interface/IsLoading';
import SelectedEntries from '@/components/Componentes_entradas/SelectedEntries';
import { ProjectItems, ProjetosSimp } from '../../../core';
import ItemsProjects from '@/components/Componentes_entradas/ItemsProjects';
import SelectedEntriesEmb from '@/components/Componentes_entradas/SelectedEntriesEmb';

// Função fetcher para carregar todos os projetos
const fetcherProjects = async (): Promise<ProjetosSimp[]> => {
  const resp = await getProjectsSimp(); 
  return resp;
};

// Função fetcher para carregar itens de um projeto específico
const fetcherItems = async (projectId: number): Promise<ProjectItems> => {
  const resp = await getProjectsItems(+projectId); 
  return resp;
};

export default function EntradasEmbalagem() {
  // Estado para controlar o ID do projeto selecionado
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  // Carregar todos os projetos usando SWR
  const { data: projetos, error: errorProjetos, isValidating: isValidatingProjetos } = useSWR<ProjetosSimp[]>('projetos', fetcherProjects, {
    revalidateOnFocus: false,
    refreshInterval: 5 * 60 * 60 * 1000,
  });  

  // Carregar itens do projeto selecionado usando SWR
  const { data: projectItems, error: errorItems, isValidating: isValidatingItems } = useSWR(
    selectedProjectId ? String(selectedProjectId) : null, 
    () => fetcherItems(+selectedProjectId!), 
    {
      revalidateOnFocus: false     
    }
  );

  // Função para tratar a mudança no select
  const handleProjectChange = (projectId: number) => {    
    setSelectedProjectId(projectId);
  };

  if (isValidatingProjetos && !isValidatingItems) return <IsLoading />;

  if (errorProjetos || errorItems) {
    return (
      <div className="flex items-center justify-center min-h-[96vh] w-[100%]">
        <p style={{ color: 'red', fontSize: '25px', fontWeight: '700' }}>
          Erro: {errorProjetos?.message || errorItems?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-w-screen min-h-screen justify-start items-start p-5 gap-x-3">
      <div className="sticky top-5 flex flex-col max-w-[400px] min-w-[400px] bg-zinc-900 
      rounded-md p-5 justify-start items-start min-h-[95.7vh] gap-y-5">
       <SelectedEntries projetos={projetos} onSelectChange={handleProjectChange}/>
       <SelectedEntriesEmb/>
      </div>
      <div className="flex flex-col border gap-y-2 border-zinc-700 flex-1 rounded-md p-5 justify-start items-start min-h-[95.7vh]">
        {projectItems ? (
          projectItems.itensProject.map((item) => {
            return <ItemsProjects key={item.id} item={item}/>
          })
        ) : (
          <div className={`flex justify-center items-center h-full flex-1 w-full`}>
            <p className={`text-2xl text-green-500`}>SELECIONE UM PROJETO PARA CARREGAR OS ITENS.</p>
          </div>
        )}
      </div>
    </div>
  );
}
