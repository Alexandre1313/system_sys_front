'use client';

import { useEffect, useState } from 'react';
import { CreateServerSelectComponentProjects } from '@/components/componentes_Romaneios/createServerSelectComponentProjects';
import { CreateServerSelectComponentDates } from '@/components/componentes_Romaneios/createServerSelectComponentDates';
import TitleComponentFixed from '@/components/componentes_Interface/TitleComponentFixed';

export default function RomaneiosDespacho() {
    const [serverSelect, setServerSelect] = useState<JSX.Element | null>(null);
    const [serverSelectDate, setServerSelectDate] = useState<JSX.Element | null>(null);
    const [projectId, setProjectId] = useState<number | null>(null);

    const handleSelectChange = (selectedProjectId: number) => {       
        setProjectId(selectedProjectId);
    };

    const handleSelectChangeDate = (dateSelected: string) => {
        console.log('Data selecionada:', dateSelected);
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

    return (
        <div className="flex flex-col p-2 lg:p-1">
            <div className="flex flex-col items-center min-h-[95vh] pt-7 lg:pt-1 rounded-md">
                <TitleComponentFixed stringOne={`ROMANEIOS DE DESPACHO`} />
                <div className={`flex w-full gap-x-5 p-7 pt-14`}>
                    {serverSelect ? (
                        serverSelect
                    ) : (
                        <p className={`flex w-[350px] bg-zinc-900 p-1 text-lg text-zinc-400 
                        outline-none cursor-pointer`}>AGUARDE...</p>
                    )}
                    {serverSelectDate ? (
                        serverSelectDate
                    ) : (
                        projectId ? <p className={`flex w-[350px] bg-zinc-900 p-1 text-lg text-zinc-400
                         outline-none cursor-pointer`}>AGUARDE...</p> : null
                    )}
                </div>
            </div>
        </div>
    );
}
