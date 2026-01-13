import { CaixaFindItem } from "../../../core";

export interface CaixaFindProps {
    caixa: CaixaFindItem;
}

export default function CaixaItemCard({ caixa }: CaixaFindProps) {
    return (
        <div
            className="
                w-full
                cursor-pointer
                rounded-xl
                border border-slate-700
                bg-slate-900
                p-4
                transition
                hover:border-emerald-500
                hover:bg-slate-800
            "
        >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-3 w-full">
                <div>
                    <p className="text-xs text-slate-400">
                        Caixa #{caixa.caixaNumber}
                    </p>
                    <p className="text-sm font-semibold text-slate-200">
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
                    {caixa.qtyCaixa} un
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
                            <p className="text-sm font-medium text-slate-100">
                                {item.itemName}
                            </p>
                            <p className="text-xs text-slate-400">
                                {item.itemGenero} • Tam {item.itemTam}
                            </p>
                        </div>

                        <span className="text-sm font-semibold text-slate-100">
                            {item.itemQty} un
                        </span>
                    </div>
                ))}

                {caixa.caixaItem.length === 0 && (
                    <span className="text-xs text-slate-500">
                        Nenhum item nesta caixa
                    </span>
                )}
            </div>

            {/* FOOTER OPCIONAL */}
            {caixa.numberJoin && (
                <div className="mt-3 text-xs text-slate-500">
                    {caixa.numberJoin}
                </div>
            )}
        </div>
    );
}
