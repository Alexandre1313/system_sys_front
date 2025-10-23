'use client';

import { useState } from 'react';
import { ExpedicaoResumoPDGrouped } from '../../../core';
import { gerarPDFExpedicao } from '../../../core/create_pdfs/pdfMakeGenertor';
import ProjectSelect from '@/components/componentesRomaneios/preojectSelect';
import { getProjectsPDataSaidas, getProjectsPDataSaidasResum } from '@/hooks_api/api';
import RemessaSelect from '@/components/componentesRomaneios/RemessaSelect';
import IsLoading from '@/components/ComponentesInterface/IsLoading';
import PageWithDrawer from '@/components/ComponentesInterface/PageWithDrawer';
import { convertMilharFormat } from '../../../core/utils/tools';
import { BarChart, FileText, Search, Download, Calendar, Package, Hash } from 'react-feather';

const fetcherSaidasPProjetoEData = async (
  projectId: string,
  tipoGrade: string,
  remessa: string
): Promise<ExpedicaoResumoPDGrouped[]> => {
  try {
    const resp = await getProjectsPDataSaidas(projectId, tipoGrade, remessa);
    return resp;
  } catch (error) {
    console.error('Erro ao buscar grades e suas saídas:', error);
    return [];
  }
};

const fetcherSaidasPProjetoEDataResum = async (
  projectId: string,
  tipoGrade: string,
  remessa: string
): Promise<ExpedicaoResumoPDGrouped[]> => {
  try {
    const resp = await getProjectsPDataSaidasResum(projectId, tipoGrade, remessa);
    return resp;
  } catch (error) {
    console.error('Erro ao buscar grades e suas saídas:', error);
    return [];
  }
};

// Função para formatar data
const formatarData = (dataString: string): string => {
  if (!dataString) return '';

  try {
    // pega só a parte da data
    const [dataParte] = dataString.split(' ');
    const [ano, mes, dia] = dataParte.split('-');

    return `${dia}/${mes}/${ano}`;
  } catch {
    return dataString;
  }
};

