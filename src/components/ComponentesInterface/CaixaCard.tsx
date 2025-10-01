'use client'

import React, { useRef, useState, useEffect } from 'react';
import { ChevronDown, Package, Users, Calendar, FileText } from 'react-feather';
import { Caixa } from '../../../core';
import CaixaItem from '../../../core/interfaces/CaixaItem';
import { convertSPTime } from '../../../core/utils/tools';
import EtiquetasNew from '../componentesDePrint/EtiquetasNew';
import Link from 'next/link';

interface CaixaCardProps {
  caixa: Caixa;
  len: number;
}

const CaixaCard: React.FC<CaixaCardProps> = ({ caixa, len }) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const getStatusInfo = (status: string, updatedAt: string, createdAt: string) => {
    const statusConfig = {
      'DESPACHADA': {
        bg: 'bg-green-500/20',
        text: convertSPTime(updatedAt),
        title: 'Data de saída',
        color: 'text-green-400'
      },
      'EXPEDIDA': {
        bg: 'bg-yellow-500/20',
        text: 'Pendente para envio',
        title: 'Situação',
        color: 'text-yellow-400'
      },
      default: {
        bg: 'bg-slate-500/20',
        text: convertSPTime(createdAt),
        title: 'Grade criada em',
        color: 'text-slate-400'
      }
    };

    return statusConfig[status as keyof typeof statusConfig] || statusConfig.default;
  };

  const statusInfo = getStatusInfo(String(caixa.grade?.status), String(caixa.grade?.updatedAt), String(caixa.grade?.createdAt));

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg overflow-hidden">
      {/* Header da Caixa */}
      <div
        className="p-2 lg:p-4 cursor-pointer hover:bg-slate-700/30 transition-all duration-300"
        onClick={toggleOpen}
      >
        <div className="flex items-start justify-between">
          {/* Número da Caixa - Destaque Principal */}
          <div className="flex items-start space-x-2 lg:space-x-4 min-w-0 flex-1">
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-600 rounded-lg lg:rounded-xl p-1.5 lg:p-1 shadow-2xl border border-emerald-400/30 flex-shrink-0 min-w-[45px] lg:min-w-[100px]">
              <div className="text-[7px] lg:text-sm text-emerald-100 font-medium mt-0.5 lg:mt-1">
                CAIXA Nº
              </div>
              <div className="text-sm lg:text-3xl font-black text-white drop-shadow-lg">
                {caixa.caixaNumber?.padStart(2, '0')}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col space-y-0.5 lg:space-y-2">
                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-3">
                  <h3 className="text-xs lg:text-xl font-bold text-slate-200 truncate leading-tight">
                    {caixa.projeto}
                  </h3>
                  <span className="px-1.5 py-0.5 lg:px-3 lg:py-1 bg-slate-700/50 border border-slate-600 rounded text-[9px] lg:text-xs text-slate-300 w-fit mt-0.5 lg:mt-0">
                    Grade #{caixa.gradeId}
                  </span>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 text-[10px] lg:text-sm text-slate-400 space-y-0.5 lg:space-y-0">
                  <div className="flex items-center space-x-1 lg:space-x-2 min-w-0">
                    <Users size={10} className="lg:w-4 lg:h-4 flex-shrink-0" />
                    <span className="font-medium text-[10px] lg:text-sm truncate">{caixa.escolaCaixa}</span>
                  </div>
                  <div className="flex items-center space-x-1 lg:space-x-2">
                    <span className="text-slate-500 hidden lg:block">•</span>
                    <span className="text-slate-300 text-[10px] lg:text-sm">Escola #{caixa.escolaNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start space-y-1 lg:space-y-2 flex-shrink-0">
            {/* Estatísticas Rápidas */}
            <div className="text-center bg-slate-700/30 rounded-lg px-1.5 py-1 lg:px-3 lg:py-2 border border-slate-600">
              <div className="text-base lg:text-3xl font-bold text-emerald-400">{caixa.qtyCaixa}</div>
              <div className="text-[8px] lg:text-xs text-slate-400 font-medium">{caixa.qtyCaixa === 1 ? 'ITEM' : 'ITENS'}</div>
            </div>

            {/* Toggle */}
            <ChevronDown
              size={14}
              className={`lg:w-5 lg:h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
      </div>

      {/* Conteúdo Expansível */}
      <div
        ref={contentRef}
        style={{ maxHeight: contentHeight }}
        className="overflow-hidden transition-all duration-500 ease-in-out"
      >
        <div className="border-t border-slate-700 bg-slate-800/30">
          {/* Status da Grade */}
          <div className="px-4 py-3 border-b border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-slate-400" />
                <span className="text-sm text-slate-400">{statusInfo.title}:</span>
                <span className={`text-sm font-medium ${statusInfo.color}`}>
                  {statusInfo.text}
                </span>
              </div>
              <div className="text-xs text-slate-500">
                Expedidor: {caixa.usuario}
              </div>
            </div>
          </div>

          {/* Lista de Itens */}
          <div className="p-4">
            <div className="mb-3">
              <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center space-x-2">
                <FileText size={16} />
                <span>Itens da Caixa</span>
              </h4>
            </div>

            <div className="space-y-2">
              {caixa.caixaItem.map((item: CaixaItem, index: number) => (
                <div
                  key={`${item.id}-${index}`}
                  className="bg-slate-700/30 border border-slate-600 rounded-lg p-3 hover:bg-slate-700/50 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-1">
                        <span className="text-sm font-medium text-slate-200 break-words">
                          {item.itemName}
                        </span>
                        <span className="px-2 py-1 bg-slate-600/50 border border-slate-500 rounded text-xs text-slate-300 mt-1 sm:mt-0 w-fit">
                          {item.itemGenero}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs text-slate-400">
                        <span>Tamanho: {item.itemTam}</span>
                        <span className="mt-1 sm:mt-0">Data: {convertSPTime(String(item.updatedAt))}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold text-emerald-400">{item.itemQty}</div>
                      <div className="text-xs text-slate-400">unidades</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Botões de Ação */}
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/ajustar_caixa/${caixa.id}`}
                  target="_AJUSTE"
                  className="flex-1 bg-slate-700 hover:bg-slate-600 border border-slate-600
                   text-slate-300 font-medium py-3 px-4 rounded-lg transition-all duration-300
                    flex items-center justify-center space-x-2 hover:scale-100"
                >
                  <Package size={16} />
                  <span>AJUSTAR CAIXA</span>
                </Link>

                {/* Botão ETIQUETAS integrado no card */}
                <div className="flex-1">
                  {printEti([caixa], `flex-1 bg-slate-700 hover:bg-slate-600 border border-slate-600
                   text-slate-300 font-medium py-3 px-4 rounded-lg transition-all duration-300
                    flex items-center justify-center space-x-2 gap-x-3 hover:scale-100 w-full`)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaixaCard;
