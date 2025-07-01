'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getCaixaParaAjuste } from '@/hooks_api/api';
import CaixaAjuste from '../../../../core/interfaces/CaixaAjuste';
import TitleComponentFixed from '@/components/ComponentesInterface/TitleComponentFixed';

const fechCaixa = async (id: string): Promise<CaixaAjuste | null> => {
  const caixa = await getCaixaParaAjuste(id);
  return caixa;
};

export default function AjustarCaixa() {
  const { id } = useParams();
  const [caixa, setCaixa] = useState<CaixaAjuste | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const caixa = await fechCaixa(String(id));
      setCaixa(caixa);
    };
    fetchData();
  }, [id]);

  const handleChange = (index: number, value: number) => {
    if (caixa) {
      const newItens = [...caixa.itens];
      newItens[index].itemQty = value;
      setCaixa({ ...caixa, itens: newItens });
      console.log(caixa)
    }
  };

  const handleSave = async () => {
    alert('Quantidade atualizada com sucesso!');
  };

  return (
    <div className={`flex flex-col min-h-screen bg-[#181818]`}>
      {/* Cabeçalho fixo */}
      <TitleComponentFixed
        stringOne="AJUSTANDO CAIXA"
        twoPoints=":"
        stringTwo={`${id}`}
      />

      {/* Cabeçalho */}
      <div className="p-4 mt-14 bg-black rounded-b-xl shadow-md">
        <h2 className="text-2xl font-bold mb-1">{caixa?.escola}</h2>
        <p className="text-sm text-gray-300">
          Projeto: <span className="font-semibold">{caixa?.projeto}</span> | Nº da Caixa:{' '}
          <span className="font-semibold">{caixa?.caixaNumber}</span>
        </p>
      </div>

      {/* Lista de Itens */}
      <div className="flex-1 p-4">
        <table className="w-full border border-gray-700 text-sm uppercase">
          <thead>
            <tr className="bg-gray-700 text-gray-100 text-left">
              <th className="p-2 border border-gray-600 w-[38%]">Item</th>
              <th className="p-2 border border-gray-600 text-right w-[12%]">Tamanho</th>
              <th className="p-2 border border-gray-600 w-[12%]">Qtd</th>
              <th className="p-2 border border-gray-600 w-[38%] pl-24">Última atualização</th>
            </tr>
          </thead>
          <tbody>
            {caixa?.itens.map((item, idx) => (
              <tr key={item.id} className="border-t border-gray-800 text-[17px]">
                <td className="p-2 border border-gray-700">{item.itemName}</td>
                <td className="p-2 border border-gray-700 text-right">{item.itemTam}</td>
                <td className="p-2 border border-gray-700">
                  <input
                    type="number"
                    value={item.itemQty}
                    onChange={(e) => handleChange(idx, parseInt(e.target.value))}
                    className="border px-2 py-1 w-[100%] bg-[#b6b6b6] h-[50px] text-black rounded"
                    min={0}
                  />
                </td>
                <td className="p-2 border border-gray-700 pl-24">{item.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botão fixo */}
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={handleSave}
          className="bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-500 shadow-xl uppercase"
        >
          Salvar alterações
        </button>
      </div>
    </div>
  );
}