export default function ResumoExpedicao() {
  const [projectId, setProjectId] = useState<number | null>(null);
  const [tipo, setTipo] = useState<string>('1');
  const [remessa, setRemessa] = useState<number | null>(null);
  const [resumo, setResumo] = useState<ExpedicaoResumoPDGrouped[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buscou, setBuscou] = useState(false);

  const handleBuscar = async () => {
    if (projectId === null) {
      setError('Selecione um projeto.');
      return;
    }
    if (remessa === null) {
      setError('Selecione uma remessa.');
      return;
    }

    setLoading(true);
    setError(null);
    setBuscou(true);
    try {
      const dados = await fetcherSaidasPProjetoEData(
        String(projectId),
        String(tipo),
        String(remessa)
      );
      setResumo(dados);
    } catch (err) {
      setError('Erro ao carregar o resumo da expedição.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuscarResum = async () => {
    if (projectId === null) {
      setError('Selecione um projeto.');
      return;
    }
    if (remessa === null) {
      setError('Selecione uma remessa.');
      return;
    }

    setLoading(true);
    setError(null);
    setBuscou(true);
    try {
      const dados = await fetcherSaidasPProjetoEDataResum(
        String(projectId),
        String(tipo),
        String(remessa)
      );
      setResumo(dados);
    } catch (err) {
      setError('Erro ao carregar o resumo da expedição.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Configurações de largura das colunas
  const colWidths = {
    projeto: 'w-[19%] min-w-[120px]',
    data: 'w-[15%] min-w-[100px]',
    item: 'w-[26%] min-w-[150px]',
    genero: 'w-[10%] min-w-[80px]',
    tamanho: 'w-[10%] min-w-[120px]',
    previsto: 'w-[10%] min-w-[90px]',
    expedido: 'w-[10%] min-w-[90px]',
    diferenca: 'w-[10%] min-w-[90px]', // ✅ NOVO: Coluna de diferença
  };

  const alignClass = 'text-left';

  let isTotalGeral = false;
  let prev = 0;
  let exp = 0;

  return (
    <PageWithDrawer sectionName="Relatório de Saídas por Data">
      {/* Header Fixo */}
      <div className="lg:fixed lg:top-0 lg:left-0 lg:right-0 lg:z-20 lg:bg-slate-900/95 lg:backdrop-blur-sm lg:border-b lg:border-slate-700">
        <div className="px-4 pt-16 pb-4 lg:pt-6 lg:pb-4 sm:px-6 lg:px-8">
          <div className="max-w-[1370px] mx-auto">

            {/* Header Principal */}
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              {/* Título e Ícone */}
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="w-9 h-9 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg lg:rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText size={16} className="lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-base lg:text-2xl xl:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 truncate">
                    Relatório de Saídas por Data
                  </h1>
                  <p className="text-slate-400 text-xs lg:text-sm hidden lg:block">
                    Análise detalhada de saídas por projeto e data
                  </p>
                </div>
              </div>

              {/* Estatísticas Rápidas - Desktop */}
              <div className="hidden lg:flex items-center space-x-3">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <FileText size={16} className="text-blue-400" />
                    <span className="text-slate-300 text-sm font-medium">
                      Relatório Ativo
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Controles de Filtro */}
            <div className="bg-slate-800/30 lg:bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 lg:gap-4 items-center">

                {/* Projeto */}
                <div className="flex-1">
                  <ProjectSelect onSelectChange={setProjectId} />
                </div>

                {/* Remessa */}
                <div className="flex-1">
                  <RemessaSelect onSelectChange={setRemessa} projectId={projectId} />
                </div>

                {/* Tipo */}
                <div className="flex-1">
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 text-slate-300 rounded-lg px-3 py-2 text-xs lg:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="-1">Todas</option>
                    <option value="1">Pedido Normal</option>
                    <option value="2">Reposição</option>
                  </select>
                </div>

                {/* Botão Resumido */}
                <div className="flex-1">
                  <button
                    onClick={handleBuscarResum}
                    disabled={loading}
                    className={`w-full bg-slate-600 hover:bg-slate-700 text-white rounded-lg px-3 py-2 text-xs lg:text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1 lg:space-x-2 ${loading ? 'cursor-wait opacity-70' : 'cursor-pointer'}`}
                  >
                    <Search size={14} className="lg:w-4 lg:h-4" />
                    <span className="hidden sm:inline">{loading ? 'Carregando...' : 'Resumido'}</span>
                    <span className="sm:hidden">Resum</span>
                  </button>
                </div>

                {/* Botão Completo */}
                <div className="flex-1">
                  <button
                    onClick={handleBuscar}
                    disabled={loading}
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2 text-xs lg:text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1 lg:space-x-2 ${loading ? 'cursor-wait opacity-70' : 'cursor-pointer'}`}
                  >
                    <Search size={14} className="lg:w-4 lg:h-4" />
                    <span className="hidden sm:inline">{loading ? 'Carregando...' : 'Completo'}</span>
                    <span className="sm:hidden">Comp</span>
                  </button>
                </div>

                {/* Botão de PDF */}
                <div className="flex-1">
                  <button
                    onClick={() => gerarPDFExpedicao(resumo)}
                    disabled={resumo.length === 0 || loading}
                    className={`w-full bg-green-600 hover:bg-green-700 text-white rounded-lg px-3 py-2 text-xs lg:text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1 lg:space-x-2 ${resumo.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <Download size={14} className="lg:w-4 lg:h-4" />
                    <span className="hidden sm:inline">Gerar PDF</span>
                    <span className="sm:hidden">PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="px-4 pt-4 lg:pt-[13.2rem] pb-8 sm:px-6 lg:px-8">
        <div className="max-w-[1370px] mx-auto">

          {loading && <IsLoading />}

          {!loading && buscou && (
            <div className="w-full">
              {error && (
                <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 mb-6">
                  <p className="text-red-400 text-center">{error}</p>
                </div>
              )}

              {resumo.length === 0 ? (
                <div className="text-center py-12 lg:py-16">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 border border-slate-700">
                    <FileText size={32} className="lg:w-10 lg:h-10 text-blue-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-semibold text-blue-400 mb-3 lg:mb-4">
                    Nenhum Dado Encontrado
                  </h3>
                  <p className="text-slate-500 text-sm lg:text-base max-w-md mx-auto mb-4 lg:mb-6">
                    Não foram encontrados dados para os filtros selecionados. Tente ajustar os critérios de busca.
                  </p>
                </div>
              ) : (
                <div className="bg-slate-800/30 lg:bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl lg:rounded-2xl shadow-lg overflow-hidden">

                  {/* Tabela Responsiva */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                      {/* Cabeçalho sticky */}
                      <thead className="sticky top-0 z-20 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700">
                        <tr className="text-slate-300 bg-slate-700/50">
                          <th className={`${colWidths.projeto} p-3 lg:p-4 text-left text-xs lg:text-sm xl:text-base font-semibold`}>
                            <div className="flex items-center space-x-1 lg:space-x-2">
                              <Package size={12} className="lg:w-4 lg:h-4 text-blue-400" />
                              <span className="hidden sm:inline">Projeto</span>
                              <span className="sm:hidden">Proj</span>
                            </div>
                          </th>
                          <th className={`${colWidths.data} p-3 lg:p-4 text-left text-xs lg:text-sm xl:text-base font-semibold`}>
                            <div className="flex items-center space-x-1 lg:space-x-2">
                              <Calendar size={12} className="lg:w-4 lg:h-4 text-purple-400" />
                              <span>Data</span>
                            </div>
                          </th>
                          <th className={`${colWidths.item} p-3 lg:p-4 text-left text-xs lg:text-sm xl:text-base font-semibold`}>
                            <div className="flex items-center space-x-1 lg:space-x-2">
                              <FileText size={12} className="lg:w-4 lg:h-4 text-green-400" />
                              <span>Item</span>
                            </div>
                          </th>
                          <th className={`${colWidths.genero} p-3 lg:p-4 text-left text-xs lg:text-sm xl:text-base font-semibold`}>
                            <div className="flex items-center space-x-1 lg:space-x-2">
                              <Hash size={12} className="lg:w-4 lg:h-4 text-orange-400" />
                              <span className="hidden sm:inline">Gênero</span>
                              <span className="sm:hidden">Gen</span>
                            </div>
                          </th>
                          <th className={`${colWidths.tamanho} p-3 lg:p-4 text-left text-xs lg:text-sm xl:text-base font-semibold`}>
                            <div className="flex items-center space-x-1 lg:space-x-2">
                              <Hash size={12} className="lg:w-4 lg:h-4 text-cyan-400" />
                              <span className="hidden sm:inline">Tamanho</span>
                              <span className="sm:hidden">Tam</span>
                            </div>
                          </th>
                          <th className={`${colWidths.previsto} p-3 lg:p-4 text-left text-xs lg:text-sm xl:text-base font-semibold`}>
                            <div className="flex items-center space-x-1 lg:space-x-2">
                              <BarChart size={12} className="lg:w-4 lg:h-4 text-yellow-400" />
                              <span className="hidden sm:inline">Previsto</span>
                              <span className="sm:hidden">Prev</span>
                            </div>
                          </th>
                          <th className={`${colWidths.expedido} p-3 lg:p-4 text-left text-xs lg:text-sm xl:text-base font-semibold`}>
                            <div className="flex items-center space-x-1 lg:space-x-2">
                              <BarChart size={12} className="lg:w-4 lg:h-4 text-emerald-400" />
                              <span className="hidden sm:inline">Expedido</span>
                              <span className="sm:hidden">Exp</span>
                            </div>
                          </th>
                          <th className={`${colWidths.diferenca} p-3 lg:p-4 text-left text-xs lg:text-sm xl:text-base font-semibold`}>
                            <div className="flex items-center space-x-1 lg:space-x-2">
                              <BarChart size={12} className="lg:w-4 lg:h-4 text-red-400" />
                              <span className="hidden sm:inline">Diferença</span>
                              <span className="sm:hidden">Diff</span>
                            </div>
                          </th>
                        </tr>
                      </thead>

                      {/* Corpo da tabela */}
                      <tbody>
                        {resumo.map((grupo, i) =>
                          grupo.groupedItems.map((dataGroup, j) =>
                            dataGroup.items.map((row, k) => {
                              const isTotal = row.item === 'Total';
                              const isStatus = row.item.startsWith('STATUS:');
                              const isTotalStatus = row.item?.startsWith('📊 Total '); // ✅ NOVO: Total por status
                              isTotalGeral = row.item === 'Total Geral';
                              if (isTotalGeral) {
                                prev = row.previsto;
                                exp = row.expedido;
                              }

                              // Determina se é linha par ou ímpar para efeito zebrado
                              const isEvenRow = (i + j + k) % 2 === 0;

                              let rowStyle = `transition-all duration-200 ${isEvenRow
                                  ? 'bg-slate-700/20 hover:bg-slate-700/40'
                                  : 'bg-slate-800/20 hover:bg-slate-800/40'
                                }`;

                              if (isTotal) rowStyle = 'bg-green-600/20 text-green-400 font-medium border-l-4 border-green-500';
                              if (isStatus) rowStyle = 'bg-blue-600/20 text-blue-400 font-medium border-l-4 border-blue-500';
                              if (isTotalStatus) rowStyle = 'bg-purple-600/20 text-purple-400 font-bold border-l-4 border-purple-500 shadow-lg'; // ✅ NOVO
                              if (isTotalGeral) rowStyle = 'bg-orange-600/20 text-white font-medium text-xl';
                              if (isTotalGeral) return null;

                              return (
                                <tr key={`${i}-${j}-${k}`} className={`border-b border-slate-700/30 ${rowStyle}`}>
                                  <td className={`${colWidths.projeto} p-3 lg:p-4 ${alignClass} text-xs lg:text-sm xl:text-base font-medium`}>
                                    {isTotal || isTotalGeral || isStatus || isTotalStatus ? '' : (
                                      <span className="text-blue-300 truncate block" title={grupo.projectname}>
                                        {grupo.projectname}
                                      </span>
                                    )}
                                  </td>
                                  <td className={`${colWidths.data} p-3 lg:p-4 ${alignClass} text-xs lg:text-sm xl:text-base`}>
                                    {isTotal || isTotalGeral || isStatus || isTotalStatus ? '' : (
                                      <span className="text-purple-300 font-mono" title={formatarData(row.data || '')}>
                                        {formatarData(row.data || '')}
                                      </span>
                                    )}
                                  </td>
                                  <td className={`${colWidths.item} p-3 lg:p-4 ${alignClass} text-xs lg:text-sm xl:text-base font-medium`}>
                                    <span className={`${isTotal ? 'text-green-300 font-semibold' : isStatus ? 'text-blue-300 font-semibold' : isTotalStatus ? 'text-purple-300 font-bold text-lg' : 'text-white'} truncate block`} title={row.item}>
                                      {row.item}
                                    </span>
                                  </td>
                                  <td className={`${colWidths.genero} p-3 lg:p-4 ${alignClass} text-xs lg:text-sm xl:text-base`}>
                                    {!isTotal && !isTotalGeral && !isStatus && !isTotalStatus && (
                                      <span className="text-orange-300 truncate block" title={row.genero}>
                                        {row.genero}
                                      </span>
                                    )}
                                  </td>
                                  <td className={`${colWidths.tamanho} p-3 lg:p-4 ${alignClass} text-xs lg:text-sm xl:text-base`}>
                                    {!isTotal && !isTotalGeral && !isStatus && !isTotalStatus && (
                                      <span className="text-cyan-300 font-medium truncate block" title={row.tamanho}>
                                        {row.tamanho}
                                      </span>
                                    )}
                                  </td>
                                  <td className={`${colWidths.previsto} p-3 lg:p-4 ${alignClass} text-xs lg:text-sm xl:text-base font-mono`}>
                                    {!isTotal && !isTotalGeral && !isStatus ? (
                                      <span className="text-yellow-300 font-semibold" title={convertMilharFormat(row.previsto)}>
                                        {convertMilharFormat(row.previsto)}
                                      </span>
                                    ) : isTotal && row.previsto > 0 ? (
                                      <span className="text-green-300 font-semibold" title={convertMilharFormat(row.previsto)}>
                                        {convertMilharFormat(row.previsto)}
                                      </span>
                                    ) : null}
                                  </td>
                                  <td className={`${colWidths.expedido} p-3 lg:p-4 ${alignClass} text-xs lg:text-sm xl:text-base font-mono`}>
                                    {!isTotal && !isTotalGeral && !isStatus ? (
                                      <span className="text-emerald-300 font-semibold" title={convertMilharFormat(row.expedido)}>
                                        {convertMilharFormat(row.expedido)}
                                      </span>
                                    ) : isTotal && row.expedido > 0 ? (
                                      <span className="text-green-300 font-semibold" title={convertMilharFormat(row.expedido)}>
                                        {convertMilharFormat(row.expedido)}
                                      </span>
                                    ) : null}
                                  </td>
                                  <td className={`${colWidths.diferenca} p-3 lg:p-4 ${alignClass} text-xs lg:text-sm xl:text-base font-mono`}>
                                    {!isTotal && !isTotalGeral && !isStatus && !isTotalStatus ? (
                                      <span className={`font-semibold ${row.expedido - row.previsto < 0 ? 'text-red-300' : row.expedido - row.previsto > 0 ? 'text-green-300' : 'text-yellow-300'}`} title={convertMilharFormat(row.expedido - row.previsto)}>
                                        {convertMilharFormat(row.expedido - row.previsto)}
                                      </span>
                                    ) : (isTotal || isTotalStatus) && (row.previsto > 0 || row.expedido > 0) ? (
                                      <span className={`font-semibold ${row.expedido - row.previsto < 0 ? 'text-red-300' : row.expedido - row.previsto > 0 ? 'text-green-300' : 'text-yellow-300'}`} title={convertMilharFormat(row.expedido - row.previsto)}>
                                        {convertMilharFormat(row.expedido - row.previsto)}
                                      </span>
                                    ) : null}
                                  </td>
                                </tr>
                              );
                            })
                          )
                        )}

                        {/* Total Geral - Agora dentro da tabela */}
                        {isTotalGeral && (
                          <tr className="bg-slate-700/30 backdrop-blur-sm text-white font-medium text-lg lg:text-xl border-t-2 border-slate-600 shadow-lg">
                            <td className={`${colWidths.projeto} p-3 lg:p-4`}></td>
                            <td className={`${colWidths.data} p-3 lg:p-4`}></td>
                            <td className={`${colWidths.item} p-3 lg:p-4`}></td>
                            <td className={`${colWidths.genero} p-3 lg:p-4`}></td>
                            <td className={`${colWidths.tamanho} p-3 lg:p-4`}>
                              <div className="flex items-center">
                                <Hash size={16} className="lg:w-5 lg:h-5 text-orange-300 mr-2 lg:mr-3 flex-shrink-0" />
                                <span className="text-sm lg:text-base whitespace-nowrap flex-shrink-0">TOTAL GERAL:</span>
                              </div>
                            </td>
                            <td className={`${colWidths.previsto} p-3 lg:p-4`}>
                              <span className="text-yellow-200 font-mono text-sm lg:text-base">{convertMilharFormat(prev)}</span>
                            </td>
                            <td className={`${colWidths.expedido} p-3 lg:p-4`}>
                              <span className="text-emerald-200 font-mono text-sm lg:text-base">{convertMilharFormat(exp)}</span>
                            </td>
                            <td className={`${colWidths.diferenca} p-3 lg:p-4`}>
                              <span className={`font-mono text-sm lg:text-base ${exp - prev < 0 ? 'text-red-200' : exp - prev > 0 ? 'text-green-200' : 'text-yellow-200'}`}>{convertMilharFormat(exp - prev)}</span>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && !buscou && (
            <div className="text-center py-12 lg:py-16">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 border border-slate-700">
                <FileText size={32} className="lg:w-10 lg:h-10 text-emerald-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold text-emerald-400 mb-3 lg:mb-4">
                Configure o Relatório
              </h3>
              <div className="space-y-2 text-slate-400 text-sm lg:text-base">
                <p>1. Selecione um projeto</p>
                <p>2. Escolha a remessa (opcional)</p>
                <p>3. Defina o tipo de pedido</p>
                <p>4. Clique em &quot;Completo&quot; ou &quot;Resumido&quot;</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWithDrawer>
  );
}
