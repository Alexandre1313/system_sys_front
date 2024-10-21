import Link from "next/link";
import { Escola } from "../../../core"

export interface EscolaComponentProps {
    escola: Escola;
}

export default function EscolaComponent({ escola }: EscolaComponentProps) {
    return (
        <Link className="flex w-auto h-auto hover:underline hover:bg-opacity-20 p-1 
        rounded transition duration-300" href={`/grades/${escola.id}`} target={'GRADES'}>
            <div className="flex w-[100%] gap-x-6 items-start">
                <div className="flex items-center justify-start min-w-[25px] lg:w-[25px]">
                    <span className="text-[13px] font-semibold lg:text-[14px] text-yellow-500">
                        {escola.id}
                    </span>
                </div>
                <div className="flex items-center justify-start ">
                    <span className="text-[13px] font-semibold lg:text-[14px] text-slate-400">
                        {escola.nome}
                    </span>
                </div>
            </div>
        </Link>
    )
}
