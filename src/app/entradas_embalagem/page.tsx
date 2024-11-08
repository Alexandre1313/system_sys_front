'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { getProjectsItems, getProjectsSimp } from '@/hooks_api/api';
import IsLoading from '@/components/Componentes_Interface/IsLoading';
import SelectedEntries from '@/components/Componentes_entradas/SelectedEntries';
import { ProjectItems, ProjetosSimp } from '../../../core';
import ItemsProjects from '@/components/Componentes_entradas/ItemsProjects';
import SelectedEntriesEmb from '@/components/Componentes_entradas/SelectedEntriesEmb';
import ModalEmbCad from '@/components/Componentes_Interface/ModalEmbCad';

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

  const [isModalOpen, setModalOpen] = useState(false);

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

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
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
        rounded-md p-5 justify-between items-start min-h-[95.7vh] gap-y-5">
        <div className="flex flex-col w-full justify-start items-start gap-y-5">
          <SelectedEntries projetos={projetos} onSelectChange={handleProjectChange} />
          <SelectedEntriesEmb />
        </div>
        <div className="flex flex-col w-full justify-center items-center gap-y-5">
          <p className={`text-[15px] text-zinc-600`}>NÃO POSSUI CADASTRO?</p>
          <button onClick={handleOpenModal}
            type="button"           
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg w-full"
          >
            CADASTRE-SE
          </button>
        </div>
      </div>
      <div className="flex flex-col border gap-y-2 border-zinc-700 flex-1 rounded-md p-5 justify-start items-start min-h-[95.7vh]">
        {projectItems ? (
          projectItems.itensProject.map((item) => {
            return <ItemsProjects key={item.id} item={item} />
          })
        ) : (
          <div className={`flex justify-center items-center h-full flex-1 w-full flex-col`}>
            <p className={`text-2xl text-green-500`}>1 - SELECIONE UM PROJETO.</p>
            <p className={`text-2xl text-green-500`}>2 - SELECIONE O EMBALADOR.</p>
          </div>
        )}
      </div>
      <ModalEmbCad isOpen={isModalOpen} handleCloseModal={handleCloseModal} />
    </div>
  );
}
