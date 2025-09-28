'use client';

import IsLoading from '@/components/ComponentesInterface/IsLoading';
import ListaCaixas from '@/components/ComponentesInterface/ListaCaixas';
import PageWithDrawer from '@/components/ComponentesInterface/PageWithDrawer';
import { getCaixasPorGrade } from '@/hooks_api/api';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Search, Package, RotateCcw, Printer } from 'react-feather';
import { Caixa } from '../../../core';
import EtiquetasNew from '@/components/componentesDePrint/EtiquetasNew';

const fachBox = async (id: string): Promise<Caixa[]> => {
    return await getCaixasPorGrade(id);
};

export default function PaginaCaixasManual() {
    const botaoBuscarRef = useRef<HTMLButtonElement | null>(null);
    const botaoCancelarRef = useRef<HTMLButtonElement | null>(null);
    const botaoNovaPesquisaRef = useRef<HTMLButtonElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [caixas, setCaixas] = useState<Caixa[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalStatus, setModalStatus] = useState<boolean>(false);
    const [idparapesquisa, setIdparapesquisa] = useState<string>('');
    const [hasMounted, setHasMounted] = useState(false);
    const [totalGradeC, setTotalGradeC] = useState<number>(0);
    const [totalGradeI, setTotalGradeI] = useState<number>(0);

    useEffect(() => {
        setHasMounted(true);
        const timer = setTimeout(() => {
            setModalStatus(true);
        }, 700);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        inputRef.current?.focus();
        const handleKeyDown = (event: KeyboardEvent) => {
            if (modalStatus) {
                if (event.key === 'Enter') {
                    botaoBuscarRef.current?.click();
                } else if (event.key === 'ArrowRight') {
                    botaoCancelarRef.current?.click();
                }
            } else {
                // Quando o modal não está aberto, seta esquerda abre o modal
                if (event.key === 'ArrowLeft') {
                    setIdparapesquisa(''); // Limpa o campo de pesquisa
                    setModalStatus(true);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [modalStatus]);

    if (!hasMounted) return null;

    const buscarCaixas = async () => {
        if (!idparapesquisa) return;
        setLoading(true);
        try {
            const box = await fachBox(idparapesquisa);
            setCaixas(box);
            if (box.length > 0 && box[0].escolaCaixa) {
                document.title = `${box[0].escolaCaixa} - CAIXAS POR GRADE MANUAL`;
            }
            setModalStatus(false);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    const resetPesquisa = () => {
        setCaixas([]);
        setIdparapesquisa('');
        setModalStatus(true);
    };

    const abrirModalPesquisa = () => {
        setIdparapesquisa(''); // Limpa o campo de pesquisa
        setModalStatus(true);
    };



    const setTotal = (num: number, num1: number) => {
        setTotalGradeC(num);
        setTotalGradeI(num1);
    }

    return (
        <PageWithDrawer
            projectName="Caixas por Grade"
            sectionName="Pesquisa Manual"
            currentPage="caixas_por_grade_m"
        >
            {/* Header Fixo para Desktop, Compacto para Mobile */}
            <div className="lg:fixed lg:top-0 lg:left-0 lg:right-0 lg:z-20 lg:bg-slate-900/95 lg:backdrop-blur-sm lg:border-b lg:border-slate-700">
                <div className="px-4 pt-16 pb-3 lg:pt-6 lg:pb-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        
                        {/* Header Compacto */}
                        <div className="flex items-center justify-between mb-3 lg:mb-4">
                            <div className="flex items-center space-x-3 lg:space-x-4 min-w-0">
                                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                    <Package size={14} className="lg:w-5 lg:h-5 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-lg lg:text-2xl xl:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 truncate">
                                        Caixas por Grade
                                    </h1>
                                    <p className="text-slate-400 text-xs lg:text-sm truncate">Pesquisa Manual de Caixas</p>
                                </div>
                            </div>

                            {/* Controles Desktop */}
                            <div className="hidden lg:flex items-center space-x-3">
                                {caixas.length > 0 ? (
                                    <button
                                        ref={botaoNovaPesquisaRef}
                                        onClick={resetPesquisa}
                                        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-300 font-medium rounded-lg transition-all duration-300 flex items-center space-x-2 text-sm"
                                    >
                                        <RotateCcw size={14} />
                                        <span>Nova Pesquisa</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={abrirModalPesquisa}
                                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 text-white font-medium rounded-lg transition-all duration-300 flex items-center space-x-2 text-sm"
                                    >
                                        <Search size={14} />
                                        <span>Pesquisar</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Instruções de Uso */}
                        <div className="bg-slate-800/30 lg:bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-lg">
                            <div className="text-center">
                                <div className="flex items-center justify-center space-x-2 mb-2">
                                    <Search size={16} className="lg:w-5 lg:h-5 text-emerald-400" />
                                    <h3 className="text-base lg:text-lg font-semibold text-slate-200">Pesquisa de Caixas</h3>
                                </div>
                                <p className="text-slate-400 text-xs lg:text-sm mb-3">
                                    Use o modal de pesquisa para buscar caixas por ID da grade
                                </p>
                                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 lg:gap-2 text-[10px] lg:text-xs text-slate-500">
                                    <span className="flex items-center space-x-1">
                                        <kbd className="px-1.5 py-0.5 lg:px-2 lg:py-1 bg-slate-700 rounded text-slate-300 text-[9px] lg:text-xs">←</kbd>
                                        <span>Abrir</span>
                                    </span>
                                    <span className="text-slate-600">•</span>
                                    <span className="flex items-center space-x-1">
                                        <kbd className="px-1.5 py-0.5 lg:px-2 lg:py-1 bg-slate-700 rounded text-slate-300 text-[9px] lg:text-xs">Enter</kbd>
                                        <span>Buscar</span>
                                    </span>
                                    <span className="text-slate-600">•</span>
                                    <span className="flex items-center space-x-1">
                                        <kbd className="px-1.5 py-0.5 lg:px-2 lg:py-1 bg-slate-700 rounded text-slate-300 text-[9px] lg:text-xs">→</kbd>
                                        <span>Cancelar</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Controles Mobile */}
                        <div className="lg:hidden flex items-center justify-between mt-3 gap-2">
                            {caixas.length > 0 ? (
                                <button
                                    ref={botaoNovaPesquisaRef}
                                    onClick={resetPesquisa}
                                    className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-300 font-medium rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 text-xs whitespace-nowrap"
                                >
                                    <RotateCcw size={12} />
                                    <span>Nova Pesquisa</span>
                                </button>
                            ) : (
                                <button
                                    onClick={abrirModalPesquisa}
                                    className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 text-xs whitespace-nowrap"
                                >
                                    <Search size={12} />
                                    <span>Pesquisar</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="px-4 pt-4 lg:pt-[16rem] pb-1 lg:pb-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col w-full justify-start items-start gap-y-4 pb-4">
                        <div className="flex justify-start items-start w-full min-h-[calc(100vh-14rem)]">
                            {loading ? (
                                <div className="w-full flex justify-center items-center">
                                    <IsLoading />
                                </div>
                            ) : caixas.length === 0 && !modalStatus ? (
                                <div className="w-full flex justify-center items-center">
                                    <div className="text-center py-12 lg:py-16">
                                        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 border border-slate-700">
                                            <Package size={32} className="lg:w-10 lg:h-10 text-slate-500" strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-xl lg:text-2xl font-semibold text-slate-300 mb-3 lg:mb-4">
                                            Nenhuma caixa encontrada
                                        </h3>
                                        <p className="text-slate-500 text-sm lg:text-base max-w-md mx-auto mb-4 lg:mb-6">
                                            Para a grade de ID: <span className="font-mono text-emerald-400">{idparapesquisa}</span>
                                        </p>
                                        <button
                                            onClick={resetPesquisa}
                                            className="h-10 lg:h-12 px-6 lg:px-8 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-300 font-medium rounded-lg lg:rounded-xl transition-all duration-300 transform hover:scale-105"
                                        >
                                            Nova Pesquisa
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full">
                                    {/* Estatísticas e Controles */}
                                    {caixas.length > 0 && (
                                        <div className="mb-6 space-y-4">
                                            {/* Estatísticas */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-slate-400 text-xs font-medium">Total por Caixa:</span>
                                                        <span className="text-lg font-bold text-yellow-500">{totalGradeC}</span>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-slate-400 text-xs font-medium">Total por Itens:</span>
                                                        <span className="text-lg font-bold text-emerald-500">{totalGradeI}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Botão de Impressão de Todas as Etiquetas */}
                                            <div className="flex justify-center">
                                                <div className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 overflow-hidden">
                                                    <EtiquetasNew 
                                                        etiquetas={caixas} 
                                                        classNew="flex items-center justify-center space-x-3 px-6 py-3 text-white font-bold text-sm lg:text-base transition-all duration-300 w-full"
                                                        len={caixas.length}
                                                    />
                                                    <div className="flex items-center justify-center space-x-2 px-6 py-2 bg-black/20 text-orange-100 text-xs">
                                                        <Printer size={14} />
                                                        <span>Imprimir Todas as {caixas.length} Etiquetas</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Lista de Caixas */}
                                    <ListaCaixas caixas={caixas} setTotalGrade={setTotal} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Pesquisa - Corrigido */}
            {modalStatus && (
                <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex flex-col justify-center items-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="bg-slate-800 border border-slate-700 p-4 lg:p-8 rounded-2xl shadow-2xl min-w-[85%] sm:min-w-[400px] max-w-[600px] flex flex-col items-center justify-center"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="mb-6"
                        >
                            <Search size={40} className="text-emerald-400" />
                        </motion.div>
                        
                        <h2 className="text-lg lg:text-2xl font-bold text-slate-300 mb-4 lg:mb-6 text-center">
                            Pesquisa de Caixas por Grade
                        </h2>
                        
                        <input
                            ref={inputRef}
                            type="text"
                            value={idparapesquisa}
                            onChange={(e) => setIdparapesquisa(e.target.value)}
                            placeholder="Digite o ID da grade"
                            className="w-full h-10 lg:h-14 px-3 lg:px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-sm lg:text-lg mb-4 lg:mb-6"
                        />
                        
                        <div className="flex w-full items-center justify-center gap-3">
                            <button
                                ref={botaoBuscarRef}
                                onClick={buscarCaixas}
                                className="flex-1 h-11 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                            >
                                <Search size={16} />
                                <span className="text-sm">Buscar</span>
                            </button>
                            <button
                                ref={botaoCancelarRef}
                                onClick={() => setModalStatus(false)}
                                className="flex-1 h-11 px-4 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg"
                            >
                                <span className="text-sm">Cancelar</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </PageWithDrawer>
    );
}
