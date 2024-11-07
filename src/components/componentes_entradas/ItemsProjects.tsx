import { ItensProjects } from "../../../core"

export interface ItemsProjectsProps {
    item: ItensProjects
}

export default function ItemsProjects({ item }: ItemsProjectsProps){
    const itemSelect = item;
    const itemNome = itemSelect.nome;
    const itemTamanho = itemSelect.tamanho;
    const itemBarcode = itemSelect.barcode;
    return (
        <div className={`flex justify-start items-center w-full border-[0.001em] hover:bg-green-950
            border-zinc-900 p-3 rounded-md cursor-pointer`}>
            <div className={`flex justify-start items-center gap-x-4 w-[25%]`}>
                <span className={`text-[14px] text-zinc-500`}>
                    ITEM:
                </span>
                <span className={`text-[14px]`}>
                    {itemNome}
                </span>
            </div>
            <div className={`flex justify-start items-center gap-x-4 w-[25%]`}>
                <span className={`text-[14px] text-zinc-500`}>
                    TAMANHO:
                </span>
                <span className={`text-[14px]`}>
                    {itemTamanho}
                </span>
            </div>
            <div className={`flex justify-start items-center gap-x-4 w-[25%]`}>
                <span className={`text-[14px] text-zinc-500`}>
                    CÓDIGO DE BARRAS:
                </span>
                <span className={`text-[14px]`}>
                    {itemBarcode}
                </span>
            </div>
        </div>
    )
}
