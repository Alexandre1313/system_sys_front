'use client'

import React, { useRef, useState, useEffect } from 'react';
import { ChevronDown } from 'react-feather';
import { Caixa } from '../../../core';
import CaixaItem from '../../../core/interfaces/CaixaItem';
import { convertSPTime } from '../../../core/utils/tools';
import EtiquetasNew from '../componentesDePrint/EtiquetasNew';
import Link from 'next/link';

interface CaixaCardProps {
  caixa: Caixa;
  tema: boolean;
  len: number;
}

const CaixaCard: React.FC<CaixaCardProps> = ({ caixa, tema, len }) => {
  const [isOpen, setIsOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState('0px');

  const toggleOpen = () => {
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px');
    }
  }, [isOpen]);

  const printEti = (etiquetas: Caixa[], classnew: string) => {
    return (<EtiquetasNew etiquetas={etiquetas} classNew={classnew} len={len} />)
  }

  const bgHeader = tema ? 'bg-zinc-200 text-zinc-800' : 'bg-[#000] text-zinc-300';
  const bgBody = tema ? 'bg-white text-zinc-800' : 'bg-zinc-900 text-zinc-400';
  const borderColor = tema ? 'border-zinc-300' : 'border-zinc-700';
  const bgAlt = tema ? 'bg-zinc-100 text-zinc-800' : 'bg-zinc-800 text-zinc-300';
  const buttonClass = tema ? '' : 'hover:text-blue-500 flex justify-center items-center w-[100%] text-[11px] p-2';

  return (
    <div className={`w-full border ${borderColor} rounded-md shadow-md`}>
      {/* Cabeçalho da caixa */}
      <table className={`w-full border-collapse border ${borderColor} table-fixed text-md`}>
        <thead>
          <tr className={`${bgHeader} text-[16px]`}>
            <th className={`px-4 py-2 text-left border-r ${borderColor} w-[10%]`}>CAIXA Nº</th>
            <th className={`px-4 py-2 text-left border-r ${borderColor} w-[20%]`}>PROJETO / GRADE ID</th>
            <th className={`px-4 py-2 text-left border-r ${borderColor} w-[35%]`}>UNIDADE ESCOLAR</th>
            <th className={`px-4 py-2 text-left border-r ${borderColor} w-[20%]`}>EXPEDIDOR</th>
            <th className={`px-4 py-2 text-left border-r ${borderColor} w-[10%]`}>TOTAL ITENS</th>
            <th className={`px-0 py-0 text-center w-[5%] min-h-full`}> {printEti([caixa], buttonClass)}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            className={`${bgBody} cursor-pointer hover:bg-opacity-30 hover:bg-gray-500`}
            onClick={toggleOpen}
          >
            <td className={`px-4 py-2 border-t border-r ${borderColor} text-2xl text-cyan-700 font-semibold`}>
              {caixa.caixaNumber}
            </td>
            <td className={`px-4 py-2 border-t border-r ${borderColor}`}>{`${caixa.projeto} - GRADE ID ${caixa.gradeId}`}</td>
            <td className={`px-4 py-2 border-t border-r ${borderColor}`}>{`${caixa.escolaCaixa} (${caixa.escolaNumber})`}</td>
            <td className={`px-4 py-2 border-t border-r ${borderColor}`}>{caixa.usuario}</td>
            <td className={`text-yellow-500 px-4 py-2 border-t border-r ${borderColor}`}>{caixa.qtyCaixa}</td>
            <td className={`px-4 py-2 border-t text-center`}>
              <ChevronDown
                size={18}
                className={`inline transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Conteúdo com animação de expansão */}
      <div
        ref={contentRef}
        style={{ maxHeight: contentHeight }}
        className="overflow-hidden transition-all duration-700 ease-in-out"
      >
        <table className={`w-full border-collapse border-t ${borderColor} table-fixed text-sm`}>
          <thead>
            <tr className={`${bgAlt} text-[15px]`}>
              <th className={`px-4 py-2 text-right border-r ${borderColor} w-[60%]`}>Item</th>
              <th className={`px-4 py-2 text-left border-r ${borderColor} w-[10%]`}>Tamanho</th>
              <th className={`px-4 py-2 text-right border-r ${borderColor} w-[10%]`}>Quantidade</th>
              <th className={`px-4 py-2 text-left w-[20%]`}>Data da embalagem</th>
            </tr>
          </thead>
          <tbody>
            {caixa.caixaItem.map((item: CaixaItem, index: number) => (
              <tr
                key={`${item.id}-${index}`}
                className={`${index % 2 === 0 ? bgBody : bgAlt} hover:bg-emerald-800 hover:bg-opacity-10`}
              >
                <td className={`px-4 py-2 border-t border-r text-right ${borderColor}`}>{item.itemName}</td>
                <td className={`px-4 py-2 border-t border-r ${borderColor}`}>{item.itemTam}</td>
                <td className={`flex justify-start items-center px-4 py-2 border-t border-r ${borderColor}`}><span className={`flex pr-3 items-center justify-end text-emerald-500 text-[17px] w-[85%]`}>{item.itemQty}</span> un</td>
                <td className={`px-4 py-2 border-t ${borderColor}`}>{convertSPTime(String(item.updatedAt))}</td>
              </tr>
            ))}
            <tr>
              <td className={`px-4 py-2 border-t border-r ${borderColor}`}>{``}</td>
              <td className={`px-4 py-2 border-t border-r ${borderColor}`}>{``}</td>
              <td className={`px-4 py-2 border-t border-r ${borderColor}`}>{``}</td>
              <td className={`border-t text-center ${borderColor}`}>
                <Link
                  href={`/ajustar_caixa/${caixa.id}`}
                  target="_AJUSTE"
                  className="bg-slate-700 hover:bg-slate-600 text-white inline-block px-4 py-2 w-full"
                >
                  AJUSTAR CAIXA
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CaixaCard;
