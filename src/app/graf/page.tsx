'use client'

import Grafico from "@/components/ComponentesInterface/Grafico"
import TitleComponentFixed from "@/components/ComponentesInterface/TitleComponentFixed";

export default function Graf() {
    return (
        <div className={`flex w-full px-6 pt-20 pb-8 min-h-screen max-h-screen flex-col justify-center items-center gap-y-5 bg-black`}>
            <TitleComponentFixed stringOne={`GRÁFICO`}/>
            <h1 className="text-center text-[30px] font-normal">Progresso dos Projetos</h1>
            <div className="flex w-full min-h-full">
                <Grafico />
            </div>
        </div>
    );
}
