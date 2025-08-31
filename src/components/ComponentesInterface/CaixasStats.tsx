'use client';

interface CaixasStatsProps {
    totalCaixas: number;
    totalItens: number;
}

export default function CaixasStats({ totalCaixas, totalItens }: CaixasStatsProps) {
    return (
        <div className="bg-slate-800/30 lg:bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl lg:rounded-2xl p-3 lg:p-5 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <span className="text-slate-400 text-xs font-medium">Total por Caixa:</span>
                        <span className="text-lg lg:text-2xl font-bold text-yellow-500">{totalCaixas}</span>
                    </div>
                </div>
                <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <span className="text-slate-400 text-xs font-medium">Total por Itens:</span>
                        <span className="text-lg lg:text-2xl font-bold text-emerald-500">{totalItens}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
