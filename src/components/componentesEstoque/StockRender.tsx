import React from 'react';
import { ProjetoStockItems } from '../../../core';
import { getProjectsItemsSaldos } from '@/hooks_api/api';
import { convertMilharFormat } from '../../../core/utils/tools';
import { CheckCircle, AlertCircle, TrendingUp, TrendingDown, Package } from 'react-feather';
import { motion } from 'framer-motion';

interface StockRenderProps {
  id: string;
}

export default async function StockRender({ id }: StockRenderProps) {
  const stockRender: ProjetoStockItems | null = await getProjectsItemsSaldos(id);

  if (!stockRender) {
    return null;
  }

  // Calcula os somatórios gerais
  const totalGeralEstoque = stockRender.itens.reduce(
    (sum, item) => sum + item.tamanhos.filter(t => !t.iskit).reduce((subSum, tamanho) => subSum + tamanho.estoque, 0),
    0
  );
  const totalGeralEntradasKit = stockRender.itens.reduce(
    (sum, item) => sum + item.tamanhos.filter(t => !t.iskit).reduce((subSum, tamanho) => subSum + tamanho.entradasKit, 0),
    0
  );
  const totalGeralEntradasAv = stockRender.itens.reduce(
    (sum, item) => sum + item.tamanhos.filter(t => !t.iskit).reduce((subSum, tamanho) => subSum + tamanho.entradasAv, 0),
    0
  );
  const totalGeralSaidasKit = stockRender.itens.reduce(
    (sum, item) => sum + item.tamanhos.filter(t => !t.iskit).reduce((subSum, tamanho) => subSum + tamanho.saidasKit, 0),
    0
  );
  const totalGeralSaidasAv = stockRender.itens.reduce(
    (sum, item) => sum + item.tamanhos.filter(t => !t.iskit).reduce((subSum, tamanho) => subSum + tamanho.saidasAv, 0),
    0
  );

  const contraprova = ((totalGeralEntradasKit + totalGeralEntradasAv) - (totalGeralSaidasKit + totalGeralSaidasAv)) === totalGeralEstoque;

  return (
    <div className="space-y-6 lg:space-y-8">      
      {/* Resumo Geral */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden"
      >
        {/* Header do Resumo */}
        <div className="bg-slate-700/30 px-4 lg:px-6 py-3 lg:py-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
              <h2 className="text-base lg:text-lg font-semibold text-white">
                Resumo Geral - {stockRender.nome}
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              {contraprova ? (
                <CheckCircle size={16} className="text-emerald-400" />
              ) : (
                <AlertCircle size={16} className="text-red-400" />
              )}
              <span className={`text-xs lg:text-sm font-medium ${
                contraprova ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {contraprova ? 'Consistente' : 'Inconsistente'}
              </span>
            </div>
          </div>
        </div>

        {/* Tabela de Resumo */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] lg:min-w-0">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-700/20">
                <th className="text-left p-3 lg:p-4 text-slate-400 text-xs lg:text-sm font-medium">Entradas</th>
                <th className="text-left p-3 lg:p-4 text-slate-400 text-xs lg:text-sm font-medium">Saídas</th>
                <th className="text-left p-3 lg:p-4 text-slate-400 text-xs lg:text-sm font-medium">Estoque</th>
                <th className="text-left p-3 lg:p-4 text-slate-400 text-xs lg:text-sm font-medium">Consistência</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-700/50">
                <td className="p-3 lg:p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp size={14} className="text-blue-400" />
                    <span className="text-blue-400 text-sm lg:text-base font-semibold">
                      {convertMilharFormat(totalGeralEntradasAv + totalGeralEntradasKit)}
                    </span>
                  </div>
                </td>
                <td className="p-3 lg:p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingDown size={14} className="text-yellow-400" />
                    <span className="text-yellow-400 text-sm lg:text-base font-semibold">
                      {convertMilharFormat(totalGeralSaidasAv + totalGeralSaidasKit)}
                    </span>
                  </div>
                </td>
                <td className="p-3 lg:p-4">
                  <div className="flex items-center space-x-2">
                    <Package size={14} className="text-emerald-400" />
                    <span className="text-emerald-400 text-sm lg:text-base font-semibold">
                      {convertMilharFormat(totalGeralEstoque)}
                    </span>
                  </div>
                </td>
                <td className="p-3 lg:p-4">
                  <div className="flex items-center space-x-2">
                    {contraprova ? (
                      <CheckCircle size={14} className="text-emerald-400" />
                    ) : (
                      <AlertCircle size={14} className="text-red-400" />
                    )}
                    <span className={`text-xs lg:text-sm font-medium ${
                      contraprova ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {contraprova ? 'OK' : 'NOT OK'}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

                 {/* Detalhamento */}
         <div className="p-4 lg:p-6 bg-slate-700/10">
           <div className="space-y-4">
             {/* Título da Seção */}
             <div className="text-center">
               <h3 className="text-slate-300 text-sm lg:text-base font-semibold mb-2">
                 Detalhamento das Movimentações
               </h3>
               <div className="w-16 h-0.5 bg-gradient-to-r from-emerald-400 to-blue-500 mx-auto rounded-full"></div>
             </div>
             
             {/* Grid de Totais */}
             <div className="grid grid-cols-2 lg:grid-cols-7 gap-3 lg:gap-4">
               <div className="bg-slate-700/30 rounded-lg p-3 text-center border border-slate-600">
                 <span className="text-slate-400 text-xs block mb-1">Estoque</span>
                 <div className="text-emerald-400 font-bold text-sm lg:text-base">{convertMilharFormat(totalGeralEstoque)}</div>
               </div>
               <div className="bg-slate-700/30 rounded-lg p-3 text-center border border-slate-600">
                 <span className="text-slate-400 text-xs block mb-1">Entradas Kits</span>
                 <div className="text-blue-400 font-bold text-sm lg:text-base">{convertMilharFormat(totalGeralEntradasKit)}</div>
               </div>
               <div className="bg-slate-700/30 rounded-lg p-3 text-center border border-slate-600">
                 <span className="text-slate-400 text-xs block mb-1">Entradas Avulsas</span>
                 <div className="text-blue-400 font-bold text-sm lg:text-base">{convertMilharFormat(totalGeralEntradasAv)}</div>
               </div>
               <div className="bg-slate-700/30 rounded-lg p-3 text-center border border-slate-600">
                 <span className="text-slate-400 text-xs block mb-1">Saídas Kits</span>
                 <div className="text-yellow-400 font-bold text-sm lg:text-base">{convertMilharFormat(totalGeralSaidasKit)}</div>
               </div>
               <div className="bg-slate-700/30 rounded-lg p-3 text-center border border-slate-600">
                 <span className="text-slate-400 text-xs block mb-1">Saídas Avulsas</span>
                 <div className="text-yellow-400 font-bold text-sm lg:text-base">{convertMilharFormat(totalGeralSaidasAv)}</div>
               </div>
               <div className="bg-blue-500/10 rounded-lg p-3 text-center border border-blue-500/30">
                 <span className="text-blue-400 text-xs block mb-1 font-medium">Total Entradas</span>
                 <div className="text-blue-400 font-bold text-sm lg:text-base">{convertMilharFormat(totalGeralEntradasAv + totalGeralEntradasKit)}</div>
               </div>
               <div className="bg-yellow-500/10 rounded-lg p-3 text-center border border-yellow-500/30">
                 <span className="text-yellow-400 text-xs block mb-1 font-medium">Total Saídas</span>
                 <div className="text-yellow-400 font-bold text-sm lg:text-base">{convertMilharFormat(totalGeralSaidasAv + totalGeralSaidasKit)}</div>
               </div>
             </div>
             
             {/* Resumo de Consistência */}
             <div className="mt-4 p-3 lg:p-4 bg-slate-700/20 rounded-lg border border-slate-600">
               <div className="flex items-center justify-center space-x-4">
                 <div className="flex items-center space-x-2">
                   <span className="text-slate-400 text-xs lg:text-sm">Consistência:</span>
                   <span className={`text-xs lg:text-sm font-bold ${
                     contraprova ? 'text-emerald-400' : 'text-red-400'
                   }`}>
                     {contraprova ? '✓ OK' : '✗ NOT OK'}
                   </span>
                 </div>
                 <div className="w-px h-4 bg-slate-600"></div>
                 <div className="flex items-center space-x-2">
                   <span className="text-slate-400 text-xs lg:text-sm">Saldo:</span>
                   <span className={`text-xs lg:text-sm font-bold ${
                     totalGeralEstoque > 0 ? 'text-emerald-400' : totalGeralEstoque < 0 ? 'text-red-400' : 'text-slate-400'
                   }`}>
                     {convertMilharFormat(totalGeralEstoque)} unidades
                   </span>
                 </div>
               </div>
             </div>
           </div>
         </div>
      </motion.div>

      {/* Renderização de tabelas individuais */}
      {stockRender.itens.map((item, index) => {
        const totalEstoque = item.tamanhos.reduce((sum, tamanho) => sum + tamanho.estoque, 0);
        const totalEntradasKit = item.tamanhos.reduce((sum, tamanho) => sum + tamanho.entradasKit, 0);
        const totalEntradasAv = item.tamanhos.reduce((sum, tamanho) => sum + tamanho.entradasAv, 0);
        const totalSaidasKit = item.tamanhos.reduce((sum, tamanho) => sum + tamanho.saidasKit, 0);
        const totalSaidasAv = item.tamanhos.reduce((sum, tamanho) => sum + tamanho.saidasAv, 0);

        return (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden"
          >
            {/* Header do Item */}
            <div className="bg-slate-700/30 px-4 lg:px-6 py-3 lg:py-4 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <h2 className="text-base lg:text-lg font-semibold text-orange-400">
                    {item.nome} ({item.genero})
                  </h2>
                </div>
                <div className="text-slate-400 text-xs lg:text-sm">
                  {item.tamanhos.length} tamanho{item.tamanhos.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Tabela de Tamanhos */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] lg:min-w-0">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-700/20">
                    <th className="text-left p-3 lg:p-4 text-slate-400 text-xs lg:text-sm font-medium">Tamanho</th>
                    <th className="text-left p-3 lg:p-4 text-slate-400 text-xs lg:text-sm font-medium">Estoque</th>
                    <th className="text-left p-3 lg:p-4 text-slate-400 text-xs lg:text-sm font-medium">Entradas Kits</th>
                    <th className="text-left p-3 lg:p-4 text-slate-400 text-xs lg:text-sm font-medium">Entradas Avulsas</th>
                    <th className="text-left p-3 lg:p-4 text-slate-400 text-xs lg:text-sm font-medium">Saídas Kits</th>
                    <th className="text-left p-3 lg:p-4 text-slate-400 text-xs lg:text-sm font-medium">Saídas Avulsas</th>
                  </tr>
                </thead>
                <tbody>
                  {item.tamanhos.map((tamanho, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors duration-200 ${
                        tamanho.estoque < 0
                          ? 'text-red-400'
                          : tamanho.estoque === 0
                            ? 'text-slate-400'
                            : 'text-emerald-400'
                      }`}
                    >
                      <td className="p-3 lg:p-4 text-slate-300 font-medium">{tamanho.tamanho}</td>
                      <td className="p-3 lg:p-4 font-semibold">{tamanho.estoque}</td>
                      <td className="p-3 lg:p-4 text-blue-400 font-semibold">{tamanho.entradasKit}</td>
                      <td className="p-3 lg:p-4 text-blue-400 font-semibold">{tamanho.entradasAv}</td>
                      <td className="p-3 lg:p-4 text-yellow-400 font-semibold">{tamanho.saidasKit}</td>
                      <td className="p-3 lg:p-4 text-yellow-400 font-semibold">{tamanho.saidasAv}</td>
                    </tr>
                  ))}
                  {/* Total do Item */}
                  <tr className="bg-slate-700/30 border-t-2 border-slate-600">
                    <td className="p-3 lg:p-4 text-slate-300 font-bold">Total</td>
                    <td className="p-3 lg:p-4 text-emerald-400 font-bold">{totalEstoque}</td>
                    <td className="p-3 lg:p-4 text-blue-400 font-bold">{totalEntradasKit}</td>
                    <td className="p-3 lg:p-4 text-blue-400 font-bold">{totalEntradasAv}</td>
                    <td className="p-3 lg:p-4 text-yellow-400 font-bold">{totalSaidasKit}</td>
                    <td className="p-3 lg:p-4 text-yellow-400 font-bold">{totalSaidasAv}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
