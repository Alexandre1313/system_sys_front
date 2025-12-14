import CaixaItem from "../../../core/interfaces/CaixaItem";

export interface CaixaResumeItemsProps {
    caixaItem: CaixaItem[] | null | undefined;
}

export default function CaixaResume({ caixaItem }: CaixaResumeItemsProps) {
    // Calcula o total de itemQty antes de renderizar o JSX
    const total = caixaItem?.reduce((acc, item) => acc + (item?.itemQty || 0), 0) || 0;
    return (
        <div className="flex flex-col min-w-[100%] lg:max-h-[50vh] lg:gap-y-3 gap-y-1 overflow-scroll max-h-[35vh] pt-3">
            {caixaItem && caixaItem.map((item, index) => (
                <div key={index} className="flex flex-col w-full justify-start items-center gap-x-2 px-3">
                    <div className="lg:flex hidden lg:flex-row w-full justify-start items-center gap-x-2">
                        <span className="lg:text-xl text-slate-300 font-bold">{item?.itemName}</span>
                        <span className="lg:text-xl text-slate-700 font-bold">{`-`}</span>
                        <span className="lg:text-xl text-slate-300 font-bold">{item?.itemGenero}</span>
                        <span className="lg:text-xl text-slate-700 font-bold">{`- TAM - `}</span>
                        <span className="lg:text-xl text-slate-300 font-bold">{item?.itemTam}</span>
                    </div>
                    <div className="lg:hidden flex flex-col items-start justify-center w-full gap-x-2">                      
                        <span className="lg:text-xl text-sm text-slate-100 font-bold w-{99%] truncate">{`${item?.itemName}`}</span>
                        <span className="lg:text-xl text-sm text-slate-300 font-bold">{`${item?.itemGenero} - TAM: ${item?.itemTam}`}</span>
                    </div>
                    <div className="flex flex-row w-full justify-start items-center gap-x-2 pt-2">
                        <span className="lg:text-xl text-sm text-teal-400 font-bold">{item?.itemQty}</span>
                        <span className="lg:text-xl text-sm text-slate-700 font-bold">{item?.itemQty === 1 ? `UNIDADE` : `UNIDADES`}</span>
                    </div>
                </div>
            ))}
            <div className="flex flex-row w-full justify-start items-center gap-x-2 p-3">
                <span className="lg:text-2xl text-[1rem] text-slate-400 font-bold">{`TOTAL:`}</span>
                <span className="lg:text-2xl text-[1rem] text-sky-400 font-bold">{total}</span>
                <span className="lg:text-2xl text-[1rem] text-slate-700 font-bold">{total === 1 ? `UNIDADE` : `UNIDADES`}</span>
            </div>
        </div>
    );
}
