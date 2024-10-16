"use client";

import EscolaComponent from '@/components/Componentes_Escola/EscolaComponent';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Agora use o useParams
import { Escola, Projeto } from '../../../../core';
import { getProjetosComEscolas } from '@/hooks_api/api';
import TitleComponent from '@/components/componentes_de interface/TitleComponent';

export default function Escolas() {
    const { d } = useParams();

    const [projeto, setProjeto] = useState<Projeto | null>(null);
    const [primeiraParte, setPrimeiraParte] = useState<Escola[]>([]);
    const [segundaParte, setSegundaParte] = useState<Escola[]>([]);
    const [terceiraParte, setTerceiraParte] = useState<Escola[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        //if (!id) return; // Só faz a chamada se o 'id' estiver disponível

        const fetchData = async () => {
            setLoading(true);
            try {
                // Faz a chamada para obter o projeto com escolas baseado no ID
                const projetoComEscolas = await getProjetosComEscolas(+d);

                if (projetoComEscolas && projetoComEscolas.escolas) {
                    const escolas = projetoComEscolas.escolas;

                    // Ordena as escolas alfabeticamente pelo nome
                    const escolasOrdenadas = escolas.sort((a, b) => a.nome.localeCompare(b.nome));

                    // Divide as escolas em duas metades
                    const terco = Math.ceil(escolasOrdenadas.length / 3);
                    setPrimeiraParte(escolasOrdenadas.slice(0, terco));
                    setSegundaParte(escolasOrdenadas.slice(terco, terco * 2));
                    setTerceiraParte(escolasOrdenadas.slice(terco * 2));
                    // Define o projeto no estado
                    setProjeto(projetoComEscolas as Projeto);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro desconhecido');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [d]);

    if (loading) {
        return <div className='flex w-full min-h-[95vh] items-center justify-center text-2xl'>Carregando...</div>;
    }

    if (error) {
        return (
            <div className='flex items-center justify-center min-h-[95vh] w-[100%]'>
                <p style={{ color: 'red', fontSize: '25px', fontWeight: '700' }}>Erro: {error}</p>
            </div>
        );
    }

    return (
        <div className='flex flex-col p-2 lg:p-7'>
            <div className="flex flex-col items-center min-h-[95vh] bg-zinc-900 pt-7 lg:pt-7 rounded-md">
                <TitleComponent title={"ESCOLAS"}/>
                <h2 className='text-green-500 text-sm pt-6'>{`MUNICÍPIO DE ${projeto?.nome}`}</h2>
                <div className="flex flex-col lg:flex-row justify-between min-h-[95vh]
                 bg-zinc-900 p-2 lg:p-7 rounded-md lg:pt-12 w-full pt-7">
                    {/* Primeira parte das escolas */}
                    <div className="flex flex-col justify-start pl-5 w-[100%] lg:w-1/3 p-2 gap-y-3 border-l border-neutral-700">
                        {primeiraParte.map((escola) => (
                            <EscolaComponent key={escola.id} escola={escola} />
                        ))}
                    </div>

                    {/* Segunda parte das escolas */}
                    <div className="flex flex-col justify-start pl-5 w-[100%] lg:w-1/3 p-2 gap-y-3 border-l border-neutral-700">
                        {segundaParte.map((escola) => (
                            <EscolaComponent key={escola.id} escola={escola} />
                        ))}
                    </div>
                    {/* Segunda parte das escolas */}
                    <div className="flex flex-col justify-start pl-5 w-[100%] lg:w-1/3 p-2 gap-y-3 border-l border-neutral-700">
                        {terceiraParte.map((escola) => (
                            <EscolaComponent key={escola.id} escola={escola} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
