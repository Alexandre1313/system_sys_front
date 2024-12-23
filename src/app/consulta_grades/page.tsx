'use client'

import TitleComponentFixed from "@/components/ComponentesInterface/TitleComponentFixed";
import { CreateServerSelectComponentProjects } from "@/components/componentesRomaneios/createServerSelectComponentProjects";
import { useEffect, useState } from "react";

export default function ConsultaDeGradesSit() {
    const [serverSelect, setServerSelect] = useState<JSX.Element | null>(null);
    const [projectId, setProjectId] = useState<number | null>(null);
    //const [stockRender, setStockRender] = useState<JSX.Element | null>(null);

    const handleSelectChange = (selectedProjectId: number) => {
        setProjectId(selectedProjectId);
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
            return
        }
        // Monta o componente de saldos
        async function fetchServerStock() {

        }
        fetchServerStock();
    }, [projectId]);
    return (
        <div className="flex flex-col w-full items-start justify-center bg-[#181818]">
            <TitleComponentFixed stringOne={`STATUS DE GRADES`} />
            <div className="flex flex-col items-center justify-start min-h-[95vh] pt-7 gap-y-5 w-full">
                <div className={`flex w-full p-[1.1rem] pt-8 fixed bg-[#1F1F1F]`}>
                    {serverSelect || (
                        <div className="flex flex-col justify-center items-start">
                            <p className="flex w-[310px] bg-[#181818] py-2 px-2 pl-3 text-[14px] text-zinc-400 border border-zinc-800 outline-none cursor-pointer h-[35px]">
                                SELECIONE O PROJETO
                            </p>
                        </div>
                    )}
                </div>
                <div className="flex w-[65%] flex-col items-center justify-start pt-24">

                </div>
            </div>
        </div>
    )
}
