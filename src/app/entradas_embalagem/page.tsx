'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { getEmb, getProjectsItems, getProjectsSimp } from '@/hooks_api/api';
import IsLoading from '@/components/componentes_Interface/IsLoading';
import SelectedEntries from '@/components/componentes_entradas/SelectedEntries';
import { ProjectItems, ProjetosSimp, Embalagem } from '../../../core';
import ItemsProjects from '@/components/componentes_entradas/ItemsProjects';
import SelectedEntriesEmb from '@/components/componentes_entradas/SelectedEntriesEmb';
import ModalEmbCad from '@/components/componentes_Interface/ModalEmbCad';
import ModalItemDetails from '@/components/componentes_entradas/ModalItemDetails';

// Função fetcher para carregar todos os projetos
const fetcherProjects = async (): Promise<ProjetosSimp[]> => {
  const resp = await getProjectsSimp();
  return resp;
};

// Função fetcher para carregar todas as embalagens
const fetcherEmb = async (): Promise<Embalagem[]> => {
  const resp = await getEmb();
  return resp;
};

// Função fetcher para carregar itens de um projeto específico
const fetcherItems = async (projectId: number): Promise<ProjectItems> => {
  const resp = await getProjectsItems(+projectId);
  return resp;
};

export default function EntradasEmbalagem() {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedEmbalagem, setSelectedEmbalagem] = useState<Embalagem | null | undefined>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpenEmb, setModalOpenEmb] = useState(false);
  const [formData, setFormData] = useState<any>({CODBARRASLEITURA: ''});
  const [selectedItem, setSelectedItem] = useState<ProjectItems['itensProject'][0] | null>(null); 

  // Carregar todos os projetos usando SWR
  const { data: projetos, error: errorProjetos, isValidating: isValidatingProjetos } = useSWR<ProjetosSimp[]>('projetos', fetcherProjects, {
    revalidateOnFocus: false,
    refreshInterval: 5 * 60 * 60 * 1000,
  });

  // Carregar todas as embalagens usando SWR
  const { data: embalagens, error: errorEmbalagens, isValidating: isValidatingEmbalagens, mutate: swrMutate } = useSWR<Embalagem[] | null | undefined>('embalagens', fetcherEmb, {
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

  const handleProjectChange = (projectId: number) => {
    setSelectedProjectId(projectId);
  };

  const handleFormDataChange = (form: any) => {
    setFormData(form);
  };

  const handleEmbalagemChange = (embalagem: Embalagem | null | undefined) => {
    setSelectedEmbalagem(embalagem);
  };

  const handleItemClick = (item: ProjectItems['itensProject'][0]) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const handleCloseModalEmb = () => {
    setModalOpenEmb(false);    
  };

  if (isValidatingProjetos && !isValidatingItems && !isValidatingEmbalagens) return <IsLoading />;

  if (errorProjetos || errorItems || errorEmbalagens) {
    return (
      <div className="flex items-center justify-center min-h-[96vh] w-[100%]">
        <p style={{ color: 'red', fontSize: '25px', fontWeight: '700' }}>
          Erro: {errorProjetos?.message || errorItems?.message || errorEmbalagens?.message}
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
          <SelectedEntriesEmb embalagens={embalagens} onSelectChangeEmb={handleEmbalagemChange} />
        </div>
        <div className="flex flex-col w-full justify-center items-center gap-y-5">
          <p className={`text-[15px] text-zinc-600`}>NÃO POSSUI CADASTRO?</p>
          <button onClick={() => setModalOpenEmb(true)}
            type="button"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg w-full"
          >
            CADASTRE-SE
          </button>
        </div>
      </div>
      <div className="flex flex-col border-0 gap-y-2 border-zinc-700 flex-1 rounded-md p-0 justify-start items-start min-h-[95.7vh]">
        {projectItems ? (
          projectItems.itensProject.map((item) => (
            <ItemsProjects key={item.id} item={item} onClick={() => handleItemClick(item)} />
          ))
        ) : (
          <div className={`flex justify-center items-center h-full flex-1 w-full flex-col`}>
            <p className={`text-2xl text-green-500`}>1 - SELECIONE UM PROJETO.</p>
            <p className={`text-2xl text-green-500`}>2 - SELECIONE O EMBALADOR.</p>
          </div>
        )}
      </div>
      {selectedItem && (
        <ModalItemDetails
          isOpen={isModalOpen}
          item={selectedItem}
          embalagem={selectedEmbalagem}
          formData={formData}
          setFormData={handleFormDataChange}
          onClose={handleCloseModal}
        />
      )}
      <ModalEmbCad isModalOpenEmb={isModalOpenEmb} handleCloseModalEmb={handleCloseModalEmb} mutate={swrMutate} />
    </div>
  );
}
