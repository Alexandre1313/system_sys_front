'use client';

import IsLoading from "@/components/ComponentesInterface/IsLoading";
import PageWithDrawer from "@/components/ComponentesInterface/PageWithDrawer";
import { ajust, getGradesPorEscolasByItems } from "@/hooks_api/api";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import {
    AlertTriangle,
    Package,
    Truck,
    CheckCircle,
    Clock,
    Settings,
    FileText,
    Grid,
    ChevronDown,
    ChevronUp,
    Scissors,
    Target
} from "react-feather";
import useSWR from "swr";
import { EscolaGradesItems } from "../../../../core";

const fetcher = async (id: string) => {
    const escolaComGradesByItems = await getGradesPorEscolasByItems(id);
    return escolaComGradesByItems;
};

const fetcherGradeAjust = async (id: string) => {
    const gradeReplica = await ajust(id);
    return gradeReplica;
};

export default function Expedition() {
    let { id } = useParams();

    if (Array.isArray(id)) {
        id = undefined;
    }

    // states tabela grades
    const [escolaData, setEscolaData] = useState<EscolaGradesItems | null>(null);
    const [expandedGrades, setExpandedGrades] = useState<Set<number>>(new Set());

    // Grades iniciam fechadas
    useEffect(() => {
        if (escolaData?.grades) {
            setExpandedGrades(new Set()); // Sempre fechadas
        }
    }, [escolaData]);

    // states modal confirmar ajuste de grade   
    const [ajustGrade, setAjustGrade] = useState(false);
    const [idGradeSelecionada, setIdGradeSelecionada] = useState<string | null>(null);

    // Usando SWR
    const { data, error, mutate: swrMutate } = useSWR(typeof id === 'string' && id ? ['grades', id] : null, () => fetcher(id!), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        if (data) {
            setEscolaData(data);
        }
    }, [data]);

    // Grade expansion toggle
    const toggleGradeExpansion = (gradeId: number) => {
        const newExpanded = new Set(expandedGrades);
        if (newExpanded.has(gradeId)) {
            newExpanded.delete(gradeId);
        } else {
            newExpanded.add(gradeId);
        }
        setExpandedGrades(newExpanded);
    };

    // Função para obter configurações visuais do status
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'EXPEDIDA':
                return {
                    color: 'text-emerald-400',
                    bgColor: 'bg-emerald-500/25',
                    borderColor: 'border-emerald-500/30',
                    icon: CheckCircle,
                    gradient: 'from-emerald-500/20 to-emerald-600/5'
                };
            case 'DESPACHADA':
                return {
                    color: 'text-purple-400',
                    bgColor: 'bg-purple-500/25',
                    borderColor: 'border-purple-500/30',
                    icon: Truck,
                    gradient: 'from-purple-500/20 to-purple-600/5'
                };
            case 'IMPRESSA':
                return {
                    color: 'text-blue-400',
                    bgColor: 'bg-blue-500/25',
                    borderColor: 'border-blue-500/30',
                    icon: FileText,
                    gradient: 'from-blue-500/20 to-blue-600/5'
                };
            default:
                return {
                    color: 'text-slate-400',
                    bgColor: 'bg-slate-500/20',
                    borderColor: 'border-slate-500/30',
                    icon: Clock,
                    gradient: 'from-slate-500/20 to-slate-600/5'
                };
        }
    };

    // Função para determinar o progresso da expedição com cores padrão do sistema
    const getProgressInfo = (quantidade: number, expedida: number) => {
        const percentual = quantidade > 0 ? (expedida / quantidade) * 100 : 0;
        const restante = quantidade - expedida;

        let status = 'nao_comecado';
        let color = 'bg-slate-500';
        let textColor = 'text-slate-300';
        let bgGradient = 'from-slate-700/20 to-transparent';
        let borderColor = 'border-slate-600/40';

        if (percentual === 100) {
            // Item completamente cortado - VERDE SUAVE
            status = 'completo';
            color = 'bg-slate-400';
            textColor = 'text-slate-200';
            bgGradient = 'from-slate-600/25 to-transparent';
            borderColor = 'border-slate-500/50';
        } else if (percentual > 0) {
            // Item parcialmente cortado - CINZA MÉDIO
            status = 'parcial';
            color = 'bg-slate-500';
            textColor = 'text-slate-300';
            bgGradient = 'from-slate-600/20 to-transparent';
            borderColor = 'border-slate-500/40';
        } else {
            // Item não começado - CINZA ESCURO
            status = 'nao_comecado';
            color = 'bg-slate-600';
            textColor = 'text-slate-400';
            bgGradient = 'from-slate-700/20 to-transparent';
            borderColor = 'border-slate-600/40';
        }

        return { percentual, restante, status, color, textColor, bgGradient, borderColor };
    };

    // Função para determinar a cor do estoque
    const getStockColor = (estoque: number) => {
        if (estoque < 0) return 'text-red-400';
        if (estoque === 0) return 'text-amber-400';
        return 'text-slate-400';
    };

    // funções utils
    function calcularTotais(grade: any) {
        const totalItens: number = grade.itensGrade.reduce((total: number, item: any) => total + item.quantidade, 0);
        const totalExpedidos: number = grade.itensGrade.reduce((total: number, item: any) => total + item.quantidadeExpedida, 0);
        const restanteParaExpedir: number = totalItens - totalExpedidos;
        const totalCaixas: number = grade.gradeCaixas.length;
        return {
            totalItens,
            totalExpedidos,
            restanteParaExpedir,
            totalCaixas,
        };
    }

    function coletarVariacoesNomesItens(grade: any): string[] {
        const nomesUnicos = Array.from(
            new Set<string>(grade.itensGrade.map((item: any) => item.itemTamanho.itemNome))
        );
        return nomesUnicos;
    }

    // functions ajustar grade 
    const abrirModalAjustGrade = (id: string | null) => {
        setAjustGrade(ajustGrade ? false : true);
        setIdGradeSelecionada(id);
    }

    // Verifica se a grade pode ser ajustada: deve ser PRONTA e ter pelo menos 1 item expedido
    const podeAjustarGrade = (grade: any) => {
        return grade.status === "PRONTA" && grade.itensGrade?.some((item: any) => item.quantidadeExpedida > 0);
    };

    const handlerAjustaGrade = async (gradeId: string) => {
        await fetcherGradeAjust(gradeId);
        setAjustGrade(ajustGrade ? false : true);
        swrMutate();
    }

    if (!data && !error) {
        return <IsLoading />
    }

    if (error) {
        return (
            <PageWithDrawer sectionName="Erro" currentPage="expedition">
                <div className="flex items-center justify-center min-h-[100dvh] px-4">
                    <div className="relative z-10 max-w-md w-full">
                        <div className="bg-red-900/20 border border-red-800 rounded-2xl p-6 sm:p-8 text-center">
                            <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle size={32} className="text-red-400" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-4">Erro no Sistema</h2>
                            <p className="text-red-300 text-sm sm:text-base mb-6">{error.message}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full h-12 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                            >
                                Tentar Novamente
                            </button>
                        </div>
                    </div>
                </div>
            </PageWithDrawer>
        );
    }

    return (
        <PageWithDrawer
            sectionName={escolaData?.nome && escolaData.nome.length > 25 ? escolaData.nome.substring(0, 25) + "..." : (escolaData?.nome || 'Corte de Grades')}
            currentPage="expedition"
            projectName={escolaData?.nome}
            projectId={escolaData?.id}
        >
            <div className="px-4 lg:pt-[5.5rem] pt-14 pb-8 sm:px-6 lg:px-8">
                <div className="max-w-[110rem] mx-auto">
                    {/* Page Header com Estatísticas Integradas */}
                    <div className="lg:fixed lg:top-0 lg:left-0 lg:right-0 lg:z-20
                     lg:bg-slate-900/95 lg:backdrop-blur-sm lg:border-b lg:border-slate-700">
                        {/* Título */}
                        <div className="flex flex-col justify-center items-center lg:py-3">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r
                            from-emerald-400 via-blue-500 to-purple-600 mb-2">
                                Corte de Grades
                            </h1>
                            <p className="text-slate-400 text-sm lg:text-[1rem] max-w-2xl mx-auto text-center">
                                {escolaData?.nome} {escolaData?.numeroEscola && `- Escola Nº ${escolaData.numeroEscola}`}
                            </p>
                            <div className="flex items-center justify-center mt-2">
                                <div className="w-12 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                                <span className="mx-3 text-slate-500 text-xs lg:text-lg">
                                    {escolaData?.grades.length || 0} grade{(escolaData?.grades.length || 0) > 1 ? 's' : ''} disponível{(escolaData?.grades.length || 0) > 1 ? 'eis' : ''}
                                </span>
                                <div className="w-12 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                            </div>
                        </div>

                        {/* Estatísticas Desktop - DENTRO do Header */}
                        <div className="hidden lg:block lg:px-4 lg:pb-4">
                            <div className="grid grid-cols-4 gap-4 max-w-7xl mx-auto">
                                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-slate-700/50 rounded-lg">
                                            <Grid size={20} className="text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase tracking-wide">Grades</p>
                                            <p className="text-xl font-semibold text-slate-200">{escolaData?.grades.length || 0}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 border border-slate-700 rounded-md p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-900/50 rounded-lg">
                                            <Package size={20} className="text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-blue-400 uppercase tracking-wide">Total Itens</p>
                                            <p className="text-xl font-semibold text-blue-300">
                                                {escolaData?.grades.reduce((sum, grade) =>
                                                    sum + grade.itensGrade.reduce((acc, item) => acc + item.quantidade, 0), 0
                                                ) || 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 border border-slate-700 rounded-md p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-emerald-900/50 rounded-lg">
                                            <CheckCircle size={20} className="text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-emerald-400 uppercase tracking-wide">Expedidos</p>
                                            <p className="text-xl font-semibold text-emerald-300">
                                                {escolaData?.grades.reduce((sum, grade) =>
                                                    sum + grade.itensGrade.reduce((acc, item) => acc + item.quantidadeExpedida, 0), 0
                                                ) || 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 border border-slate-700 rounded-md p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-amber-900/50 rounded-lg">
                                            <Clock size={20} className="text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-amber-400 uppercase tracking-wide">Para Cortar</p>
                                            <p className="text-xl font-semibold text-amber-300">
                                                {escolaData?.grades
                                                    .filter(grade => grade.status === 'PRONTA')
                                                    .reduce((sum, grade) => {
                                                        return sum + grade.itensGrade.reduce((acc, item) => {
                                                            if (item.quantidadeExpedida === 0) {
                                                                return acc + item.quantidade;
                                                            } else {
                                                                return acc + (item.quantidade - item.quantidadeExpedida);
                                                            }
                                                        }, 0);
                                                    }, 0) || 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="pt-5 lg:pt-[9rem]">
                        {/* Stats Cards - Mobile Only */}
                        <div className="grid grid-cols-2 lg:hidden gap-3 mb-4">
                            <div className="bg-slate-800/50 border border-slate-700 rounded-md p-3">
                                <div className="flex items-center space-x-2">
                                    <div className="p-1.5 bg-slate-700/50 rounded-lg">
                                        <Grid size={20} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wide">Grades</p>
                                        <p className="text-xl font-semibold text-slate-200">{escolaData?.grades.length || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800/50 border border-slate-700 rounded-md p-3">
                                <div className="flex items-center space-x-2">
                                    <div className="p-1.5 bg-blue-900/50 rounded-lg">
                                        <Package size={20} className="text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-400 uppercase tracking-wide">Total</p>
                                        <p className="text-xl font-semibold text-blue-300">
                                            {escolaData?.grades.reduce((sum, grade) =>
                                                sum + grade.itensGrade.reduce((acc, item) => acc + item.quantidade, 0), 0
                                            ) || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800/50 border border-slate-700 rounded-md p-3">
                                <div className="flex items-center space-x-2">
                                    <div className="p-1.5 bg-emerald-900/50 rounded-lg">
                                        <CheckCircle size={20} className="text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-emerald-400 uppercase tracking-wide">Expedidos</p>
                                        <p className="text-xl font-semibold text-emerald-300">
                                            {escolaData?.grades.reduce((sum, grade) =>
                                                sum + grade.itensGrade.reduce((acc, item) => acc + item.quantidadeExpedida, 0), 0
                                            ) || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800/50 border border-slate-700 rounded-md p-3">
                                <div className="flex items-center space-x-2">
                                    <div className="p-1.5 bg-amber-900/50 rounded-lg">
                                        <Clock size={20} className="text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-amber-400 uppercase tracking-wide">P/ Cortar</p>
                                        <p className="text-xl font-semibold text-amber-300">
                                            {escolaData?.grades
                                                .filter(grade => grade.status === 'PRONTA')
                                                .reduce((sum, grade) => {
                                                    return sum + grade.itensGrade.reduce((acc, item) => {
                                                        if (item.quantidadeExpedida === 0) {
                                                            return acc + item.quantidade;
                                                        } else {
                                                            return acc + (item.quantidade - item.quantidadeExpedida);
                                                        }
                                                    }, 0);
                                                }, 0) || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Grades Container */}
                        <div className="w-full lg:pt-2">
                            {/* Desktop Table View */}
                            <div className="hidden lg:block">
                                {escolaData?.grades.map((grade) => {
                                    const totais = calcularTotais(grade);
                                    const variacoes = coletarVariacoesNomesItens(grade);
                                    const statusConfig = getStatusConfig(grade.status);
                                    const isExpanded = expandedGrades.has(grade.id);
                                    const StatusIcon = statusConfig.icon;

                                    return (
                                        <motion.div
                                            key={grade.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`mb-6 rounded-md bg-slate-800/50 backdrop-blur-sm border ${statusConfig.borderColor} overflow-hidden`}
                                        >
                                            {/* Grade Header Table */}
                                            <div className={`bg-gradient-to-r ${statusConfig.gradient} bg-slate-800/70`}>
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="bg-slate-700/50 text-slate-300 text-sm">
                                                            <th className="p-3 text-left font-semibold w-[10%] align-top">AÇÕES</th>
                                                            <th className="p-3 text-left font-semibold w-[14%] align-top">STATUS</th>
                                                            <th className="p-3 text-left font-semibold w-[10%] align-top">GRADE ID</th>
                                                            <th className="p-3 text-left font-semibold w-[10%] align-top">TOTAL</th>
                                                            <th className="p-3 text-left font-semibold w-[10%] align-top">EXPEDIDOS</th>
                                                            <th className="p-3 text-left font-semibold w-[10%] align-top">PARA CORTAR</th>
                                                            <th className="p-3 text-left font-semibold w-[8%] align-top">VOLUMES</th>
                                                            <th className="p-3 text-left font-semibold w-[18%] align-top">ITENS</th>
                                                            <th className="p-3 text-left font-semibold w-[10%] align-top">DETALHES</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                                                            <td className="p-3 align-top">
                                                                {podeAjustarGrade(grade) && (
                                                                    <button
                                                                        onClick={() => abrirModalAjustGrade(String(grade.id))}
                                                                        className="flex items-center space-x-2 px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-lg transition-all duration-200 text-amber-400 hover:text-amber-300"
                                                                    >
                                                                        <Settings size={14} />
                                                                        <span className="text-sm font-medium">Ajustar</span>
                                                                    </button>
                                                                )}
                                                            </td>
                                                            <td className="p-3 align-top">
                                                                <div className="flex items-center space-x-2">
                                                                    <StatusIcon size={16} className={statusConfig.color} />
                                                                    <span className={`text-lg font-medium ${statusConfig.color} min-w-[85px] block`}>{grade.status}</span>
                                                                </div>
                                                            </td>
                                                            <td className="p-3 text-lg font-extralight text-teal-400 text-left align-top">{grade.id}</td>
                                                            <td className="p-3 text-lg font-extralight text-blue-300 text-left align-top">{totais.totalItens}</td>
                                                            <td className="p-3 text-lg font-extralight text-emerald-400 text-left align-top">{totais.totalExpedidos}</td>
                                                            <td className="p-3 text-lg font-extralight text-amber-400 text-left align-top">{totais.restanteParaExpedir}</td>
                                                            <td className="p-3 text-lg font-extralight text-blue-400 text-left align-top">{totais.totalCaixas}</td>
                                                            <td className="p-3 align-top">
                                                                <div className="flex flex-col gap-1 items-start">
                                                                    {variacoes.map((item, idx) => (
                                                                        <span key={idx} className="px-2 py-1 bg-slate-700/50 border border-slate-600/50 rounded text-xs text-slate-300 truncate max-w-[200px]" title={item}>
                                                                            {item}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </td>
                                                            <td className="p-3 w-24 text-left align-top">
                                                                <button
                                                                    onClick={() => toggleGradeExpansion(grade.id)}
                                                                    className="flex items-center justify-center space-x-1 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-lg transition-all duration-200 text-slate-400 hover:text-slate-300 w-[100px]"
                                                                >
                                                                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                                    <span className="text-sm font-medium">{isExpanded ? 'Ocultar' : 'Ver'}</span>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Expandable Items Detail - Desktop Table */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="border-t border-slate-700/50 bg-slate-900/30"
                                                    >
                                                        <div className="p-4">
                                                            <h4 className="text-base font-medium text-white mb-3 flex items-center space-x-2">
                                                                <Scissors size={18} className="text-amber-400" />
                                                                <span>Itens para Corte</span>
                                                            </h4>

                                                            {/* Items Table - Desktop */}
                                                            <div className="overflow-x-auto">
                                                                <div className="min-w-full">
                                                                    <table className="w-full table-fixed">
                                                                        <thead>
                                                                            <tr className="border-b border-slate-700/50">
                                                                                <th className="text-left py-2 px-3 text-xs font-extralight text-slate-400 uppercase tracking-wide w-[7%]">Status</th>
                                                                                <th className="text-left py-2 px-3 text-xs font-extralight text-slate-400 uppercase tracking-wide w-[16%]">Item</th>
                                                                                <th className="text-left py-2 px-3 text-xs font-extralight text-slate-400 uppercase tracking-wide w-[10%]">Gênero</th>
                                                                                <th className="text-left py-2 px-3 text-xs font-extralight text-slate-400 uppercase tracking-wide w-[7%]">Tamanho</th>
                                                                                <th className="text-left py-2 px-3 text-xs font-extralight text-slate-400 uppercase tracking-wide w-[10%]">Previsto</th>
                                                                                <th className="text-left py-2 px-3 text-xs font-extralight text-slate-400 uppercase tracking-wide w-[10%]">Expedidos</th>
                                                                                <th className="text-left py-2 px-3 text-xs font-extralight text-slate-400 uppercase tracking-wide w-[10%]">Para Cortar</th>
                                                                                <th className="text-left py-2 px-3 text-xs font-extralight text-slate-400 uppercase tracking-wide w-[10%]">Estoque</th>
                                                                                <th className="text-left py-2 px-3 text-xs font-extralight text-slate-400 uppercase tracking-wide w-[10%]">Código</th>
                                                                                <th className="text-left py-2 px-3 text-xs font-extralight text-slate-400 uppercase tracking-wide w-[10%]">Progresso</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {grade.itensGrade.map((item: any) => {
                                                                                const progress = getProgressInfo(item.quantidade, item.quantidadeExpedida);

                                                                                return (
                                                                                    <tr
                                                                                        key={item.id}
                                                                                        className={`border-b border-slate-800/50 transition-colors duration-200 ${progress.status === 'completo' ? 'bg-emerald-900/30 hover:bg-emerald-900/40' :
                                                                                            progress.status === 'parcial' ? 'bg-amber-900/30 hover:bg-amber-900/40' :
                                                                                                'bg-slate-800/25 hover:bg-slate-800/35'
                                                                                            }`}
                                                                                    >
                                                                                        {/* Status */}
                                                                                        <td className="py-3 px-3 w-[80px]">
                                                                                            <div className="flex items-center space-x-2">
                                                                                                <div className={`w-2.5 h-2.5 rounded-full ${progress.status === 'completo' ? 'bg-emerald-400' :
                                                                                                    progress.status === 'parcial' ? 'bg-amber-400' :
                                                                                                        'bg-slate-500'
                                                                                                    }`}></div>
                                                                                                {progress.status === 'completo' ? (
                                                                                                    <CheckCircle size={14} className="text-emerald-400" />
                                                                                                ) : progress.status === 'parcial' ? (
                                                                                                    <Scissors size={14} className="text-amber-400" />
                                                                                                ) : (
                                                                                                    <Target size={14} className="text-slate-500" />
                                                                                                )}
                                                                                            </div>
                                                                                        </td>

                                                                                        {/* Item */}
                                                                                        <td className="py-3 px-3 w-[200px]">
                                                                                            <div className="font-light text-white text-base leading-tight truncate" title={item.itemTamanho.itemNome}>
                                                                                                {item.itemTamanho.itemNome}
                                                                                            </div>
                                                                                        </td>

                                                                                        {/* Gênero */}
                                                                                        <td className="py-3 px-3 w-[100px]">
                                                                                            <span className="font-light text-slate-300 text-sm">{item.itemTamanho.itemGenero}</span>
                                                                                        </td>

                                                                                        {/* Tamanho */}
                                                                                        <td className="py-3 px-3 w-[80px]">
                                                                                            <span className="font-light text-slate-300 text-sm">{item.itemTamanho.tamanhoNome}</span>
                                                                                        </td>

                                                                                        {/* Previsto */}
                                                                                        <td className="py-3 px-3 text-left w-[80px]">
                                                                                            <span className="font-semibold text-blue-300 text-base">{item.quantidade}</span>
                                                                                        </td>

                                                                                        {/* Expedidos */}
                                                                                        <td className="py-3 px-3 text-left w-[80px]">
                                                                                            <span className="font-semibold text-emerald-300 text-base">{item.quantidadeExpedida}</span>
                                                                                        </td>

                                                                                        {/* Para Cortar */}
                                                                                        <td className="py-3 px-3 text-left w-[100px]">
                                                                                            <span className="font-semibold text-amber-300 text-base">{progress.restante}</span>
                                                                                        </td>

                                                                                        {/* Estoque */}
                                                                                        <td className="py-3 px-3 text-left w-[80px]">
                                                                                            <span className={`font-medium text-base ${getStockColor(item.itemTamanho.estoque)}`}>{item.itemTamanho.estoque}</span>
                                                                                        </td>

                                                                                        {/* Código */}
                                                                                        <td className="py-3 px-3 text-left w-[120px]">
                                                                                            {item.itemTamanho.barcode ? (
                                                                                                <span className="font-mono font-light text-slate-400 text-xs truncate block" title={item.itemTamanho.barcode}>{item.itemTamanho.barcode}</span>
                                                                                            ) : (
                                                                                                <span className="text-slate-600 text-xs">-</span>
                                                                                            )}
                                                                                        </td>

                                                                                        {/* Progresso */}
                                                                                        <td className="py-3 px-3 w-[140px]">
                                                                                            <div className="flex items-center space-x-2 min-w-[120px]">
                                                                                                <div className="flex-1">
                                                                                                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                                                                                                        <div
                                                                                                            className={`${progress.color} h-1.5 rounded-full transition-all duration-500`}
                                                                                                            style={{ width: `${progress.percentual}%` }}
                                                                                                        ></div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <span className={`text-xs font-extralight ${progress.textColor} min-w-[35px] text-right`}>
                                                                                                    {Math.round(progress.percentual)}%
                                                                                                </span>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                );
                                                                            })}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Mobile Cards View - Padrão Resume2 Exato */}
                            <div className="lg:hidden space-y-4">
                                {escolaData?.grades.map((grade) => {
                                    const totais = calcularTotais(grade);
                                    const statusConfig = getStatusConfig(grade.status);
                                    const isExpanded = expandedGrades.has(grade.id);

                                    return (
                                        <div key={grade.id} className={`border ${statusConfig.borderColor} rounded-xl overflow-hidden shadow-lg ${statusConfig.bgColor}`}>
                                            {/* Header da Grade - Estrutura Fixa mais Compacta */}
                                            <div className="bg-slate-800/50 p-3">
                                                <div className="space-y-3">

                                                    {/* Textos grandes - um por linha */}
                                                    <div className="space-y-2">
                                                        <div className={`${statusConfig.bgColor} rounded-lg p-2 border ${statusConfig.borderColor}`}>
                                                            <p className="text-xs text-slate-400 uppercase font-extralight">Grade</p>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center space-x-2">
                                                                    <div className={`w-2.5 h-2.5 rounded-full ${statusConfig.color}`}></div>
                                                                    <p className="text-lg font-extralight text-slate-300">#{grade.id}</p>
                                                                </div>
                                                                <span className={`text-sm font-extralight px-1.5 py-0.5 rounded ${statusConfig.borderColor} ${statusConfig.color} border`}>
                                                                    {grade.status}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="bg-slate-700/30 rounded-lg p-2">
                                                            <p className="text-xs text-slate-400 uppercase font-extralight">Unidade Escolar</p>
                                                            <p className="text-lg font-extralight text-slate-300 truncate">{escolaData?.nome}</p>
                                                        </div>
                                                    </div>

                                                    {/* Textos pequenos - lado a lado bem divididos */}
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                        <div className="bg-slate-700/30 rounded-lg p-2 border-r border-slate-600/30">
                                                            <p className="text-[10px] text-slate-400 uppercase font-medium">Nº da Escola</p>
                                                            <p className="text-sm font-semibold text-yellow-500">{escolaData?.numeroEscola}</p>
                                                        </div>

                                                        <div className="bg-slate-700/30 rounded-lg p-2 border-r border-slate-600/30">
                                                            <p className="text-[10px] text-slate-400 uppercase font-medium">Total</p>
                                                            <p className="text-sm font-extralight text-cyan-400">{totais.totalItens}</p>
                                                        </div>

                                                        <div className="bg-slate-700/30 rounded-lg p-2 border-r border-slate-600/30">
                                                            <p className="text-[10px] text-slate-400 uppercase font-medium">Expedidos</p>
                                                            <p className="text-sm font-extralight text-emerald-400">{totais.totalExpedidos}</p>
                                                        </div>

                                                        <div className="bg-slate-700/30 rounded-lg p-2 border-r border-slate-600/30">
                                                            <p className="text-[10px] text-slate-400 uppercase font-medium">Para Cortar</p>
                                                            <p className="text-sm font-extralight text-orange-400">{totais.restanteParaExpedir}</p>
                                                        </div>

                                                        <div className="bg-slate-700/30 rounded-lg p-2 border-r border-slate-600/30">
                                                            <p className="text-[10px] text-slate-400 uppercase font-medium">Volumes</p>
                                                            <p className="text-sm font-extralight text-red-400">{totais.totalCaixas}</p>
                                                        </div>

                                                        <div className="bg-slate-700/30 rounded-lg p-2 border-r border-slate-600/30">
                                                            <p className="text-[10px] text-slate-400 uppercase font-medium">Concluído</p>
                                                            <p className="text-sm font-extralight text-slate-300">
                                                                {totais.totalItens > 0 ? Math.round((totais.totalExpedidos / totais.totalItens) * 100) : 0}%
                                                            </p>
                                                        </div>

                                                        {/* Botões de Ação */}
                                                        <div className="col-span-2 sm:col-span-3 flex justify-between items-center pt-1">
                                                            <div className="flex space-x-2">
                                                                {podeAjustarGrade(grade) && (
                                                                    <button
                                                                        onClick={() => abrirModalAjustGrade(String(grade.id))}
                                                                        className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-400 hover:text-amber-300 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors duration-200 flex items-center space-x-1"
                                                                    >
                                                                        <Settings size={10} />
                                                                        <span>Ajustar</span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <button
                                                                onClick={() => toggleGradeExpansion(grade.id)}
                                                                className="flex items-center justify-center w-6 h-6 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-colors duration-200"
                                                            >
                                                                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tabela de Itens - Expandida */}
                                            {isExpanded && (
                                                <div className="border-t border-slate-700">
                                                    <div className="overflow-x-auto w-full">
                                                        <div className="min-w-max">
                                                            <table className="w-full">
                                                                <thead className="bg-slate-700/50 text-slate-400">
                                                                    <tr>
                                                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap min-w-[120px]">Item</th>
                                                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap min-w-[100px]">Gênero</th>
                                                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap min-w-[80px]">Tam</th>
                                                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap min-w-[100px]">Previsto</th>
                                                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap min-w-[100px]">Expedido</th>
                                                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap min-w-[100px]">P/ Cortar</th>
                                                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap min-w-[100px]">Estoque</th>
                                                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap min-w-[100px]">Progresso</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-slate-700">
                                                                    {grade.itensGrade.map((item: any) => {
                                                                        const restante = item.quantidade - item.quantidadeExpedida;
                                                                        const progressPercentage = item.quantidade > 0 ? (item.quantidadeExpedida / item.quantidade) * 100 : 0;
                                                                        const itemStatus = item.quantidadeExpedida === 0 ? 'unstarted' :
                                                                            item.quantidadeExpedida === item.quantidade ? 'complete' : 'partial';
                                                                        const itemBgColor = itemStatus === 'complete' ? 'bg-emerald-500/10' :
                                                                            itemStatus === 'partial' ? 'bg-yellow-500/10' : 'bg-slate-500/10';
                                                                        return (
                                                                            <tr key={item.id} className={`${itemBgColor} hover:bg-slate-700/30 transition-colors duration-150`}>
                                                                                <td className="px-4 py-3 text-sm font-medium uppercase whitespace-nowrap min-w-[120px]">{item.itemTamanho.itemNome}</td>
                                                                                <td className="px-4 py-3 text-sm font-medium uppercase whitespace-nowrap min-w-[100px]">{item.itemTamanho.itemGenero}</td>
                                                                                <td className="px-4 py-3 text-sm font-medium uppercase bg-slate-700/50 text-slate-400 whitespace-nowrap min-w-[80px]">{item.itemTamanho.tamanhoNome}</td>
                                                                                <td className="px-4 py-3 text-sm text-cyan-400 whitespace-nowrap min-w-[100px]">
                                                                                    {item.quantidade}
                                                                                </td>
                                                                                <td className={`px-4 py-3 text-sm text-left text-white ${(item.quantidade === item.quantidadeExpedida) ? 'bg-gradient-to-l from-emerald-500/20 to-transparent' : ''} whitespace-nowrap min-w-[100px]`}>
                                                                                    <span className={`${(item.quantidade === item.quantidadeExpedida) ? 'text-emerald-500' : ''}`}>
                                                                                        {item.quantidadeExpedida}
                                                                                    </span>
                                                                                </td>
                                                                                <td className={`px-4 py-3 text-sm text-white ${(restante > 0) ? 'bg-gradient-to-r from-red-500/20 to-transparent' : ''} whitespace-nowrap min-w-[100px]`}>
                                                                                    <span className={`${(restante > 0) ? 'text-red-500' : ''}`}>
                                                                                        {restante}
                                                                                    </span>
                                                                                </td>
                                                                                <td className={`px-4 py-3 text-sm text-blue-400 whitespace-nowrap min-w-[100px]`}>
                                                                                    {item.itemTamanho.estoque || 0}
                                                                                </td>
                                                                                <td className="px-4 py-3 text-sm whitespace-nowrap min-w-[100px]">
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <div className="w-16 bg-slate-700 rounded-full h-2">
                                                                                            <div
                                                                                                className={`h-2 rounded-full transition-all duration-300 ${itemStatus === 'complete' ? 'bg-emerald-500' :
                                                                                                    itemStatus === 'partial' ? 'bg-yellow-500' : 'bg-slate-500'
                                                                                                    }`}
                                                                                                style={{ width: `${progressPercentage}%` }}
                                                                                            ></div>
                                                                                        </div>
                                                                                        <span className="text-xs text-slate-400 min-w-[35px]">
                                                                                            {Math.round(progressPercentage)}%
                                                                                        </span>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    })}

                                                                    {/* Linha de Totais */}
                                                                    <tr className="font-bold bg-slate-700/50 text-slate-400">
                                                                        <td className="px-4 py-3 whitespace-nowrap min-w-[120px]"></td>
                                                                        <td className="px-4 py-3 whitespace-nowrap min-w-[100px]">TOTAIS</td>
                                                                        <td className="px-4 py-3 whitespace-nowrap min-w-[80px]" colSpan={1}>{'==>'}</td>
                                                                        <td className="px-4 py-3 text-sm font-bold text-slate-300 bg-slate-600/50 whitespace-nowrap min-w-[100px]">
                                                                            {totais.totalItens}
                                                                        </td>
                                                                        <td className="px-4 py-3 text-sm font-bold text-slate-300 bg-slate-600/50 text-left whitespace-nowrap min-w-[100px]">
                                                                            {totais.totalExpedidos}
                                                                        </td>
                                                                        <td className="px-4 py-3 text-sm font-bold text-slate-300 bg-slate-600/50 whitespace-nowrap min-w-[100px]">
                                                                            {totais.restanteParaExpedir}
                                                                        </td>
                                                                        <td className="px-4 py-3 whitespace-nowrap min-w-[100px] bg-slate-600/50"></td>
                                                                        <td className="px-4 py-3 text-sm font-bold text-slate-300 bg-slate-600/50 whitespace-nowrap min-w-[100px]"></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Modal de Confirmação de Ajuste - Redesigned */}
                        <AnimatePresence>
                            {ajustGrade && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        className="w-full max-w-[85vw] sm:max-w-md lg:max-w-lg bg-slate-900/95 backdrop-blur-lg border border-slate-700/80 rounded-lg shadow-2xl overflow-hidden"
                                    >
                                        {/* Header Compacto */}
                                        <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-b border-amber-500/40 p-3">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex items-center justify-center w-8 h-8 bg-amber-500/30 rounded-lg">
                                                    <Settings size={16} className="text-amber-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-base font-bold text-white">Ajuste de Grade</h3>
                                                    <p className="text-amber-300 font-medium text-sm">Grade #{idGradeSelecionada}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Conteúdo */}
                                        <div className="p-3 sm:p-4">
                                            {/* Informações da Grade */}
                                            {(() => {
                                                const gradeInfo = escolaData?.grades.find(g => g.id === Number(idGradeSelecionada));
                                                const totais = gradeInfo ? calcularTotais(gradeInfo) : null;

                                                return gradeInfo && totais ? (
                                                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-2 mb-3">
                                                        <h4 className="text-white font-medium mb-2 flex items-center space-x-2 text-sm">
                                                            <FileText size={12} className="text-blue-400" />
                                                            <span>Informações</span>
                                                        </h4>

                                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                                                            <div className="text-center bg-slate-700/30 rounded p-1.5">
                                                                <p className="text-sm font-bold text-blue-300">{totais.totalItens}</p>
                                                                <p className="text-[10px] text-slate-400">Total</p>
                                                            </div>
                                                            <div className="text-center bg-slate-700/30 rounded p-1.5">
                                                                <p className="text-sm font-bold text-emerald-300">{totais.totalExpedidos}</p>
                                                                <p className="text-[10px] text-slate-400">Expedidos</p>
                                                            </div>
                                                            <div className="text-center bg-slate-700/30 rounded p-1.5">
                                                                <p className="text-sm font-bold text-amber-300">{totais.restanteParaExpedir}</p>
                                                                <p className="text-[10px] text-slate-400">P/ Cortar</p>
                                                            </div>
                                                            <div className="text-center bg-slate-700/30 rounded p-1.5">
                                                                <p className="text-sm font-bold text-slate-300">{totais.totalCaixas}</p>
                                                                <p className="text-[10px] text-slate-400">Volumes</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center space-x-2">
                                                            <div className={`w-2.5 h-2.5 rounded-full ${gradeInfo.status === 'PRONTA' ? 'bg-blue-400' :
                                                                gradeInfo.status === 'EXPEDIDA' ? 'bg-emerald-400' :
                                                                    gradeInfo.status === 'DESPACHADA' ? 'bg-purple-400' :
                                                                        'bg-slate-400'
                                                                }`}></div>
                                                            <span className="text-slate-300 font-medium text-sm">Status: {gradeInfo.status}</span>
                                                        </div>
                                                    </div>
                                                ) : null;
                                            })()}

                                            {/* Aviso de Atenção */}
                                            <div className="bg-gradient-to-r from-amber-500/15 to-red-500/15 border border-amber-500/30 rounded-lg p-3 sm:p-4 mb-4">
                                                <div className="flex items-start space-x-2 sm:space-x-3">
                                                    <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-amber-500/30 rounded-md flex items-center justify-center">
                                                        <AlertTriangle size={14} className="sm:w-4 sm:h-4 text-amber-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-amber-400 font-bold mb-2 text-sm">⚠️ Operação Irreversível</h4>
                                                        <p className="text-amber-200 text-xs sm:text-sm mb-2 font-medium">
                                                            Esta ação não poderá ser desfeita após confirmação
                                                        </p>

                                                        <div className="space-y-1">
                                                            <div className="flex items-center space-x-2 text-xs">
                                                                <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                                                                <span className="text-slate-300">Apenas grades PRONTAS com itens expedidos</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2 text-xs">
                                                                <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                                                                <span className="text-slate-300">Grades EXPEDIDAS/DESPACHADAS não podem ser alteradas</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2 text-xs">
                                                                <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                                                                <span className="text-slate-300">Dados serão recalculados automaticamente</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Botões de Ação */}
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <button
                                                    onClick={() => abrirModalAjustGrade(null)}
                                                    className="flex-1 flex items-center justify-center px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-lg transition-all duration-200 text-slate-300 hover:text-white font-medium text-sm sm:text-base"
                                                >
                                                    <span>Cancelar</span>
                                                </button>
                                                <button
                                                    onClick={() => handlerAjustaGrade(idGradeSelecionada!)}
                                                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-emerald-500/20 to-green-500/20 hover:from-emerald-500/30 hover:to-green-500/30 border border-emerald-500/40 rounded-lg transition-all duration-200 text-emerald-300 hover:text-emerald-200 font-medium text-sm sm:text-base shadow-lg"
                                                >
                                                    <Settings size={16} />
                                                    <span>Confirmar Ajuste</span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </PageWithDrawer>
    );
}
