import Caixa from "../../../core/interfaces/Caixa";
import CaixaResumeItems from "./CaixaResumeItems";

export interface CaixaResumeProps{
    caixa: Caixa | null;
}

export default function CaixaResume({ caixa }: CaixaResumeProps) {
    return (
        <div className={`shadow-lg flex flex-col min-w-[100%] gap-y-3 border border-zinc-800 rounded-lg p-1 min-h-[270px]`}>
            <div className={`flex flex-row w-full justify-start items-center gap-x-2 border border-zinc-800 rounded-lg p-3`}>
                <span className={`text-4xl text-black font-bold`}>{caixa?.escolaNumber}</span>
                <span className={`text-2xl text-black font-bold`}>{`-`}</span>
                <span className={`text-4xl text-black font-bold`}>{caixa?.projeto}</span>
            </div>
            <div className={`flex flex-row w-full justify-start items-center gap-x-2 px-3`}>
                <span className={`text-xl text-black font-bold`}>{caixa?.escolaCaixa}</span>
            </div>
            <CaixaResumeItems caixaItem={caixa?.caixaItem}/>
        </div>
    )
}
