'use client';

import { useState } from 'react';
import TitleComponentFixed from '@/components/ComponentesInterface/TitleComponentFixed';
import { ExpedicaoResumoPDGrouped } from '../../../core';
import { gerarPDFExpedicao } from '../../../core/create_pdfs/pdfMakeGenertor';
import ProjectSelect from '@/components/componentesRomaneios/preojectSelect';
import { getProjectsPDataSaidas } from '@/hooks_api/api';
import RemessaSelect from '@/components/componentesRomaneios/RemessaSelect';
import IsLoading from '@/components/ComponentesInterface/IsLoading';
import { convertMilharFormat } from '../../../core/utils/tools';
import React from 'react';

const fetcherSaidasPProjetoEData = async (projectId: string, tipoGrade: string, remessa: string): Promise<ExpedicaoResumoPDGrouped[]> => {
  try {
    const resp = await getProjectsPDataSaidas(projectId, tipoGrade, remessa);
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
  const [buscou, setBuscou] = useState(false); // controla se já buscou dados

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
      const dados = await fetcherSaidasPProjetoEData(String(projectId), String(tipo), String(remessa));
      setResumo(dados);
    } catch (err) {
      setError('Erro ao carregar o resumo da expedição.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-[#181818] text-zinc-300 min-h-[101vh] relative">
      <TitleComponentFixed stringOne="RESUMO DE SAÍDAS P/ PROJETO - STATUS - DATA" />
      {/* Filtros */}
      <div className="flex flex-wrap gap-4 justify-start items-center p-6 bg-[#1F1F1F] fixed w-full top-11">
        <ProjectSelect onSelectChange={setProjectId} />

        <RemessaSelect onSelectChange={setRemessa} projectId={projectId} />

        <select
          id="select-tipo"
          title="Selecione o tipo de grade"
          className={`flex w-[310px] py-2 px-3 text-[14px] no-arrow outline-none cursor-pointer
                      bg-[#181818] text-zinc-400 h-[35px] border border-zinc-800`}
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="-1">TODAS</option>
          <option value="1">PEDIDO NORMAL</option>
          <option value="2">REPOSIÇÃO</option>
        </select>

        <div className="flex gap-3 ml-auto">
          <button
            onClick={handleBuscar}
            disabled={loading}
            className={`px-6 py-1 min-w-[250px] h-[34px] rounded-md bg-zinc-700 text-white hover:bg-zinc-600 ${loading ? 'cursor-wait opacity-70' : 'cursor-pointer'
              }`}
          >
            {loading ? 'CARREGANDO...' : 'BUSCAR'}
          </button>

          <button
            onClick={() => gerarPDFExpedicao(resumo)}
            disabled={resumo.length === 0 || loading}
            className={`px-6 py-1 min-w-[250px] h-[34px] rounded-md bg-zinc-700 text-white hover:bg-zinc-600`}>
            GERAR PDF
          </button>
        </div>
      </div>

      {/* Se estiver carregando */}
      {loading && <IsLoading />}

      {/* Se já buscou e não está carregando */}
      {!loading && buscou && (
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="overflow-x-auto rounded border border-zinc-700 bg-zinc-900 mt-[10rem] mb-[3rem]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-zinc-800 text-zinc-400 sticky top-0 z-10">
                <tr className={``}>
                  <th className="p-3 border-b border-zinc-700">PROJETO</th>
                  <th className="p-3 border-b border-zinc-700">DATA</th>
                  <th className="p-3 border-b border-zinc-700">ITEM</th>
                  <th className="p-3 border-b border-zinc-700">GÊNERO</th>
                  <th className="p-3 border-b border-zinc-700">TAMANHO</th>
                  <th className="p-3 border-b border-zinc-700 text-right">PREVISTO</th>
                  <th className="p-3 border-b border-zinc-700 text-right">EXPEDIDO</th>
                </tr>
              </thead>
              <tbody>
                {resumo.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-zinc-500 font-extralight">
                      Nenhum dado encontrado para os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  resumo.map((grupo, i) =>
                    grupo.groupedItems.map((dataGroup, j) => {
                      const rows = dataGroup.items.map((row, k) => {
                        const isTotal = row.item === 'Total';
                        const isTotalGeral = row.item === 'Total Geral';

                        let rowStyle = 'font-extralight';

                        if (isTotalGeral) {
                          rowStyle += ' bg-green-900 text-white';
                        } else if (isTotal) {
                          rowStyle += ' bg-zinc-800 text-green-400';
                        }

                        return (
                          <tr
                            key={`${i}-${j}-${k}`}
                            className={`border-b border-zinc-700 transition-colors duration-200 ${rowStyle}`}
                          >
                            {/* Se for total ou total geral, deixar os campos Projeto/Data vazios */}
                            <td className="p-3">{isTotal || isTotalGeral ? '' : grupo.projectname}</td>
                            <td className="p-3">{isTotal || isTotalGeral ? '' : row.data || ''}</td>
                            <td className="p-3">{row.item}</td>
                            <td className="p-3">{row.genero}</td>
                            <td className="p-3">{row.tamanho}</td>
                            <td className="p-3 text-right">{convertMilharFormat(row.previsto)}</td>
                            <td className="p-3 text-right">{convertMilharFormat(row.expedido)}</td>
                          </tr>
                        );
                      });

                      // Insere uma linha em branco depois de cada bloco (após os totais)
                      return (
                        <React.Fragment key={`grupo-${i}-${j}`}>
                          {rows}
                        </React.Fragment>
                      );
                    })
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
