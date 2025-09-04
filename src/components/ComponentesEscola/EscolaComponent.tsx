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
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-700 to-orange-700 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
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
                                Atica - Grades pendentes
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

                {/* Progress Bar (if needed) */}
                {!statusClass.desactiv && (
                    <div className="mt-3 w-full bg-slate-700 rounded-full h-1">
                        <div className="bg-gradient-to-r from-emerald-500 to-blue-600 h-1 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                )}
            </div>
        </Link>
    );
}
