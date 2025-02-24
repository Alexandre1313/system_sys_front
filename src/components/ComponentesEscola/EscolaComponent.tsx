import Link from "next/link";
import { Grade } from "../../../core";

export interface EscolaComponentProps {
    escola: any;
}

export default function EscolaComponent({ escola }: EscolaComponentProps) {
    // Verifica se há alguma grade com 'finalizada' = false    
    const oneExpedida = escola.grades.some((grade: Grade) => grade.status === "EXPEDIDA" || grade.status === "DESPACHADA");
    const todasExpedidas = escola.grades.every((grade: Grade) => grade.status === "EXPEDIDA" || grade.status === "DESPACHADA");
    const desativado = false; //oneExpedida && todasExpedidas;

    // Define a classe de estilo dependendo do estado das grades
    const statusClass = oneExpedida && !todasExpedidas ? "text-cyan-500" : oneExpedida && todasExpedidas ? "text-green-600" : "text-slate-200";

    return (
        <Link
            className={`flex w-auto h-auto hover:underline hover:bg-opacity-20 p-1 rounded transition duration-300 ${statusClass} ${desativado ? "pointer-events-none opacity-50" : ""}`}
            href={desativado ? "#" : `/grades/${escola.id}`}
            target={'_GRADES'}
        >
            <div className="flex w-[100%] gap-x-6 items-start">
                <div className="flex items-center justify-start min-w-[25px] lg:w-[25px]">
                    <span className="text-[14px] font-light lg:text-[14px] text-yellow-300">
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
