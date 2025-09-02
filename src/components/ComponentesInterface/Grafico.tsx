'use client'

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getGrafico } from '@/hooks_api/api';
import { Grafo } from '../../../core';

// Registrando as escalas e elementos do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

export default function Grafico() {
    const [labels, setLabels] = useState<string[]>([]);
    const [quantidadeTotal, setQuantidadeTotal] = useState<number[]>([]);
    const [quantidadeExpedida, setQuantidadeExpedida] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [isHorizontal, setIsHorizontal] = useState(true);

    // UseEffect para buscar os dados da API assim que o componente for montado
    useEffect(() => {
        const fetchData = async () => {
            try {
                const projetos = await getGrafico();

                // Preparar os dados da resposta da API
                const labelsData = projetos.map((projeto: Grafo) => projeto.nomeProjeto);
                const quantidadeTotalData = projetos.map((projeto: Grafo) => projeto.quantidadeTotal);
                const quantidadeExpedidaData = projetos.map((projeto: Grafo) => projeto.quantidadeExpedida);

                // Atualizando o estado com os dados recebidos
                setLabels(labelsData);
                setQuantidadeTotal(quantidadeTotalData);
                setQuantidadeExpedida(quantidadeExpedidaData);

                setLoading(false);
            } catch (error) {
                console.error('Erro ao buscar os dados dos projetos:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Verificar se os dados estão carregando
    if (loading) {
        return (
            <div className="flex w-full h-full items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
                    <p className="text-white text-lg">Carregando dados...</p>
                </div>
            </div>
        );
    }

    // Função para truncar labels no mobile
    const truncateLabel = (label: string, maxLength: number = 10) => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            return label.length > maxLength ? label.substring(0, maxLength) + '...' : label;
        }
        return label;
    };

    // Labels processados para mobile
    const processedLabels = labels.map(label => truncateLabel(label));

    // Calcular dimensões baseadas no número de labels
    const minWidth = isHorizontal ? '100%' : `${Math.max(labels.length * 120, 800)}px`;
    const minHeight = isHorizontal ? `${Math.max(labels.length * 60, 400)}px` : '400px';

    // Função para calcular espessura das barras baseada no dispositivo
    const getBarThickness = () => {
        if (isHorizontal) return 20;
        if (typeof window !== 'undefined' && window.innerWidth < 768) return 20; // Mais fino no mobile
        return 35; // Mais fino no desktop também
    };

    const getMaxBarThickness = () => {
        if (isHorizontal) return 30;
        if (typeof window !== 'undefined' && window.innerWidth < 768) return 25; // Máximo menor no mobile
        return 40; // Máximo menor no desktop também
    };

    // Dados do gráfico
    const data = {
        labels: processedLabels,
        datasets: [
            {
                label: 'Quantidade Total',
                data: quantidadeTotal,
                backgroundColor: 'rgba(6, 182, 212, 0.8)', // cyan-500
                borderColor: 'rgba(6, 182, 212, 1)',
                borderWidth: 2,
                borderRadius: 8,
                barThickness: getBarThickness(),
                maxBarThickness: getMaxBarThickness(),
            },
            {
                label: 'Quantidade Expedida',
                data: quantidadeExpedida,
                backgroundColor: 'rgba(168, 85, 247, 0.8)', // purple-500
                borderColor: 'rgba(168, 85, 247, 1)',
                borderWidth: 2,
                borderRadius: 8,
                barThickness: getBarThickness(),
                maxBarThickness: getMaxBarThickness(),
            },
        ],
    };

    // Opções do gráfico
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: isHorizontal ? 'y' as const : 'x' as const,
        plugins: {
            legend: {
                display: false, // Remove a legenda duplicada
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                titleColor: '#f8fafc',
                bodyColor: '#f8fafc',
                titleFont: {
                    size: 16,
                    weight: 'bold' as const,
                },
                bodyFont: {
                    size: 14,
                    weight: 'normal' as const,
                },
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                    title: function(context: any) {
                        // Mostra o nome completo no tooltip
                        const index = context[0].dataIndex;
                        return labels[index] || '';
                    },
                    label: function(context: any) {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y || context.parsed.x;
                        return `${label}: ${value.toLocaleString('pt-BR')}`;
                    }
                }
            },
            // Plugin para mostrar valores nas barras
            datalabels: {
                display: true,
                color: '#f8fafc',
                font: {
                    size: 12,
                    weight: 'bold' as const,
                },
                anchor: isHorizontal ? 'end' as const : 'end' as const,
                align: isHorizontal ? 'right' as const : 'top' as const,
                offset: isHorizontal ? 2 : 4, // Reduzido offset no horizontal
                formatter: function(value: number) {
                    return value.toLocaleString('pt-BR');
                }
            }
        },
        scales: {
            x: {
                stacked: false,
                ticks: {
                    color: '#f8fafc',
                    font: {
                        size: 12,
                        weight: 'normal' as const,
                    },
                    padding: 8,
                    maxRotation: isHorizontal ? 0 : 45, // Rotaciona labels no vertical
                    minRotation: isHorizontal ? 0 : 45,
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                    drawBorder: false,
                },
            },
            y: {
                beginAtZero: true,
                stacked: false,
                ticks: {
                    color: '#f8fafc',
                    font: {
                        size: 12,
                        weight: 'normal' as const,
                    },
                    padding: 8,
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                    drawBorder: false,
                },
            },
        },
        interaction: {
            intersect: false,
            mode: 'index' as const,
        },
        layout: {
            padding: {
                right: isHorizontal ? 2 : 20, // Reduzido ao mínimo no horizontal
                left: isHorizontal ? 2 : 20, // Reduzido ao mínimo no horizontal
                top: isHorizontal ? 5 : 60, // Reduzido no topo para horizontal
                bottom: isHorizontal ? 5 : 60, // Reduzido na base para horizontal
            }
        }
    };

    return (
        <div className="w-full h-full p-0">
            {/* Controles do gráfico */}
            <div className="flex justify-center mb-4">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-2 border border-slate-700">
                    <button
                        onClick={() => setIsHorizontal(true)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                            isHorizontal 
                                ? 'bg-cyan-500 text-white shadow-lg' 
                                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                        }`}
                    >
                        Horizontal
                    </button>
                    <button
                        onClick={() => setIsHorizontal(false)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                            !isHorizontal 
                                ? 'bg-purple-500 text-white shadow-lg' 
                                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                        }`}
                    >
                        Vertical
                    </button>
                </div>
            </div>

            {/* Container do gráfico com scroll dinâmico */}
            <div className="w-full h-full">
                {isHorizontal ? (
                    // Gráfico horizontal - scroll vertical quando necessário
                    <div className="w-full h-full overflow-y-auto overflow-x-hidden pb-16">
                        <div className="w-full" style={{ minHeight: minHeight }}>
                            <Bar 
                                data={data}
                                options={options}
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                ) : (
                    // Gráfico vertical - scroll horizontal quando necessário
                    <div className="w-full h-full overflow-x-auto overflow-y-hidden">
                        <div className="min-w-full" style={{ minWidth: minWidth }}>
                            <Bar 
                                data={data}
                                options={options}
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
