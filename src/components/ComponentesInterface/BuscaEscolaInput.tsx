'use client';

import { Search } from 'react-feather';
import React, { useState, useEffect, memo, useRef } from 'react';

interface BuscaEscolaInputProps {
  tema: boolean;
  buscaEscola: string;
  setBuscaEscola: (valor: string) => void;
  onBuscar: () => void;
}

const BuscaEscolaInput: React.FC<BuscaEscolaInputProps> = ({ tema, buscaEscola, setBuscaEscola, onBuscar }) => {
  const [localValue, setLocalValue] = useState(buscaEscola);
  const botaoBuscarRef1 = useRef<HTMLButtonElement | null>(null);;

  useEffect(() => {
    const delay = setTimeout(() => {
      setBuscaEscola(localValue);
    }, 400); // delay de 400ms para evitar atualização em tempo real

    return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValue]);

  const colorInput = tema
    ? 'bg-[#F7F7F7] border-neutral-600 text-black placeholder:text-neutral-600'
    : 'bg-[#181818] border-neutral-600 text-white placeholder:text-neutral-400';

  const colorLupa = tema ? '#000' : '#ccc';

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
    <div className="relative flex w-[75%]">
      <button
        className="cursor-pointer"
        type="button"
        onClick={onBuscar}
        ref={botaoBuscarRef1}
      >
        <Search          
          color={colorLupa}
          size={21}
          className="rounded-full absolute left-3 top-1/3 transform -translate-y-1/2 pointer-events-auto hover:bg-emerald-700"
          strokeWidth={1}         
        />
      </button>
      <input
        type="text"
        placeholder="Busca..."
        className={`w-full mb-4 p-2 pl-12 rounded border focus:outline-none ${colorInput}`}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value.toLowerCase())}
      />
    </div>
  );
};

export default memo(BuscaEscolaInput);
