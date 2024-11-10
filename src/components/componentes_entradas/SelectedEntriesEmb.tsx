import { ChangeEvent } from 'react';
import { Embalagem } from '../../../core';

interface SelectedEntriesEmbProps { 
  onSelectChangeEmb: (embalagemId: number) => void;
  embalagens: Embalagem[] | undefined; 
}

export default function SelectedEntriesEmb({ onSelectChangeEmb, embalagens}: SelectedEntriesEmbProps) {
  // Função de alteração de seleção
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const embalagemId = Number(event.target.value);
    onSelectChangeEmb(embalagemId);   
  };

  return (
     <div className={`flex flex-col gap-y-1 w-full`}>
      <label htmlFor="" className={`text-[15px] text-zinc-700`}>EMBALADOR</label>
      <select
        className={`flex w-full bg-zinc-900 p-2 text-lg border rounded-md text-zinc-400
                    border-zinc-700 outline-none cursor-pointer`}      
        onChange={handleChange}>
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
