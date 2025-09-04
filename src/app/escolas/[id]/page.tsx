"use client";

import EscolaComponent from '@/components/ComponentesEscola/EscolaComponent';
import IsLoading from '@/components/ComponentesInterface/IsLoading';
import PageWithDrawer from '@/components/ComponentesInterface/PageWithDrawer';
import { getProjetosComEscolas } from '@/hooks_api/api';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Search, Grid, List, Home } from 'react-feather';
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
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Usando SWR para buscar os dados do projeto e escolas
    const { data: projeto, error, isValidating } = useSWR<Projeto>(
        id !== undefined ? id : null,
        fetcher, {
        refreshInterval: 2 * 60 * 60 * 1000, // Atualiza a cada 2 horas
        revalidateOnFocus: false,
        onError: (err) => {
            console.error('SWR Error:', err);
        }
    });

    useEffect(() => {
        if (projeto && projeto.nome) {
            document.title = `${projeto.nome} - ESCOLAS`;
        }
    }, [projeto]);

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

    // Loading state
    if (isValidating) {
        return <IsLoading />
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

    // Filter schools
    const escolasFiltradas = projeto.escolas.filter((escola) =>
        escola.nome.toLowerCase().includes(busca) || escola.numeroEscola.toString().includes(busca)
    );

    const escolasOrdenadas = escolasFiltradas;

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
                        <div className="bg-slate-800/30 lg:bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl lg:rounded-2xl p-3 lg:p-3 shadow-lg">
                            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 items-center">

                                {/* Barra de Pesquisa */}
                                <div className="flex-1 relative w-full">
                                    <Search
                                        size={18}
                                        className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
                                        strokeWidth={1.5}
                                    />
                                    <input
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
                                        onClick={() => setViewMode('list')}
                                        className={`flex items-center justify-center w-10 h-8 lg:w-14 lg:h-12 rounded-md lg:rounded-lg transition-all duration-300 ${viewMode === 'list'
                                                ? 'bg-emerald-600 text-white shadow-lg'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-600'
                                            }`}
                                    >
                                        <List size={16} className="lg:w-5 lg:h-5" strokeWidth={1.5} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo Principal - Com Espaçamento Ajustado */}
            <div className="px-4 pt-4 lg:pt-[15rem] pb-8 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

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
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-6"
                                : "grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 lg:gap-6"
                        }>
                            {escolasOrdenadas.map((escola, index) => (
                                <motion.div
                                    key={escola.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.2,
                                        delay: index * 0.02,
                                        ease: "easeOut"
                                    }}
                                    className="animate-fade-in"
                                >
                                    <EscolaComponent escola={escola} />
                                </motion.div>
                            ))}
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
