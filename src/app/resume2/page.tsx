'use client'

import PageEntExcel from '@/components/componentesDePrint/PageEntExcel';
import PageExcelNew from '@/components/componentesDePrint/PageExcelNew';
import PageExcelNewfaltas from '@/components/componentesDePrint/PageExcelNewfaltas';
import PageExcelRelatorio from '@/components/componentesDePrint/PageExcelRelatorio';
import RomaneiosAll from '@/components/componentesDePrint/RomaneiosAll';
import BuscaEscolaInput from '@/components/ComponentesInterface/BuscaEscolaInput';
import IsLoading from '@/components/ComponentesInterface/IsLoading';
import MostradorPageResults from '@/components/ComponentesInterface/MostradorPageResults';
import MostradorPageResults2 from '@/components/ComponentesInterface/MostradorPageResults2';
import TitleComponentFixed from '@/components/ComponentesInterface/TitleComponentFixed';
import GradesFilterTable from '@/components/componentesRomaneios/GradesFiltterTable';
import ProjectSelect from '@/components/componentesRomaneios/preojectSelect';
import RemessaSelect from '@/components/componentesRomaneios/RemessaSelect';
import { alterarPDespachadas, getFilterGrades } from '@/hooks_api/api';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle } from 'react-feather';
import { GradesRomaneio } from '../../../core';
import { filtrarGradesPorPrioridade, getResumo } from '../../../core/utils/tools';

const fetcherGradesPStatus = async (projectId: number, remessa: number, status: string, tipo: string): Promise<GradesRomaneio[] | null> => {
  try {
    const resp = await getFilterGrades(String(projectId), String(remessa), status, tipo);
    return resp;
  } catch (error) {
    console.error("Erro ao buscar grades:", error);
    return null;
  }
};

