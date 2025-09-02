'use client'

import Link from 'next/link';
import { GradesRomaneio } from '../../../core';
import { converPercentualFormat, convertMilharFormat, convertMilharFormatKG } from '../../../core/utils/tools';
import { CheckCircle, ExternalLink, ChevronDown, ChevronUp } from 'react-feather';
import { useState } from 'react';

interface GradeFilterTableProps {
  expedicaoData: GradesRomaneio[];
  staticColors: boolean; // true = tema claro, false = tema escuro
  status: string;
  selectedGrades: number[];
  handleSelect: (id: number) => void;
}

export default function GradesFilterTable({ expedicaoData, staticColors, status, selectedGrades, handleSelect }: GradeFilterTableProps) {
  const [expandedGrades, setExpandedGrades] = useState<Set<number>>(new Set());

  const toggleGradeExpansion = (gradeId: number) => {
    const newExpanded = new Set(expandedGrades);
    if (newExpanded.has(gradeId)) {
      newExpanded.delete(gradeId);
    } else {
      newExpanded.add(gradeId);
    }
    setExpandedGrades(newExpanded);
  };

  const theme = staticColors
    ? {
      bg: 'bg-white',
      text: 'text-black',
      border: 'border-gray-400',
      header: 'bg-gray-100 text-black',
      zebra: 'bg-gray-50',
      highlight: 'bg-cyan-400 bg-opacity-[0.07]',
      textCyan: 'text-black',
      bgColorValueP: 'bg-gradient-to-r from-red-500/20 to-transparent',
      bgColorValueE: 'bg-gradient-to-l from-emerald-500/20 to-transparent',
      textPurple: 'text-purple-700',
      textGreen: 'text-black',
      textBlue: 'text-blue-700',
      nadie: '',
      colorText: 'text-slate-700',
      colorBG: 'bg-gray-100 text-zinc-500',
      colorDivResuls: 'border-zinc-900 bg-[#E3E3E4] bg-opacity-[1]',
    }
    : {
      bg: 'bg-slate-800/30',
      text: 'text-slate-300',
      border: 'border-slate-700',
      header: 'bg-slate-700/50 text-slate-400',
      zebra: 'bg-slate-700/30',
      highlight: 'bg-slate-400 bg-opacity-[0.07]',
      textCyan: 'text-white',
      bgColorValueP: 'bg-gradient-to-r from-red-500/20 to-transparent',
      bgColorValueE: 'bg-gradient-to-l from-emerald-500/20 to-transparent',
      textPurple: 'text-purple-400',
      textGreen: 'text-white',
      textBlue: 'text-blue-400',
      nadie: '',
      colorText: 'text-slate-500',
      colorBG: 'bg-slate-700/50 text-slate-500',
      colorDivResuls: 'border-slate-700 bg-slate-800/50',
    };

  return (
    <div className={`flex flex-col gap-y-4 w-full ${theme.bg} ${theme.text}`}>
      {expedicaoData.map((grade) => {
        const totalQuantidade = grade.tamanhosQuantidades.reduce((sum, i) => sum + i.quantidade, 0);
        const totalPrevisto = grade.tamanhosQuantidades.reduce((sum, i) => sum + i.previsto, 0);
        const totalPesoAfer = grade.tamanhosQuantidades.reduce((sum, i) => sum + (i.peso ?? 0) * (i.quantidade ?? 0), 0);
        const faltaExpedir = totalPrevisto - totalQuantidade;
        const percentualConcluido = converPercentualFormat((totalQuantidade / totalPrevisto) * 100);
        const isSelected = selectedGrades.includes(grade.id);
        const isExpanded = expandedGrades.has(grade.id);

        const colorStatus = grade.status === 'DESPACHADA' ? 'text-blue-500' : grade.status === 'EXPEDIDA' ? 'text-emerald-500' : 'text-slate-400';
        const colorChecked = grade.status === 'EXPEDIDA' ? 'border-emerald-500' : grade.status === 'DESPACHADA' ? 'border-blue-500' : 'border-slate-500';

        return (
          <div key={grade.id} className={`border border-slate-700 rounded-xl overflow-hidden shadow-lg ${theme.bg}`}>
            {/* Header da Grade */}
            <div className={`${theme.colorDivResuls} p-4 lg:p-6`}>
              <div className="space-y-4">

                {/* Checkbox no topo */}
                {(status === 'EXPEDIDA' || status === 'PRONTA') && (
                  <div className="flex items-center justify-center w-6 h-6">
                    <label className="relative cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelect(grade.id)}
                        className="sr-only peer"
                      />
                      <div className={`w-6 h-6 rounded border-2 ${colorChecked} flex items-center justify-center transition-all duration-200`}>
                        <CheckCircle
                          className={`w-4 h-4 text-emerald-400 transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                        />
                      </div>
                    </label>
                  </div>
                )}

                {/* Textos grandes - um por linha */}
                <div className="space-y-3">
                  <div className="flex gap-x-3">
                    <div className="bg-slate-700/30 rounded-lg p-3 lg:w-1/2">
                      <p className="text-xs lg:text-base text-slate-400 uppercase font-medium">Projeto</p>
                      <p className="text-sm lg:text-lg font-semibold text-blue-300 truncate">{grade.projectname}</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3 lg:w-1/2">
                      <p className="text-xs lg:text-base text-slate-400 uppercase font-medium">Empresa</p>
                      <p className="text-sm lg:text-lg font-semibold text-purple-300 truncate">{grade.company}</p>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <p className="text-xs lg:text-base text-slate-400 uppercase font-medium">Unidade Escolar</p>
                    <p className="text-sm lg:text-lg font-semibold text-emerald-300 truncate">{grade.escola}</p>
                  </div>
                </div>

                {/* Textos pequenos - lado a lado bem divididos */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  <div className="bg-slate-700/30 rounded-lg p-3 border-r border-slate-600/30">
                    <p className="text-xs lg:text-base text-slate-400 uppercase font-medium">Status</p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm lg:text-lg font-semibold ${colorStatus}`}>{grade.status}</span>
                      {grade.tipo && <span className="text-xs lg:text-base text-orange-400 bg-orange-500/10 px-2 py-1 rounded">R</span>}
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3 border-r border-slate-600/30">
                    <p className="text-xs lg:text-base text-slate-400 uppercase font-medium">Nº da Escola</p>
                    {status === 'PRONTA' ? (
                      <Link href={`/expedition/${grade.escolaId}`} target="_blank" className="flex items-center space-x-1 text-sm lg:text-lg font-semibold text-cyan-300 hover:text-cyan-200 transition-colors">
                        <span>{grade.numeroEscola}</span>
                        <ExternalLink size={12} />
                      </Link>
                    ) : (
                      <p className="text-sm lg:text-lg font-semibold text-cyan-300">{grade.numeroEscola}</p>
                    )}
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3 border-r border-slate-600/30">
                    <p className="text-xs lg:text-base text-slate-400 uppercase font-medium">Nº Join</p>
                    <p className="text-sm lg:text-lg font-semibold text-violet-300">{grade.numberJoin}</p>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3 border-r border-slate-600/30">
                    <p className="text-xs lg:text-base text-slate-400 uppercase font-medium">Grade ID</p>
                    <p className="text-sm lg:text-lg font-semibold text-slate-200">{grade.id}</p>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3 border-r border-slate-600/30">
                    <p className="text-xs lg:text-base text-slate-400 uppercase font-medium">Último Update</p>
                    <p className="text-sm lg:text-lg font-semibold text-slate-300">{grade.update}</p>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3 border-r border-slate-600/30">
                    <p className="text-xs lg:text-base text-slate-400 uppercase font-medium">Qty de Volumes</p>
                    <Link href={`/caixas_por_grade/${grade.id}`} target="_blank" className="flex items-center space-x-1 text-sm lg:text-lg font-semibold text-amber-300 hover:text-amber-200 transition-colors">
                      <span>{grade.caixas.length}</span>
                      <ExternalLink size={12} />
                    </Link>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-3 border-r border-slate-600/30">
                    <p className="text-xs lg:text-base text-slate-400 uppercase font-medium">Concluído</p>
                    <p className="text-sm lg:text-lg font-semibold text-green-300">{percentualConcluido}</p>
                  </div>
                  {/* Botão Expandir/Recolher */}
                  <div className="flex justify-end items-end">
                    <button
                      onClick={() => toggleGradeExpansion(grade.id)}
                      className="flex items-center justify-center w-8 h-8 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-colors duration-200"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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
                      <thead className={`${theme.header}`}>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap min-w-[120px]">Item</th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap min-w-[100px]">Gênero</th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap min-w-[80px]">Tam</th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap min-w-[100px]">Previsto</th>
                          <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider whitespace-nowrap min-w-[100px]">Expedido</th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap min-w-[100px]">À Expedir</th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap min-w-[100px]">Peso Unit.</th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap min-w-[100px]">Peso Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {grade.tamanhosQuantidades.map((item, index) => {
                          const zebra = index % 2 === 0 ? theme.nadie : theme.zebra;
                          const highlight = item.previsto > item.quantidade ? theme.highlight : '';

                          return (
                            <tr key={index} className={`${zebra} ${highlight} hover:bg-slate-700/30 transition-colors duration-150`}>
                              <td className="px-4 py-3 text-sm font-medium uppercase whitespace-nowrap min-w-[120px]">{item.item}</td>
                              <td className="px-4 py-3 text-sm font-medium uppercase whitespace-nowrap min-w-[100px]">{item.genero}</td>
                              <td className={`px-4 py-3 text-sm font-medium uppercase ${theme.header} whitespace-nowrap min-w-[80px]`}>{item.tamanho}</td>
                              <td className={`px-4 py-3 text-sm ${theme.textPurple} whitespace-nowrap min-w-[100px]`}>
                                {convertMilharFormat(item.previsto)}
                              </td>
                              <td className={`px-4 py-3 text-sm text-right ${theme.textGreen} ${(item.previsto === item.quantidade) ? theme.bgColorValueE : ''} whitespace-nowrap min-w-[100px]`}>
                                <span className={`${(item.previsto === item.quantidade) ? 'text-emerald-500' : ''}`}>
                                  {convertMilharFormat(item.quantidade)}
                                </span>
                              </td>
                              <td className={`px-4 py-3 text-sm ${theme.textCyan} ${(item.previsto - item.quantidade > 0) ? theme.bgColorValueP : ''} whitespace-nowrap min-w-[100px]`}>
                                <span className={`${(item.previsto - item.quantidade > 0) ? 'text-red-500' : ''}`}>
                                  {convertMilharFormat(item.previsto - item.quantidade)}
                                </span>
                              </td>
                              <td className={`px-4 py-3 text-sm ${theme.textBlue} whitespace-nowrap min-w-[100px]`}>
                                {convertMilharFormatKG(item.peso ?? 0)}
                              </td>
                              <td className={`px-4 py-3 text-sm ${theme.textBlue} whitespace-nowrap min-w-[100px]`}>
                                {convertMilharFormatKG((item.peso ?? 0) * item.quantidade)}
                              </td>
                            </tr>
                          );
                        })}

                        {/* Linha de Totais */}
                        <tr className={`font-bold ${theme.header}`}>
                          <td className="px-4 py-3 whitespace-nowrap min-w-[120px]"></td>
                          <td className="px-4 py-3 whitespace-nowrap min-w-[100px]">TOTAIS</td>
                          <td className="px-4 py-3 whitespace-nowrap min-w-[80px]" colSpan={1}>{'==>'}</td>
                          <td className="px-4 py-3 text-sm font-bold text-slate-300 bg-slate-600/50 whitespace-nowrap min-w-[100px]">
                            {convertMilharFormat(totalPrevisto)}
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-slate-300 bg-slate-600/50 text-right whitespace-nowrap min-w-[100px]">
                            {convertMilharFormat(totalQuantidade)}
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-slate-300 bg-slate-600/50 whitespace-nowrap min-w-[100px]">
                            {convertMilharFormat(faltaExpedir)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap min-w-[100px] bg-slate-600/50"></td>
                          <td className="px-4 py-3 text-sm font-bold text-slate-300 bg-slate-600/50 whitespace-nowrap min-w-[100px]">
                            {convertMilharFormatKG(totalPesoAfer ?? 0)}
                          </td>
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
  );
}
