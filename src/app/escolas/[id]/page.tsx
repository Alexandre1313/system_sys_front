"use client";

import EscolaComponent from '@/components/ComponentesEscola/EscolaComponent';
import PageWithDrawer from '@/components/ComponentesInterface/PageWithDrawer';
import { useIsMobile } from '@/hooks/useIsMobile';
import { getProjetosComEscolas } from '@/hooks_api/api';
import { AnimatePresence, motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Grid, Home, List, Search } from 'react-feather';
import useSWR from 'swr';
import { Projeto } from '../../../../core';

// Definindo o fetcher
const fetcher = async (id: number): Promise<Projeto> => {
    try {
        const projetoComEscolas = await getProjetosComEscolas(id);
        return projetoComEscolas as Projeto;
    } catch (error) {
        console.error('Erro ao buscar projeto:', error);
        throw error;
    }
};

export default function Escolas() {
    const { id } = useParams();
    const [busca, setBusca] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'grid1' | 'grid2' | 'grid3' | 'list'>('grid2');

    const isMobile = useIsMobile();

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement | null;

            // ignora atalhos quando estiver no input de busca (ou marcado)
            if (target?.closest('#buscaEscola, [data-hotkeys="off"]')) return;

            // ignora qualquer campo editável
            if (
                target &&
                (target.tagName === "INPUT" ||
                    target.tagName === "TEXTAREA" ||
                    target.tagName === "SELECT" ||
                    target.isContentEditable ||
                    target.closest("[contenteditable='true']"))
            ) return;

            if (e.repeat) return;

            const legacyCode = Number(
                (e as unknown as { which?: number; keyCode?: number }).which ??
                (e as unknown as { keyCode?: number }).keyCode ??
                0
            );

            // 1..5 (barra superior e numpad)
            let num: number | null = null;

            if (e.key && /^[1-5]$/.test(e.key)) {
                num = Number(e.key);
            } else if (legacyCode >= 49 && legacyCode <= 53) {
                num = legacyCode - 48;
            } else if (legacyCode >= 97 && legacyCode <= 101) {
                num = legacyCode - 96;
            }

            if (num !== null) {
                e.preventDefault();
                switch (num) {
                    case 1: setViewMode("grid"); return;
                    case 2: setViewMode("grid1"); return;
                    case 3: setViewMode("grid2"); return;
                    case 4: setViewMode("grid3"); return;
                    case 5: setViewMode("list"); return;
                }
            }
        };

        document.addEventListener("keydown", handler, { passive: false });
        return () => document.removeEventListener("keydown", handler);
    }, []);

    // Usando SWR para buscar os dados do projeto e escolas
    const { data: projeto, error } = useSWR<Projeto>(
        id !== undefined ? id : null,
        fetcher, {
        refreshInterval: 3 * 60 * 1000, // Atualiza a cada 2 horas
        revalidateOnFocus: true,
        onError: (err) => {
            console.error('SWR Error:', err);
        }
    });

    useEffect(() => {
        if (projeto && projeto.nome) {
            document.title = `${projeto.nome} - ESCOLAS`;
        }
    }, [projeto]);

    // Filter schools with memoization for better performance - must be before all conditional returns
    const escolasOrdenadas = useMemo(() => {
        if (!projeto?.escolas) return [];

        const escolasFiltradas = projeto.escolas.filter((escola) =>
            escola.nome.toLowerCase().includes(busca.toLowerCase()) ||
            escola.numeroEscola.toString().includes(busca)
        );
        return escolasFiltradas;
    }, [projeto?.escolas, busca]);   

    // Se a chave não é válida
    if (id === undefined) {
        return (
            <PageWithDrawer sectionName="Erro" currentPage="escolas">
                <div className="flex items-center justify-center min-h-[100dvh] px-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-red-400 text-2xl">⚠️</span>
                        </div>
                        <h2 className="text-xl font-bold text-red-400 mb-2">ID Inválido</h2>
                        <p className="text-red-300">ID do projeto não está disponível.</p>
                    </div>
                </div>
            </PageWithDrawer>
        );
    }

    // Aguarda dados carregarem antes de renderizar
    if (!projeto) {
        return (
            <PageWithDrawer sectionName="Loading" currentPage="escolas">
                <div className="flex items-center justify-center min-h-[100dvh] px-4">
                    <div className="relative z-10 max-w-md w-full">
                        <div className="text-center">
                            {/* Loading Icon */}
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-white border-t-transparent rounded-full animate-rotate"></div>
                            </div>

                            {/* Loading Text */}
                            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">
                                Carregando...
                            </h2>
                            <p className="text-slate-400 text-sm sm:text-base">
                                Aguarde enquanto carregamos os dados
                            </p>

                            {/* Progress Bar */}
                            <div className="mt-6 w-64 mx-auto bg-slate-800 rounded-full h-2 overflow-hidden relative">
                                <div className="absolute top-0 h-full w-1/3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full animate-loadingBar"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </PageWithDrawer>
        );
    }

    // Error state
    if (error) {
        return (
            <PageWithDrawer sectionName="Erro" currentPage="escolas">
                <div className="flex items-center justify-center min-h-[100dvh] px-4">
                    <div className="relative z-10 max-w-md w-full">
                        <div className="bg-red-900/20 border border-red-800 rounded-2xl p-6 sm:p-8 text-center">
                            <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-red-400 text-2xl">⚠️</span>
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

    // No project found
    if (!projeto || !projeto.escolas) {
        return (
            <PageWithDrawer sectionName="Projeto não encontrado" currentPage="escolas">
                <div className="flex items-center justify-center min-h-[100dvh] px-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-orange-400 text-2xl">📋</span>
                        </div>
                        <h2 className="text-xl font-bold text-orange-400 mb-2">Projeto não encontrado</h2>
                        <p className="text-orange-400">Nenhum projeto encontrado com este ID.</p>
                    </div>
                </div>
            </PageWithDrawer>
        );
    }

    return (
        <PageWithDrawer
            projectName={projeto.nome}
            sectionName="Escolas"
            currentPage="escolas"
        >
            {/* Header Fixo para Desktop, Compacto para Mobile */}
            <div className="lg:fixed lg:top-0 lg:left-0 lg:right-0 lg:z-20 lg:bg-slate-900/95 lg:backdrop-blur-sm lg:border-b lg:border-slate-700">
                <div className="px-4 pt-16 pb-4 lg:pt-6 lg:pb-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">

                        {/* Header Compacto e Alinhado */}
                        <div className="flex items-center justify-between mb-4 lg:mb-6">
                            {/* Título e Ícone - Alinhado com Menu Hamburguer */}
                            <div className="flex items-center space-x-3 lg:space-x-4">
                                <div className="w-9 h-9 lg:w-12 lg:h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg lg:rounded-2xl flex items-center justify-center shadow-lg">
                                    <Home size={16} className="lg:w-6 lg:h-6 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-lg lg:text-2xl xl:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 truncate">
                                        {projeto.nome}
                                    </h1>
                                    <p className="text-slate-400 text-xs lg:text-sm hidden lg:block">Unidades Escolares</p>
                                </div>
                            </div>

                            {/* Contador de Escolas - Apenas no Desktop */}
                            <div className="hidden lg:flex items-center space-x-3">
                                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl px-4 py-2">
                                    <div className="flex items-center space-x-2">
                                        <Home size={16} className="text-blue-400" />
                                        <span className="text-slate-300 text-sm font-medium">
                                            {escolasOrdenadas.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Barra de Pesquisa e Controles - Layout Flat */}
                        <div className="bg-slate-800/30 lg:bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl lg:rounded-2xl p-3 lg:p-2 shadow-lg">
                            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 items-center">

                                {/* Barra de Pesquisa */}
                                <div className="flex-1 relative w-full">
                                    <Search
                                        size={18}
                                        className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
                                        strokeWidth={1.5}
                                    />
                                    <input
                                        id="buscaEscola"
                                        data-hotkeys="off"
                                        type="text"
                                        placeholder="Buscar escola..."
                                        className="w-full h-12 lg:h-14 pl-10 lg:pl-12 pr-4 bg-slate-700/50 border border-slate-600 rounded-lg lg:rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-sm lg:text-base"
                                        value={busca}
                                        onChange={(e) => setBusca(e.target.value.toLowerCase())}
                                    />
                                </div>

                                {/* Toggle de Visualização - Menor no Mobile */}
                                <div className="flex bg-slate-700/50 rounded-lg lg:rounded-xl p-1 border border-slate-600">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`flex items-center justify-center w-10 h-8 lg:w-14 lg:h-12 rounded-md lg:rounded-lg transition-all duration-300 ${viewMode === 'grid'
                                            ? 'bg-emerald-600 text-white shadow-lg'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-600'
                                            }`}
                                    >
                                        <Grid size={16} className="lg:w-5 lg:h-5" strokeWidth={1.5} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('grid1')}
                                        className={`flex items-center justify-center w-10 h-8 lg:w-14 lg:h-12 rounded-md lg:rounded-lg transition-all duration-300 ${viewMode === 'grid1'
                                            ? 'bg-emerald-600 text-white shadow-lg'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-600'
                                            }`}
                                    >
                                        <Grid size={16} className="lg:w-5 lg:h-5" strokeWidth={1.5} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('grid2')}
                                        className={`flex items-center justify-center w-10 h-8 lg:w-14 lg:h-12 rounded-md lg:rounded-lg transition-all duration-300 ${viewMode === 'grid2'
                                            ? 'bg-emerald-600 text-white shadow-lg'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-600'
                                            }`}
                                    >
                                        <Grid size={16} className="lg:w-5 lg:h-5" strokeWidth={1.5} />
                                    </button>
                                    {!isMobile && (
                                        <>
                                            <button
                                                onClick={() => setViewMode('grid3')}
                                                className={`flex items-center justify-center w-10 h-8 lg:w-14 lg:h-12 rounded-md lg:rounded-lg transition-all duration-300 ${viewMode === 'grid3'
                                                    ? 'bg-emerald-600 text-white shadow-lg'
                                                    : 'text-slate-400 hover:text-white hover:bg-slate-600'
                                                    }`}
                                            >
                                                <Grid size={16} className="lg:w-5 lg:h-5" strokeWidth={1.5} />
                                            </button>
                                            <button
                                                onClick={() => setViewMode('list')}
                                                className={`flex items-center justify-center w-10 h-8 lg:w-14 lg:h-12 rounded-md lg:rounded-lg transition-all duration-300 ${viewMode === 'list'
                                                    ? 'bg-emerald-600 text-white shadow-lg'
                                                    : 'text-slate-400 hover:text-white hover:bg-slate-600'
                                                    }`}
                                            >
                                                <List size={16} className="lg:w-5 lg:h-5" strokeWidth={1.5} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo Principal - Com Espaçamento Ajustado */}
            <div className="px-4 pt-4 lg:pt-[13.5rem] pb-8 sm:px-6 lg:px-8">
                <div className="max-w-[98rem] mx-auto">

                    {/* Contador de Resultados - Apenas no Mobile */}
                    <div className="lg:hidden flex items-center justify-center mb-7">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-full px-4 py-2">
                            <span className="text-slate-300 text-sm font-medium">
                                {escolasOrdenadas.length} escola{escolasOrdenadas.length !== 1 ? 's' : ''} encontrada{escolasOrdenadas.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>

                    {/* Lista/Grid de Escolas */}
                    {escolasOrdenadas.length > 0 ? (
                        <div className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-[repeat(16,minmax(0,1fr))] xl:grid-cols-[repeat(16,minmax(0,1fr))] gap-4 lg:gap-4 will-change-contents'
                                : viewMode === 'grid1'
                                    ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4 lg:gap-4 will-change-contents'
                                    : viewMode === 'grid2'
                                        ? 'grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-4 will-change-contents'
                                        : viewMode === 'grid3'
                                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 lg:gap-4 will-change-contents'
                                            : 'grid grid-cols-1 gap-4 lg:gap-4 will-change-contents'
                        }

                            style={{ contain: 'layout style' }}>
                            <AnimatePresence>
                                {escolasOrdenadas.map((escola, index) => (
                                    <motion.div
                                        key={escola.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{
                                            duration: 0.10,
                                            delay: Math.min(index * 0.004, 0.12),
                                            ease: "linear",
                                        }}
                                        style={{ willChange: "opacity" }}
                                    >
                                        <EscolaComponent escola={escola} viewMode={viewMode} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="text-center py-12 lg:py-16">
                            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 border border-slate-700">
                                <Search size={32} className="lg:w-10 lg:h-10 text-slate-500" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl lg:text-2xl font-semibold text-slate-300 mb-3 lg:mb-4">
                                Nenhuma escola encontrada
                            </h3>
                            <p className="text-slate-500 text-sm lg:text-base max-w-md mx-auto mb-4 lg:mb-6">
                                Tente ajustar sua busca ou verifique se digitou corretamente.
                            </p>
                            <button
                                onClick={() => setBusca('')}
                                className="h-10 lg:h-12 px-6 lg:px-8 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-300 font-medium rounded-lg lg:rounded-xl transition-all duration-300 transform hover:scale-105"
                            >
                                Limpar Busca
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </PageWithDrawer>
    );
}