const fetcherAlterStatus = async (ids: number[]): Promise<number[] | null> => {
  try {
    const resp = await alterarPDespachadas(ids);
    return resp;
  } catch (error) {
    console.error("Erro ao atualizar status das grades:", error);
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
  const [modalStatus, setModalStatus] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(`GERE OS RELATÓRIOS ANTES DA ALTERAÇÃO`);
  const [selectedGrades, setSelectedGrades] = useState<number[]>([]);

  // Função para buscar as grades com os filtros
  const loaderFilter = useCallback(async () => {
    if (!projectId || !remessa || !status || !tipo) return;

    setIsLoading(true);
    const res = await fetcherGradesPStatus(projectId, remessa, status, tipo);
    setData(res || []);
    setDataFiltered(res || []);
    setSelectedGrades(res ? res.map(g => g.id) : []); // <-- seleciona tudo ao carregar
    setIsLoading(false);
  }, [projectId, remessa, status, tipo]);

  useEffect(() => {
    loaderFilter();
  }, [loaderFilter]);

  const theme = () => {
    setTema(tema ? false : true);
  }

  const modalAjustStatus = () => {
    if (status === 'EXPEDIDA' && dataFiltered.length > 0) {
      setModalStatus(modalStatus ? false : true);
    }
  }

  const fecharModalAjustStatus = () => {
    setModalStatus(modalStatus ? false : true);
  }

  const themeBG = tema ? 'bg-[#FFFFFF]' : 'bg-[#181818]';
  const themeBG2 = tema ? 'bg-[#FFFFFF]' : 'bg-[#181818]';
  const themeBG3 = tema ? 'bg-[#f7f7f7] text-zinc-950' : 'bg-[#181818] text-zinc-400';
  const colorFontAviso = tema ? 'text-zinc-950' : 'text-blue-500';
  const colorButons = tema ? 'bg-zinc-300 text-zinc-950 hover:bg-zinc-200' : 'bg-zinc-700 text-white hover:bg-zinc-600';
  const borderWhite = tema ? 'border-b-[3px] border-yellow-500' : '';
  //const colorInput = tema ? 'bg-[#F7F7F7] border-neutral-600 text-black placeholder:text-neutral-600' : 'bg-[#181818] border-neutral-600 text-white placeholder:text-neutral-400';
  //const colorLupa = tema ? '#000' : '#ccc';
  const colorDivResuls = tema ? 'border-zinc-900 bg-[#E3E3E4] bg-opacity-[1]' : 'border-zinc-900 bg-[#1E1E1F] bg-opacity-[1]';
  const buttonBaseClassTheme = "rounded px-4 py-2 cursor-pointer transition-colors duration-300 fixed bottom-5 left-1/2 transform -translate-x-1/2 min-w-[400px]";
  const buttonBaseClassTheme2 = "rounded px-4 py-2 cursor-pointer transition-colors duration-300 fixed bottom-24 left-1/2 transform -translate-x-1/2 min-w-[400px]";
  const buttonClassTheme = `${buttonBaseClassTheme} bg-gray-700 text-gray-200 hover:bg-gray-600`;
  const buttonClassTheme2 = `${buttonBaseClassTheme2} bg-red-500 text-white hover:bg-red-600`;

  const aplicarBusca = () => {
    const resultado = filtrarGradesPorPrioridade(data, buscaEscola);
    setDataFiltered(resultado);
  };

  const ajustarStatus = async (ids: number[]) => {
    const resp = await fetcherAlterStatus(ids);
    if (resp) {
      setMessage(`GRADES ALTERADAS COM OS SEGUINTES IDs:`);
      const timeout = setTimeout(() => {
        setStatus("DESPACHADA");
        setMessage(`GERE OS RELATÓRIOS ANTES DA ALTERAÇÃO`);
        setModalStatus((prev) => prev ? false : true);
        clearTimeout(timeout);
      }, 1000);
      return
    }
    setMessage(`ERRO AO MUDAR STATUS DAS GRADES`);
    const timeout = setTimeout(() => {
      setMessage(`TENTE NOVAMENTE`);
      clearTimeout(timeout);
    }, 1000);
    return
  }

  // Atualização do handleSelect para remover ao desmarcar e adicionar ao marcar
  const handleSelect = (id: number) => {
    setSelectedGrades((prevSelected) => {
      const isSelected = prevSelected.includes(id);

      if (isSelected) {
        // Desmarcou: remove do selected e do dataFiltered
        setDataFiltered((prevFiltered) => prevFiltered.filter(g => g.id !== id));
        return prevSelected.filter(item => item !== id);
      } else {
        // Marcou: adiciona ao selected e ao dataFiltered
        const gradeToAdd = data.find(g => g.id === id);
        if (gradeToAdd) {
          setDataFiltered((prevFiltered) => [...prevFiltered, gradeToAdd]);
        }
        return [...prevSelected, id];
      }
    });
  };

  const filtered = getResumo(status, dataFiltered);

  return (
    <div className={`flex flex-col w-full items-start justify-center ${themeBG}`}>
      <TitleComponentFixed stringOne="RELATÓRIOS DE SAÍDA" />
      <div className="flex flex-col items-center justify-start min-h-[101vh] pt-7 gap-y-5 w-full">
        <div className={`flex w-full lg:p-[0.8rem] p-[0.7rem] lg:pt-[2.1rem] pt-4 fixed ${themeBG2} gap-x-5 z-[15] ${borderWhite}`}>

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
            <option value="TODAS">TODAS</option>
            <option value="IMPRESSA">-----</option>
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
            <div className={`fixed top-[6rem] mt-3 h-[calc(100vh-7.1rem)] flex flex-col justify-between items-center min-w-[27%] max-w-[27%] border-r-1 ${colorDivResuls}`}>
              <div className={`flex w-full flex-col justify-start items-center`}>
                <div className={`flex w-full flex-row justify-center items-center`}>
                  <div className={`flex flex-col justify-start items-center p-1 w-[50%] gap-y-1`}>
                    <MostradorPageResults title={`PREVISTO N`} valor={filtered.previstoN} tema={tema} valorColor={`text-cyan-500`} />
                    <MostradorPageResults title={`EXPEDIDOS N`} valor={filtered.expedidos} tema={tema} valorColor={`text-emerald-500`} />
                    <MostradorPageResults title={`À EXPEDIR N`} valor={filtered.aExpedir} tema={tema} valorColor={`text-orange-500`} />
                    <MostradorPageResults title={`GRADES N`} valor={filtered.gradesValidas} tema={tema} />
                    <MostradorPageResults title={`ESC. ATENDIDAS N`} valor={filtered.escolasAtendidasN} tema={tema} valorColor={`text-purple-600`} />
                    <MostradorPageResults title={`CUB. TOTAL N`} valor={filtered.cubagemN} tema={tema} />
                    <MostradorPageResults title={`PESO TOTAL N`} valor={filtered.pesoN} tema={tema} />
                    <MostradorPageResults title={`VOLUMES N`} valor={filtered.volumesN} tema={tema} valorColor={`text-red-500`} />
                  </div>
                  <div className={`flex flex-col justify-start items-center p-1 w-[50%] gap-y-1`}>
                    <MostradorPageResults title={`PREVISTO R`} valor={filtered.prevRepo} tema={tema} valorColor={`text-cyan-500`} />
                    <MostradorPageResults title={`EXPEDIDOS R`} valor={filtered.expRepo} tema={tema} valorColor={`text-emerald-500`} />
                    <MostradorPageResults title={`À EXPEDIR R`} valor={filtered.aExpRepo} tema={tema} valorColor={`text-orange-500`} />
                    <MostradorPageResults title={`GRADES R`} valor={filtered.gradesRepo} tema={tema} />
                    <MostradorPageResults title={`ESC. ATENDIDAS R`} valor={filtered.escolasAtendidasR} tema={tema} valorColor={`text-purple-600`} />
                    <MostradorPageResults title={`CUB. TOTAL R`} valor={filtered.cubagemR} tema={tema} />
                    <MostradorPageResults title={`PESO TOTAL R`} valor={filtered.pesoR} tema={tema} />
                    <MostradorPageResults title={`VOLUMES R`} valor={filtered.volumesR} tema={tema} valorColor={`text-red-500`} />
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
                  <button onClick={modalAjustStatus} className="flex ml-3 items-center justify-center text-[14px] px-3 py-1 min-w-[50px] h-[31px] bg-red-700 text-white rounded-md hover:bg-red-600">
                    ME
                  </button>
                </div>
              </div>
              <div className="relative flex w-[100%] justify-center items-center">
                {/* Ícone da lupa dentro do input */}
                <BuscaEscolaInput tema={tema} buscaEscola={buscaEscola} setBuscaEscola={setBuscaEscola} onBuscar={aplicarBusca} />
              </div>
            </div>
          </div>
          <div className={`flex flex-col items-start justify-center w-full max-w-[73%]`}>
            <div className={`fixed top-[6.7rem] min-h-[70px] flex flex-row items-center justify-between w-full border-b ${colorDivResuls}`}>
              <div className={`flex flex-row items-center justify-start w-auto`}>
                <MostradorPageResults2 title={`PREVISTO  T`} valor={filtered.previstoT} tema={tema} valorColor={`text-cyan-500`} />
                <MostradorPageResults2 title={`EXPEDIDOS T`} valor={filtered.expedidosT} tema={tema} valorColor={`text-emerald-500`} />
                <MostradorPageResults2 title={`À EXPEDIR T`} valor={filtered.aExpedirT} tema={tema} valorColor={`text-orange-500`} />
                <MostradorPageResults2 title={`GRADES T`} valor={filtered.gradesT} tema={tema} />
                <MostradorPageResults2 title={`ESC. ATENDIDAS T`} valor={filtered.escolasAtendidasT} tema={tema} valorColor={`text-purple-600`} />
                <MostradorPageResults2 title={`CUB. TOTAL T`} valor={filtered.cubagemT} tema={tema} />
                <MostradorPageResults2 title={`PESO TOTAL T`} valor={filtered.pesoT} tema={tema} />
                <MostradorPageResults2 title={`VOLUMES T`} valor={filtered.volumes} tema={tema} valorColor={`text-red-500`} />
                {tipo === 'T' && (
                  <MostradorPageResults2 title={`PERC. ERROS T`} valor={filtered.percErr} tema={tema} valorColor={`text-yellow-500`} />
                )}
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
                <GradesFilterTable expedicaoData={dataFiltered} staticColors={tema} status={status} selectedGrades={selectedGrades} handleSelect={handleSelect} />
              ) : (
                <div className="flex items-center justify-center w-full h-[82vh]">
                  <p className={`text-lg ${colorFontAviso}`}>NÃO HÁ DADOS PARA OS PARÂMETROS PESQUISADOS.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {filtered.ids.length > 0 && modalStatus && (
        <div className={`fixed inset-0 z-50 bg-[#181818] bg-opacity-80 min-h-[105vh]
                lg:min-h-[100vh] flex flex-col pt-10
                justify-center items-center p-4`}>

          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white p-8 rounded-md shadow-md min-w-[30%] min-h-[30%]
                        flex flex-col items-center justify-center max-w-[800px]"
          >
            <div>
              <AlertTriangle size={60} color={`rgba(255, 0, 0, 1)`} />
            </div>
            <div className={`flex flex-col text-black w-full items-center justify-center`}>
              <h2 className={`text-[35px] font-bold`}>{`MUDANÇA DE STATUS`}</h2>
              <h2 className={`text-[20px] font-bold`}>{message}</h2>
              <span className={`text-[16px] font-bold mr-2`}>
                {`GRADES IDs AFETADOS:`}
              </span>
              <div className={`flex items-center justify-center flex-wrap`}>
                {filtered.ids.map((id, index) => (
                  <span key={index} className={`text-[25px] text-red-700 font-bold mr-2`}>
                    {id}
                  </span>
                ))}
              </div>
              <span className={`text-[15px] font-bold`}>DESEJA MESMO ALTERAR O STATUS DAS GRADES?</span>
              <span className={`text-[15px] font-bold`}>A OPERAÇÃO NÃO PODERÁ SER REVERTIDA</span>
            </div>
          </motion.div>
          <button
            onClick={() => ajustarStatus(filtered.ids)}
            className={`${buttonClassTheme} hover:bg-green-600`}
          >
            {"AJUSTAR"}
          </button>
          <button
            onClick={fecharModalAjustStatus}
            className={buttonClassTheme2}
          >
            {"CANCELAR"}
          </button>
        </div>
      )}
    </div>
  );
}
