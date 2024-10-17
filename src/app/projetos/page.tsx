'use client'

import { useEffect, useState } from 'react';
import ProjetoComponent from "@/components/Componentes_Projeto/ProjetoComponent";
import { get } from "../../hooks_api/api";
import { Projeto } from '../../../core'; // Importa a interface Projeto
import TitleComponent from '@/components/Componentes_Interface/TitleComponent';
import Carregando from '@/components/Componentes_Interface/Carregando';
import TitleComponentFixed from '@/components/Componentes_Interface/TitleComponentFixed';

export default function Projetos() {  
    const [projetos, setProjetos] = useState<Projeto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Começa o carregamento
            try {
                const data = await get("P");
                setProjetos(data as Projeto[]);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro desconhecido');
            } finally {
                setLoading(false); // Finaliza o carregamento
            }
        };
        fetchData();
    }, []);

    if (error) {
        return (
            <div className='flex items-center justify-center min-h-[100%] w-[100%]'>
                <p style={{ color: 'red', fontSize: '25px', fontWeight: '700' }}>Erro: {error}</p>
            </div>
        )
    }

    return (
        <>
            <div className="flexColCS p-4 pt-14">
                <TitleComponentFixed stringOne={`PROJETOS`}/>
                <div className="flexColCS min-h-[96vh] border border-transparent rounded-lg
                 p-4 pt-7 lg:p-9 gap-y-5 lg:gap-y-10">
                    <div className="flexRRFE max-w-[1200px] border border-transparent 
                      rounded-lg gap-x-12 flex-wrap gap-y-12 p-1 lg:p-3">
                        {loading ? (
                            <Carregando quantidade={3} />
                        ) : (
                            projetos
                                .sort((a, b) => {
                                    // Ordenação pela propriedade `nome` em ordem alfabética
                                    if (a.nome < b.nome) return -1;
                                    if (a.nome > b.nome) return 1;
                                    return 0;
                                })
                                .map((p) => (
                                    <ProjetoComponent key={p.id} projeto={p} />
                                ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
