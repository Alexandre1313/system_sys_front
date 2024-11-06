'use client'

import { getProjectsItems } from '@/hooks_api/api';  
import useSWR from 'swr';  
import { ProjectItems } from '../../../core';  
import IsLoading from '@/components/Componentes_Interface/IsLoading';  
import SelectedEnties from '@/components/componentes_entradas/SelectedEnties';

const fetcher = async (): Promise<ProjectItems[]> => {
  const resp = await getProjectsItems(); 
  return resp;  
};

export default function EntradasEmbalagem() {
  const { data: projetosItens, error, isValidating } = useSWR<ProjectItems[]>('projetos-itens', fetcher, {
    revalidateOnFocus: false,  
    refreshInterval: 5 * 60 * 60 * 1000,  
  });

  if (isValidating) {
    return <IsLoading />  
  }

  const selectedItems = () => {}

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
          <SelectedEnties selectedItems={selectedItems}/>
      </div>
      <div className="flex border border-zinc-700 flex-1 rounded-md p-5 justify-start items-start min-h-[95.7vh]">       
        <div>{JSON.stringify(projetosItens)}</div> 
      </div>
    </div>
  );
}
