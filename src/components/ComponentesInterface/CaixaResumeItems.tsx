import CaixaItem from "../../../core/interfaces/CaixaItem";

export interface CaixaResumeItemsProps {
    caixaItem: CaixaItem[] | null | undefined;
}

export default function CaixaResume({ caixaItem }: CaixaResumeItemsProps) {
    // Calcula o total de itemQty antes de renderizar o JSX
    const total = caixaItem?.reduce((acc, item) => acc + (item?.itemQty || 0), 0) || 0;
    return (
        <div className="flex flex-col min-w-[100%] lg:max-h-[50vh] lg:gap-y-3 gap-y-1 overflow-scroll max-h-[17vh]">
            {caixaItem && caixaItem.map((item, index) => (
                <div key={index} className="flex flex-col w-full justify-start items-center gap-x-2 px-3">
                    <div className="lg:flex hidden lg:flex-row w-full justify-start items-center gap-x-2">
                        <span className="lg:text-xl text-black font-bold">{item?.itemName}</span>
                        <span className="lg:text-xl text-black font-bold">{`-`}</span>
                        <span className="lg:text-xl text-black font-bold">{item?.itemGenero}</span>
                        <span className="lg:text-xl text-black font-bold">{`- TAM - `}</span>
                        <span className="lg:text-xl text-black font-bold">{item?.itemTam}</span>
                    </div>
                    <div className="lg:hidden flex flex-col items-start justify-center w-full gap-x-2">                      
                        <span className="lg:text-xl text-sm text-black font-bold w-{99%] truncate">{`${item?.itemName}`}</span>
                        <span className="lg:text-xl text-sm text-black font-bold">{`${item?.itemGenero} - TAM: ${item?.itemTam}`}</span>
                    </div>
                    <div className="flex flex-row w-full justify-start items-center gap-x-2 pt-2">
                        <span className="lg:text-xl text-sm text-black font-bold">{item?.itemQty}</span>
                        <span className="lg:text-xl text-sm text-black font-bold">{item?.itemQty === 1 ? `UNIDADE` : `UNIDADES`}</span>
                    </div>
                </div>
            ))}
            <div className="flex flex-row w-full justify-start items-center gap-x-2 p-3">
                <span className="lg:text-xl text-sm text-black font-bold">{`TOTAL:`}</span>
                <span className="lg:text-xl text-sm text-black font-bold">{total}</span>
                <span className="lg:text-xl text-sm text-black font-bold">{total === 1 ? `UNIDADE` : `UNIDADES`}</span>
            </div>
        </div>
    );
}
