'use client'

import React, { useEffect } from 'react';
import CaixaCard from './CaixaCard';
import { Caixa } from '../../../core';

interface ListaCaixasProps {
  caixas: Caixa[];
  setTotalGrade?: (n: number, n1: number) => void;  
}

const ListaCaixas = ({ caixas, setTotalGrade }: ListaCaixasProps) => {

  useEffect(() => {
    const total = caixas.reduce((acc, caixa) => acc + (caixa.qtyCaixa || 0), 0);
    const totalItems = caixas.reduce((accCaixas, caixa) => {
      const totalItens = caixa.caixaItem?.reduce((accItens, item) => accItens + (item.itemQty || 0), 0) || 0;
      return accCaixas + totalItens;
    }, 0);
    setTotalGrade!(total, totalItems);
  }, [caixas, setTotalGrade]);

  // Ordenar caixas do maior para o menor número
  const caixasOrdenadas = [...caixas].sort((a, b) => {
    const numA = parseInt(a.caixaNumber || '0');
    const numB = parseInt(b.caixaNumber || '0');
    return numB - numA; // Ordem decrescente (maior para menor)
  });

  return (
    <div className="w-full space-y-4">
      {caixasOrdenadas.map((caixa, index) => (
        <div
          key={index}
          className="animate-fade-in"
          style={{
            animationDelay: `${index * 50}ms`,
            animationFillMode: 'both'
          }}
        >
          <CaixaCard caixa={caixa} len={caixas.length} />
        </div>
      ))}
    </div>
  );
};

export default ListaCaixas;
