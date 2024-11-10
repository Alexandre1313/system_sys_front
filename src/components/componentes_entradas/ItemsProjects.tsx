import { ItensProjects } from "../../../core"
import { motion } from 'framer-motion';

export interface ItemsProjectsProps {
    item: ItensProjects
}

export default function ItemsProjects({ item }: ItemsProjectsProps) {
    const itemSelect = item;
    const itemId = item.id;
    const itemGenero = item.genero;
    const itemNome = itemSelect.nome;
    const itemTamanho = itemSelect.tamanho;
    const itemBarcode = itemSelect.barcode;
    const classColor = itemGenero === 'FEMININO' ? 'text-zinc-300': itemGenero === 'MASCULINO' ? 'text-blue-500': 'text-yellow-500'; 
    return (
        <div className={`flex justify-start items-center w-full border-[0.001em] hover:bg-green-950
            border-zinc-900 p-3 rounded-md cursor-pointer`}>
            <div className={`flex justify-start items-center gap-x-4 w-[42%]`}>
                <span className={`text-[14px] text-zinc-500`}>
                    ITEM:
                </span>
                <span className={`text-[14px] ${classColor}`}>
                    {itemNome}
                </span>
            </div>
            <div className={`flex justify-start items-center gap-x-4 w-[18%]`}>
                <span className={`text-[14px] text-zinc-500`}>
                    GÊNERO:
                </span>
                <span className={`text-[14px] ${classColor}`}>
                    {itemGenero}
                </span>
            </div>
            <div className={`flex justify-start items-center gap-x-4 w-[20%]`}>
                <span className={`text-[14px] text-zinc-500`}>
                    TAMANHO:
                </span>
                <span className={`text-[14px] ${classColor}`}>
                    {itemTamanho}
                </span>
            </div>
            <div className={`flex justify-start items-center gap-x-4 w-[20%]`}>
                <span className={`text-[14px] text-zinc-500`}>
                    CÓDIGO DE BARRAS:
                </span>
                <span className={`text-[14px] ${classColor}`}>
                    {itemBarcode}
                </span>
            </div>
        </div>
    )
}
