'use client'

import PageEntExcel from '@/components/componentesDePrint/PageEntExcel';
import PageExcelNew from '@/components/componentesDePrint/PageExcelNew';
import PageExcelNewfaltas from '@/components/componentesDePrint/PageExcelNewfaltas';
import PageExcelRelatorioPedido from '@/components/componentesDePrint/PageExcelRelatorioPedido';
import RomaneiosAll from '@/components/componentesDePrint/RomaneiosAll';
import AdvancedFilter from '@/components/ComponentesInterface/AdvancedFilter';
import IsLoading from '@/components/ComponentesInterface/IsLoading';
import PageWithDrawer from '@/components/ComponentesInterface/PageWithDrawer';
import GradesFilterTable from '@/components/componentesRomaneios/GradesFiltterTable';
import ProjectSelect from '@/components/componentesRomaneios/preojectSelect';
import RemessaSelect from '@/components/componentesRomaneios/RemessaSelect';
import { alterarPDespachadas, getFilterGradesPP } from '@/hooks_api/api';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, BarChart, FileText, Package, Search, Settings } from 'react-feather';
import { GradesRomaneio } from '../../../core';
import { filtrarGradesPorPrioridade, getResumo } from '../../../core/utils/tools';

const fetcherGradesPStatusPP = async (projectId: number, remessa: number, status: string, tipo: string): Promise<GradesRomaneio[] | null> => {
  try {
    const resp = await getFilterGradesPP(String(projectId), String(remessa), status, tipo);
    return resp;
  } catch (error) {
    console.error("Erro ao buscar grades:", error);
    return null;
  }
};

const fetcherAlterStatus = async (ids: number[]): Promise<number[] | null> => {
  try {
    const resp = await alterarPDespachadas(ids);
    return resp;
  } catch (error) {
    console.error("Erro ao atualizar status das grades:", error);
    return null;
  }
};

