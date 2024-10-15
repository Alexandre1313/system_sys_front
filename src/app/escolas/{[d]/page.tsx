"use client"

import EscolaComponent from '@/components/Componentes_Escola/EscolaComponent';
import { useEffect, useState } from 'react';
import { Escola, Projeto } from '../../../../core';
import { getProjetosComEscolas } from '@/hooks_api/api';

export default interface EscolasProps {
    id: string;
}

export default function Escolas(id: string) {
    const [projeto, setProjeto] = useState<Projeto | null>(null);
    const [primeiraMetade, setPrimeiraMetade] = useState<Escola[]>([]);
    const [segundaMetade, setSegundaMetade] = useState<Escola[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); 

    useEffect(() => {
        if (escolas && escolas.length > 0) {
            // Ordena as escolas em ordem alfabética pelo nome
            const escolasOrdenadas = [...escolas].sort((a, b) => a.nome.localeCompare(b.nome));

            // Encontra o ponto do meio
            const meio = Math.ceil(escolasOrdenadas.length / 2);

            // Divide o array de escolas em duas metades
            setPrimeiraMetade(escolasOrdenadas.slice(0, meio));
            setSegundaMetade(escolasOrdenadas.slice(meio));
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getProjetosComEscolas(+id);
                const escolasOrdenadas = [...data].sort((a, b) => a.nome.localeCompare(b.nome));
                setProjeto(data as Projeto);
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
        <div className="flex justify-between">
            {/* Div para a primeira metade das escolas */}
            <div className="w-1/2 p-2">
                {primeiraMetade.map((escola) => (
                    <EscolaComponent key={escola.id} escola={escola} />
                ))}
            </div>

            {/* Div para a segunda metade das escolas */}
            <div className="w-1/2 p-2">
                {segundaMetade.map((escola) => (
                    <EscolaComponent key={escola.id} escola={escola} />
                ))}
            </div>
        </div>
    );
}