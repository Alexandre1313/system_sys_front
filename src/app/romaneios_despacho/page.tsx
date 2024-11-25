'use client';

import { useEffect, useState } from 'react';
import { CreateServerSelectComponentProjects } from '@/components/componentes_Romaneios/createServerSelectComponentProjects';
import { CreateServerSelectComponentDates } from '@/components/componentes_Romaneios/createServerSelectComponentDates';
import TitleComponentFixed from '@/components/componentes_Interface/TitleComponentFixed';
import { getGradesRoman } from '@/hooks_api/api';
import useSWR from 'swr';
import { GradesRomaneio } from '../../../core';
import GradeRomaneioTable from '@/components/componentes_Romaneios/GradeRomaneioTable';
import Romaneios from '@/components/componentesDePrint/Romaneios';
import RomaneiosAll from '@/components/componentesDePrint/RomaneiosAll';
import IsLoading from '@/components/componentes_Interface/IsLoading';

// Função fetcher para carregar todas as grades por data
const fetcherGradesPDate = async (projectId: number, dateStr: string): Promise<GradesRomaneio[]> => {
    const resp = await getGradesRoman(String(projectId), String(dateStr));
    return resp;
};

export default function RomaneiosDespacho() {
    const [serverSelect, setServerSelect] = useState<JSX.Element | null>(null);
    const [serverSelectDate, setServerSelectDate] = useState<JSX.Element | null>(null);
    const [projectId, setProjectId] = useState<number | null>(null);
    const [dateStr, setDateStr] = useState<string | null>(null);    
    
    const { data: grades, isValidating} = useSWR(
        projectId && dateStr ? [projectId, dateStr] : null,
        () => fetcherGradesPDate(projectId!, dateStr!),
        {
            revalidateOnFocus: false,
            refreshInterval: 5 * 60 * 1000,
        }
    );

    const handleSelectChange = (selectedProjectId: number) => {
        setProjectId(selectedProjectId);
        setDateStr(null); // Reseta a data ao alterar o projeto
    };

    const handleSelectChangeDate = (dateSelected: string) => {
        setDateStr(dateSelected);
    };

    useEffect(() => {
        // Monta o componente do seletor de projetos
        async function fetchServerSelect() {
            const selectComponent = await CreateServerSelectComponentProjects({
                onSelectChange: handleSelectChange,
            });
            setServerSelect(selectComponent);
        }
        fetchServerSelect();
    }, []);

    useEffect(() => {
        if (!projectId) {
            setServerSelectDate(null); // Limpa o seletor de datas se o projeto for inválido
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

    const renderGrades = () => {
        if (isValidating) {
            return (
                <div className="flex items-center justify-center w-full h-[63vh]">
                    <IsLoading/>
                </div>
            );
        }

        if (!grades || grades.length === 0) {
            return (
                <div className="flex items-center justify-center w-full h-[63vh]">
                    <p className="text-lg text-blue-500">NÃO HÁ GRADES PARA O PROJETO OU A DATA PESQUISADA.</p>
                </div>
            );
        }

        return grades.map((grade, index) => (
            <GradeRomaneioTable key={index} romaneio={[grade]} printRomaneio={(romaneios) => <Romaneios romaneios={romaneios} />} />
        ));
    };

    return (
        <div className="flex flex-col bg-[#181818]">
            <div className="flex flex-col items-center min-h-[95vh] pt-7 lg:pt-1 rounded-md gap-y-5">
                <TitleComponentFixed stringOne={`ROMANEIOS DE DESPACHO`} />
                <div className={`flex w-full gap-x-5 p-[1.1rem] pt-14 bg-[#1F1F1F]`}>
                    {serverSelect || (
                        <div className="flex flex-col justify-center items-start">
                            <p className="flex w-[310px] bg-[#181818] py-2 px-2 pl-3 text-[14px] text-zinc-400 border border-zinc-800 outline-none cursor-pointer h-[35px]">
                                SELECIONE O PROJETO
                            </p>
                        </div>
                    )}
                    {serverSelectDate || (projectId && (
                        <div className="flex flex-col justify-center items-start">
                            <p className="flex w-[310px] bg-[#181818] py-2 px-2 text-[14px] text-zinc-400 border border-zinc-800 outline-none cursor-pointer h-[35px]">
                                AGUARDE...
                            </p>
                        </div>
                    ))}
                </div>
                <div className="flex w-full flex-col items-center p-5 gap-y-10">
                    <div
                        className={`flex flex-col w-full h-[63vh] border border-zinc-800 p-2 overflow-y-scroll bg-[#1F1F1F]`}
                    >
                        {renderGrades()}
                    </div>
                    <div className="flex flex-col w-full min-h-[10vh] bg-[#1f1f1f] justify-center items-center">
                        {grades && grades.length > 0 && <RomaneiosAll romaneios={grades} />}
                    </div>
                </div>
            </div>
        </div>
    );
}
