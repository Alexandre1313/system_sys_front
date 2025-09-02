import { ChangeEvent } from 'react';
import { Embalagem } from '../../../core';

interface SelectedEntriesEmbProps { 
  onSelectChangeEmb: (embalagem: Embalagem | null | undefined) => void;
  embalagens: Embalagem[] | null | undefined; 
}

export default function SelectedEntriesEmb({ onSelectChangeEmb, embalagens}: SelectedEntriesEmbProps) {
  // Função de alteração de seleção
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const embalagemId = Number(event.target.value);
    const embSelect: Embalagem | null | undefined = embalagens!.find(e => e.id === embalagemId)
    onSelectChangeEmb(embSelect);   
  };

  return (
    <div className="flex flex-col gap-y-2 w-full">
      <label htmlFor="embalagem-select" className="text-slate-400 text-xs lg:text-sm font-medium">
        EMBALADOR
      </label>
      <select
        id="embalagem-select"
        className="w-full h-10 lg:h-12 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 px-3 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 cursor-pointer"
        onChange={handleChange}
      >
        <option value="">SELECIONE O EMBALADOR</option> 
        {embalagens?.map((embalagem) => (
          <option key={embalagem.id} value={embalagem.id}>
            {embalagem.nome}
          </option>
        ))}     
      </select>
    </div>
  );
}
