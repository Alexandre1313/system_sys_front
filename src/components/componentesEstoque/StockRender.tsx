import React from 'react';
import { ProjetoStockItems } from '../../../core';
import { getProjectsItemsSaldos } from '@/hooks_api/api';

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
    (sum, item) => sum + item.tamanhos.reduce((subSum, tamanho) => subSum + tamanho.estoque, 0),
    0
  );
  const totalGeralEntradas = stockRender.itens.reduce(
    (sum, item) => sum + item.tamanhos.reduce((subSum, tamanho) => subSum + tamanho.entradas, 0),
    0
  );
  const totalGeralSaidas = stockRender.itens.reduce(
    (sum, item) => sum + item.tamanhos.reduce((subSum, tamanho) => subSum + tamanho.saidas, 0),
    0
  );

  return (
    <div className="p-6 flex flex-col w-full gap-y-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-zinc-500">{stockRender.nome}</h1>

      {/* Tabela de somatório geral */}
      <table className="sticky top-28 min-w-full border-collapse border border-zinc-700 mb-8">
        <thead>
          <tr className="bg-[#1f1f1f] text-zinc-500 border-b border-zinc-700">
            <th className="px-4 py-2 text-left border-r border-zinc-700 w-[25%]">Contraprova</th>
            <th className="px-4 py-2 text-left border-r border-zinc-700 w-[25%]">Estoque</th>
            <th className="px-4 py-2 text-left border-r border-zinc-700 w-[25%]">Entradas</th>
            <th className="px-4 py-2 text-left w-[25%]">Saídas</th>
          </tr>
        </thead>
        <tbody>
          <tr className="font-bold bg-zinc-800 text-zinc-200">
            <td className="px-4 py-2 border font-extralight text-yellow-400 tracking-[1px] text-[20px] border-zinc-700 w-[25%]">{Math.abs(totalGeralEstoque + totalGeralEntradas)}</td>
            <td className="px-4 py-2 border font-extralight tracking-[1px] text-[20px] border-zinc-700 w-[25%]">{totalGeralEstoque}</td>
            <td className="px-4 py-2 border font-extralight tracking-[1px] text-[20px] border-zinc-700 w-[25%]">{totalGeralEntradas}</td>
            <td className="px-4 py-2 border font-extralight tracking-[1px] text-[20px] border-zinc-700 w-[25%]">{totalGeralSaidas}</td>
          </tr>
        </tbody>
      </table>

      {/* Renderização de tabelas individuais */}
      {stockRender.itens.map((item, index) => {
        const totalEstoque = item.tamanhos.reduce((sum, tamanho) => sum + tamanho.estoque, 0);
        const totalEntradas = item.tamanhos.reduce((sum, tamanho) => sum + tamanho.entradas, 0);
        const totalSaidas = item.tamanhos.reduce((sum, tamanho) => sum + tamanho.saidas, 0);

        return (
          <div key={index} className="mb-8 flex flex-col mt-[-20px]">
            <h2 className="text-xl font-semibold mb-4 text-orange-600">
              {item.nome} ({item.genero})
            </h2>
            <table className="min-w-full border-collapse border border-zinc-700">
              <thead>
                <tr className="bg-[#1f1f1f] text-zinc-500 border-b border-zinc-700">
                  <th className="px-4 py-2 text-left border-r border-zinc-700 w-[25%]">Tamanho</th>
                  <th className="px-4 py-2 text-left border-r border-zinc-700 w-[25%]">Estoque</th>
                  <th className="px-4 py-2 text-left border-r border-zinc-700 w-[25%]">Entradas</th>
                  <th className="px-4 py-2 text-left w-[25%]">Saídas</th>
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
                    <td className="text-zinc-400 px-4 py-2 border border-zinc-700 w-[25%]">{tamanho.tamanho}</td>
                    <td className="px-4 py-2 border border-zinc-700 w-[25%]">{tamanho.estoque}</td>
                    <td className="text-blue-500 px-4 py-2 border border-zinc-700 w-[25%]">{tamanho.entradas}</td>
                    <td className="text-yellow-600 px-4 py-2 border border-zinc-700 w-[25%]">{tamanho.saidas}</td>
                  </tr>
                ))}
                <tr className="font-bold bg-zinc-800 text-zinc-200">
                  <td className="px-4 py-2 border border-zinc-700 w-[25%]">Total</td>
                  <td className="px-4 py-2 border border-zinc-700 w-[25%]">{totalEstoque}</td>
                  <td className="px-4 py-2 border border-zinc-700 w-[25%]">{totalEntradas}</td>
                  <td className="px-4 py-2 border border-zinc-700 w-[25%]">{totalSaidas}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
