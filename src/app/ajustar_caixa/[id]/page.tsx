'use client';

import IsLoading from '@/components/ComponentesInterface/IsLoading';
import TitleComponentFixed from '@/components/ComponentesInterface/TitleComponentFixed';
import { getCaixaParaAjuste, modificarCaixa } from '@/hooks_api/api';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AlertTriangle } from 'react-feather';
import { CaixaAjuste } from '../../../../core';
import { padStart } from 'pdf-lib';

type ItemComOriginalQty = CaixaAjuste['itens'][number] & {
  originalQty: number;
};

const fechBoxAjust = async (box: CaixaAjuste): Promise<CaixaAjuste | null> => {
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
          setCaixaStatusBoolean(caixaData.status === 'PRONTA' ? false : true);
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

  const handleChange = (index: number, rawValue: number, status: string) => {
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
        setMsg(`DESEJA MESMO ALTERAR AS QUANTIDADES DA CAIXA DE ID ${id} ?`);
        setMsg1('A OPERAÇÃO NÃO PODERÁ SER REVERTIDA');
        setOpenModal(!openModal);
        clearTimeout(time);
      }, 1500);

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
        const refreshedBox = await getCaixaParaAjuste(String(newBox.id));

        if (refreshedBox) {
          setItensComOriginal(
            refreshedBox.itens.map(item => ({
              ...item,
              originalQty: item.itemQty,
            }))
          );

          setCaixa({ ...refreshedBox });
          setCaixaStatusBoolean(refreshedBox.status === 'PRONTA' ? false : true);

          setMsg('CAIXA ALTERADA COM SUCESSO!');
          setMsg1('CONFIRA AS QUANTIDADES');
        } else {
          setMsg('ERRO AO ATUALIZAR A CAIXA!');
          setMsg1('NÃO FOI POSSÍVEL CARREGAR A CAIXA ATUALIZADA');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar a caixa:', error);
      setMsg('OCORREU UM ERRO DURANTE A ATUALIZAÇÃO!');
      setMsg1('TENTE NOVAMENTE MAIS TARDE');
    } finally {
      const timeOut = setTimeout(() => {
        setMsg(`DESEJA MESMO ALTERAR AS QUANTIDADES DA CAIXA DE ID ${id} ?`);
        setMsg1('A OPERAÇÃO NÃO PODERÁ SER REVERTIDA');
        setOpenModal(!openModal);
        clearTimeout(timeOut);
      }, 1500);
    }
  };

  const houveAlteracao = itensComOriginal.some(item => item.itemQty !== item.originalQty);

  const cursor = caixaStatusBoolean || !houveAlteracao ? 'cursor-not-allowed' : '';

  const colorStatus = caixa?.status === 'EXPEDIDA' ? 'text-emerald-500' : caixa?.status === 'DESPACHADA' ? 'text-blue-500' : '';

  const totalQuantidade = itensComOriginal.reduce((sum, item) => sum + item.itemQty, 0);

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-[82vh]">
          <IsLoading />
        </div>
      ) : caixa ? (
        <div className="flex flex-col min-h-screen bg-[#181818] p-4">
          {/* Cabeçalho fixo */}
          <TitleComponentFixed
            stringOne="AJUSTANDO CAIXA"
            twoPoints=":"
            stringTwo={`${id}`}
          />

          {/* Cabeçalho */}
          <div className="flex flex-row p-3 mt-14 bg-zinc-700 bg-opacity-30 rounded-md mx-3 text-[17px] font-light uppercase">
            <div className="flex items-end justify-center flex-col w-1/2 text-zinc-500">
              <span className="pr-3">Projeto:</span>
              <span className="pr-3">Escola:</span>
              <span className="pr-3">Nº Escola:</span>
              <span className="pr-3">Grade Id:</span>
              <span className="pr-3">Nº Caixa:</span>
              <span className="pr-3">Quant. na caixa:</span>
              <span className="pr-3">Status da caixa:</span>
            </div>
            <div className="flex items-start justify-center flex-col w-1/2 text-zinc-300">
              <span className="pl-3">{caixa.projeto}</span>
              <span className="pl-3">{caixa.escola}</span>
              <span className="pl-3">{caixa.escolaNumero}</span>
              <span className="pl-3">{caixa.gradeId}</span>
              <span className="pl-3">{caixa.caixaNumber}</span>
              <span className="pl-3">{caixa.qtyCaixa}</span>
              <span className={`pl-3 ${colorStatus}`}>{caixa.status}</span>
            </div>
          </div>

          {/* Lista de Itens */}
          <div className="flex flex-col p-3 w-full">
            <table className="w-full border border-gray-700 text-sm uppercase">
              <thead>
                <tr className="bg-zinc-700 text-zinc-300 text-left">
                  <th className="p-2 border border-gray-600 w-[38%]">Item</th>
                  <th className="p-2 border border-gray-600 text-right w-[12%]"></th>
                  <th className="p-2 border border-gray-600 w-[12%]">Quantidade</th>
                  <th className="p-2 border border-gray-600 w-[38%] pl-24">Última atualização</th>
                </tr>
              </thead>
              <tbody>
                {itensComOriginal.map((item, idx) => (
                  <tr key={item.id} className="border-t border-gray-800 text-sm">
                    <td className="p-2 border border-gray-700">{item.itemName}</td>
                    <td className="p-2 border border-gray-700 text-right font-normal text-zinc-400 text-[17px] bg-gradient-to-l from-zinc-300/15 to-transparent">
                      <span>TAM: </span>
                      <span className="text-cyan-500">{item.itemTam}</span>
                    </td>
                    <td className="p-2 border border-gray-700">
                      <input
                        disabled={caixaStatusBoolean}
                        type="number"
                        min={0}
                        value={item.itemQty}
                        onChange={(e) =>
                          handleChange(idx, parseInt(e.target.value || '0', 10), caixa.status)
                        }
                        onBlur={() => handleInputBlur(idx)}
                        className={`border px-2 py-1 w-full h-[35px] rounded text-[17px] font-normal 
                                    ${item.itemQty !== item.originalQty ? 'border-cyan-400 text-cyan-400' : 'border-[#8d8d8d] text-emerald-500'} 
                                   bg-[#444444] outline-2 focus:outline focus:outline-emerald-500`}
                      />
                    </td>
                    <td className="p-2 border border-gray-700 pl-24 text-zinc-400">{item.updatedAt}</td>
                  </tr>
                ))}
                <tr className="bg-zinc-700 text-zinc-300 text-left">
                  <td className="p-2 border border-gray-600"></td>
                  <td className="p-2 border border-gray-600 text-right text-[17px]">Total da caixa:</td>
                  <td className="p-2 border border-gray-600 lowercase">
                    <span className="text-yellow-500 text-[17px]">{totalQuantidade}</span>
                    {totalQuantidade > 1 ? ' unidades' : ' unidade'}
                  </td>
                  <td className="p-2 border border-gray-600 pl-24"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Botão fixo */}
          <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50">
            <button
              onClick={handleSaveStepOne}
              disabled={caixaStatusBoolean || !houveAlteracao}
              className={`"bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-500 bg-slate-600 shadow-xl uppercase ${cursor}`}
            >
              Salvar alterações
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-[82vh]">
          <p className="text-lg text-zinc-400">NÃO HÁ DADOS PARA OS PARÂMETROS PESQUISADOS.</p>
        </div>
      )
      }
      {openModal && (
        <div className={`fixed inset-0 z-50 bg-[#181818] bg-opacity-80 min-h-[105vh]
                lg:min-h-[100vh] flex flex-col pt-10
                justify-center items-center p-4`}>

          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white p-8 rounded-md shadow-md min-w-[30%] min-h-[300px]
                        flex flex-col items-center justify-center max-w-[800px]"
          >
            <div>
              <AlertTriangle size={65} color={`rgba(255, 0, 0, 1)`} />
            </div>
            <div className={`flex flex-col text-black w-full items-center justify-center pt-6`}>
              <h2 className={`text-[35px] font-bold`}>{`ALTERAÇÃO DE CAIXA`}</h2>
              <span className={`text-[17px] font-bold`}>{msg}</span>
              <span className={`text-[17px] font-bold`}>{msg1}</span>
              <div className={`flex flex-row pt-8 gap-x-6`}>
                <button
                  onClick={handleSaveStepTwo}
                  className={`px-4 py-2 bg-green-500 text-white rounded-md min-w-[200px] hover:bg-green-400 cursor-pointer`}
                >
                  {"AJUSTAR"}
                </button>
                <button
                  onClick={handleSaveStepOne}
                  className={`px-4 py-2 bg-red-500 text-white rounded-md min-w-[200px] hover:bg-red-400 cursor-pointer`}
                >
                  {"CANCELAR"}
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
