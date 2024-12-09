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

  return (
    <div className="p-6 flex flex-col w-full gap-y-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-zinc-500">{stockRender.nome}</h1>
      {stockRender.itens.map((item, index) => (
        <div key={index} className="mb-8 flex flex-col mt-[-20px]">
          <h2 className="text-xl font-semibold mb-4 text-zinc-400">
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
                  className={tamanho.estoque < 0 ? 'text-red-500 font-semibold' : tamanho.estoque === 0 ? 'text-zinc-400 font-semibold': 'text-green-500 font-semibold'}
                >
                  <td className=" text-zinc-400 px-4 py-2 border border-zinc-700 w-[25%]">{tamanho.tamanho}</td>
                  <td className="px-4 py-2 border border-zinc-700 w-[25%]">{tamanho.estoque}</td>
                  <td className="text-blue-500 px-4 py-2 border border-zinc-700 w-[25%]">{tamanho.entradas}</td>
                  <td className="text-yellow-600 px-4 py-2 border border-zinc-700 w-[25%]">{tamanho.saidas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );  
};
