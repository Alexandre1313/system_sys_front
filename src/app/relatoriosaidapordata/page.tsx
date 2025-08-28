'use client';

import { useState } from 'react';
import TitleComponentFixed from '@/components/ComponentesInterface/TitleComponentFixed';
import { ExpedicaoResumoPDGrouped } from '../../../core';
import { gerarPDFExpedicao } from '../../../core/create_pdfs/pdfMakeGenertor';
import ProjectSelect from '@/components/componentesRomaneios/preojectSelect';
import { getProjectsPDataSaidas, getProjectsPDataSaidasResum } from '@/hooks_api/api';
import RemessaSelect from '@/components/componentesRomaneios/RemessaSelect';
import IsLoading from '@/components/ComponentesInterface/IsLoading';
import { convertMilharFormat } from '../../../core/utils/tools';

const fetcherSaidasPProjetoEData = async (
  projectId: string,
  tipoGrade: string,
  remessa: string
): Promise<ExpedicaoResumoPDGrouped[]> => {
  try {
    const resp = await getProjectsPDataSaidas(projectId, tipoGrade, remessa);
    return resp;
  } catch (error) {
    console.error('Erro ao buscar grades e suas saídas:', error);
    return [];
  }
};

const fetcherSaidasPProjetoEDataResum = async (
  projectId: string,
  tipoGrade: string,
  remessa: string
): Promise<ExpedicaoResumoPDGrouped[]> => {
  try {
    const resp = await getProjectsPDataSaidasResum(projectId, tipoGrade, remessa);
    return resp;
  } catch (error) {
    console.error('Erro ao buscar grades e suas saídas:', error);
    return [];
  }
};

