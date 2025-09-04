'use client';

import StockRender from "@/components/componentesEstoque/StockRender";
import PageWithDrawer from '@/components/ComponentesInterface/PageWithDrawer';
import { CreateServerSelectComponentProjects } from "@/components/componentesRomaneios/createServerSelectComponentProjects";
import { useEffect, useState } from "react";
import { Database, Package } from 'react-feather';
import { motion } from 'framer-motion';

export default function Estoques() {
  const [serverSelect, setServerSelect] = useState<JSX.Element | null>(null);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [stockRender, setStockRender] = useState<JSX.Element | null>(null);

  const handleSelectChange = (selectedProjectId: number) => {
    setProjectId(selectedProjectId);
  };

  useEffect(() => {
    // Monta o componente do seletor de projetos
    async function fetchServerSelect() {
      const selectComponent = await CreateServerSelectComponentProjects({
        onSelectChange: handleSelectChange,
      });
      setServerSelect(selectComponent);
    }
    fetchServerSelect();
  }, []);

  useEffect(() => {
    if (!projectId) {
      return
    }
    // Monta o componente de saldos
    async function fetchServerStock() {
      const stockRender = await StockRender({ id: String(projectId) });
      setStockRender(stockRender);
    }
    fetchServerStock();
  }, [projectId]);

  return (
    <PageWithDrawer 
      sectionName="Movimentações do Estoque" 
      currentPage="estoques"
    >
      {/* Header Fixo */}
      <div className="lg:fixed lg:top-0 lg:left-0 lg:right-0 lg:z-20 lg:bg-slate-900/95 lg:backdrop-blur-sm lg:border-b lg:border-slate-700">
        <div className="px-4 pt-16 pb-4 lg:pt-6 lg:pb-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Header Principal */}
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              {/* Título e Ícone */}
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="w-9 h-9 lg:w-12 lg:h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg lg:rounded-2xl flex items-center justify-center shadow-lg">
                  <Database size={16} className="lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-base lg:text-2xl xl:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 truncate">
                    Movimentações do Estoque
                  </h1>
                  <p className="text-slate-400 text-xs lg:text-sm hidden lg:block">
                    Controle e análise de movimentações
                  </p>
                </div>
              </div>
              
              {/* Estatísticas Rápidas - Desktop */}
              <div className="hidden lg:flex items-center space-x-3">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Package size={16} className="text-emerald-400" />
                    <span className="text-slate-300 text-sm font-medium">
                      Análise de Estoque
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Controles de Seleção */}
            <div className="bg-slate-800/30 lg:bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-lg">
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 items-center">
                
                {/* Seleção de Projeto */}
                <div className="flex-1 w-full">
                  {serverSelect || (
                    <div className="flex flex-col justify-center lg:items-start items-center w-full">
                      <p className="flex lg:w-[310px] w-full bg-slate-700/50 py-2 px-3 text-sm text-slate-400 border border-slate-600 rounded-lg cursor-pointer h-10 lg:h-12">
                        SELECIONE O PROJETO
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="px-4 pt-3 lg:pt-[15rem] pb-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Contador de Resultados - Mobile */}
          <div className="lg:hidden flex items-center justify-center mb-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-full px-4 py-2">
              <span className="text-slate-300 text-xs font-medium">
                {projectId ? 'Estoque carregado' : 'Selecione um projeto'}
              </span>
            </div>
          </div>

          {/* Renderização do Estoque */}
          <div className="w-full lg:pt-2 pt-1">
            {stockRender}
          </div>

          {/* Estado Vazio */}
          {!projectId && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12 lg:py-16"
            >
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 border border-slate-700">
                <Database size={32} className="lg:w-10 lg:h-10 text-emerald-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold text-emerald-400 mb-3 lg:mb-4">
                Configure o Seletor
              </h3>
              <div className="space-y-2 text-slate-400 text-sm lg:text-base">
                <p>1. Selecione um projeto</p>
                <p>2. Visualize as movimentações</p>
                <p>3. Analise a consistência dos dados</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageWithDrawer>
  );
}
