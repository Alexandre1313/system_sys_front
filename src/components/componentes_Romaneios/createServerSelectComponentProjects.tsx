import { getProjectsSimp } from "@/hooks_api/api";

interface CreateServerSelectComponentProjectsProps {
  onSelectChange: (projectId: number) => void;
}

export async function CreateServerSelectComponentProjects({ onSelectChange }: CreateServerSelectComponentProjectsProps) {
  const projetos = await getProjectsSimp();

  return (
    <div className={`flex flex-col justify-center items-start`}>     
      <select
        id="select-projeto"
        className={`flex w-[310px] bg-[#181818] py-2 px-3 text-[14px] text-zinc-400 no-arrow
                        outline-none cursor-pointer h-[35px] border border-zinc-800`}
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
