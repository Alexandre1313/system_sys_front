import Link from "next/link";

export interface EscolaComponentProps {
    escola: any;
}

export default function EscolaComponent({ escola }: EscolaComponentProps) {        
   
    // Versão simplificada para teste
    const isActive = escola.grades && escola.grades.length > 0;
    const statusClass = isActive ? "text-emerald-500" : "text-slate-400";

    return (
        <Link
            href={isActive ? `/grades/${escola.id}` : "#"}
            target={'_GRADES'}
            className={`group block w-full ${!isActive ? "pointer-events-none cursor-not-allowed" : ""}`}
        >
            <div className={`bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700 hover:border-emerald-500/30 rounded-xl p-4 transition-all duration-300 transform hover:scale-[1.02] ${!isActive ? "opacity-40" : ""}`}>
                <div className="flex items-center space-x-4">
                    {/* School Number */}
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                                {escola.numeroEscola}
                            </span>
                        </div>
                    </div>

                    {/* School Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className={`font-medium text-sm sm:text-base truncate group-hover:text-emerald-300 transition-colors duration-300 ${statusClass}`}>
                            {escola.nome}
                        </h3>
                        <p className="text-slate-500 text-xs mt-1">
                            Escola #{escola.numeroEscola}
                        </p>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'} ${isActive ? 'animate-pulse' : ''}`}></div>
                    </div>

                    {/* Arrow Icon */}
                    {isActive && (
                        <div className="flex-shrink-0">
                            <div className="text-slate-400 group-hover:text-emerald-400 transition-colors duration-300">
                                <span className="text-sm">→</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Progress Bar (if needed) */}
                {isActive && (
                    <div className="mt-3 w-full bg-slate-700 rounded-full h-1">
                        <div className="bg-gradient-to-r from-emerald-500 to-blue-600 h-1 rounded-full" style={{width: '99%'}}></div>
                    </div>
                )}
            </div>
        </Link>
    );
}
