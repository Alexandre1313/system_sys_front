import Link from "next/link";
import { CaixaFindItem } from "../../../core";

export interface CaixaFindProps {
    caixa: CaixaFindItem;
}

export default function CaixaItemCard({ caixa }: CaixaFindProps) {
    return (
        <Link
            href={`/ajustar_caixa/${caixa.id}`}
            target={'_blank'}
            className=""
        >
            <div
                className="
                w-full
                cursor-pointer
                rounded-xl
                border border-slate-700
                bg-transparent
                p-4
                transition
                hover:border-emerald-500
                hover:bg-slate-800
            "
            >
                {/* HEADER */}
                <div className="flex items-center justify-between mb-3 w-full">
                    <div>
                        <p className="text-xl text-slate-400">
                            CAIXA Nº {caixa.caixaNumber}
                        </p>
                        <p className="text-sm font-semibold text-slate-200 truncate w-[360px]">
                            {caixa.escolaCaixa}
                        </p>
                    </div>

                    <span
                        className="
                        rounded-md
                        bg-emerald-500/10
                        px-2 py-1
                        text-xs
                        font-semibold
                        text-emerald-400
                    "
                    >
                    </span>
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
                                <p className="text-lg font-medium text-slate-100">
                                    {item.itemName}
                                </p>
                                <p className="text-lg text-slate-400">
                                    {item.itemGenero} • Tam {item.itemTam}
                                </p>
                            </div>

                            <span className="text-sm font-semibold text-slate-100">
                                {item.itemQty} {item.itemQty === 1 ? 'un' : 'uns'}
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
