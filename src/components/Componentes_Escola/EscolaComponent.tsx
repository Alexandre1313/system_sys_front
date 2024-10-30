import Link from "next/link";
import { Escola } from "../../../core"

export interface EscolaComponentProps {
    escola: Escola;
}

export default function EscolaComponent({ escola }: EscolaComponentProps) {
    return (
        <Link className="flex w-auto h-auto hover:underline hover:bg-opacity-20 p-1 
        rounded transition duration-300" href={`/grades/${escola.id}`} target={'_GRADES'}>
            <div className="flex w-[100%] gap-x-6 items-start">
                <div className="flex items-center justify-start min-w-[25px] lg:w-[25px]">
                    <span className="text-[13px] font-light lg:text-[13px] text-yellow-300">
                        {escola.numeroEscola}
                    </span>
                </div>
                <div className="flex items-center justify-start ">
                    <span className="text-[13px] font-light lg:text-[13px] text-slate-300">
                        {escola.nome}
                    </span>
                </div>
            </div>
        </Link>
    )
}
