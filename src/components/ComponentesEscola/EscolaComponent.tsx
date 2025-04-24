import Link from "next/link";
import { Grade } from "../../../core";

export interface EscolaComponentProps {
    escola: any;
}

export default function EscolaComponent({ escola }: EscolaComponentProps) {
    const oneExpedida = escola.grades.some((grade: Grade) => grade.status === "EXPEDIDA" || grade.status === "DESPACHADA");
    const todasExpedidas = escola.grades.every((grade: Grade) => grade.status === "EXPEDIDA" || grade.status === "DESPACHADA");
    const desativado = false; 
    
    const repo = escola.grades.some(
        (grade: Grade) => 
            grade.tipo?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() === "REPOSICAO" 
            && grade.status === "PRONTA"
    );

    let statusClass = "text-slate-200"; 
    
    if (repo) {        
        statusClass = "text-red-500";
    }   
    else if (oneExpedida && !todasExpedidas) {
        statusClass = "text-cyan-500";
    } else if ((oneExpedida && todasExpedidas) || escola.grades.length === 0) {
        statusClass = "text-emerald-400";
    }

    return (
        <Link
            className={`flex w-auto h-auto hover:underline hover:bg-opacity-20 p-1 rounded transition duration-300 ${statusClass} ${desativado ? "pointer-events-none opacity-50" : ""}`}
            href={desativado ? "#" : `/grades/${escola.id}`}
            target={'_GRADES'}
        >
            <div className="flex w-[100%] gap-x-6 items-start">
                <div className="flex items-center justify-start min-w-[25px] lg:w-[25px]">
                    <span className="text-[14px] font-light lg:text-[14px] text-yellow-200">
                        {escola.numeroEscola}
                    </span>
                </div>
                <div className="flex items-center justify-start">
                    <span className={`text-[14px] font-light lg:text-[14px] ${statusClass}`}>
                        {escola.nome}
                    </span>
                </div>
            </div>
        </Link>
    );
}
