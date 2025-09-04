'use client';

import PageWithDrawer from '@/components/ComponentesInterface/PageWithDrawer';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale";
import { format, startOfMonth } from "date-fns";
import { useEffect, useState } from "react";
import { getRanking } from "@/hooks_api/api";
import { converPercentualFormat, convertMilharFormat, formatarTituloRanking } from "../../../core/utils/tools";
import { Calendar, TrendingUp, Award, Users, BarChart, ArrowUp, ArrowDown, Minus } from "react-feather";
import { motion } from 'framer-motion';

registerLocale("pt-BR", ptBR);

const fetcher = async (month: string): Promise<{ rankingPorMes: Record<string, any[]>; rankingGeral: any[]; }> => {
    const ranking = await getRanking(month);
    return ranking;
};

export default function Ranking() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(startOfMonth(new Date()));
    const [rankingData, setRankingData] = useState<{
        rankingPorMes: Record<string, any[]>;
        rankingGeral: any[];
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Interpreta null como "T"
    const mesFormatado = selectedDate ? format(selectedDate, "yyyy-MM") : "T";

    useEffect(() => {
        const buscarRanking = async () => {
            if (mesFormatado) {
                setIsLoading(true);
                try {
                    const data = await fetcher(mesFormatado);
                    setRankingData(data);
                } catch (error) {
                    console.error("Erro ao buscar ranking:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        buscarRanking();
    }, [mesFormatado]);

    const [primeiroMes, ranking] = Object.entries(rankingData?.rankingPorMes || [])[0] || [];

    // Função para renderizar ícone de variação
    const renderVariationIcon = (variation: number) => {
        if (variation > 0) {
            return <ArrowUp size={12} className="text-emerald-400" />;
        } else if (variation < 0) {
            return <ArrowDown size={12} className="text-red-400" />;
        } else {
            return <Minus size={12} className="text-slate-400" />;
        }
    };

    // Função para obter cor da variação
    const getVariationColor = (variation: number) => {
        if (variation > 0) return 'text-emerald-400';
        if (variation < 0) return 'text-red-400';
        return 'text-slate-400';
    };

    return (
        <PageWithDrawer sectionName="Ranking de Expedidores" currentPage="rankingusers">
            {/* Header Fixo */}
            <div className="lg:fixed lg:top-0 lg:left-0 lg:right-0 lg:z-20 lg:bg-slate-900/95 lg:backdrop-blur-sm lg:border-b lg:border-slate-700">
                <div className="px-4 pt-16 pb-4 lg:pt-6 lg:pb-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        
                        {/* Header Principal */}
                        <div className="flex items-center justify-between mb-4 lg:mb-6">
                            {/* Título e Ícone */}
                            <div className="flex items-center space-x-3 lg:space-x-4">
                                <div className="w-9 h-9 lg:w-12 lg:h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg lg:rounded-2xl flex items-center justify-center shadow-lg">
                                    <Award size={16} className="lg:w-6 lg:h-6 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-base lg:text-2xl xl:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 truncate">
                                        Ranking de Expedidores
                                    </h1>
                                    <p className="text-slate-400 text-xs lg:text-sm hidden lg:block">Desempenho e Produtividade</p>
                                </div>
                            </div>
                            
                            {/* Estatísticas Rápidas - Desktop */}
                            <div className="hidden lg:flex items-center space-x-3">
                                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl px-4 py-2">
                                    <div className="flex items-center space-x-2">
                                        <Users size={16} className="text-blue-400" />
                                        <span className="text-slate-300 text-sm font-medium">
                                            {rankingData?.rankingGeral?.length || 0} expedidores
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Controles de Filtro */}
                        <div className="bg-slate-800/30 lg:bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-lg">
                            <div className="flex flex-col sm:flex-row gap-3 lg:gap-6 items-center">
                                
                                {/* Seletor de Período */}
                                <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
                                    <div className="flex items-center space-x-2 lg:space-x-3">
                                        <Calendar size={16} className="lg:w-5 lg:h-5 text-slate-400" />
                                        <span className="text-slate-300 text-xs lg:text-sm font-medium">Período:</span>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row gap-3 flex-1">
                                        <button
                                            onClick={() => setSelectedDate(null)}
                                            className={`px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-300 ${
                                                !selectedDate 
                                                    ? 'bg-emerald-600 text-white shadow-lg' 
                                                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600 border border-slate-600'
                                            }`}
                                        >
                                            Todos os Meses
                                        </button>
                                        
                                        <div className="flex-1 w-full lg:max-w-[250px] items-center justify-center">
                                            <DatePicker
                                                selected={selectedDate}
                                                onChange={(date: Date | null) => setSelectedDate(date)}
                                                dateFormat="MM/yyyy"
                                                showMonthYearPicker
                                                locale="pt-BR"
                                                className="w-full h-9 lg:h-10 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 px-3 
                                                text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all 
                                                duration-300 text-center lg:text-left z-100"
                                                placeholderText="Selecione o mês"
                                            />
                                        </div>
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
                    
                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                        </div>
                    )}

                    {/* Contador de Resultados - Mobile */}
                    <div className="lg:hidden flex items-center justify-center mb-6">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-full px-4 py-2">
                            <span className="text-slate-300 text-xs font-medium">
                                {rankingData?.rankingGeral?.length || 0} expedidores ativos
                            </span>
                        </div>
                    </div>

                    {/* Ranking do Dia */}
                    {primeiroMes && ranking && ranking.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-6 lg:mb-8"
                        >
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 lg:p-6 mb-6">
                                <div className="flex items-center space-x-2 lg:space-x-3 mb-3 lg:mb-4">
                                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-emerald-400 rounded-full"></div>
                                    <h2 className="text-base lg:text-xl font-semibold text-white flex items-center space-x-2">
                                        <TrendingUp size={16} className="lg:w-5 lg:h-5 text-emerald-400" />
                                        <span>Expedidas Hoje</span>
                                    </h2>
                                </div>
                                
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[600px] lg:min-w-0">
                                        <thead>
                                            <tr className="border-b border-slate-700">
                                                <th className="text-left p-2 lg:p-3 text-slate-400 text-xs lg:text-sm font-medium">Expedidor</th>
                                                <th className="text-left p-2 lg:p-3 text-slate-400 text-xs lg:text-sm font-medium">Hoje</th>
                                                <th className="text-left p-2 lg:p-3 text-slate-400 text-xs lg:text-sm font-medium">Ontem</th>
                                                <th className="text-left p-2 lg:p-3 text-slate-400 text-xs lg:text-sm font-medium">Dif.</th>
                                                <th className="text-left p-2 lg:p-3 text-slate-400 text-xs lg:text-sm font-medium">Var.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ranking.map((item, idx) => (
                                                <motion.tr 
                                                    key={idx} 
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                                                    className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors duration-200 ${
                                                        item.diferenca_dia > 0 ? 'bg-emerald-500/5' :
                                                        item.diferenca_dia === 0 ? 'bg-slate-700/10' : 'bg-red-500/5'
                                                    }`}
                                                >
                                                    <td className="p-2 lg:p-3">
                                                        <div className="flex items-center space-x-2 lg:space-x-3">
                                                            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                                                                <span className="text-slate-300 text-xs lg:text-sm font-medium">#{idx + 1}</span>
                                                            </div>
                                                            <span className="text-white text-xs lg:text-sm font-medium truncate max-w-[120px] lg:max-w-none" title={item.nome}>
                                                                {item.nome}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-2 lg:p-3">
                                                        <span className="text-emerald-400 text-xs lg:text-sm font-semibold">
                                                            {convertMilharFormat(item.pecas_hoje)}
                                                        </span>
                                                    </td>
                                                    <td className="p-2 lg:p-3">
                                                        <span className="text-slate-300 text-xs lg:text-sm">
                                                            {convertMilharFormat(item.pecas_ontem)}
                                                        </span>
                                                    </td>
                                                    <td className="p-2 lg:p-3">
                                                        <div className="flex items-center space-x-1 lg:space-x-2">
                                                            {renderVariationIcon(item.diferenca_dia)}
                                                            <span className={`font-semibold text-xs lg:text-sm ${getVariationColor(item.diferenca_dia)}`}>
                                                                {convertMilharFormat(item.diferenca_dia)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-2 lg:p-3">
                                                        <span className={`font-semibold text-xs lg:text-sm ${getVariationColor(item.diferenca_dia)}`}>
                                                            {converPercentualFormat(item.variacao_percentual_dia)}
                                                        </span>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Ranking por Mês */}
                    <div className="space-y-6 lg:space-y-8">
                        {mesFormatado === "T" ? (
                            Object.entries(rankingData?.rankingPorMes || {}).map(([mes, ranking], index) => (
                                <motion.div 
                                    key={mes}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 lg:p-6"
                                >
                                    <div className="flex items-center space-x-2 lg:space-x-3 mb-3 lg:mb-4">
                                        <div className="w-2 h-2 lg:w-3 lg:h-3 bg-blue-400 rounded-full"></div>
                                        <h2 className="text-base lg:text-xl font-semibold text-white flex items-center space-x-2">
                                            <BarChart size={16} className="lg:w-5 lg:h-5 text-blue-400" />
                                            <span className="text-xs lg:text-sm">{formatarTituloRanking(`Ranking - ${mes}`)}</span>
                                        </h2>
                                    </div>
                                    
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[400px] lg:min-w-0">
                                            <thead>
                                                <tr className="border-b border-slate-700">
                                                    <th className="text-left p-2 lg:p-3 text-slate-400 text-xs lg:text-sm font-medium">Pos.</th>
                                                    <th className="text-left p-2 lg:p-3 text-slate-400 text-xs lg:text-sm font-medium">Expedidor</th>
                                                    <th className="text-left p-2 lg:p-3 text-slate-400 text-xs lg:text-sm font-medium">Peças</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ranking.map((item, idx) => (
                                                    <motion.tr 
                                                        key={idx}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                                                        className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors duration-200"
                                                    >
                                                        <td className="p-2 lg:p-3">
                                                            <div className="flex items-center space-x-1 lg:space-x-2">
                                                                {idx < 3 ? (
                                                                    <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center ${
                                                                        idx === 0 ? 'bg-yellow-500/20 border border-yellow-500/30' :
                                                                        idx === 1 ? 'bg-slate-400/20 border border-slate-400/30' :
                                                                        'bg-orange-500/20 border border-orange-500/30'
                                                                    }`}>
                                                                        <span className={`text-xs lg:text-sm font-bold ${
                                                                            idx === 0 ? 'text-yellow-400' :
                                                                            idx === 1 ? 'text-slate-300' :
                                                                            'text-orange-400'
                                                                        }`}>
                                                                            {idx + 1}º
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-slate-400 text-xs lg:text-sm">#{idx + 1}</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="p-2 lg:p-3">
                                                            <span className="text-white text-xs lg:text-sm font-medium truncate max-w-[150px] lg:max-w-none" title={item.nome}>
                                                                {item.nome}
                                                            </span>
                                                        </td>
                                                        <td className="p-2 lg:p-3">
                                                            <span className="text-emerald-400 text-xs lg:text-sm font-semibold">
                                                                {convertMilharFormat(item.total_pecas_expedidas)}
                                                            </span>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                                {/* Total */}
                                                <tr className="border-t-2 border-slate-600 bg-slate-700/20">
                                                    <td className="p-2 lg:p-3"></td>
                                                    <td className="p-2 lg:p-3 text-right">
                                                        <span className="text-slate-400 text-xs lg:text-sm font-medium">Total:</span>
                                                    </td>
                                                    <td className="p-2 lg:p-3">
                                                        <span className="text-zinc-00 font-bold text-sm lg:text-lg">
                                                            {convertMilharFormat(
                                                                ranking.reduce(
                                                                    (acc, item) => acc + (item.total_pecas_expedidas || 0),
                                                                    0
                                                                )
                                                            )}
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            mesFormatado &&
                            rankingData?.rankingPorMes[mesFormatado] && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 lg:p-6"
                                >
                                    <div className="flex items-center space-x-2 lg:space-x-3 mb-3 lg:mb-4">
                                        <div className="w-2 h-2 lg:w-3 lg:h-3 bg-blue-400 rounded-full"></div>
                                        <h2 className="text-base lg:text-xl font-semibold text-white flex items-center space-x-2">
                                            <BarChart size={16} className="lg:w-5 lg:h-5 text-blue-400" />
                                            <span className="text-xs lg:text-sm">{formatarTituloRanking(`Ranking - ${mesFormatado}`)}</span>
                                        </h2>
                                    </div>
                                    
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[400px] lg:min-w-0">
                                            <thead>
                                                <tr className="border-b border-slate-700">
                                                    <th className="text-left p-2 lg:p-3 text-slate-400 text-xs lg:text-sm font-medium">Pos.</th>
                                                    <th className="text-left p-2 lg:p-3 text-slate-400 text-xs lg:text-sm font-medium">Expedidor</th>
                                                    <th className="text-left p-2 lg:p-3 text-slate-400 text-xs lg:text-sm font-medium">Peças</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rankingData.rankingPorMes[mesFormatado].map((item, idx) => (
                                                    <motion.tr 
                                                        key={idx}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                                                        className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors duration-200"
                                                    >
                                                        <td className="p-2 lg:p-3">
                                                            <div className="flex items-center space-x-1 lg:space-x-2">
                                                                {idx < 3 ? (
                                                                    <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center ${
                                                                        idx === 0 ? 'bg-yellow-500/20 border border-yellow-500/30' :
                                                                        idx === 1 ? 'bg-slate-400/20 border border-slate-400/30' :
                                                                        'bg-orange-500/20 border border-orange-500/30'
                                                                    }`}>
                                                                        <span className={`text-xs lg:text-sm font-bold ${
                                                                            idx === 0 ? 'text-yellow-400' :
                                                                            idx === 1 ? 'text-slate-300' :
                                                                            'text-orange-400'
                                                                        }`}>
                                                                            {idx + 1}º
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-slate-400 text-xs lg:text-sm">#{idx + 1}</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="p-2 lg:p-3">
                                                            <span className="text-white text-xs lg:text-sm font-medium truncate max-w-[150px] lg:max-w-none" title={item.nome}>
                                                                {item.nome}
                                                            </span>
                                                        </td>
                                                        <td className="p-2 lg:p-3">
                                                            <span className="text-emerald-400 text-xs lg:text-sm font-semibold">
                                                                {convertMilharFormat(item.total_pecas_expedidas)}
                                                            </span>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                                {/* Total */}
                                                <tr className="border-t-2 border-slate-600 bg-slate-700/20">
                                                    <td className="p-2 lg:p-3"></td>
                                                    <td className="p-2 lg:p-3 text-right">
                                                        <span className="text-slate-400 text-xs lg:text-sm font-medium">Total:</span>
                                                    </td>
                                                    <td className="p-2 lg:p-3">
                                                        <span className="text-zinc-300 font-bold text-sm lg:text-lg">
                                                            {convertMilharFormat(
                                                                rankingData.rankingPorMes[mesFormatado].reduce(
                                                                    (acc, item) => acc + (item.total_pecas_expedidas || 0),
                                                                    0
                                                                )
                                                            )}
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )
                        )}
                    </div>

                    {/* Ranking Geral */}
                    {!selectedDate && rankingData?.rankingGeral && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="mt-6 lg:mt-8"
                        >
                            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 lg:p-6">
                                <div className="flex items-center space-x-2 lg:space-x-3 mb-3 lg:mb-4">
                                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-purple-400 rounded-full"></div>
                                    <h2 className="text-base lg:text-xl font-semibold text-white flex items-center space-x-2">
                                        <Award size={16} className="lg:w-5 lg:h-5 text-purple-400" />
                                        <span>Ranking Geral</span>
                                    </h2>
                                </div>
                                
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[400px] lg:min-w-0">
                                        <thead>
                                            <tr className="border-b border-slate-700">
                                                <th className="text-left p-2 lg:p-3 text-slate-400 text-xs lg:text-sm font-medium">Pos.</th>
                                                <th className="text-left p-2 lg:p-3 text-slate-400 text-xs lg:text-sm font-medium">Expedidor</th>
                                                <th className="text-left p-2 lg:p-3 text-slate-400 text-xs lg:text-sm font-medium">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rankingData.rankingGeral.map((item, idx) => (
                                                <motion.tr 
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                                                    className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors duration-200"
                                                >
                                                    <td className="p-2 lg:p-3">
                                                        <div className="flex items-center space-x-1 lg:space-x-2">
                                                            {idx < 3 ? (
                                                                <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center ${
                                                                    idx === 0 ? 'bg-yellow-500/20 border border-yellow-500/30' :
                                                                    idx === 1 ? 'bg-slate-400/20 border border-slate-400/30' :
                                                                    'bg-orange-500/20 border border-orange-500/30'
                                                                }`}>
                                                                    <span className={`text-xs lg:text-sm font-bold ${
                                                                        idx === 0 ? 'text-yellow-400' :
                                                                        idx === 1 ? 'text-slate-300' :
                                                                        'text-orange-400'
                                                                    }`}>
                                                                        {idx + 1}º
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-slate-400 text-xs lg:text-sm">#{idx + 1}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-2 lg:p-3">
                                                        <span className="text-white text-xs lg:text-sm font-medium truncate max-w-[150px] lg:max-w-none" title={item.nome}>
                                                            {item.nome}
                                                        </span>
                                                    </td>
                                                    <td className="p-2 lg:p-3">
                                                        <span className="text-emerald-400 text-xs lg:text-sm font-semibold">
                                                            {convertMilharFormat(item.total_pecas_expedidas_geral)}
                                                        </span>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                            
                                            {/* Totais */}
                                            <tr className="border-t-2 border-slate-600 bg-slate-700/20">
                                                <td className="p-2 lg:p-3"></td>
                                                <td className="p-2 lg:p-3 text-right">
                                                    <span className="text-slate-400 text-xs lg:text-sm font-medium">Total Geral:</span>
                                                </td>
                                                <td className="p-2 lg:p-3">
                                                    <span className="text-zinc-300 font-bold text-sm lg:text-lg">
                                                        {convertMilharFormat(
                                                            rankingData.rankingGeral.reduce(
                                                                (acc, item) => acc + (item.total_pecas_expedidas_geral || 0),
                                                                0
                                                            )
                                                        )}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="border-t border-slate-600 bg-slate-700/10">
                                                <td className="p-2 lg:p-3"></td>
                                                <td className="p-2 lg:p-3 text-right">
                                                    <span className="text-slate-400 text-xs lg:text-sm font-medium">Média Mensal:</span>
                                                </td>
                                                <td className="p-2 lg:p-3">
                                                    <span className="text-yellow-400 font-bold text-sm lg:text-lg">
                                                        {convertMilharFormat(
                                                            Math.round(
                                                                (rankingData.rankingGeral.reduce(
                                                                    (acc, item) => acc + (item.total_pecas_expedidas_geral || 0),
                                                                    0
                                                                ) / Object.entries(rankingData.rankingPorMes || {}).length)
                                                            )
                                                        )}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Estado Vazio */}
                    {!isLoading && (!rankingData || (Object.keys(rankingData.rankingPorMes || {}).length === 0 && (!rankingData.rankingGeral || rankingData.rankingGeral.length === 0))) && (
                        <div className="text-center py-12 lg:py-16">
                            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 border border-slate-700">
                                <BarChart size={32} className="lg:w-10 lg:h-10 text-slate-500" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl lg:text-2xl font-semibold text-slate-300 mb-3 lg:mb-4">
                                Nenhum dado encontrado
                            </h3>
                            <p className="text-slate-500 text-sm lg:text-base max-w-md mx-auto mb-4 lg:mb-6">
                                Não há dados de ranking disponíveis para o período selecionado.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </PageWithDrawer>
    );
}
