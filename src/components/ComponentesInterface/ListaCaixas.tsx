'use client'

import React from 'react';
import CaixaCard from './CaixaCard'; // ou o caminho relativo correto
import { Caixa } from '../../../core';

interface ListaCaixasProps {
    caixas: Caixa[];
    tema: boolean;
}

const ListaCaixas = ({ caixas, tema }: ListaCaixasProps) => {
  return (
    <div className={`flex flex-row flex-wrap gap-y-1 gap-x-5 items-start justify-center min-h-[80vh] w-full`}>
      {caixas.length === 0 ? (
        <p className={`text-center text-sm mt-10 ${tema ? 'text-zinc-600' : 'text-zinc-400'}`}>
          Nenhuma caixa encontrada para a grade de id 000.
        </p>
      ) : (
        caixas.map((caixa, index) => (
          <CaixaCard key={index} caixa={caixa} tema={tema} />
        ))
      )}
    </div>
  );
};

export default ListaCaixas;
