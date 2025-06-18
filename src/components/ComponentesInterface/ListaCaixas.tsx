'use client'

import React from 'react';
import CaixaCard from './CaixaCard'; 
import { Caixa } from '../../../core';

interface ListaCaixasProps {
  caixas: Caixa[];
  tema: boolean;
}

const ListaCaixas = ({ caixas, tema }: ListaCaixasProps) => {
  return (
    <div className="flex flex-col gap-y-8 gap-x-5 items-start justify-start min-h-[80vh] w-full">
      {caixas.map((caixa, index) => (
        <CaixaCard key={index} caixa={caixa} tema={tema} len={caixas.length} />
      ))}
    </div>
  );
};

export default ListaCaixas;
