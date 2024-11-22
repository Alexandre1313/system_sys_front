'use client';

import { useEffect, useState } from 'react';
import { CreateServerSelectComponentProjects } from '@/components/componentes_Romaneios/createServerSelectComponentProjects';
import { CreateServerSelectComponentDates } from '@/components/componentes_Romaneios/createServerSelectComponentDates';
import TitleComponentFixed from '@/components/componentes_Interface/TitleComponentFixed';
import { getGradesRoman } from '@/hooks_api/api';
import useSWR from 'swr';
import { GradesRomaneio } from '../../../core';

// Função fetcher para carregar todos as grades por data
const fetcherGradesPDate = async (projectId: number, dateStr: string): Promise<GradesRomaneio[]> => {
    const resp = await getGradesRoman(String(projectId), String(dateStr));
    return resp;
};

export default function RomaneiosDespacho() {
    const [serverSelect, setServerSelect] = useState<JSX.Element | null>(null);
    const [serverSelectDate, setServerSelectDate] = useState<JSX.Element | null>(null);
    const [projectId, setProjectId] = useState<number | null>(null);
    const [dateStr, setDateStr] = useState<string | null>(null);

    const [grades, setGrades] = useState<GradesRomaneio[] | null>(null);

    const handleSelectChange = (selectedProjectId: number) => {
        setProjectId(selectedProjectId);
    };

    const handleSelectChangeDate = (dateSelected: string) => {
        setDateStr(dateSelected);
    };

    useEffect(() => {
        // Busca o componente Select já montado do lado do servidor
        async function fetchServerSelect() {
            const selectComponent = await CreateServerSelectComponentProjects({
                onSelectChange: handleSelectChange,
            });
            setServerSelect(selectComponent);
        }
        fetchServerSelect();
    }, []);

    useEffect(() => {
        if (projectId === null || projectId === 0) {
            setServerSelectDate(null); // Limpa o select de datas se o projeto não for válido            
            return;
        }
        async function fetchServerSelectDates() {
            const selectComponent = await CreateServerSelectComponentDates({
                onSelectChange: handleSelectChangeDate,
                projectId,
            });
            setServerSelectDate(selectComponent);
        }
        fetchServerSelectDates();
    }, [projectId]);

    // Carregar todas as grades por data usando SWR
    const { error: errorGradesPorData, isValidating: isValidatingGradesPorData, mutate: swrMutateGradesPorData } = useSWR(
        projectId && dateStr ? [dateStr] : null,
        () => fetcherGradesPDate(projectId!, dateStr!),
        {
            revalidateOnFocus: false,
            refreshInterval: 120 * 1000,
            onSuccess: (data) => {
                // Atualiza o estado diretamente quando os dados são recebidos
                setGrades(data);
                console.log(grades)
            },
        }
    );

    return (
        <div className="flex flex-col">
            <div className="flex flex-col items-center min-h-[95vh] pt-7 lg:pt-1 rounded-md">
                <TitleComponentFixed stringOne={`ROMANEIOS DE DESPACHO`} />
                <div className={`flex w-full gap-x-5 p-[1.1rem] pt-14 bg-zinc-900`}>
                    {serverSelect ? (
                        serverSelect
                    ) : (
                        <div className={`flex flex-col justify-center items-start`}>
                            <p className={`flex w-[310px] bg-zinc-900 py-2 px-2 pl-3 text-[14px] text-zinc-400 border border-zinc-800
                        outline-none cursor-pointer h-[35px]`}>SELECIONE O PROJETO</p>
                        </div>
                    )}
                    {serverSelectDate ? (
                        serverSelectDate
                    ) : (
                        projectId ? <div className={`flex flex-col justify-center items-start`}>
                            <p className={`flex w-[310px] bg-zinc-900 py-2 px-2 text-[14px] text-zinc-400 border border-zinc-800
                        outline-none cursor-pointer h-[35px]`}>AGUARDE...</p> </div> : null
                    )}
                </div>
            </div>
        </div>
    );
}
