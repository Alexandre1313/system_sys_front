'use client'

import { useEffect, useState } from 'react';
import { getProjectsSimp } from "@/hooks_api/api";

interface ProjectSelectProps {
  onSelectChange: (projectId: number) => void;
  color?: boolean;
}

export default function ProjectSelect({ onSelectChange }: ProjectSelectProps) {
  const [projetos, setProjetos] = useState<{ id: number; nome: string }[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getProjectsSimp();
      setProjetos(data);
    };

    fetchProjects();
  }, []);

  return (
    <select
      id="select-projeto"
      title="Selecione o projeto"
      className="w-full bg-slate-700/50 border border-slate-600 text-slate-300 rounded-lg px-3 py-2 text-xs lg:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
      onChange={(event) => {
        const projectId = Number(event.target.value);
        onSelectChange(projectId);
      }}
    >
      <option value="">Selecione o Projeto</option>
      {projetos.map((projeto) => (
        <option key={projeto.id} value={projeto.id}>
          {projeto.nome}
        </option>
      ))}
      <option value={"-1"}>Todos os Projetos</option>
    </select>
  );
}
