import Caixa from "../../../core/interfaces/Caixa";
import CaixaResumeItems from "./CaixaResumeItems";

export interface CaixaResumeProps{
    caixa: Caixa | null;
}

export default function CaixaResume({ caixa }: CaixaResumeProps) {
    return (
        <div className={`shadow-lg flex flex-col min-w-[100%] lg:gap-y-3 gap-y-1 border border-zinc-800 rounded-lg p-1 min-h-[270px]`}>
            <div className={`flex flex-row w-full justify-start items-center gap-x-2 border border-zinc-800
                 rounded-lg lg:p-3 p-1`}>               
                <span className={`lg:text-4xl text-2xl text-black font-bold`}>{caixa?.projeto}</span>
                <span className={`lg:text-2xl text-xl text-black font-bold`}>{`- CX `}</span>
                <span className={`lg:text-4xl text-2xl text-black font-bold`}>{caixa?.caixaNumber?.padStart(2, '0')}</span>                
            </div>
            <div className={`flex flex-row w-full justify-start items-center gap-x-2 px-3 border-b border-slate-200`}>
                <span className={`lg:text-2xl text-[1.05rem] text-black font-bold`}>{caixa?.escolaCaixa}</span>
            </div>
            <CaixaResumeItems caixaItem={caixa?.caixaItem}/>
        </div>
    )
}
