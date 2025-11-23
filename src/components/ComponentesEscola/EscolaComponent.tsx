import Link from "next/link";
import { analyzerStatus } from "../../../core/utils/tools";

export interface EscolaComponentProps {
    escola: any;
    viewMode: string;
}

export default function EscolaComponent({ escola, viewMode }: EscolaComponentProps) {
    const statusClass = analyzerStatus(escola.grades);

    return (
        viewMode === 'grid' ? (
            <Link
                href={!statusClass.desactiv ? `/grades/${escola.id}` : "#"}                
                className={`group flex items-center justify-center w-full ${statusClass.desactiv ? "pointer-events-none cursor-not-allowed" : ""}`}
            >
                <div className="relative h-[65px] w-[65px] rounded-full overflow-hidden transform hover:scale-[1.02] will-change-transform"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'translate3d(0, 0, 0)', // Force GPU layer
                        contain: 'layout style paint',
                        contentVisibility: 'auto'
                    }}>
                    {/* Círculo de fundo */}
                    <div 
                        className={`absolute inset-0 ${statusClass.statusClassBg} rounded-full ${statusClass.desactiv ? "opacity-40" : ""}`}
                        style={{
                            transform: 'translate3d(0, 0, 0)'
                        }}
                    ></div>
                    
                    {/* Círculo de progresso SVG - sempre renderizado */}
                    <svg 
                        className={`absolute inset-0 w-full h-full ${!statusClass.desactiv && escola.percentualProgresso !== undefined ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        viewBox="0 0 130 130"
                        style={{
                            willChange: 'opacity',
                            backfaceVisibility: 'hidden',
                            transform: 'translate3d(0, 0, 0) rotate(-90deg)', // Começa no topo (12h), sentido horário
                            shapeRendering: 'geometricPrecision',
                            WebkitFontSmoothing: 'antialiased',
                            imageRendering: '-webkit-optimize-contrast'
                        }}
                    >
                        <defs>
                            <linearGradient id={`gradient-${escola.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
                            </linearGradient>
                            <filter id={`shadow-${escola.id}`} x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
                            </filter>
                        </defs>
                        {/* Círculo de fundo (cinza) */}
                        <circle
                            cx="65"
                            cy="65"
                            r="56"
                            fill="none"
                            stroke="rgba(71, 85, 105, 0.25)"
                            strokeWidth="10"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            filter={`url(#shadow-${escola.id})`}
                        />
                        {/* Círculo de progresso (colorido) */}
                        <circle
                            cx="65"
                            cy="65"
                            r="56"
                            fill="none"
                            stroke={`url(#gradient-${escola.id})`}
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray={`${2 * Math.PI * 56}`}
                            strokeDashoffset={`${2 * Math.PI * 56 * (1 - (Math.min(100, Math.max(0, escola.percentualProgresso || 0)) / 100))}`}
                            filter={`url(#shadow-${escola.id})`}
                        />
                    </svg>
                    
                    {/* Círculo interno com número */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-12 h-12 ${statusClass.statusClassBgGrad} rounded-full flex items-center justify-center ${statusClass.desactiv ? "opacity-40" : ""}`}>
                            <span className="text-white font-extralight text-lg">
                                {escola.numeroEscola}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        ) : (
            <Link
                href={!statusClass.desactiv ? `/grades/${escola.id}` : "#"}                
                className={`group block w-full ${statusClass.desactiv ? "pointer-events-none cursor-not-allowed" : ""}`}
            >
                <div className={`${statusClass.statusClassBg} rounded-xl p-3 
                             transform hover:scale-[1.02] ${statusClass.desactiv ? "opacity-40" : ""} will-change-transform`}
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'translate3d(0, 0, 0)', // Force GPU layer
                        contain: 'layout style paint',
                        contentVisibility: 'auto'
                    }}>
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
                            <h3 className={`font-medium text-sm sm:text-base truncate group-hover:text-emerald-300`}>
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
                                <div className="text-slate-400 group-hover:text-emerald-400">
                                    <span className="text-sm">→</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Progress Bar */}
                    {!statusClass.desactiv && escola.percentualProgresso !== undefined && (
                        <div className="mt-[0.30rem]">
                            <div className="flex items-center space-x-3">
                                {/* Progress Bar */}
                                <div className="flex-1 bg-slate-700/50 rounded-full h-1 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-emerald-500 to-blue-600 h-full rounded-full"
                                        style={{ 
                                            width: `${Math.min(100, Math.max(0, escola.percentualProgresso))}%`,
                                            transform: 'translate3d(0, 0, 0)'
                                        }}
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
        )
    );
}
