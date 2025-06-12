'use client';

import ListaCaixas from '@/components/ComponentesInterface/ListaCaixas';
import TitleComponentFixed from '@/components/ComponentesInterface/TitleComponentFixed';
import { useState, useEffect } from 'react';
import { Caixa } from '../../../../core';
import { useParams } from 'next/navigation';
import { getCaixasPorGrade } from '@/hooks_api/api';

const fachBox = async (id: string): Promise<Caixa[]> => {
    const caixas = await getCaixasPorGrade(id);
    return caixas;
};

export default function PaginaCaixas() {
    const [tema, setTema] = useState<boolean>(false); // false = escuro
    const [caixas, setCaixas] = useState<Caixa[]>([]);

    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                const box = await fachBox(id as string);
                setCaixas(box);
            }
        };
        fetchData();
    }, [id]);

    return (
        <div className={`flex w-full ${tema ? 'bg-[#FFFFFF]' : 'bg-[#181818]'} flex-col min-h-[101vh] pt-[80px]`}>
            <TitleComponentFixed stringOne="LISTAGEM DE CAIXAS POR GRADE" />
            <div className="flex flex-col w-full justify-start items-center gap-y-1 pb-6">
                <div className="flex justify-center items-start w-full px-32">
                    <ListaCaixas caixas={caixas} tema={tema} />
                </div>
                <button
                    className="mt-4 px-4 py-2 rounded border border-zinc-500 text-sm"
                    onClick={() => setTema(prev => !prev)}
                >
                    Alternar Tema
                </button>
            </div>
        </div>
    );
}
