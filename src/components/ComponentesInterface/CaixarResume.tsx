import Caixa from "../../../core/interfaces/Caixa";
import CaixaResumeItems from "./CaixaResumeItems";

export interface CaixaResumeProps {
    caixa: Caixa | null;
}

export default function CaixaResume({ caixa }: CaixaResumeProps) {
    return (
        <div className={`flex flex-col min-w-[100%] lg:max-h-[75vh] max-h-[235px] lg:gap-y-0 gap-y-1 border border-slate-600 rounded-lg p-1 lg:min-h-[1px]`}>
            <div className={`bg-slate-700 flex flex-col rounded-lg`}>
                <div className={`flex flex-row w-full justify-start items-center lg:p-3 p-1 pl-3 gap-x-2`}>
                    <span className={`lg:text-4xl text-xl text-slate-500 font-bold`}>{'CAIXA Nº'}</span>
                    <span className={`lg:text-2xl text-xl text-slate-500 font-bold`}>{`-`}</span>
                    <span className={`lg:text-4xl text-xl text-slate-500 font-bold`}>{caixa?.caixaNumber?.padStart(2, '0')}</span>
                </div>
                <div className={`flex flex-row w-full justify-start items-center gap-x-1 px-3`}>
                    <span className={`lg:text-2xl text-[0.80rem] text-slate-500 font-extralight truncate lg:pb-3 pb-2`}>{caixa?.escolaCaixa}</span>
                </div>
            </div>
            <CaixaResumeItems caixaItem={caixa?.caixaItem} />
        </div>
    )
}
