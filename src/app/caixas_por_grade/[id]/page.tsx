'use client';

import IsLoading from '@/components/ComponentesInterface/IsLoading';
import ListaCaixas from '@/components/ComponentesInterface/ListaCaixas';
import PageWithDrawer from '@/components/ComponentesInterface/PageWithDrawer';
import { getCaixasPorGrade } from '@/hooks_api/api';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Package } from 'react-feather';
import { Caixa } from '../../../../core';

const fachBox = async (id: string): Promise<Caixa[]> => {
    return await getCaixasPorGrade(id);
};

export default function PaginaCaixasPorGrade() {
    const params = useParams();
    const id = params.id as string;
    const [caixas, setCaixas] = useState<Caixa[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [hasMounted, setHasMounted] = useState(false);
    const [totalGradeC, setTotalGradeC] = useState<number>(0);
    const [totalGradeI, setTotalGradeI] = useState<number>(0);

    useEffect(() => {
        setHasMounted(true);
        const fetchData = async () => {
            try {
                const box = await fachBox(id);
                setCaixas(box);
                if (box.length > 0 && box[0].escolaCaixa) {
                    document.title = `${box[0].escolaCaixa} - CAIXAS POR GRADE ${id}`;
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (!hasMounted) return null;



    const setTotal = (num: number, num1: number) => {
        setTotalGradeC(num);
        setTotalGradeI(num1);
    }

    return (
        <PageWithDrawer
            projectName="Caixas por Grade"
            sectionName={`Grade ${id}`}
            currentPage="caixas_por_grade"
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
                                    <p className="text-slate-400 text-xs lg:text-sm truncate">Grade ID: {id}</p>
                                </div>
                            </div>
                        </div>

                        {/* Informações da Escola */}
                        {caixas.length > 0 && caixas[0].escolaCaixa && (
                            <div className="bg-slate-800/30 lg:bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl lg:rounded-2xl p-2 lg:p-4 shadow-lg">
                                <div className="flex items-start justify-between gap-2 lg:gap-3">
                                    <div className="flex items-start space-x-2 lg:space-x-3 min-w-0 flex-1">
                                        <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Package size={12} className="lg:w-4 lg:h-4 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h2 className="text-sm lg:text-lg font-bold text-slate-200 truncate">{caixas[0].escolaCaixa}</h2>
                                            <p className="text-xs lg:text-sm text-slate-400 truncate">Escola #{caixas[0].escolaNumber} • {caixas[0].projeto}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <div className="text-lg lg:text-2xl font-bold text-emerald-400">{caixas.length}</div>
                                        <div className="text-[10px] lg:text-xs text-slate-400">CAIXAS</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="px-4 pt-4 lg:pt-[8.4rem] pb-1 lg:pb-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col w-full justify-start items-start gap-y-4 pb-4">
                        <div className="flex justify-start items-start w-full min-h-[calc(100vh-11rem)]">
                            {loading ? (
                                <div className="w-full flex justify-center items-center">
                                    <IsLoading />
                                </div>
                            ) : caixas.length === 0 ? (
                                <div className="w-full flex justify-center items-center">
                                    <div className="text-center py-12 lg:py-16">
                                        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 border border-slate-700">
                                            <Package size={32} className="lg:w-10 lg:h-10 text-slate-500" strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-xl lg:text-2xl font-semibold text-slate-300 mb-3 lg:mb-4">
                                            Nenhuma caixa encontrada
                                        </h3>
                                        <p className="text-slate-500 text-sm lg:text-base max-w-md mx-auto mb-4 lg:mb-6">
                                            Para a grade de ID: <span className="font-mono text-emerald-400">{id}</span>
                                        </p>
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
        </PageWithDrawer>
    );
}
