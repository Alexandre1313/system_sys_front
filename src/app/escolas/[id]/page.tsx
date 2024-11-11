"use client";

import EscolaComponent from '@/components/componentes_Escola/EscolaComponent';
import { useParams } from 'next/navigation'; // Agora use o useParams
import { Projeto } from '../../../../core';
import { getProjetosComEscolas } from '@/hooks_api/api';
import TitleComponentFixed from '@/components/componentes_Interface/TitleComponentFixed';
import useSWR from 'swr';
import IsLoading from '@/components/componentes_Interface/IsLoading';
import { motion } from 'framer-motion';

// Definindo o fetcher
const fetcher = async (id: number): Promise<Projeto> => {
    const projetoComEscolas = await getProjetosComEscolas(id);
    return projetoComEscolas as Projeto;
};

export default function Escolas() {
    const { id } = useParams();

    // Convertendo 'd' para número. Se 'd' não estiver definido, 'id' será 'undefined'. 

    // Usando SWR para buscar os dados do projeto e escolas, com verificação se 'id' é válido
    const { data: projeto, error, isValidating } = useSWR<Projeto>(
        id !== undefined ? id : null, // Passa 'null' se 'id' for 'undefined', evitando chamada desnecessária
        fetcher, {
        refreshInterval: 2 * 60 * 60 * 1000, // Atualiza a cada 2 horas
        revalidateOnFocus: false, // Revalida ao focar na aba
    }
    );

    // Se a chave não é válida (ou seja, não existe ID), não tenta buscar dados
    if (id === undefined) {
        return <div className='flex items-center justify-center min-h-[95vh] w-[100%]'><p>ID do projeto não está disponível.</p></div>;
    }

    // Exibe uma mensagem de carregamento enquanto os dados estão sendo buscados
    if (isValidating) {
        return <IsLoading />
    }

    // Exibe uma mensagem de erro se a chamada falhar
    if (error) {
        return (
            <div className='flex items-center justify-center min-h-[95vh] w-[100%]'>
                <p style={{ color: 'red', fontSize: '25px', fontWeight: '700' }}>Erro: {error.message}</p>
            </div>
        );
    }

    // Verifica se o projeto e suas escolas estão disponíveis
    if (!projeto || !projeto.escolas) {
        return (
            <div className='flex items-center justify-center min-h-[95vh] w-[100%]'>
                <p style={{ color: 'orange', fontSize: '25px', fontWeight: '700' }}>Nenhum projeto encontrado.</p>
            </div>
        );
    }

    // Ordenando as escolas alfabeticamente pelo nome
    const escolasOrdenadas = projeto.escolas.sort((a, b) => parseInt(a.numeroEscola, 10) - parseInt(b.numeroEscola, 10));

    // Dividindo as escolas em três partes
    const terco = Math.ceil(escolasOrdenadas.length / 3);
    const primeiraParte = escolasOrdenadas.slice(0, terco);
    const segundaParte = escolasOrdenadas.slice(terco, terco * 2);
    const terceiraParte = escolasOrdenadas.slice(terco * 2);
    let cont: number = 0;
    return (
       
        <>
            <div className='flex flex-col p-2 lg:p-7'>
                <div className="flex flex-col items-center min-h-[95vh] pt-7 lg:pt-7 rounded-md">
                    <TitleComponentFixed stringOne={`MUNICÍPIO DE ${projeto.nome}`}
                        twoPoints={`-`}
                        stringTwo={`ESCOLAS`} />
                    <div className="flex flex-col lg:flex-row justify-between lg:min-h-[95vh]
                    p-2 lg:p-7 rounded-md lg:pt-12 w-full pt-7">
                        {/* Primeira parte das escolas */}
                        <div className="flex flex-col justify-start pl-5 w-[100%] lg:w-1/3 p-2 gap-y-1 border-l border-neutral-700">
                            {primeiraParte.map((escola) => (
                                <motion.div
                                    key={escola.id}
                                    initial={{ opacity: 0, y: 20 }} // Começa invisível e um pouco abaixo
                                    animate={{ opacity: 1, y: 0 }} // Anima para visível e na posição correta
                                    transition={{
                                        duration: 0.03,
                                        delay: cont++ * 0.02, // Incrementa o atraso para cada item
                                    }}
                                    style={{
                                        display: 'flex',
                                        padding: '0',
                                        width: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start'
                                    }}
                                >
                                    <EscolaComponent key={escola.id} escola={escola} />
                                </motion.div>                             
                            ))}
                        </div>

                        {/* Segunda parte das escolas */}
                        <div className="flex flex-col justify-start pl-5 w-[100%] lg:w-1/3 p-2 gap-y-1 border-l border-neutral-700">
                            {segundaParte.map((escola) => (
                                <motion.div
                                    key={escola.id}
                                    initial={{ opacity: 0, y: 20 }} // Começa invisível e um pouco abaixo
                                    animate={{ opacity: 1, y: 0 }} // Anima para visível e na posição correta
                                    transition={{
                                        duration: 0.03,
                                        delay: cont++ * 0.02, // Incrementa o atraso para cada item
                                    }}
                                    style={{
                                        display: 'flex',
                                        padding: '0',
                                        width: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start'
                                    }}
                                >
                                    <EscolaComponent key={escola.id} escola={escola} />
                                </motion.div>
                            ))}
                        </div>

                        {/* Terceira parte das escolas */}
                        <div className="flex flex-col justify-start pl-5 w-[100%] lg:w-1/3 p-2 gap-y-1 border-l border-neutral-700">
                            {terceiraParte.map((escola) => (
                                <motion.div
                                    key={escola.id}
                                    initial={{ opacity: 0, y: 20 }} // Começa invisível e um pouco abaixo
                                    animate={{ opacity: 1, y: 0 }} // Anima para visível e na posição correta
                                    transition={{
                                        duration: 0.03,
                                        delay: cont++ * 0.02, // Incrementa o atraso para cada item
                                    }}
                                    style={{
                                        display: 'flex',
                                        padding: '0',
                                        width: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start'
                                    }}
                                >
                                    <EscolaComponent key={escola.id} escola={escola} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
