'use client'

import { useEffect, useState } from 'react';
import { getProjectsSimp } from "@/hooks_api/api";

interface ProjectSelectProps {
  onSelectChange: (projectId: number) => void;
  color?: boolean;
}

export default function ProjectSelect({ color, onSelectChange }: ProjectSelectProps) {
  const [projetos, setProjetos] = useState<{ id: number; nome: string }[]>([]);
  const newColor = color ? 'bg-[#f7f7f7] text-zinc-950' : 'bg-[#181818] text-zinc-400';

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getProjectsSimp();
      setProjetos(data);
    };

    fetchProjects();
  }, []);

  return (
    <div className="flex flex-col justify-center items-start">
      <select
        id="select-projeto"
        title="Selecione o projeto"
        className={`flex w-[310px] py-2 px-3 text-[14px] no-arrow ${newColor}
                        outline-none cursor-pointer h-[35px] border border-zinc-800`}
        onChange={(event) => {
          const projectId = Number(event.target.value);
          onSelectChange(projectId);
        }}
      >
        <option value="">SELECIONE O PROJETO</option>
        {projetos.map((projeto) => (
          <option key={projeto.id} value={projeto.id}>
            {projeto.nome}
          </option>
        ))}
        <option value={"-1"}>TODOS OS PROJETOS</option>
      </select>
    </div>
  );
}
