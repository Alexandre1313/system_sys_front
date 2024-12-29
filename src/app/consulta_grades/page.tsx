'use client'

import TitleComponentFixed from '@/components/ComponentesInterface/TitleComponentFixed';
import { CreateServerSelectComponentDates } from '@/components/componentesRomaneios/createServerSelectComponentDates';
import { CreateServerSelectComponentProjects } from '@/components/componentesRomaneios/createServerSelectComponentProjects';
import TabelaExpedicao from '@/components/consultaGrades/TabelaExpedicao';
import { getProjectsGradesSaldos } from '@/hooks_api/api';
import { useEffect, useState } from 'react';
import { GradeOpenBySchool } from '../../../core';
import useSWR from 'swr';
import IsLoading from '@/components/ComponentesInterface/IsLoading';

const fetcherGradesPDateSaldos = async (projectId: number, dateStr: string): Promise<GradeOpenBySchool[]> => {
    const resp = await getProjectsGradesSaldos(String(projectId), String(dateStr));
    return resp;
};

export default function ConsultaStatusGrades() {
    const [projectId, setProjectId] = useState<number | null>(null);
    const [serverSelect, setServerSelect] = useState<JSX.Element | null>(null);
    const [serverSelectDate, setServerSelectDate] = useState<JSX.Element | null>(null);
    const [dateStr, setDateStr] = useState<string | null>(null);

    // Condicional para carregar os dados apenas quando projectId e dateStr estiverem definidos
    const { data: grades, isValidating } = useSWR(
        projectId && dateStr ? [projectId, dateStr] : null,
        () => fetcherGradesPDateSaldos(projectId!, dateStr!),
        {
            revalidateOnFocus: false,
            refreshInterval: 5 * 60 * 1000,
        }
    );

    // Mudança no projeto - reseta a data
    const handleSelectChange = (selectedProjectId: number) => {
        setProjectId(selectedProjectId);
        setDateStr(null); // Resetar a data quando o projeto mudar
    };

    // Mudança na data selecionada
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
                <div className="flex items-center justify-center w-full h-[82vh]">
                    <IsLoading />
                </div>
            );
        }

        if (!grades || grades.length === 0) {
            return (
                <div className="flex items-center justify-center w-full h-[82vh]">
                    <p className="text-lg text-blue-500">NÃO HÁ GRADES PARA O PROJETO OU A DATA PESQUISADA.</p>
                </div>
            );
        }

        return (
            <TabelaExpedicao expedicaoData={grades || []} />
        )
    };

    return (
        <div className="flex flex-col w-full items-start justify-center bg-[#181818]">
            <TitleComponentFixed stringOne={`GRADES EM EXPEDIÇÃO`} />
            <div className="flex flex-col items-center justify-start min-h-[95vh] pt-7 gap-y-5 w-full">
                <div className={`flex w-full p-[1.1rem] pt-8 fixed bg-[#1F1F1F] gap-x-5`}>
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
                <div className="flex w-[100%] flex-col items-center justify-start pt-24">
                    {renderGrades()}
                </div>
            </div>
        </div>
    );
}
