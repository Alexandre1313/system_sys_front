import { ChangeEvent } from 'react';
import { ProjetosSimp } from '../../../core';

interface SelectProjetoProps {
  projetos: ProjetosSimp[] | undefined;
  onSelectChange: (projectId: number) => void;
}

export default function SelectedEntries({ projetos, onSelectChange }: SelectProjetoProps) {
  // Função de alteração de seleção
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const projectId = Number(event.target.value);
    onSelectChange(projectId);
  };

  return (
    <div className="flex flex-col gap-y-2 w-full">
      <label htmlFor="projeto-select" className="text-slate-400 text-xs lg:text-sm font-medium">
        PROJETOS
      </label>
      <select
        id="projeto-select"
        className="w-full h-10 lg:h-12 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 px-3 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 cursor-pointer"
        onChange={handleChange}
      >
        <option value="">SELECIONE O PROJETO</option>
        {projetos?.map((projeto) => (
          <option key={projeto.id} value={projeto.id}>
            {projeto.nome}
          </option>
        ))}
      </select>
    </div>
  );
}
