import { Stock } from "../../../core"

interface StockQtyProps{
    stock: Stock;
}

export default function StockQty({ stock }: StockQtyProps) {
    return (
        <div className="flex w-full flex-col space-y-3">
            {/* Título */}
            <div className="flex w-full items-center justify-center pb-3 border-b border-slate-600">
                <span className="text-sm lg:text-base text-emerald-400 font-bold uppercase tracking-wide text-center">
                    Item a ser incluído no estoque
                </span>               
            </div>

            {/* Informações do Item */}
            <div className="space-y-2">
                <div className="flex items-center justify-between gap-x-3 py-1.5">
                    <span className="text-xs lg:text-sm font-medium text-slate-400 uppercase">
                        Item:
                    </span>   
                    <span className="text-xs lg:text-sm font-semibold text-slate-200 text-right">
                        {stock.selectedtItem.nome}
                    </span>               
                </div>

                <div className="flex items-center justify-between gap-x-3 py-1.5">
                    <span className="text-xs lg:text-sm font-medium text-slate-400 uppercase">
                        Gênero:
                    </span>   
                    <span className="text-xs lg:text-sm font-semibold text-slate-200">
                        {stock.selectedtItem.genero}
                    </span>               
                </div>

                <div className="flex items-center justify-between gap-x-3 py-1.5">
                    <span className="text-xs lg:text-sm font-medium text-slate-400 uppercase">
                        Tamanho:
                    </span>   
                    <span className="text-xs lg:text-sm font-semibold text-yellow-400">
                        {stock.selectedtItem.tamanho}
                    </span>              
                </div>

                <div className="flex items-center justify-between gap-x-3 py-1.5 bg-emerald-500/10 rounded-lg px-3 border border-emerald-500/30">
                    <span className="text-xs lg:text-sm font-medium text-emerald-400 uppercase">
                        Quantidade:
                    </span>   
                    <span className="text-sm lg:text-base font-bold text-emerald-400">
                        {stock.quantidade > 1 ? `${stock.quantidade} PEÇAS`: `${stock.quantidade} PEÇA`}
                    </span>              
                </div>

                <div className="flex items-center justify-between gap-x-3 py-1.5">
                    <span className="text-xs lg:text-sm font-medium text-slate-400 uppercase">
                        Embalador:
                    </span>   
                    <span className="text-xs lg:text-sm font-semibold text-slate-200">
                        {stock.embalagem.nome}
                    </span>              
                </div>
            </div>
        </div>
    )
}
