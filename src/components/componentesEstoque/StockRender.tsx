import React from 'react';
import { ProjetoStockItems } from '../../../core';
import { getProjectsItemsSaldos } from '@/hooks_api/api';
import { convertMilharFormat } from '../../../core/utils/tools';
import TitleComponentFixed from '../ComponentesInterface/TitleComponentFixed';

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

  const styleContraprova = contraprova ? 'text-green-400' : 'text-red-500';

  return (
    <div className="p-6 pt-4 flex flex-col w-full gap-y-10">
       <TitleComponentFixed stringOne={`MOVIMENTAÇÕES DO ESTOQUE`} twoPoints={`-`} stringTwo={stockRender.nome}/>
      {/*<h1 className="text-xl font-bold text-center mb-4 text-zinc-500">{`MOVIMENTAÇÕES DO PROJETO ${stockRender.nome}`}</h1>*/}

      {/* Tabela de somatório geral */}
      <div className={`sticky top-28 min-w-full border border-zinc-700 mb-2 bg-[#181818]`}>
        <table className="min-w-full border-collapse border border-zinc-700 bg-green-500 bg-opacity-10">
          <thead>
            <tr className="text-zinc-500 border-b border-zinc-700">
              <th className="px-4 py-2 text-left border-r border-zinc-700 w-[15%]"></th>
              <th className="px-4 py-2 text-left border-r border-zinc-700 w-[17%]"></th>
              <th className="px-4 py-2 text-left border-r border-zinc-700 w-[17%]"></th>
              <th className="px-4 py-2 text-left border-r border-zinc-700 w-[17%]"></th>
              <th className="px-4 py-2 text-left border-r border-zinc-700 w-[17%]">Entradas - totais</th>
              <th className="px-4 py-2 text-left w-[17%]">Saídas - Totais</th>
            </tr>
          </thead>
          <tbody>
            <tr className="font-bold text-zinc-200">
              <td className={`px-4 py-2 border font-extralight ${styleContraprova} tracking-[1px] text-[17px] border-zinc-700 w-[15%]`}>{''}</td>
              <td className="px-4 py-2 border font-extralight tracking-[1px] text-[20px] border-zinc-700 w-[17%]"></td>
              <td className="px-4 py-2 border font-extralight tracking-[1px] text-[20px] border-zinc-700 w-[17%]"></td>
              <td className="px-4 py-2 border font-extralight tracking-[1px] text-[20px] border-zinc-700 w-[17%]"></td>
              <td className="px-4 py-2 border font-extralight tracking-[1px] text-[20px] text-blue-500 border-zinc-700 w-[17%]">{convertMilharFormat(totalGeralEntradasAv + totalGeralEntradasKit)}</td>
              <td className="px-4 py-2 border font-extralight tracking-[1px] text-[20px] text-yellow-600 border-zinc-700 w-[17%]">{convertMilharFormat(totalGeralSaidasAv + totalGeralSaidasKit)}</td>
            </tr>
          </tbody>
        </table>
        <table className={`min-w-full border-collapse border border-zinc-700 bg-green-500 bg-opacity-10`}>
          <thead>
            <tr className=" text-zinc-500 border-b border-zinc-700">
              <th className="px-4 py-2 text-left border-r border-zinc-700 w-[15%]">Consistência</th>
              <th className="px-4 py-2 text-left border-r border-zinc-700 w-[17%]">Estoque</th>
              <th className="px-4 py-2 text-left border-r border-zinc-700 w-[17%]">Entradas Kits</th>
              <th className="px-4 py-2 text-left border-r border-zinc-700 w-[17%]">Entradas Avulsas</th>
              <th className="px-4 py-2 text-left border-r border-zinc-700 w-[17%]">Saídas Kits</th>
              <th className="px-4 py-2 text-left w-[17%]">Saídas Avulsas</th>
            </tr>
          </thead>
          <tbody>
            <tr className="font-bold text-zinc-200">
              <td className={`px-4 py-2 border font-extralight ${styleContraprova} tracking-[1px] text-[17px] border-zinc-700 w-[15%]`}>{contraprova ? 'OK' : 'NOT OK'}</td>
              <td className="px-4 py-2 border font-extralight tracking-[1px] text-[20px] border-zinc-700 w-[17%]">{totalGeralEstoque}</td>
              <td className="px-4 py-2 border font-extralight tracking-[1px] text-[20px] border-zinc-700 w-[17%]">{totalGeralEntradasKit}</td>
              <td className="px-4 py-2 border font-extralight tracking-[1px] text-[20px] border-zinc-700 w-[17%]">{totalGeralEntradasAv}</td>
              <td className="px-4 py-2 border font-extralight tracking-[1px] text-[20px] border-zinc-700 w-[17%]">{totalGeralSaidasKit}</td>
              <td className="px-4 py-2 border font-extralight tracking-[1px] text-[20px] border-zinc-700 w-[17%]">{totalGeralSaidasAv}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Renderização de tabelas individuais */}
      {stockRender.itens.map((item, index) => {
        const totalEstoque = item.tamanhos.reduce((sum, tamanho) => sum + tamanho.estoque, 0);
        const totalEntradasKit = item.tamanhos.reduce((sum, tamanho) => sum + tamanho.entradasKit, 0);
        const totalEntradasAv = item.tamanhos.reduce((sum, tamanho) => sum + tamanho.entradasAv, 0);
        const totalSaidasKit = item.tamanhos.reduce((sum, tamanho) => sum + tamanho.saidasKit, 0);
        const totalSaidasAv = item.tamanhos.reduce((sum, tamanho) => sum + tamanho.saidasAv, 0);

        return (
          <div key={index} className="mb-8 flex flex-col mt-[-20px]">
            <h2 className="text-xl font-semibold mb-4 text-orange-600">
              {item.nome} ({item.genero})
            </h2>
            <table className="min-w-full border-collapse border border-zinc-700">
              <thead>
                <tr className="bg-[#1f1f1f] text-zinc-500 border-b border-zinc-700">
                  <th className="px-4 py-2 text-left border-r border-zinc-700 w-[15%]">Tamanho</th>
                  <th className="px-4 py-2 text-left border-r border-zinc-700 w-[17%]">Estoque</th>
                  <th className="px-4 py-2 text-left border-r border-zinc-700 w-[17%]">Entradas Kits</th>
                  <th className="px-4 py-2 text-left border-r border-zinc-700 w-[17%]">Entradas Avulsas</th>
                  <th className="px-4 py-2 text-left border-r border-zinc-700 w-[17%]">Saídas Kits</th>
                  <th className="px-4 py-2 text-left w-[17%]">Saídas Avulsas</th>
                </tr>
              </thead>
              <tbody>
                {item.tamanhos.map((tamanho, idx) => (
                  <tr
                    key={idx}
                    className={
                      tamanho.estoque < 0
                        ? 'text-red-500 font-semibold hover:bg-green-600 hover:bg-opacity-10'
                        : tamanho.estoque === 0
                          ? 'text-zinc-400 font-semibold hover:bg-green-600 hover:bg-opacity-10'
                          : 'text-green-500 font-semibold hover:bg-green-600 hover:bg-opacity-10'
                    }
                  >
                    <td className="text-zinc-400 bg-[#1F1F1F] px-4 py-2 border border-zinc-700 w-[15%]">{tamanho.tamanho}</td>
                    <td className="px-4 py-2 border border-zinc-700 w-[17%]">{tamanho.estoque}</td>
                    <td className="text-blue-500 px-4 py-2 border border-zinc-700 w-[17%]">{tamanho.entradasKit}</td>
                    <td className="text-blue-500 px-4 py-2 border border-zinc-700 w-[17%]">{tamanho.entradasAv}</td>
                    <td className="text-yellow-600 px-4 py-2 border border-zinc-700 w-[17%]">{tamanho.saidasKit}</td>
                    <td className="text-yellow-600 px-4 py-2 border border-zinc-700 w-[17%]">{tamanho.saidasAv}</td>
                  </tr>
                ))}
                <tr className="font-bold bg-zinc-800 text-zinc-200">
                  <td className="px-4 py-2 border border-zinc-700 w-[15%]">Total</td>
                  <td className="px-4 py-2 border border-zinc-700 w-[17%]">{totalEstoque}</td>
                  <td className="px-4 py-2 border border-zinc-700 w-[17%]">{totalEntradasKit}</td>
                  <td className="px-4 py-2 border border-zinc-700 w-[17%]">{totalEntradasAv}</td>
                  <td className="px-4 py-2 border border-zinc-700 w-[17%]">{totalSaidasKit}</td>
                  <td className="px-4 py-2 border border-zinc-700 w-[17%]">{totalSaidasAv}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
