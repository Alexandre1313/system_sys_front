import CaixaItem from "../../../core/interfaces/CaixaItem";

export interface CaixaResumeItemsProps {
    caixaItem: CaixaItem[] | null | undefined;
}

export default function CaixaResume({ caixaItem }: CaixaResumeItemsProps) {
    // Calcula o total de itemQty antes de renderizar o JSX
    const total = caixaItem?.reduce((acc, item) => acc + (item?.itemQty || 0), 0) || 0;
    return (
        <div className="flex flex-col min-w-[100%] max-h-[50vh] gap-y-3 overflow-scroll">           
                {caixaItem && caixaItem.map((item, index) => (
                    <div key={index} className="flex flex-col w-full justify-start items-center gap-x-2 px-3">
                        <div className="flex flex-row w-full justify-start items-center gap-x-2">
                            <span className="text-xl text-black font-bold">{item?.itemName}</span>
                            <span className="text-xl text-black font-bold">{`-`}</span>
                            <span className="text-xl text-black font-bold">{item?.itemGenero}</span>
                            <span className="text-xl text-black font-bold">{`- TAMANHO`}</span>
                            <span className="text-xl text-black font-bold">{item?.itemTam}</span>
                        </div>
                        <div className="flex flex-row w-full justify-start items-center gap-x-2">
                            <span className="text-xl text-black font-bold">{item?.itemQty}</span>
                            <span className="text-xl text-black font-bold">{item?.itemQty === 1 ? `UNIDADE` : `UNIDADES`}</span>
                        </div>
                    </div>
                ))}          
            <div className="flex flex-row w-full justify-start items-center gap-x-2 p-3">
                <span className="text-xl text-black font-bold">{`TOTAL:`}</span>
                <span className="text-xl text-black font-bold">{total}</span>
                <span className="text-xl text-black font-bold">{total === 1 ? `UNIDADE` : `UNIDADES`}</span>
            </div>
        </div>
    );
}
