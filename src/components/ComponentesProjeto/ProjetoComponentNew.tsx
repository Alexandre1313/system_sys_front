import Link from "next/link";
import Projeto from "../../../core/interfaces/Projeto";

interface ProjetoComponentNewProps {
    projeto: Projeto;
}

export default function ProjetoComponentNew({ projeto }: ProjetoComponentNewProps) {
    return (
        <Link href={`/escolas/${projeto.id}`} className="group block w-full">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/10 h-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">📋</span>
                    </div>
                    {projeto.isActive && (
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-slate-400 text-xs font-medium">Ativo</span>
                        </div>
                    )}
                    {!projeto.isActive && (
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-slate-400 text-xs font-medium">Inativo</span>
                        </div>
                    )}
                </div>

                {/* Project Name */}
                {projeto.isActive && (
                    <div className="mb-4">
                        <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors duration-300 line-clamp-2">
                            {projeto.nome}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1 animate-shake-loop">
                            <span className="text-white">Situação</span> - Há grades pendentes
                        </p>
                    </div>
                )}

                {!projeto.isActive && (
                    <div className="mb-4">
                        <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors duration-300 line-clamp-2">
                            {projeto.nome}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">
                            Situação - Finalizado Totalmente
                        </p>
                    </div>
                )}

                {/* Action Indicator */}
                <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-xs">
                        Clique para acessar
                    </span>
                    <div className="flex items-center text-slate-400 group-hover:text-emerald-300 transition-colors duration-300">
                        <span className="text-sm mr-1">→</span>
                        <span className="text-xs font-medium">ENTRAR</span>
                    </div>
                </div>

                {/* Hover Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
        </Link>
    )
}
