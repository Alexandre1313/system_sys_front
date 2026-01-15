import Link from "next/link";
import { CaixaFindItem } from "../../../core";
import { convertSPTime } from "../../../core/utils/tools";

export interface CaixaFindProps {
    caixa: CaixaFindItem;
}

export default function CaixaItemCard({ caixa }: CaixaFindProps) {
    return (
        <Link
            href={`/ajustar_caixa/${caixa.id}`}            
            className=""
        >
            <div
                className="w-full cursor-pointer rounded-xl border border-slate-700 bg-transparent p-3 transition
                hover:border-emerald-700 hover:bg-slate-900 font-extralight"
            >
                {/* HEADER */}
                <div className="flex flex-col items-center justify-center mb-3 w-full">
                    <div className={`flex justify-between items-center w-full`}>
                       <p className="text-xl text-slate-400">CAIXA Nº {caixa.caixaNumber}</p>
                       <span className="rounded-md bg-slate-600/10 px-2 py-1 text-xs text-slate-400" >
                        {convertSPTime(String(caixa.createdAt))}
                       </span>
                    </div>
                    <p className="text-sm text-slate-600 truncate w-[415px]">
                        {caixa.escolaCaixa}
                    </p>                   
                </div>

                {/* DIVIDER */}
                <div className="h-px bg-slate-700 mb-3" />

                {/* ITENS DA CAIXA */}
                <div className="flex flex-col gap-2">
                    {caixa.caixaItem.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between"
                        >
                            <div>
                                <p className="text-lg text-slate-600">
                                    {item.itemName}
                                </p>
                                <p className="text-lg text-slate-600">
                                    {item.itemGenero} • Tam {item.itemTam}
                                </p>
                            </div>

                            <span className="text-xl text-emerald-600">
                                {item.itemQty} {item.itemQty === 1 ? 'UN' : 'UNS'}
                            </span>
                        </div>
                    ))}

                    {caixa.caixaItem.length === 0 && (
                        <span className="text-xs text-slate-500">
                            Nenhum item nesta caixa
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