export default function ResumoExpedicao() {
  const [projectId, setProjectId] = useState<number | null>(null);
  const [tipo, setTipo] = useState<string>('1');
  const [remessa, setRemessa] = useState<number | null>(null);
  const [resumo, setResumo] = useState<ExpedicaoResumoPDGrouped[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buscou, setBuscou] = useState(false);

  const handleBuscar = async () => {
    if (projectId === null) {
      setError('Selecione um projeto.');
      return;
    }
    if (remessa === null) {
      setError('Selecione uma remessa.');
      return;
    }

    setLoading(true);
    setError(null);
    setBuscou(true);
    try {
      const dados = await fetcherSaidasPProjetoEData(
        String(projectId),
        String(tipo),
        String(remessa)
      );
      setResumo(dados);
    } catch (err) {
      setError('Erro ao carregar o resumo da expedição.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuscarResum = async () => {
    if (projectId === null) {
      setError('Selecione um projeto.');
      return;
    }
    if (remessa === null) {
      setError('Selecione uma remessa.');
      return;
    }

    setLoading(true);
    setError(null);
    setBuscou(true);
    try {
      const dados = await fetcherSaidasPProjetoEDataResum(
        String(projectId),
        String(tipo),
        String(remessa)
      );
      setResumo(dados);
    } catch (err) {
      setError('Erro ao carregar o resumo da expedição.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Variáveis de largura e alinhamento
  const colWidths = {
    projeto: '19%',
    data: '15%',
    item: '26%',
    genero: '10%',
    tamanho: '10%',
    previsto: '10%',
    expedido: '10%',
  };
  const alignClass = 'text-left'; // Alinha tudo à esquerda
  let isTotalGeral = false;
  let prev = 0;
  let exp = 0;

  return (
    <div className="flex flex-col w-full bg-[#181818] text-zinc-300 min-h-[101vh] relative">
      <TitleComponentFixed stringOne="RESUMO DE SAÍDAS P/ PROJETO - STATUS - DATA" />

      {/* Filtros fixos */}
      <div className="flex flex-wrap gap-4 justify-start items-center p-6 bg-[#1F1F1F] fixed w-full top-11 z-30">
        <ProjectSelect onSelectChange={setProjectId} />
        <RemessaSelect onSelectChange={setRemessa} projectId={projectId} />

        <select
          id="select-tipo"
          title="Selecione o tipo de grade"
          className="flex w-[310px] py-2 px-3 text-[14px] no-arrow outline-none cursor-pointer bg-[#181818] text-zinc-400 h-[35px] border border-zinc-800"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="-1">TODAS</option>
          <option value="1">PEDIDO NORMAL</option>
          <option value="2">REPOSIÇÃO</option>
        </select>

        <div className="flex gap-3 ml-auto">
          <button
            onClick={handleBuscarResum}
            disabled={loading}
            className={`px-6 py-1 min-w-[250px] h-[34px] rounded-md bg-zinc-700 text-white hover:bg-zinc-600 ${loading ? 'cursor-wait opacity-70' : 'cursor-pointer'}`}
          >
            {loading ? 'CARREGANDO...' : 'RESUMIDO'}
          </button>

          <button
            onClick={handleBuscar}
            disabled={loading}
            className={`px-6 py-1 min-w-[250px] h-[34px] rounded-md bg-zinc-700 text-white hover:bg-zinc-600 ${loading ? 'cursor-wait opacity-70' : 'cursor-pointer'}`}
          >
            {loading ? 'CARREGANDO...' : 'COMPLETO'}
          </button>

          <button
            onClick={() => gerarPDFExpedicao(resumo)}
            disabled={resumo.length === 0 || loading}
            className="px-6 py-1 min-w-[250px] h-[34px] rounded-md bg-zinc-700 text-white hover:bg-zinc-600"
          >
            GERAR PDF
          </button>
        </div>
      </div>

      {loading && <IsLoading />}

      {!loading && buscou && (
        <div className="max-w-full mx-auto w-full flex flex-col gap-6 mt-[10rem] mb-[4rem] px-6">
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Container da tabela */}
          <div className="relative rounded border border-zinc-800 bg-zinc-900">
            {/* Cabeçalho sticky em div */}
            <div className="sticky top-[128px] z-20 bg-zinc-900">
              <table className="min-w-full border-collapse table-fixed">
                <thead>
                  <tr className="bg-zinc-800 text-zinc-400 border-b border-zinc-700">
                    <th style={{ width: colWidths.projeto }} className={`p-3 ${alignClass}`}>PROJETO</th>
                    <th style={{ width: colWidths.data }} className={`p-3 ${alignClass}`}>DATA</th>
                    <th style={{ width: colWidths.item }} className={`p-3 ${alignClass}`}>ITEM</th>
                    <th style={{ width: colWidths.genero }} className={`p-3 ${alignClass}`}>GÊNERO</th>
                    <th style={{ width: colWidths.tamanho }} className={`p-3 ${alignClass}`}>TAMANHO</th>
                    <th style={{ width: colWidths.previsto }} className={`p-3 ${alignClass}`}>PREVISTO</th>
                    <th style={{ width: colWidths.expedido }} className={`p-3 ${alignClass}`}>EXPEDIDO</th>
                  </tr>
                </thead>
              </table>
            </div>

            {/* Corpo da tabela scrollável */}
            <div className="">
              <table className="min-w-full border-collapse table-fixed">
                <tbody>
                  {resumo.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-zinc-500 font-extralight">
                        Nenhum dado encontrado para os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    resumo.map((grupo, i) =>
                      grupo.groupedItems.map((dataGroup, j) =>
                        dataGroup.items.map((row, k) => {
                          const isTotal = row.item === 'Total';
                          isTotalGeral = row.item === 'Total Geral';
                          if (isTotalGeral) {
                            prev = row.previsto;
                            exp = row.expedido;
                          }

                          let rowStyle = 'font-extralight odd:bg-gray-700 odd:bg-opacity-10 even:bg-transparent';

                          if (isTotalGeral) rowStyle = 'bg-orange-600/20 text-white font-medium text-xl fixed bottom-0 left-0 w-full';
                          if (isTotal) rowStyle = 'bg-zinc-800 text-green-500 font-medium';
                          if (isTotalGeral) return null;

                          return (
                            <tr key={`${i}-${j}-${k}`} className={`border-b border-zinc-800 ${rowStyle} hover:bg-green-500 hover:bg-opacity-[25%]`}>
                              <td style={{ width: colWidths.projeto }} className={`p-3 ${alignClass}`}>{isTotal || isTotalGeral ? '' : grupo.projectname}</td>
                              <td style={{ width: colWidths.data }} className={`p-3 ${alignClass}`}>{isTotal || isTotalGeral ? '' : row.data || ''}</td>
                              <td style={{ width: colWidths.item }} className={`p-3 ${alignClass}`}>{row.item}</td>
                              <td style={{ width: colWidths.genero }} className={`p-3 ${alignClass}`}>{row.genero}</td>
                              <td style={{ width: colWidths.tamanho }} className={`p-3 ${alignClass}`}>{row.tamanho}</td>
                              <td style={{ width: colWidths.previsto }} className={`p-3 ${alignClass}`}>{convertMilharFormat(row.previsto)}</td>
                              <td style={{ width: colWidths.expedido }} className={`p-3 ${alignClass}`}>{convertMilharFormat(row.expedido)}</td>
                            </tr>
                          );
                        })
                      )
                    )
                  )}
                </tbody>
              </table>
              {isTotalGeral && (
                <div className="fixed bottom-0 left-0 w-full bg-orange-900 text-white font-medium text-xl">
                  <div className="flex">
                    <div style={{ width: '18%' }} className="p-3"></div>
                    <div style={{ width: colWidths.data }} className="p-3"></div>
                    <div style={{ width: colWidths.item }} className="p-3"></div>
                    <div style={{ width: colWidths.genero }} className="p-3"></div>
                    <div style={{ width: colWidths.tamanho }} className="p-3">TOTAL GERAL:</div>
                    <div style={{ width: '10%' }} className="p-3">{convertMilharFormat(prev)}</div>
                    <div style={{ width: '11%' }} className="p-3">{convertMilharFormat(exp)}</div>
                  </div>
                </div>
              )}
            </div>            
          </div>
        </div>
      )}
    </div>
  );
}
