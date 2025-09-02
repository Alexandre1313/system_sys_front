import { getProjectsSimp } from "@/hooks_api/api";

interface CreateServerSelectComponentProjectsProps {
  onSelectChange: (projectId: number) => void;
}

export async function CreateServerSelectComponentProjects({ onSelectChange }: CreateServerSelectComponentProjectsProps) {
  const projetos = await getProjectsSimp();

  return (
    <div className="flex flex-col gap-y-2 w-full">     
      <label htmlFor="projeto-select" className="text-slate-400 text-xs lg:text-sm font-medium">
        PROJETOS
      </label>
      <select
        id="projeto-select"
        title="Selecione o projeto"
        className="w-full h-10 lg:h-12 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 px-3 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 cursor-pointer"
        onChange={(event) => {
          const projectId = Number(event.target.value);
          onSelectChange(projectId); // Chama o manipulador ao mudar a seleção
        }}
      >
        <option value="">SELECIONE O PROJETO</option>
        {projetos.map((projeto) => (
          <option key={projeto.id} value={projeto.id}>
            {projeto.nome}
          </option>
        ))}
      </select>
    </div>
  );
}
