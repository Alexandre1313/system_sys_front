'use client';

import ListaCaixas from '@/components/ComponentesInterface/ListaCaixas';
import TitleComponentFixed from '@/components/ComponentesInterface/TitleComponentFixed';
import { useState, useEffect } from 'react';
import { Caixa } from '../../../../core';
import { useParams } from 'next/navigation';
import { getCaixasPorGrade } from '@/hooks_api/api';
import IsLoading from '@/components/ComponentesInterface/IsLoading';

const fachBox = async (id: string): Promise<Caixa[]> => {
    const caixas = await getCaixasPorGrade(id);
    return caixas;
};

export default function PaginaCaixas() {
    const [tema, setTema] = useState<boolean>(false); // false = escuro
    const [caixas, setCaixas] = useState<Caixa[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalGradeC, setTotalGradeC] = useState<number>(0);
    const [totalGradeI, setTotalGradeI] = useState<number>(0);

    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                setLoading(true);
                const box = await fachBox(id as string);
                setCaixas(box);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const setTotal = (num: number, num1: number) => {
        setTotalGradeC(num);
        setTotalGradeI(num1);
    }

    const colorButons = tema ? 'bg-zinc-300 text-zinc-950 hover:bg-zinc-200' : 'bg-zinc-700 text-white hover:bg-zinc-600';

    return (
        <div className={`flex w-full ${tema ? 'bg-[#FFFFFF]' : 'bg-[#181818]'} flex-col min-h-[101vh] pt-[80px]`}>
            <TitleComponentFixed stringOne="LISTAGEM DE CAIXAS DA GRADE DE ID " stringTwo={`${id}`} />
            <div className={`flex w-full items-center justify-end fixed top-12 left-0 px-4 pt-4`}>
                <div className={`flex flex-row gap-y-2 uppercase`}>
                    <span className={`flex text-[20px] text-slate-300 items-center justify-end`}>Total da grade por caixa:</span>
                    <span className={`flex text-[20px] min-w-[200px] items-center justify-start text-yellow-500`}>{totalGradeC}</span>
                    <span className={`flex text-[20px] text-slate-300 items-center justify-end`}>Total da grade por itens:</span>
                    <span className={`flex text-[20px] min-w-[200px] items-center justify-start text-emerald-500`}>{totalGradeI}</span>
                </div>
                <div>
                    {/* Botão mudar tema */}
                    <button onClick={() => setTema(prev => !prev)} className={`px-6 py-1 min-w-[50px] h-[34px] rounded-md ${colorButons}`}>
                        {tema ? "E" : "C"}
                    </button>
                </div>
            </div>
            <div className="flex flex-col w-full justify-start items-center gap-y-1 pb-4">
                <div className="flex justify-center items-center w-full px-32">
                    {loading ? (
                        <IsLoading color={tema} />
                    ) : caixas.length === 0 ? (
                        <div className="flex flex-row flex-wrap gap-y-1 gap-x-5 items-center justify-center min-h-[80vh] w-full">
                            <p className={`text-center text-lg py-10 ${tema ? 'text-zinc-600' : 'text-zinc-400'}`}>
                                {`Nenhuma caixa encontrada para a grade de id ${id}.`}
                            </p>
                        </div>
                    ) : (
                        <ListaCaixas caixas={caixas} tema={tema} setTotalGrade={setTotal} />
                    )}
                </div>
            </div>
        </div>
    );
}