export default function ConsultaStatusGradesPP() {
  const [projectId, setProjectId] = useState<number | null>(null);
  const [remessa, setRemessa] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("EXPEDIDA");
  const [tipo, setTipo] = useState<string>("T");
  const [data, setData] = useState<GradesRomaneio[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataFiltered, setDataFiltered] = useState<GradesRomaneio[]>([]);
  const [buscaEscola, setBuscaEscola] = useState<string>('');
  const [modalStatus, setModalStatus] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(`GERE OS RELATÓRIOS ANTES DA ALTERAÇÃO`);
  const [selectedGrades, setSelectedGrades] = useState<number[]>([]);

  // Função para buscar as grades com os filtros
  const loaderFilter = useCallback(async () => {
    if (!projectId || !remessa || !status || !tipo) return;

    setIsLoading(true);
    const res = await fetcherGradesPStatusPP(projectId, remessa, status, tipo);
    setData(res || []);
    setDataFiltered(res || []);
    setSelectedGrades(res ? res.map(g => g.id) : []); // <-- seleciona tudo ao carregar
    setIsLoading(false);
  }, [projectId, remessa, status, tipo]);

  useEffect(() => {
    loaderFilter();
  }, [loaderFilter]);

  // ✅ NOVO: Função para aplicar filtro manualmente
  const aplicarFiltro = useCallback((termoBusca: string) => {
    if (data.length > 0) {
      const resultado = filtrarGradesPorPrioridade(data, termoBusca);
      setDataFiltered(resultado);
    } else if (!termoBusca.trim()) {
      // Se não tem dados mas busca está vazia, limpa o filtro
      setDataFiltered([]);
    }
  }, [data]);

  // Aplicar filtro quando dados carregam
  useEffect(() => {
    aplicarFiltro(buscaEscola);
  }, [data, buscaEscola, aplicarFiltro]);

  const modalAjustStatus = () => {
    if (status === 'EXPEDIDA' && dataFiltered.length > 0) {
      setModalStatus(modalStatus ? false : true);
    }
  }

  const fecharModalAjustStatus = () => {
    setModalStatus(modalStatus ? false : true);
  }


  const ajustarStatus = async (ids: number[]) => {
    const resp = await fetcherAlterStatus(ids);
    if (resp) {
      setMessage(`GRADES ALTERADAS COM OS SEGUINTES IDs:`);
      const timeout = setTimeout(() => {
        setStatus("DESPACHADA");
        setMessage(`GERE OS RELATÓRIOS ANTES DA ALTERAÇÃO`);
        setModalStatus((prev) => prev ? false : true);
        clearTimeout(timeout);
      }, 1000);
      return
    }
    setMessage(`ERRO AO MUDAR STATUS DAS GRADES`);
    const timeout = setTimeout(() => {
      setMessage(`TENTE NOVAMENTE`);
      clearTimeout(timeout);
    }, 1000);
    return
  }

  // Atualização do handleSelect para remover ao desmarcar e adicionar ao marcar
  const handleSelect = (id: number) => {
    setSelectedGrades((prevSelected) => {
      const isSelected = prevSelected.includes(id);

      if (isSelected) {
        // Desmarcou: remove do selected e do dataFiltered
        setDataFiltered((prevFiltered) => prevFiltered.filter(g => g.id !== id));
        return prevSelected.filter(item => item !== id);
      } else {
        // Marcou: adiciona ao selected e ao dataFiltered
        const gradeToAdd = data.find(g => g.id === id);
        if (gradeToAdd) {
          setDataFiltered((prevFiltered) => [...prevFiltered, gradeToAdd]);
        }
        return [...prevSelected, id];
      }
    });
  };

  const filtered = getResumo(status, dataFiltered);

  return (
    <PageWithDrawer
      sectionName="Relatórios de Saída P/ Peças"
      currentPage="resumepp"
    >
      {/* Header Fixo */}
      <div className="lg:fixed lg:top-0 lg:left-0 lg:right-0 lg:z-20 lg:bg-slate-900/95 lg:backdrop-blur-sm lg:border-b lg:border-slate-700">
        <div className="px-4 pt-16 pb-4 lg:pt-6 lg:pb-4 sm:px-6 lg:px-8">
          <div className="max-w-[1370px] mx-auto">

            {/* Header Principal */}
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              {/* Título e Ícone */}
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="w-9 h-9 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg lg:rounded-2xl flex items-center justify-center shadow-lg">
                  <BarChart size={16} className="lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-base lg:text-2xl xl:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 truncate">
                    Relatórios de Saída P/ Peças
                  </h1>
                  <p className="text-slate-400 text-xs lg:text-sm hidden lg:block">
                    Análise de expedição por peças e impressão de romaneios de despacho
                  </p>
                </div>
              </div>

              {/* Estatísticas Rápidas - Desktop */}
              <div className="hidden lg:flex items-center space-x-3">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Package size={16} className="text-blue-400" />
                    <span className="text-slate-300 text-sm font-medium">
                      {filtered.gradesT} Grades
                    </span>
                  </div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <FileText size={16} className="text-purple-400" />
                    <span className="text-slate-300 text-sm font-medium">
                      {filtered.expedidosT} Expedidos
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Controles de Filtro */}
            <div className="bg-slate-800/30 lg:bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl lg:rounded-2xl p-3 lg:p-3 shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2 sm:gap-3 lg:gap-4 items-stretch">

                {/* Status */}
                <div className="lg:col-span-2">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-10 bg-slate-700/50 border border-slate-600 text-slate-300 rounded-lg px-3 py-2 text-xs lg:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="EXPEDIDA">Expedidas</option>
                    <option value="DESPACHADA">Despachadas</option>
                    <option value="PENDENTE">Pendentes</option>
                    <option value="TODAS">Todas</option>
                    {'<option value="IMPRESSA">-----</option>'}
                  </select>
                </div>

                {/* Projeto */}
                <div className="lg:col-span-2">
                  <ProjectSelect onSelectChange={setProjectId} />
                </div>

                {/* Remessa */}
                <div className="lg:col-span-2">
                  <RemessaSelect onSelectChange={setRemessa} projectId={projectId} />
                </div>

                {/* Tipo */}
                <div className="lg:col-span-2">
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full h-10 bg-slate-700/50 border border-slate-600 text-slate-300 rounded-lg px-3 py-2 text-xs lg:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="T">Todas</option>
                    <option value="N">Pedido Normal</option>
                    <option value="R">Reposição</option>
                  </select>
                </div>

                {/* Busca - Menor no desktop, normal no mobile */}
                <div className="sm:col-span-1 lg:col-span-1">
                  <button
                    onClick={loaderFilter}
                    className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-2 py-2 text-xs font-medium transition-colors duration-200 flex items-center justify-center gap-2 lg:gap-0"
                    title="Buscar dados"
                  >
                    <Search size={16} />
                    <span className="lg:hidden">Buscar</span>
                  </button>
                </div>

                {/* Filtro Avançado - Responsivo */}
                <div className="sm:col-span-1 lg:col-span-3">
                  <AdvancedFilter
                    value={buscaEscola}
                    onChange={setBuscaEscola}
                    onEnter={(valor) => {
                      setBuscaEscola(valor);
                      aplicarFiltro(valor);
                    }}
                    placeholder="Filtro avançado..."
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Botões de Ação - Compactos */}
            {data && (
              <div className="bg-slate-800/30 lg:bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl lg:rounded-2xl p-3 lg:p-3 shadow-lg mt-3 lg:mt-4">
                <h3 className="text-sm lg:text-base font-semibold text-white mb-3 flex items-center space-x-2">
                  <FileText size={16} className="text-blue-400" />
                  <span>Relatórios e Ações</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-3">
                  <RomaneiosAll romaneios={dataFiltered} />
                  <PageExcelNewfaltas expedicaoDataB={dataFiltered} />
                  <PageExcelNew expedicaoDataB={dataFiltered} />
                  <PageEntExcel expedicaoDataB={dataFiltered} />
                  <PageExcelRelatorioPedido expedicaoDataB={dataFiltered} />
                  <button
                    onClick={modalAjustStatus}
                    title="Mudança de Status (Expedida para Despachada)"
                    className="bg-slate-500/15 border border-slate-400/40 text-slate-100 rounded-md px-3 py-2 
                    text-xs font-semibold transition-all duration-200 flex items-center lg:justify-center justify-start hover:bg-slate-500/25
                    hover:border-slate-400/60 hover:scale-105 hover:shadow-lg hover:shadow-slate-500/20 focus:ring-2
                    focus:ring-slate-500/50 focus:border-transparent"
                  >
                    <Settings size={14} className="lg:w-4 lg:h-4" />
                    <span className="hidden sm:inline pl-2">Mudar Status</span>
                    <span className="sm:hidden pl-2">Status</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="px-4 pt-4 lg:pt-[19.85rem] pb-8 sm:px-6 lg:px-8">
        <div className="max-w-[1370px] mx-auto">

          {/* Estatísticas Resumidas */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            {/* Estatísticas Totais */}
            <div className="bg-slate-800/20 lg:bg-slate-800/20 backdrop-blur-sm border border-slate-700 rounded-xl lg:rounded-2xl p-3 lg:p-3 shadow-lg mb-0">
              <h3 className="text-base lg:text-xl font-semibold text-white mb-3 flex items-center space-x-2">
                <BarChart size={18} className="text-green-400" />
                <span>Estatísticas Totais</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1">
                <div className="bg-cyan-500/30 rounded-lg p-2 lg:p-3">
                  <p className="text-slate-400 text-xs lg:text-sm">Previsto</p>
                  <p className="text-cyan-500 text-base lg:text-[1.7rem] lg:leading-[2rem] font-extralight">{filtered.previstoT}</p>
                </div>
                <div className="bg-emerald-500/30 rounded-lg p-2 lg:p-3">
                  <p className="text-slate-400 text-xs lg:text-sm">Expedidos</p>
                  <p className="text-emerald-500 text-base lg:text-[1.7rem] lg:leading-[2rem] font-extralight">{filtered.expedidosT}</p>
                </div>
                <div className="bg-orange-500/30 rounded-lg p-2 lg:p-3">
                  <p className="text-slate-400 text-xs lg:text-sm">À Expedir</p>
                  <p className="text-orange-500 text-base lg:text-[1.7rem] lg:leading-[2rem] font-extralight">{filtered.aExpedirT}</p>
                </div>
                <div className="bg-white/20 rounded-lg p-2 lg:p-3">
                  <p className="text-slate-400 text-xs lg:text-sm">Grades</p>
                  <p className="text-white text-base lg:text-[1.7rem] lg:leading-[2rem] font-extralight">{filtered.gradesT}</p>
                </div>
                {status !== 'PENDENTE' && (
                  <div className="bg-purple-500/30 rounded-lg p-2 lg:p-3">
                    <p className="text-slate-400 text-xs lg:text-sm">Esc. Atendidas</p>
                    <p className="text-purple-500 text-base lg:text-[1.7rem] lg:leading-[2rem] font-extralight">{filtered.escolasAtendidasT}</p>
                  </div>
                )}
                {status === 'PENDENTE' && (
                  <div className="bg-purple-500/30 rounded-lg p-2 lg:p-3">
                    <p className="text-slate-400 text-xs lg:text-sm">Esc. à Atender</p>
                    <p className="text-purple-500 text-base lg:text-[1.7rem] lg:leading-[2rem] font-extralight">{filtered.escolasFaltantesT}</p>
                  </div>
                )}
                <div className="bg-white/20 rounded-lg p-2 lg:p-3">
                  <p className="text-slate-400 text-xs lg:text-sm">Cub. Total</p>
                  <p className="text-white text-base lg:text-xl font-extralight">{filtered.cubagemT}</p>
                </div>
                <div className="bg-white/20 rounded-lg p-2 lg:p-3">
                  <p className="text-slate-400 text-xs lg:text-sm">Peso Total</p>
                  <p className="text-white text-base lg:text-xl font-extralight">{filtered.pesoT}</p>
                </div>
                <div className="bg-red-500/30 rounded-lg p-2 lg:p-3">
                  <p className="text-slate-400 text-xs lg:text-sm">Volumes</p>
                  <p className="text-red-500 text-base lg:text-[1.7rem] lg:leading-[2rem] font-extralight">{filtered.volumes}</p>
                </div>
                {tipo === 'T' && (
                  <div className="bg-yellow-500/30 rounded-lg p-2 lg:p-3 sm:col-span-2 lg:col-span-1">
                    <p className="text-slate-400 text-xs lg:text-sm">Perc. Erros</p>
                    <p className="text-yellow-500 text-base lg:text-[1.7rem] lg:leading-[2rem] font-extralight">{filtered.percErr}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Estatísticas Normais */}
            <div className="bg-slate-800/20 lg:bg-slate-800/20 backdrop-blur-sm border border-slate-700 rounded-xl lg:rounded-2xl p-3 lg:p-3 shadow-lg">
              <h3 className="text-base lg:text-xl font-semibold text-white mb-3 flex items-center space-x-2">
                <Package size={18} className="text-blue-400" />
                <span>Estatísticas Normais</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1">
                <div className="bg-slate-700/30 rounded-lg p-2 lg:p-3">
                  <p className="text-slate-400 text-xs lg:text-sm">Previsto</p>
                  <p className="text-cyan-500 text-base lg:text-[1.7rem] lg:leading-[2rem] font-extralight">{filtered.previstoN}</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-2 lg:p-3">
                  <p className="text-slate-400 text-xs lg:text-sm">Expedidos</p>
                  <p className="text-emerald-500 text-base lg:text-[1.7rem] lg:leading-[2rem] font-extralight">{filtered.expedidos}</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-2 lg:p-3">
                  <p className="text-slate-400 text-xs lg:text-sm">À Expedir</p>
                  <p className="text-orange-500 text-base lg:text-[1.7rem] lg:leading-[2rem] font-extralight">{filtered.aExpedir}</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-2 lg:p-3">
                  <p className="text-slate-400 text-xs lg:text-sm">Grades</p>
                  <p className="text-white text-base lg:text-[1.7rem] lg:leading-[2rem] font-extralight">{filtered.gradesValidas}</p>
                </div>
                {status !== 'PENDENTE' && (
                  <div className="bg-slate-700/30 rounded-lg p-2 lg:p-3">
                    <p className="text-slate-400 text-xs lg:text-sm">Esc. Atendidas</p>
                    <p className="text-purple-500 text-base lg:text-[1.7rem] lg:leading-[2rem] font-extralight">{filtered.escolasAtendidasN}</p>
                  </div>
                )}
                 {status === 'PENDENTE' && (
                  <div className="bg-slate-700/30 rounded-lg p-2 lg:p-3">
                    <p className="text-slate-400 text-xs lg:text-sm">Esc. à Atender</p>
                    <p className="text-purple-500 text-base lg:text-[1.7rem] lg:leading-[2rem] font-extralight">{filtered.escolasFaltantesN}</p>
                  </div>
                )}
                <div className="bg-slate-700/30 rounded-lg p-2 lg:p-3">
                  <p className="text-slate-400 text-xs lg:text-sm">Cub. Total</p>
                  <p className="text-white text-base lg:text-xl font-extralight">{filtered.cubagemN}</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-2 lg:p-3">
                  <p className="text-slate-400 text-xs lg:text-sm">Peso Total</p>
                  <p className="text-white text-base lg:text-xl font-extralight">{filtered.pesoN}</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-2 lg:p-3">
                  <p className="text-slate-400 text-xs lg:text-sm">Volumes</p>
                  <p className="text-red-500 text-base lg:text-[1.7rem] lg:leading-[2rem] font-extralight">{filtered.volumesN}</p>
                </div>
              </div>
            </div>

            {/* Estatísticas Reposição */}
            <div className="bg-slate-800/20 lg:bg-slate-800/20 backdrop-blur-sm border border-slate-700 rounded-xl lg:rounded-2xl p-3 lg:p-3 shadow-lg mb-6">
              <h3 className="text-base lg:text-xl font-semibold text-white mb-3 flex items-center space-x-2">
                <Settings size={18} className="text-purple-400" />
                <span>Estatísticas Reposição</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1">
                <div className="bg-slate-700/30 rounded-lg p-2 lg:p-3">
                  <p className="text-slate-400 text-xs lg:text-sm">Previsto</p>
                  <p className="text-cyan-500 text-base lg:text-[1.7rem] lg:leading-[2rem] font-extralight">{filtered.prevRepo}</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-2 lg:p-3">
                  <p className="text-slate-400 text-xs lg:text-sm">Expedidos</p>
                  <p className="text-emerald-500 text-base lg:text-[1.7rem] lg:leading-[2rem] font-extralight">{filtered.expRepo}</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-2 lg:p-3">
                  <p className="text-slate-400 text-xs lg:text-sm">À Expedir</p>
                  <p className="text-orange-500 text-base lg:text-[1.7rem] lg:leading-[2rem] font-extralight">{filtered.aExpRepo}</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-2 lg:p-3">
                  <p className="text-slate-400 text-xs lg:text-sm">Grades</p>
                  <p className="text-white text-base lg:text-[1.7rem] lg:leading-[2rem] font-extralight">{filtered.gradesRepo}</p>
                </div>
                {status !== 'PENDENTE' && (
                  <div className="bg-slate-700/30 rounded-lg p-2 lg:p-3">
                    <p className="text-slate-400 text-xs lg:text-sm">Esc. Atendidas</p>
                    <p className="text-purple-500 text-base lg:text-[1.7rem] lg:leading-[2rem] font-extralight">{filtered.escolasAtendidasR}</p>
                  </div>
                )}
                {status === 'PENDENTE' && (
                  <div className="bg-slate-700/30 rounded-lg p-2 lg:p-3">
                    <p className="text-slate-400 text-xs lg:text-sm">Esc. à Atender</p>
                    <p className="text-purple-500 text-base lg:text-[1.7rem] lg:leading-[2rem] font-extralight">{filtered.escolasFaltantesR}</p>
                  </div>
                )}
                <div className="bg-slate-700/30 rounded-lg p-2 lg:p-3">
                  <p className="text-slate-400 text-xs lg:text-sm">Cub. Total</p>
                  <p className="text-white text-base lg:text-xl font-extralight">{filtered.cubagemR}</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-2 lg:p-3">
                  <p className="text-slate-400 text-xs lg:text-sm">Peso Total</p>
                  <p className="text-white text-base lg:text-xl font-extralight">{filtered.pesoR}</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-2 lg:p-3">
                  <p className="text-slate-400 text-xs lg:text-sm">Volumes</p>
                  <p className="text-red-500 text-base lg:text-[1.7rem] lg:leading-[2rem] font-extralight">{filtered.volumesR}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Tabela de Grades */}
          <div className="bg-slate-800/30 lg:bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl lg:rounded-2xl p-3 lg:p-3 shadow-lg">
            <h3 className="text-base lg:text-xl font-semibold text-white mb-3 flex items-center space-x-2">
              <Package size={18} className="text-green-400" />
              <span>Grades</span>
              <span className="text-slate-400 text-xs lg:text-sm">({dataFiltered.length} resultados)</span>
            </h3>

            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex items-center justify-center w-full h-64">
                  <IsLoading />
                </div>
              ) : data?.length ? (
                <GradesFilterTable
                  expedicaoData={dataFiltered}
                  staticColors={false}
                  status={status}
                  selectedGrades={selectedGrades}
                  handleSelect={handleSelect}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-64">
                  <p className="text-slate-400 text-center w-full text-wrap text-lg">Não há dados para os parâmetros pesquisados.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação */}
      {filtered.ids.length > 0 && modalStatus && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center min-h-dvh p-4 pt-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-2xl p-4 lg:p-6 shadow-2xl max-w-md lg:max-w-3xl w-full max-h-[90vh] flex flex-col"
          >
            <div className="flex flex-col items-center text-center space-y-3 flex-1 min-h-0">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-400" />
              </div>

              <div className="space-y-1">
                <h2 className="text-lg lg:text-xl font-bold text-white">
                  Mudança de Status
                </h2>
                <p className="text-slate-400 text-xs lg:text-xl">
                  {message}
                </p>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-3 w-full flex-1 min-h-0 flex flex-col">
                <p className="text-slate-300 text-xs lg:text-xl font-medium mb-2 flex-shrink-0">
                  Grades IDs Afetados:
                </p>
                <div className="flex flex-wrap gap-1 justify-center overflow-y-auto flex-1 min-h-0">
                  {filtered.ids.map((id, index) => (
                    <span key={index} className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-2xl font-mono">
                      {id}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1 flex-shrink-0">
                <p className="text-slate-300 text-xs lg:text-xl font-medium">
                  Deseja mesmo alterar o status das grades?
                </p>
                <p className="text-red-400 text-xs lg:text-xl">
                  A operação não poderá ser revertida
                </p>
              </div>

              <div className="flex space-x-2 w-full flex-shrink-0">
                <button
                  onClick={() => ajustarStatus(filtered.ids)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg px-3 py-2 text-xs lg:text-xl font-medium transition-colors duration-200"
                >
                  Ajustar
                </button>
                <button
                  onClick={fecharModalAjustStatus}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-2 text-xs lg:text-xl font-medium transition-colors duration-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </PageWithDrawer>
  );
}
