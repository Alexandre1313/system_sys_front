import Link from "next/link";
import { analyzerStatus } from "../../../core/utils/tools";

export interface EscolaComponentProps {
    escola: any;
}

export default function EscolaComponent({ escola }: EscolaComponentProps) {        
   
    const objectStatus = analyzerStatus(escola.grades);    

    return (
        <Link
            className={`flex w-auto h-auto hover:underline hover:bg-opacity-20 p-1 rounded transition duration-300 ${objectStatus.statusClass} ${objectStatus.desactiv ? "pointer-events-none opacity-40 cursor-not-allowed" : ""}`}
            href={objectStatus.desactiv ? "#" : `/grades/${escola.id}`}
            target={'_GRADES'}
        >
            <div className="flex w-[100%] gap-x-6 items-start">
                <div className="flex items-center justify-start min-w-[25px] lg:w-[25px]">
                    <span className="text-[14px] font-light lg:text-[14px] text-yellow-200">
                        {escola.numeroEscola}
                    </span>
                </div>
                <div className="flex items-center justify-start">
                    <span className={`text-[14px] font-light lg:text-[14px] ${objectStatus.statusClass}`}>
                        {escola.nome}
                    </span>
                </div>
            </div>
        </Link>
    );
}
