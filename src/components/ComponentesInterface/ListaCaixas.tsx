'use client'

import React, { useEffect } from 'react';
import CaixaCard from './CaixaCard';
import { Caixa } from '../../../core';

interface ListaCaixasProps {
  caixas: Caixa[];
  tema: boolean;  
  setTotalGrade?: (n: number, n1: number) => void;  
}

const ListaCaixas = ({ caixas, tema, setTotalGrade }: ListaCaixasProps) => {

  useEffect(() => {
    const total = caixas.reduce((acc, caixa) => acc + (caixa.qtyCaixa || 0), 0);
    const totalItems = caixas.reduce((accCaixas, caixa) => {
      const totalItens = caixa.caixaItem?.reduce((accItens, item) => accItens + (item.itemQty || 0), 0) || 0;
      return accCaixas + totalItens;
    }, 0);
    setTotalGrade!(total, totalItems);
  }, [caixas, setTotalGrade]);

  return (
    <div className="flex flex-col gap-y-8 gap-x-5 items-start justify-start min-h-[80vh] w-full">
      {caixas.map((caixa, index) => (
        <CaixaCard key={index} caixa={caixa} tema={tema} len={caixas.length} />
      ))}
    </div>
  );
};

export default ListaCaixas;
