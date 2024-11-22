import { getProjectsSimp } from "@/hooks_api/api";

interface CreateServerSelectComponentProjectsProps {
  onSelectChange: (projectId: number) => void;
}

export async function CreateServerSelectComponentProjects({ onSelectChange }: CreateServerSelectComponentProjectsProps) {
  const projetos = await getProjectsSimp();

  return (
    <div className={`flex flex-col justify-center items-start gap-y-1 w-[350px]`}>     
      <select
        id="select-projeto"
        className={`flex w-full bg-zinc-900 p-2 text-lg text-zinc-400 outline-none cursor-pointer`}
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
