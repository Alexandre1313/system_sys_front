import Link from "next/link";
import { Grade } from "../../../core";

export interface EscolaComponentProps {
    escola: any;
}

export default function EscolaComponent({ escola }: EscolaComponentProps) {
    // Verifica se há alguma grade com 'finalizada' = false
    const hasIncompleteGrades = escola.grades.some((grade: Grade) => !grade.finalizada);

    // Define a classe de estilo dependendo do estado das grades
    const statusClass = hasIncompleteGrades
        ? "text-slate-300" // Cor para grades não finalizadas
        : "text-green-500"; // Cor para grades finalizadas

    return (
        <Link
            className={`flex w-auto h-auto hover:underline hover:bg-opacity-20 p-1 rounded transition duration-300 ${statusClass}`}
            href={`/grades/${escola.id}`}
            target={'_GRADES'}
        >
            <div className="flex w-[100%] gap-x-6 items-start">
                <div className="flex items-center justify-start min-w-[25px] lg:w-[25px]">
                    <span className="text-[13px] font-light lg:text-[13px] text-yellow-300">
                        {escola.numeroEscola}
                    </span>
                </div>
                <div className="flex items-center justify-start">
                    <span className={`text-[13px] font-light lg:text-[13px] ${statusClass}`}>
                        {escola.nome}
                    </span>
                </div>
            </div>
        </Link>
    );
}
