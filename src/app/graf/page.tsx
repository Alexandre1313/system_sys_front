'use client'

import Grafico from "@/components/ComponentesInterface/Grafico";
import PageWithDrawer from '@/components/ComponentesInterface/PageWithDrawer';
import { BarChart } from 'react-feather';
import { motion } from 'framer-motion';

export default function Graf() {
    return (
        <PageWithDrawer 
            sectionName="Análise de Progresso" 
            currentPage="graf"
        >
            {/* Header Fixo */}
            <div className="lg:fixed lg:top-0 lg:left-0 lg:right-0 lg:z-20 lg:bg-slate-900/95 lg:backdrop-blur-sm lg:border-b lg:border-slate-700">
                <div className="px-4 pt-16 pb-4 lg:pt-6 lg:pb-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        
                        {/* Header Principal */}
                        <div className="flex items-center justify-between mb-4 lg:mb-6">
                            {/* Título e Ícone */}
                            <div className="flex items-center space-x-3 lg:space-x-4">
                                <div className="w-9 h-9 lg:w-12 lg:h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg lg:rounded-2xl flex items-center justify-center shadow-lg">
                                    <BarChart size={16} className="lg:w-6 lg:h-6 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-base lg:text-2xl xl:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-600 truncate">
                                        Progresso dos Projetos
                                    </h1>
                                    <p className="text-slate-400 text-xs lg:text-sm hidden lg:block">
                                        Visualização do progresso de expedição por projeto
                                    </p>
                                </div>
                            </div>
                            
                            {/* Estatísticas Rápidas - Desktop */}
                            <div className="hidden lg:flex items-center space-x-3">
                                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl px-4 py-2">
                                    <div className="flex items-center space-x-2">
                                        <BarChart size={16} className="text-cyan-400" />
                                        <span className="text-slate-300 text-sm font-medium">
                                            Análise de Dados
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Informações Adicionais */}
                        <div className="bg-slate-800/30 lg:bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-lg">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                                    <div>
                                        <p className="text-white font-medium text-sm">Quantidade Total</p>
                                        <p className="text-slate-400 text-xs">Total de itens planejados</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                    <div>
                                        <p className="text-white font-medium text-sm">Quantidade Expedida</p>
                                        <p className="text-slate-400 text-xs">Itens já expedidos</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="px-4 pt-4 lg:pt-[15rem] pb-8 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Contador de Resultados - Mobile */}
                    <div className="lg:hidden flex items-center justify-center mb-6">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-full px-4 py-2">
                            <span className="text-slate-300 text-xs font-medium">
                                Gráfico de Progresso
                            </span>
                        </div>
                    </div>

                    {/* Container do Gráfico */}
                    <div className="bg-slate-800/30 lg:bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg overflow-hidden">
                        <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] min-h-[400px]">
                            <Grafico />
                        </div>
                    </div>

                    {/* Estado Vazio */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-center py-12 lg:py-16"
                    >
                        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 border border-slate-700">
                            <BarChart size={32} className="lg:w-10 lg:h-10 text-cyan-500" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl lg:text-2xl font-semibold text-cyan-400 mb-3 lg:mb-4">
                            Análise de Progresso
                        </h3>
                        <div className="space-y-2 text-slate-400 text-sm lg:text-base">
                            <p>Visualize o progresso de expedição</p>
                            <p>Compare quantidades planejadas vs expedidas</p>
                            <p>Analise a eficiência dos projetos</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </PageWithDrawer>
    );
}
