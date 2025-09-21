import Link from "next/link";
import { analyzerStatus } from "../../../core/utils/tools";

export interface EscolaComponentProps {
    escola: any;
}

export default function EscolaComponent({ escola }: EscolaComponentProps) {
    const statusClass = analyzerStatus(escola.grades);
    return (
        <Link
            href={!statusClass.desactiv ? `/grades/${escola.id}` : "#"}
            target={'_GRADES'}
            className={`group block w-full ${statusClass.desactiv ? "pointer-events-none cursor-not-allowed" : ""}`}
        >
            <div className={`${statusClass.statusClassBg} rounded-xl p-4 transition-all duration-300 
                             transform hover:scale-[1.02] ${statusClass.desactiv ? "opacity-40" : ""}`}>
                <div className="flex items-center space-x-4">
                    {/* School Number */}
                    <div className="flex-shrink-0">
                        <div className={`w-10 h-10 ${statusClass.statusClassBgGrad} rounded-lg flex items-center justify-center`}>
                            <span className="text-white font-extralight text-lg">
                                {escola.numeroEscola}
                            </span>
                        </div>
                    </div>

                    {/* School Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className={`font-medium text-sm sm:text-base truncate group-hover:text-emerald-300 transition-colors duration-300`}>
                            {escola.nome}
                        </h3>
                        {!statusClass.desactiv && (
                            <p className="text-slate-500 text-xs mt-1">
                                Ativa
                            </p>
                        )}
                        {statusClass.desactiv && (
                            <p className="text-slate-500 text-xs mt-1">
                                Inativa
                            </p>
                        )}
                    </div>

                    {/* Status Indicator */}
                    <div className="flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full ${statusClass.statusClass}  ${!statusClass.desactiv ? 'animate-pulse' : ''}`}></div>
                    </div>

                    {/* Arrow Icon */}
                    {!statusClass.desactiv && (
                        <div className="flex-shrink-0">
                            <div className="text-slate-400 group-hover:text-emerald-400 transition-colors duration-300">
                                <span className="text-sm">→</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                {!statusClass.desactiv && escola.percentualProgresso !== undefined && (
                    <div className="mt-4">
                        <div className="flex items-center space-x-3">
                            {/* Progress Bar */}
                            <div className="flex-1 bg-slate-700/50 rounded-full h-2 overflow-hidden">
                                <div 
                                    className="bg-gradient-to-r from-emerald-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out" 
                                    style={{ width: `${Math.min(100, Math.max(0, escola.percentualProgresso))}%` }}
                                ></div>
                            </div>
                            
                            {/* Percentage */}
                            <span className="text-emerald-400 text-xs font-medium flex-shrink-0">
                                {Math.round(escola.percentualProgresso || 0)}%
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
}
