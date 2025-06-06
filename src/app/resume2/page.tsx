'use client'

import IsLoading from '@/components/ComponentesInterface/IsLoading';
import TitleComponentFixed from '@/components/ComponentesInterface/TitleComponentFixed';
import { CreateServerSelectComponentRemessa } from '@/components/componentesRomaneios/createServerSelectComponentRemessa';
import GradesFilter from '@/components/componentesRomaneios/GradesFiltter';
import { getFilterGrades } from '@/hooks_api/api';
import { useEffect, useState } from 'react';
import { GradesRomaneio } from '../../../core';
import { CreateServerSelectComponentProjectsResume } from '@/components/componentesRomaneios/createServerSelectComponentProjects.Resume';
import GradesFilterTable from '@/components/componentesRomaneios/GradesFiltterTable';

const fetcherGradesPStatus = async (projectId: number, remessa: number, status: string, tipo: string): Promise<GradesRomaneio[] | null> => {
  try {
    const resp = await getFilterGrades(String(projectId), String(remessa), status, tipo);
    return resp;
  } catch (error) {
    console.error("Erro ao buscar grades:", error);
    return null;
  }
};

export default function ConsultaStatusGrades() {
  const [projectId, setProjectId] = useState<number | null>(null);
  const [remessa, setRemessa] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("EXPEDIDA");
  const [tipo, setTipo] = useState<string>("T");
  const [data, setData] = useState<GradesRomaneio[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tema, setTema] = useState<boolean>(true);

  const [serverSelect, setServerSelect] = useState<JSX.Element | null>(null);
  const [serverSelectRemessa, setServerSelectRemessa] = useState<JSX.Element | null>(null);

  // Função para buscar as grades com os filtros
  const loaderFilter = async () => {
    if (!projectId || !remessa || !status || !tipo) return;

    setIsLoading(true);
    const res = await fetcherGradesPStatus(projectId, remessa, status, tipo);
    setData(res);
    setIsLoading(false);
  };

  // Atualiza as grades automaticamente quando os filtros mudam
  useEffect(() => {
    loaderFilter();
  }, [projectId, remessa, status, tipo]);

  // Carrega o seletor de projetos
  useEffect(() => {
    async function fetchServerSelect() {
      const selectComponent = await CreateServerSelectComponentProjectsResume({
        color: tema, onSelectChange: setProjectId,
      });
      setServerSelect(selectComponent);
    }
    fetchServerSelect();
  }, [tema]);

  // Carrega o seletor de remessas quando o projeto muda
  useEffect(() => {
    if (!projectId) {
      setServerSelectRemessa(null);
      return;
    }

    async function fetchServerSelectRemessas() {
      const selectComponent = await CreateServerSelectComponentRemessa({
        onSelectChange: setRemessa,
        projectId, color: tema
      });
      setServerSelectRemessa(selectComponent);
    }
    fetchServerSelectRemessas();
  }, [projectId, tema]);

  const theme = () => {
    setTema(tema ? false : true);
  }

  const themeBG = tema ? 'bg-[#FFFFFF]' : 'bg-[#181818]';
  const themeBG2 = tema ? 'bg-[#FFFFFF]' : 'bg-[#1F1F1F]';
  const themeBG3 = tema ? 'bg-[#f7f7f7] text-zinc-950' : 'bg-[#181818] text-zinc-400';
  const colorFontAviso = tema ? 'text-zinc-950' : 'text-blue-500';
  const colorButons = tema ? 'bg-zinc-300 text-zinc-950 hover:bg-zinc-200' : 'bg-zinc-700 text-white hover:bg-zinc-600';
  const borderWhite = tema ? 'border-b-[3px] border-yellow-500' : '';

  return (
    <div className={`flex flex-col w-full items-start justify-center ${themeBG}`}>
      <TitleComponentFixed stringOne="RELATÓRIOS DE SAÍDA" />
      <div className="flex flex-col items-center justify-start min-h-[101vh] pt-7 gap-y-5 w-full">
        <div className={`flex w-full lg:p-[1.1rem] p-[0.7rem] lg:pt-8 pt-4 fixed ${themeBG2} gap-x-5 z-[15] ${borderWhite}`}>

          {/* Seletor de Status */}
          <select
            id="select-status"
            title="Selecione um status"
            className={`flex lg:w-[310px] w-[80px] ${themeBG3} py-2 px-3 lg:text-[14px] text-[12px] no-arrow outline-none cursor-pointer lg:h-[35px] border border-zinc-800`}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="EXPEDIDA">EXPEDIDAS</option>
            <option value="DESPACHADA">DESPACHADAS</option>
            <option value="PRONTA">PRONTAS</option>
            <option value="IMPRESSA">IMPRESSAS</option>
            <option value="TODAS">TODAS</option>
          </select>

          {/* Seletor de Projeto */}
          {serverSelect ?? (
            <div className="flex flex-col justify-center items-start">
              <p className={`flex lg:w-[310px] w-[80px] ${themeBG3} py-2 px-2 pl-3 text-[14px] border border-zinc-800 outline-none cursor-pointer h-[35px]`}>
                SELECIONE O PROJETO
              </p>
            </div>
          )}

          {/* Seletor de Remessa */}
          {serverSelectRemessa ?? (projectId && (
            <div className="flex flex-col justify-center items-start">
              <p className={`flex w-[310px] py-2 px-2 ${themeBG3} text-[14px] border border-zinc-800 outline-none cursor-pointer h-[35px]`}>
                AGUARDE...
              </p>
            </div>
          ))}

          {/* Seletor de Tipo */}
          <select
            id="select-tipo"
            title="Selecione o tipo"
            className={`flex lg:w-[310px] w-[80px] py-2 ${themeBG3} px-3 lg:text-[14px] text-[12px] no-arrow outline-none cursor-pointer lg:h-[35px] border border-zinc-800`}
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="T">TODAS</option>
            <option value="N">PEDIDO NORMAL</option>
            <option value="R">REPOSIÇÃO</option>
          </select>

          {/* Botão de Busca */}
          <button onClick={loaderFilter} className={`px-6 py-1 min-w-[250px] h-[34px] rounded-md ${colorButons}`}>
            BUSCAR
          </button>

          {/* Botão mudar tema */}
          <button onClick={theme} className={`px-6 py-1 min-w-[50px] h-[34px] rounded-md ${colorButons}`}>
            {tema ? "E" : "C"}
          </button>
        </div>

        {/* Exibição dos Resultados */}
        <div className="flex w-full flex-row items-center justify-between mt-[80px]">
          <div className={`flex flex-col min-w-[350px] max-w-[350px]`}>
            <div className={`fixed top-32 flex flex-col min-w-[480px] max-w-[480px] min-h-[86%] border-r-1 border-zinc-900 bg-zinc-500`}>
              <p>alexandre</p>
            </div>
          </div>
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center w-full h-[82vh]">
                <IsLoading />
              </div>
            ) : data?.length ? (
              <GradesFilterTable expedicaoData={data} staticColors={tema} />
            ) : (
              <div className="flex items-center justify-center w-full h-[82vh]">
                <p className={`text-lg ${colorFontAviso}`}>NÃO HÁ DADOS PARA OS PARÂMETROS PESQUISADOS.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
