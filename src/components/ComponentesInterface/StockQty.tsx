import { Stock } from "../../../core"

interface StockQtyProps{
    stock: Stock;
}

export default function StockQty({ stock }: StockQtyProps) {
    return (
        <div className={`flex w-auto flex-col justify-center items-center
         border border-zinc-300 rounded-md p-4`}>
            <div className={`flex w-full items-center justify-start`}>
                <span className={`text-[19px] text-green-700 font-bold`}>
                    ITEM À SER INCLUIDO NO ESTOQUE:
                </span>               
            </div>
            <div className={`flex w-full items-center justify-start gap-x-3`}>
                <span className={`text-[16px] font-bold text-black`}>
                    ITEM:
                </span>   
                <span className={`text-[16px] font-bold text-black`}>
                    {stock.selectedtItem.nome}
                </span>               
            </div>
            <div className={`flex w-full items-center justify-start gap-x-3`}>
                <span className={`text-[16px] font-bold text-black`}>
                    GÊNERO:
                </span>   
                <span className={`text-[16px] font-bold text-black`}>
                    {stock.selectedtItem.genero}
                </span>               
            </div>
            <div className={`flex w-full items-center justify-start gap-x-3`}>
                <span className={`text-[16px] font-bold text-black`}>
                    TAMANHO:
                </span>   
                <span className={`text-[16px] font-bold text-black`}>
                    {stock.selectedtItem.tamanho}
                </span>              
            </div>
            <div className={`flex w-full items-center justify-start gap-x-3`}>
                <span className={`text-[16px] font-bold text-black`}>
                    QUANTIDADE:
                </span>   
                <span className={`text-[16px] font-bold text-black`}>
                    {stock.quantidade > 1 ? `${stock.quantidade} PEÇAS`: `${stock.quantidade} PEÇA`}
                </span>              
            </div>
            <div className={`flex w-full items-center justify-start gap-x-3`}>
                <span className={`text-[16px] font-bold text-black`}>
                    EMBALADOR:
                </span>   
                <span className={`text-[16px] font-bold text-black`}>
                    {stock.embalagem.nome}
                </span>              
            </div>
        </div>
    )
}
