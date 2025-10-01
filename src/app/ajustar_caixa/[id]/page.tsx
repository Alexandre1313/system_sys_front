'use client';

import IsLoading from '@/components/ComponentesInterface/IsLoading';
import PageWithDrawer from '@/components/ComponentesInterface/PageWithDrawer';
import { getCaixaParaAjuste, modificarCaixa } from '@/hooks_api/api';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { padStart } from 'pdf-lib';
import { useEffect, useState } from 'react';
import { AlertTriangle, Package, Edit3, Save, X } from 'react-feather';
import { CaixaAjuste } from '../../../../core';

type ItemComOriginalQty = CaixaAjuste['itens'][number] & {
  originalQty: number;
};

const fechBoxAjust = async (box: CaixaAjuste): Promise<CaixaAjuste | null | { status: string; mensagem: string; caixa: CaixaAjuste }> => {
  const boxData = await modificarCaixa(box);
  return boxData;
}

export default function AjustarCaixa() {
  const { id } = useParams();

  // Estado original da caixa (sem originalQty)
  const [caixa, setCaixa] = useState<CaixaAjuste | null>(null);

  const [caixaStatusBoolean, setCaixaStatusBoolean] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [msg, setMsg] = useState<string>(`DESEJA MESMO ALTERAR AS QUANTIDADES DA CAIXA DE ID ${id} ?`);
  const [msg1, setMsg1] = useState<string>('A OPERAÇÃO NÃO PODERÁ SER REVERTIDA');
  const [modalType, setModalType] = useState<'confirm' | 'success' | 'error' | 'exclusao'>('confirm');

  // Estado separado para itens com originalQty, usado para controlar quantidades
  const [itensComOriginal, setItensComOriginal] = useState<ItemComOriginalQty[]>([]);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const caixaData = await getCaixaParaAjuste(String(id));
        if (caixaData) {
          const itensComOriginalQty = caixaData.itens.map(item => ({
            ...item,
            originalQty: item.itemQty,
          }));
          setCaixa(caixaData);
          setItensComOriginal(itensComOriginalQty);
          setCaixaStatusBoolean(caixaData.status === 'PENDENTE' ? false : true);
          if (caixaData && caixaData.caixaNumber) {
            document.title = `CAIXA Nº ${padStart(caixaData.caixaNumber, 2, '0')}`;
          }
        } else {
          setCaixa(null);
        }
      } catch (error) {
        console.error('Erro ao buscar dados da caixa:', error);
        setCaixa(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  /*const handleChange = (index: number, rawValue: number, status: string) => {
    if (!caixa) return;

    const statusBloqueados = ['DESPACHADA', 'EXPEDIDA'];
    if (statusBloqueados.includes(status)) return;

    const newItens = [...itensComOriginal];

    // Se valor inválido ou NaN, seta 0 temporariamente
    const value = isNaN(rawValue) ? 0 : rawValue;

    // Limita valor máximo ao original
    const safeValue = Math.min(value, newItens[index].originalQty);

    const totalItens = newItens.length;

    // Se tiver só 1 item, quantidade mínima = 1
    if (totalItens === 1 && safeValue < 1) {
      newItens[index].itemQty = 1;
      setItensComOriginal(newItens);
      return;
    }

    // Se tiver mais de um item, garantir que pelo menos 1 item tenha qtd >= 1
    // Calcula quantos itens ficariam com quantidade >= 1 se alterarmos este
    const qtdsComPeloMenosUm = newItens.filter((item, i) =>
      i === index ? safeValue >= 1 : item.itemQty >= 1
    ).length;

    if (totalItens > 1 && qtdsComPeloMenosUm === 0) {
      // Impede o update para zero se for o único com qtd >= 1
      return;
    }

    newItens[index].itemQty = safeValue;
    setItensComOriginal(newItens);
  };*/

  /**
 * Lida com a mudança de quantidade de um item na lista,
 * removendo as validações que impedem que todos os itens fiquem zerados.
 *
 * @param {number} index - O índice do item na lista.
 * @param {number} rawValue - O valor bruto digitado pelo usuário.
 * @param {string} status - O status da caixa.
 */
  const handleChange = (index: number, rawValue: number, status: string) => {
    if (!caixa) return;

    const statusBloqueados = ['DESPACHADA', 'EXPEDIDA'];
    if (statusBloqueados.includes(status)) return;

    const newItens = [...itensComOriginal];

    // Se valor inválido ou NaN, seta 0 temporariamente
    const value = isNaN(rawValue) ? 0 : rawValue;

    // Limita valor máximo ao original e mínimo a 0
    const safeValue = Math.min(Math.max(value, 0), newItens[index].originalQty);

    // A única validação que resta é a de status da caixa.
    // Agora, a quantidade de um item pode ser 0, mesmo se for o último item.

    newItens[index].itemQty = safeValue;
    setItensComOriginal(newItens);
  };

  const handleInputChange = (index: number, inputValue: string, status: string) => {
    if (!caixa) return;

    const statusBloqueados = ['DESPACHADA', 'EXPEDIDA'];
    if (statusBloqueados.includes(status)) return;

    const newItens = [...itensComOriginal];

    // Remove caracteres não numéricos e zeros à esquerda
    const cleanValue = inputValue.replace(/[^0-9]/g, '').replace(/^0+/, '') || '0';
    const numericValue = parseInt(cleanValue, 10);

    // Se valor inválido ou NaN, seta 0
    const value = isNaN(numericValue) ? 0 : numericValue;

    // Limita valor máximo ao original e mínimo a 0
    const safeValue = Math.min(Math.max(value, 0), newItens[index].originalQty);

    newItens[index].itemQty = safeValue;
    setItensComOriginal(newItens);
  };

  const handleInputBlur = (index: number) => {
    // Se o input ficou vazio (""), força o valor para 0 ou 1 (conforme regra)
    const currentValue = itensComOriginal[index].itemQty;

    if (currentValue === undefined || currentValue === null) {
      handleChange(index, 0, caixa!.status);
      return;
    }
  };

  const handleSaveStepOne = async () => {
    setOpenModal(openModal ? false : true);
  };

  const handleSaveStepTwo = async () => {
    if (!caixa) {
      setMsg('NÃO HÁ UMA CAIXA VÁLIDA PARA ALTERAÇÃO!');
      setMsg1('REVEJA E TENTE NOVAMENTE');

      const time = setTimeout(() => {
        setModalType('confirm');
        setMsg(`DESEJA MESMO ALTERAR AS QUANTIDADES DA CAIXA DE ID ${id} ?`);
        setMsg1('A OPERAÇÃO NÃO PODERÁ SER REVERTIDA');
        setOpenModal(!openModal);
        clearTimeout(time);
      }, 1100);

      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const novosItens = itensComOriginal.map(({ originalQty, ...item }) => ({
        ...item,
      }));

      const novaCaixa = { ...caixa, itens: novosItens };

      const newBox = await fechBoxAjust(novaCaixa);

      if (newBox) {
        // Verificar se a caixa foi excluída
        if ('status' in newBox && newBox.status === 'EXCLUIDA') {
          setModalType('exclusao');
          setMsg('CAIXA EXCLUÍDA COM SUCESSO!');
          setMsg1((newBox as any).mensagem);

          // Limpar dados da caixa
          setCaixa(null);
          setItensComOriginal([]);
          setCaixaStatusBoolean(true);

          // Redirecionar após um tempo
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);

          return;
        }

        const refreshedBox = newBox as CaixaAjuste;

        if (refreshedBox) {
          // Atualizar os itens com as quantidades originais resetadas
          const itensAtualizados = refreshedBox.itens.map((item: any) => ({
            ...item,
            originalQty: item.itemQty, // Resetar originalQty para a nova quantidade
          }));

          // Atualizar estados
          setItensComOriginal(itensAtualizados);
          setCaixa(refreshedBox); // Usar o objeto diretamente, não spread
          setCaixaStatusBoolean(refreshedBox.status === 'PENDENTE' ? false : true);

          setModalType('success');
          setMsg('CAIXA ALTERADA COM SUCESSO!');
          setMsg1('CONFIRA AS QUANTIDADES');
        } else {
          setModalType('error');
          setMsg('ERRO AO ATUALIZAR A CAIXA!');
          setMsg1('NÃO FOI POSSÍVEL CARREGAR A CAIXA ATUALIZADA');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar a caixa:', error);
      setModalType('error');
      setMsg('OCORREU UM ERRO DURANTE A ATUALIZAÇÃO!');
      setMsg1('TENTE NOVAMENTE MAIS TARDE');
    } finally {
      const timeOut = setTimeout(() => {
        setModalType('confirm');
        setMsg(`DESEJA MESMO ALTERAR AS QUANTIDADES DA CAIXA DE ID ${id} ?`);
        setMsg1('A OPERAÇÃO NÃO PODERÁ SER REVERTIDA');
        setOpenModal(!openModal);
        clearTimeout(timeOut);
      }, 1000);
    }
  };

  const houveAlteracao = itensComOriginal.some(item => item.itemQty !== item.originalQty);

  const colorStatus = caixa?.status === 'EXPEDIDA' ? 'text-emerald-500' : caixa?.status === 'DESPACHADA' ? 'text-blue-500' : '';

  const totalQuantidade = itensComOriginal.reduce((sum, item) => sum + item.itemQty, 0);

  return (
    <PageWithDrawer
      projectName="Ajustar Caixa"
      sectionName={`Caixa ${caixa?.caixaNumber || id}`}
      currentPage="ajustar_caixa"
    >
      {isLoading ? (
        <div className="flex items-center justify-center w-full min-h-[100vh]">
          <IsLoading />
        </div>
      ) : caixa ? (
        <>
          {/* Header Fixo para Desktop, Compacto para Mobile */}
          <div className="lg:fixed lg:top-0 lg:left-0 lg:right-0 lg:z-20 lg:bg-slate-900/95 lg:backdrop-blur-sm lg:border-b lg:border-slate-700">
            <div className="px-4 pt-16 pb-3 lg:pt-6 lg:pb-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">

                {/* Header Compacto */}
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <div className="flex items-center space-x-3 lg:space-x-4 min-w-0">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <Edit3 size={14} className="lg:w-5 lg:h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h1 className="text-lg lg:text-2xl xl:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-pink-600 truncate">
                        Ajustar Caixa
                      </h1>
                      <p className="text-slate-400 text-xs lg:text-sm truncate">Caixa {caixa.caixaNumber.padStart(2, '0')}</p>
                    </div>
                  </div>
                </div>

                {/* Informações da Caixa */}
                <div className="bg-slate-800/30 lg:bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-lg">
                  {/* Mobile Layout */}
                  <div className="lg:hidden space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-slate-200 truncate">{caixa.projeto}</h3>
                        <p className="text-xs text-slate-400 truncate">{caixa.escola}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-3">
                        <span className="px-2 py-1 bg-emerald-400/20 border border-emerald-400/40 rounded-full text-xs text-emerald-400 font-semibold">
                          {caixa.caixaNumber.padStart(2, '0')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${caixa.status === 'EXPEDIDA' ? 'bg-emerald-400/20 text-emerald-400' :
                          caixa.status === 'DESPACHADA' ? 'bg-blue-400/20 text-blue-400' :
                            'bg-slate-400/20 text-slate-400'
                          }`}>
                          {caixa.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Grade: {caixa.gradeId}</span>
                      <span>Escola: {caixa.escolaNumero}</span>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden lg:grid lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">Projeto:</span>
                        <span className="text-slate-200 text-sm font-medium truncate ml-2">{caixa.projeto}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">Escola:</span>
                        <span className="text-slate-200 text-sm font-medium truncate ml-2">{caixa.escola}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">Nº Escola:</span>
                        <span className="text-slate-200 text-sm font-medium">{caixa.escolaNumero}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">Grade ID:</span>
                        <span className="text-slate-200 text-sm font-medium">{caixa.gradeId}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">Nº Caixa:</span>
                        <span className="text-emerald-400 text-sm font-bold">{caixa.caixaNumber.padStart(2, '0')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">Status:</span>
                        <span className={`text-sm font-bold ${colorStatus || 'text-slate-300'}`}>{caixa.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="px-4 pt-1 lg:pt-[15rem] pb-20 lg:pb-24 sm:px-6 lg:px-8">

            <div className="max-w-7xl mx-auto">

              {/* Resumo da Caixa */}
              <div className="bg-slate-700/90 border border-slate-800 rounded-xl p-2 px-4 sticky lg:top-60 top-0">
                <div className="grid grid-cols-3 lg:grid-cols-3 gap-1">
                  {/* Total Atual */}
                  <div className="flex items-center justify-center lg:justify-center">
                    <div className="lg:text-left text-center">
                      <span className="text-slate-400 text-xs lg:text-sm">Total Atual:</span>
                      <div className="flex items-center space-x-2 justify-center lg:justify-center">
                        <span className="lg:text-2xl font-extralight text-yellow-400">{totalQuantidade}</span>
                        <span className="text-slate-400 text-sm">
                          {totalQuantidade === 1 ? '' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Total Original */}
                  <div className="flex items-center justify-center lg:justify-center">
                    <div className="lg:text-left text-center">
                      <span className="text-slate-400 text-xs lg:text-sm">Total Original:</span>
                      <div className="flex items-center space-x-2 justify-center lg:justify-center">
                        <span className="lg:text-2xl font-extralight text-emerald-400">
                          {itensComOriginal.reduce((sum, item) => sum + item.originalQty, 0)}
                        </span>
                        <span className="text-slate-400 text-sm">
                          {itensComOriginal.reduce((sum, item) => sum + item.originalQty, 0) === 1 ? '' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Diferença */}
                  <div className="flex items-center justify-center lg:justify-center col-span-1 lg:col-span-1 
                    lg:border-t-[0px] md:col-span-1 md:border-t-[0px] pt-0 md:pt-0 lg:pt-0 border-slate-600">
                    <div className="lg:text-left text-center">
                      <span className="text-slate-400 text-xs lg:text-sm">Diferença:</span>
                      <div className="flex items-center space-x-2 justify-center lg:justify-center">
                        <span className={`lg:text-2xl font-extralight ${totalQuantidade > itensComOriginal.reduce((sum, item) => sum + item.originalQty, 0)
                          ? 'text-green-400'
                          : totalQuantidade < itensComOriginal.reduce((sum, item) => sum + item.originalQty, 0)
                            ? 'text-red-400'
                            : 'text-slate-400'
                          }`}>
                          {totalQuantidade > itensComOriginal.reduce((sum, item) => sum + item.originalQty, 0)
                            ? `+${totalQuantidade - itensComOriginal.reduce((sum, item) => sum + item.originalQty, 0)}`
                            : totalQuantidade < itensComOriginal.reduce((sum, item) => sum + item.originalQty, 0)
                              ? `-${Math.abs(totalQuantidade - itensComOriginal.reduce((sum, item) => sum + item.originalQty, 0))}`
                              : '0'
                          }
                        </span>
                        <span className="text-slate-400 text-sm">
                          {Math.abs(totalQuantidade - itensComOriginal.reduce((sum, item) => sum + item.originalQty, 0)) === 1 ? '' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Indicador de Alterações */}
                <div className="mt-4 pt-4 border-t border-slate-600">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                    <span className="text-slate-400 text-sm font-medium">
                      {itensComOriginal.filter(item => item.itemQty !== item.originalQty).length}
                      {itensComOriginal.filter(item => item.itemQty !== item.originalQty).length === 1 ? ' item' : ' itens'} modificado{itensComOriginal.filter(item => item.itemQty !== item.originalQty).length === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lista de Itens */}
              <div className="space-y-4 mt-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Package size={20} className="text-slate-400" />
                  <h2 className="text-lg lg:text-xl font-semibold text-slate-200">Itens da Caixa</h2>
                  <span className="px-2 py-1 bg-slate-700/50 border border-slate-600 rounded text-xs text-slate-300">
                    {itensComOriginal.length} {itensComOriginal.length === 1 ? 'item' : 'itens'}
                  </span>
                </div>

                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden table-fixed">
                    <thead>
                      <tr className="bg-slate-700/50 text-slate-300">
                        <th className="w-64 p-4 text-left font-medium">Item</th>
                        <th className="w-20 p-4 text-left font-medium">Tamanho</th>
                        <th className="w-32 p-4 text-left font-medium">Quantidade</th>
                        <th className="w-24 p-4 text-left font-medium">Status</th>
                        <th className="w-36 p-4 text-left font-medium">Última Atualização</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itensComOriginal.map((item, idx) => (
                        <tr key={item.id} className="border-t border-slate-700 hover:bg-slate-700/30 transition-colors">
                          <td className="p-4 text-left">
                            <div className="flex flex-col">
                              <span className="text-slate-200 font-medium">{item.itemName}</span>
                              <span className="text-slate-400 text-sm">{item.itemGenero}</span>
                            </div>
                          </td>
                          <td className="p-4 text-left">
                            <div className="w-16 flex justify-start">
                              <span className="px-2 py-1 bg-slate-600/50 border border-slate-500 rounded text-lg text-cyan-400 font-extralight whitespace-nowrap">
                                {item.itemTam}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-left">
                            <div className="flex items-center justify-start space-x-2 w-full">
                              <div className="flex items-center border border-slate-600/30 rounded-lg overflow-hidden">
                                <button
                                  disabled={caixaStatusBoolean}
                                  onClick={() => handleChange(idx, Math.max(0, item.itemQty - 1), caixa.status)}
                                  className={`px-3 py-2 bg-slate-700 hover:bg-slate-600 border-r border-slate-600/30 transition-colors
                                            ${caixaStatusBoolean ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                  <span className="text-slate-300 font-bold text-base">&#45;</span>
                                </button>
                                <input
                                  disabled={caixaStatusBoolean}
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  value={item.itemQty}
                                  onChange={(e) =>
                                    handleInputChange(idx, e.target.value, caixa.status)
                                  }
                                  onBlur={() => handleInputBlur(idx)}
                                  className={`w-16 h-10 px-1 py-1 text-center font-extralight text-lg transition-all duration-300 border-0 bg-transparent
                                            ${item.itemQty !== item.originalQty
                                      ? 'text-yellow-400'
                                      : 'text-emerald-400'
                                    } 
                                           focus:outline-none
                                           disabled:opacity-50 disabled:cursor-not-allowed`}
                                />
                                <button
                                  disabled={caixaStatusBoolean}
                                  onClick={() => handleChange(idx, Math.min(item.originalQty, item.itemQty + 1), caixa.status)}
                                  className={`px-3 py-2 bg-slate-700 hover:bg-slate-600 border-l border-slate-600/30 transition-colors
                                            ${caixaStatusBoolean ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                  <span className="text-slate-300 font-bold text-base">&#43;</span>
                                </button>
                              </div>
                              <div className="w-12 flex justify-center">
                                {item.itemQty !== item.originalQty && (
                                  <span className="text-xs text-yellow-400 font-medium whitespace-nowrap">
                                    {item.itemQty > item.originalQty ? '+' : ''}{item.itemQty - item.originalQty}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-left">
                            <div className="w-20 flex justify-start">
                              {item.itemQty !== item.originalQty ? (
                                <span className="px-2 py-1 bg-yellow-400/20 border border-yellow-400/50 rounded text-xs text-yellow-400 font-medium whitespace-nowrap">
                                  MODIFICADO
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-emerald-400/20 border border-emerald-400/50 rounded text-xs text-emerald-400 font-medium whitespace-nowrap">
                                  ORIGINAL
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-slate-400 text-sm text-left">{item.updatedAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-3">
                  {itensComOriginal.map((item, idx) => (
                    <div key={item.id} className={`bg-slate-800/50 border-[0.0317rem] rounded-2xl p-4 transition-all duration-300 ${item.itemQty !== item.originalQty
                      ? 'border-yellow-400/60 bg-yellow-400/5 shadow-lg shadow-yellow-400/10'
                      : 'border-slate-700'
                      }`}>

                      {/* Header Compacto */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h3 className="text-base font-semibold text-slate-200 truncate mb-1 flex-1">{item.itemName}</h3>
                            {item.itemQty !== item.originalQty && (
                              <span className="px-2 py-1 bg-yellow-400/20 border border-yellow-400/60 rounded-full text-xs text-yellow-400 font-semibold whitespace-nowrap ml-2">
                                MODIFICADO
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-slate-400">{item.itemGenero}</span>
                            <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                            <span className="px-2 py-0.5 bg-cyan-400/20 border border-cyan-400/40 rounded-full text-[0.7rem] text-cyan-400 font-extralight">
                              {item.itemTam}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Controles de Quantidade - Layout Melhorado */}
                      <div className="bg-slate-700/30 rounded-xl p-3">
                        <div className="flex flex-col items-center space-y-3">
                          {/* Linha Principal: Botões ao lado do Input */}
                          <div className="flex items-center justify-center space-x-3">
                            {/* Botão Diminuir */}
                            <button
                              disabled={caixaStatusBoolean}
                              onClick={() => handleChange(idx, Math.max(0, item.itemQty - 1), caixa.status)}
                              className={`w-10 h-10 bg-slate-600 hover:bg-red-600 border-0 border-slate-500 hover:border-red-500 rounded-lg flex items-center justify-center transition-all duration-300
                                        ${caixaStatusBoolean ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
                            >
                              <span className="text-white font-bold text-lg">&#45;</span>
                            </button>

                            {/* Input da Quantidade */}
                            <input
                              disabled={caixaStatusBoolean}
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={item.itemQty}
                              onChange={(e) =>
                                handleInputChange(idx, e.target.value, caixa.status)
                              }
                              onBlur={() => handleInputBlur(idx)}
                              className={`w-20 h-10 px-2 rounded-lg border-[0.0317rem] text-center font-extralight text-base transition-all duration-300 bg-transparent
                                        ${item.itemQty !== item.originalQty
                                  ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                                  : 'border-emerald-400 bg-emerald-400/10 text-emerald-400'
                                } 
                                       focus:outline-none
                                       disabled:opacity-50 disabled:cursor-not-allowed`}
                            />

                            {/* Botão Aumentar */}
                            <button
                              disabled={caixaStatusBoolean}
                              onClick={() => handleChange(idx, Math.min(item.originalQty, item.itemQty + 1), caixa.status)}
                              className={`w-10 h-10 bg-slate-600 hover:bg-green-600 border-0 border-slate-500 hover:border-green-500 rounded-lg flex items-center justify-center transition-all duration-300
                                        ${caixaStatusBoolean ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
                            >
                              <span className="text-white font-bold text-lg">&#43;</span>
                            </button>
                          </div>

                          {/* Diferença - Sempre Visível */}
                          <div className="flex justify-center">
                            <span className={`text-sm font-bold px-3 py-1 rounded-full ${item.itemQty > item.originalQty
                              ? 'text-green-400 bg-green-400/20'
                              : item.itemQty < item.originalQty
                                ? 'text-red-400 bg-red-400/20'
                                : 'text-slate-400 bg-slate-400/20'
                              }`}>
                              {item.itemQty > item.originalQty ? '+' : ''}{item.itemQty - item.originalQty}
                            </span>
                          </div>

                          {/* Informação Original - Pequena */}
                          <div className="text-xs text-slate-500">
                            Original: {item.originalQty}
                          </div>
                        </div>
                      </div>

                      {/* Footer Simplificado */}
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Atualizado: {item.updatedAt}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.itemQty !== item.originalQty
                            ? 'bg-yellow-400/20 text-yellow-400'
                            : 'bg-emerald-400/20 text-emerald-400'
                            }`}>
                            {item.itemQty !== item.originalQty ? 'ALTERADO' : 'ORIGINAL'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Botão Fixo */}
          <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50">
            <button
              onClick={handleSaveStepOne}
              disabled={caixaStatusBoolean || !houveAlteracao}
              className={`flex items-center space-x-2 px-6 py-2.5 lg:px-6 lg:py-3 rounded-xl font-semibold shadow-2xl transition-all duration-300 transform hover:scale-105 
                         ${caixaStatusBoolean || !houveAlteracao
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white'
                }`}
            >
              <Save size={16} className="lg:w-4 lg:h-4" />
              <span className="text-xs lg:text-base whitespace-nowrap">Salvar Alterações</span>
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center w-full min-h-[100vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
              <Package size={32} className="text-slate-500" strokeWidth={1.5} />
            </div>
            <p className="text-lg text-slate-300 mb-2">Caixa não encontrada</p>
            <p className="text-sm text-slate-500">Não há dados para os parâmetros pesquisados.</p>
          </div>
        </div>
      )
      }
      {/* Modal de Confirmação */}
      {openModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex flex-col justify-center items-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-slate-800 border border-slate-700 p-4 rounded-2xl shadow-2xl w-full max-w-[320px] flex flex-col items-center justify-center"
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
              {modalType === 'confirm' && <AlertTriangle size={48} className="text-orange-400" />}
              {modalType === 'success' && <Package size={48} className="text-emerald-400" />}
              {modalType === 'error' && <AlertTriangle size={48} className="text-red-400" />}
              {modalType === 'exclusao' && <Package size={48} className="text-blue-400" />}
            </motion.div>

            <div className="flex flex-col text-center w-full items-center justify-center">
              <h2 className="text-base font-bold text-slate-200 mb-3">
                {modalType === 'confirm' && 'Alteração de Caixa'}
                {modalType === 'success' && 'Sucesso'}
                {modalType === 'error' && 'Erro'}
                {modalType === 'exclusao' && 'Caixa Excluída'}
              </h2>
              <p className="text-slate-300 text-xs mb-2 leading-relaxed">
                {msg}
              </p>
              <p className="text-slate-400 text-xs mb-4">
                {msg1}
              </p>

              <div className="flex flex-col w-full items-center justify-center gap-2">
                {modalType === 'confirm' ? (
                  <>
                    <button
                      onClick={handleSaveStepTwo}
                      className="w-full h-10 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <Save size={14} />
                      <span className="text-xs">Confirmar</span>
                    </button>
                    <button
                      onClick={handleSaveStepOne}
                      className="w-full h-10 px-3 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <X size={14} />
                      <span className="text-xs">Cancelar</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleSaveStepOne}
                    className={`w-full h-10 px-3 font-medium rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 ${modalType === 'success' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' :
                      modalType === 'error' ? 'bg-red-600 hover:bg-red-500 text-white' :
                        modalType === 'exclusao' ? 'bg-blue-600 hover:bg-blue-500 text-white' :
                          'bg-slate-600 hover:bg-slate-500 text-white'
                      }`}
                  >
                    <Package size={14} />
                    <span className="text-xs">OK</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </PageWithDrawer>
  );
}
