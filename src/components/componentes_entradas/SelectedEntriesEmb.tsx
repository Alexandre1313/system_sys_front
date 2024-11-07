import { ChangeEvent } from 'react';

interface SelectedEntriesEmbProps { 
  onSelectChange?: (projectId: number) => void;
}

export default function SelectedEntriesEmb({ onSelectChange }: SelectedEntriesEmbProps) {
  // Função de alteração de seleção
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const projectId = Number(event.target.value);
    //onSelectChange(projectId);
  };

  return (
     <div className={`flex flex-col gap-y-1 w-full`}>
      <label htmlFor="" className={`text-[15px] text-zinc-700`}>EMBALADOR</label>
      <select
        className={`flex w-full bg-zinc-900 p-2 text-lg border rounded-md text-zinc-400 border-zinc-700 outline-none cursor-pointer`}
      
        onChange={handleChange}>
        <option value="">SELECIONE O EMBALADOR</option>       
      </select>
    </div>
  );
}
