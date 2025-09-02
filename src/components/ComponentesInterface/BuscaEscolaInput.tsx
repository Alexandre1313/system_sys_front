'use client';

import { Search } from 'react-feather';
import React, { useState, useEffect, memo, useRef } from 'react';

interface BuscaEscolaInputProps {
  buscaEscola: string;
  setBuscaEscola: (valor: string) => void;
  onBuscar: () => void;
}

const BuscaEscolaInput: React.FC<BuscaEscolaInputProps> = ({ buscaEscola, setBuscaEscola, onBuscar }) => {
  const [localValue, setLocalValue] = useState(buscaEscola);
  const botaoBuscarRef1 = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const delay = setTimeout(() => {
      setBuscaEscola(localValue);
    }, 400); // delay de 400ms para evitar atualização em tempo real

    return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValue]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {     
        if (event.key === 'Enter') {
          botaoBuscarRef1.current?.click();
        }      
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [localValue]);

  return (
    <div className="relative w-full">
      <button
        className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer hover:bg-slate-600/50 rounded-full p-1 transition-colors duration-200"
        type="button"
        onClick={onBuscar}
        ref={botaoBuscarRef1}
      >
        <Search          
          color="#9ca3af"
          size={16}
          className="hover:text-slate-300 transition-colors duration-200"
          strokeWidth={2}         
        />
      </button>
      <input
        type="text"
        placeholder="Buscar escola..."
        className="w-full bg-slate-700/50 border border-slate-600 text-slate-300 rounded-lg pl-10 pr-3 py-2 text-xs lg:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 placeholder:text-slate-400"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value.toLowerCase())}
      />
    </div>
  );
};

export default memo(BuscaEscolaInput);
