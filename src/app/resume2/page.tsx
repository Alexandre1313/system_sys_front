'use client'

import IsLoading from '@/components/ComponentesInterface/IsLoading';
import TitleComponentFixed from '@/components/ComponentesInterface/TitleComponentFixed';
import { getFilterGrades } from '@/hooks_api/api';
import { useEffect, useState } from 'react';
import { GradesRomaneio } from '../../../core';
import GradesFilterTable from '@/components/componentesRomaneios/GradesFiltterTable';
import ProjectSelect from '@/components/componentesRomaneios/preojectSelect';
import RemessaSelect from '@/components/componentesRomaneios/RemessaSelect';
import { Search } from 'react-feather';
import MostradorPageResults from '@/components/ComponentesInterface/MostradorPageResults';
import RomaneiosAll from '@/components/componentesDePrint/RomaneiosAll';
import PageExcelNewfaltas from '@/components/componentesDePrint/PageExcelNewfaltas';
import PageExcelNew from '@/components/componentesDePrint/PageExcelNew';
import PageEntExcel from '@/components/componentesDePrint/PageEntExcel';
import PageExcelRelatorio from '@/components/componentesDePrint/PageExcelRelatorio';
import { filtrarGradesPorPrioridade, getResumo } from '../../../core/utils/tools';
import MostradorPageResults2 from '@/components/ComponentesInterface/MostradorPageResults2';

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
  const [data, setData] = useState<GradesRomaneio[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tema, setTema] = useState<boolean>(false);
  const [dataFiltered, setDataFiltered] = useState<GradesRomaneio[]>([]);
  const [buscaEscola, setBuscaEscola] = useState<string>('');

  // Função para buscar as grades com os filtros
  const loaderFilter = async () => {
    if (!projectId || !remessa || !status || !tipo) return;

    setIsLoading(true);
    const res = await fetcherGradesPStatus(projectId, remessa, status, tipo);
    setData(res || []);
    setIsLoading(false);
  };

  // Atualiza as grades automaticamente quando os filtros mudam
  useEffect(() => {
    loaderFilter();
  }, [projectId, remessa, status, tipo]);

  const theme = () => {
    setTema(tema ? false : true);
  }

  const themeBG = tema ? 'bg-[#FFFFFF]' : 'bg-[#181818]';
  const themeBG2 = tema ? 'bg-[#FFFFFF]' : 'bg-[#1F1F1F]';
  const themeBG3 = tema ? 'bg-[#f7f7f7] text-zinc-950' : 'bg-[#181818] text-zinc-400';
  const colorFontAviso = tema ? 'text-zinc-950' : 'text-blue-500';
  const colorButons = tema ? 'bg-zinc-300 text-zinc-950 hover:bg-zinc-200' : 'bg-zinc-700 text-white hover:bg-zinc-600';
  const borderWhite = tema ? 'border-b-[3px] border-yellow-500' : '';
  const colorInput = tema ? 'bg-[#F7F7F7] border-neutral-600 text-black placeholder:text-neutral-600' : 'bg-[#181818] border-neutral-600 text-white placeholder:text-neutral-400';
  const colorLupa = tema ? '#000' : '#ccc';
  const colorDivResuls = tema ? 'border-zinc-900 bg-[#E3E3E4] bg-opacity-[1]' : 'border-zinc-900 bg-[#1E1E1F] bg-opacity-[1]';
 
  useEffect(() => {
    const gradesFiltradas = filtrarGradesPorPrioridade(data, buscaEscola);
    setDataFiltered(gradesFiltradas);
  }, [data, buscaEscola]);

  const filtered = getResumo(dataFiltered);

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
          <ProjectSelect onSelectChange={setProjectId} color={tema} />

          {/* Seletor de Remessa */}
          <RemessaSelect onSelectChange={setRemessa} projectId={projectId} color={tema} />

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
        <div className="flex w-full flex-row items-center justify-between mt-[80px] pt-1">
          <div className={`flex flex-col min-w-[25%] max-w-[25%]`}>
            <div className={`fixed top-[6.1rem] mt-3 h-[calc(100vh-7.1rem)] flex flex-col justify-between items-center min-w-[27%] max-w-[27%] border-r-1 ${colorDivResuls}`}>
              <div className={`flex w-full flex-col justify-start items-center`}>
                <div className={`flex w-full flex-row justify-center items-center`}>
                  <div className={`flex flex-col justify-start items-center p-1 w-[50%] gap-y-1`}>
                    <MostradorPageResults title={`PREVISTO N`} valor={filtered.previstoN} tema={tema} valorColor={`text-cyan-500`}/>
                    <MostradorPageResults title={`EXPEDIDOS N`} valor={filtered.expedidos} tema={tema} />
                    <MostradorPageResults title={`À EXPEDIR N`} valor={filtered.aExpedir} tema={tema} />
                    <MostradorPageResults title={`GRADES N`} valor={filtered.gradesValidas} tema={tema} />
                    <MostradorPageResults title={`ESC. ATENDIDAS N`} valor={filtered.escolasAtendidasN} tema={tema} />
                    <MostradorPageResults title={`CUB. TOTAL N`} valor={filtered.cubagemN} tema={tema} />
                    <MostradorPageResults title={`PESO TOTAL N`} valor={filtered.pesoN} tema={tema} />
                    <MostradorPageResults title={`VOLUMES N`} valor={filtered.volumesN} tema={tema} valorColor={`text-red-500`}/>
                  </div>
                  <div className={`flex flex-col justify-start items-center p-1 w-[50%] gap-y-1`}>
                    <MostradorPageResults title={`PREVISTO R`} valor={filtered.prevRepo} tema={tema} valorColor={`text-cyan-500`}/>
                    <MostradorPageResults title={`EXPEDIDOS R`} valor={filtered.expRepo} tema={tema} />
                    <MostradorPageResults title={`À EXPEDIR R`} valor={filtered.aExpRepo} tema={tema} />
                    <MostradorPageResults title={`GRADES R`} valor={filtered.gradesRepo} tema={tema} />
                    <MostradorPageResults title={`ESC. ATENDIDAS R`} valor={filtered.escolasAtendidasR} tema={tema} />
                    <MostradorPageResults title={`CUB. TOTAL R`} valor={filtered.cubagemR} tema={tema} />
                    <MostradorPageResults title={`PESO TOTAL R`} valor={filtered.pesoR} tema={tema} />
                    <MostradorPageResults title={`VOLUMES R`} valor={filtered.volumesR} tema={tema} valorColor={`text-red-500`}/>
                  </div>
                </div>
                <div className={`flex w-full flex-row justify-center items-center gap-x-2 mt-4`}>
                  <div className={``} title='GERAÇÃO DE ROMANEIS DE EMBARQUE/ENTREGA'>
                    {data && (
                      <RomaneiosAll romaneios={dataFiltered} data-tip="Clique aqui para mais informações" />
                    )}
                  </div>
                  <div title='RELATÓRIO EM EXCEL FALTAS EM TEMPO REAL'>
                    {data && (
                      <PageExcelNewfaltas expedicaoDataB={dataFiltered} />
                    )}
                  </div>
                  <div title='RELATÓRIO EM EXCEL EXPEDIDOS NO DIA'>
                    {data && (
                      <PageExcelNew expedicaoDataB={dataFiltered} />
                    )}
                  </div>
                  <div title='RELATÓRIO EM EXCEL POR ENTREGA'>
                    {data && (
                      <PageEntExcel expedicaoDataB={dataFiltered} />
                    )}
                  </div>
                  <div title='RELATÓRIO EM EXCEL POR GRADE'>
                    {data && (
                      <PageExcelRelatorio expedicaoData={dataFiltered} />
                    )}
                  </div>
                </div>
              </div>
              <div className="relative flex w-[75%]">
                {/* Ícone da lupa dentro do input */}
                <Search
                  color={colorLupa}
                  size={21}
                  className="absolute left-3 top-1/3 transform -translate-y-1/2 pointer-events-none"
                  strokeWidth={1}
                />
                <input
                  type="text"
                  placeholder="Busca..."
                  className={`w-full mb-4 p-2 pl-12 rounded border focus:outline-none ${colorInput}`}
                  value={buscaEscola}
                  onChange={(e) => setBuscaEscola(e.target.value.toLowerCase())}
                />
              </div>
            </div>
          </div>
          <div className={`flex flex-col items-start justify-center w-full max-w-[73%]`}>
            <div className={`fixed top-[7rem] min-h-[70px] flex flex-row items-center justify-between w-full ${colorDivResuls}`}>
              <div className={`flex flex-row items-center justify-start w-auto`}>
                <MostradorPageResults2 title={`PREVISTO  T`} valor={filtered.previstoT} tema={tema} valorColor={`text-cyan-500`}/>
                <MostradorPageResults2 title={`EXPEDIDOS T`} valor={filtered.expedidosT} tema={tema} />
                <MostradorPageResults2 title={`À EXPEDIR T`} valor={filtered.aExpedirT} tema={tema} />
                <MostradorPageResults2 title={`GRADES T`} valor={filtered.gradesT} tema={tema} />
                <MostradorPageResults2 title={`ESC. ATENDIDAS T`} valor={filtered.escolasAtendidasT} tema={tema} />
                <MostradorPageResults2 title={`CUB. TOTAL T`} valor={filtered.cubagemT} tema={tema} />
                <MostradorPageResults2 title={`PESO TOTAL T`} valor={filtered.pesoT} tema={tema} />
                <MostradorPageResults2 title={`VOLUMES T`} valor={filtered.volumes} tema={tema} valorColor={`text-red-500`} />
              </div>
              <div className={`flex flex-row items-center justify-start w-auto`}>

              </div>
            </div>
            <div className={`flex pt-[4rem] flex-col items-start justify-center w-full`}>
              {isLoading ? (
                <div className="flex items-center justify-center w-full h-[82vh]">
                  <IsLoading color={tema} />
                </div>
              ) : data?.length ? (
                <GradesFilterTable expedicaoData={dataFiltered} staticColors={tema} />
              ) : (
                <div className="flex items-center justify-center w-full h-[82vh]">
                  <p className={`text-lg ${colorFontAviso}`}>NÃO HÁ DADOS PARA OS PARÂMETROS PESQUISADOS.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
