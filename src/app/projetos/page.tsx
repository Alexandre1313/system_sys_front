'use client';

import useSWR from 'swr';
import ProjetoComponent from "@/components/Componentes_Projeto/ProjetoComponent";
import { Projeto } from '../../../core'; // Importa a interface Projeto
import TitleComponentFixed from '@/components/Componentes_Interface/TitleComponentFixed';
import { get } from "../../hooks_api/api";
import IsLoading from '@/components/Componentes_Interface/IsLoading';

// Defina a função fetcher garantindo que ela retorne o tipo correto
const fetcher = async (): Promise<Projeto[]> => {
    const data = await get("P");
    return data as Projeto[];
};

export default function Projetos() {
    // Use o SWR com a chave e o fetcher definidos corretamente
    const { data: projetos, error, isValidating } = useSWR<Projeto[]>('projetos', fetcher, {
        revalidateOnFocus: false, // Configuração opcional para evitar novas buscas ao focar na aba
        refreshInterval: 5 * 60 * 60 * 1000, // Atualiza a cada 5 horas
    });

    // Exibe uma mensagem de carregamento enquanto os dados estão sendo buscados
    if (isValidating) {
        return <IsLoading/>
    }

    if (error) {
        return (
            <div className='flex items-center justify-center min-h-[95vh] w-[100%]'>
                <p style={{ color: 'red', fontSize: '25px', fontWeight: '700' }}>Erro: {error.message}</p>
            </div>
        );
    }

    return (
        <>
            <div className="flexColCS p-4 pt-14">
                <TitleComponentFixed stringOne={`PROJETOS`} />
                <div className="flexColCS min-h-[96vh] border border-transparent rounded-lg
         p-4 pt-7 lg:p-9 gap-y-5 lg:gap-y-10">
                    <div className="flexRRFE max-w-[1200px] border border-transparent 
            rounded-lg gap-x-12 flex-wrap gap-y-12 p-1 lg:p-3">
                        {
                            projetos && projetos.length > 0 ? (
                                projetos
                                    .sort((a, b) => a.nome.localeCompare(b.nome)) // Usando localeCompare para ordenar por nome
                                    .map((p) => (
                                        <ProjetoComponent key={p.id} projeto={p} />
                                    ))
                            ) : (
                                <p>Nenhum projeto encontrado.</p>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    );
}
