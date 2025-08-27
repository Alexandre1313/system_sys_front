'use client';

import { useState } from 'react';
import TitleComponentFixed from '@/components/ComponentesInterface/TitleComponentFixed';
import { ExpedicaoResumoPDGrouped } from '../../../core';
import { gerarPDFExpedicao } from '../../../core/create_pdfs/pdfMakeGenertor';
import ProjectSelect from '@/components/componentesRomaneios/preojectSelect';
import { getProjectsPDataSaidas } from '@/hooks_api/api';

const fetcherSaidasPProjetoEData = async (
  projectId: string,
  tipoGrade: string
): Promise<ExpedicaoResumoPDGrouped[]> => {
  try {
    const resp = await getProjectsPDataSaidas(projectId, tipoGrade);
    return resp;
  } catch (error) {
    console.error('Erro ao buscar grades e suas saídas:', error);
    return [];
  }
};

export default function ResumoExpedicao() {
  const [projectId, setProjectId] = useState<number | null>(null);
  const [tipo, setTipo] = useState<string>('1');
  const [resumo, setResumo] = useState<ExpedicaoResumoPDGrouped[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuscar = async () => {
    if (projectId === null) {
      setError('Selecione um projeto.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const dados = await fetcherSaidasPProjetoEData(String(projectId), String(tipo));
      setResumo(dados);
    } catch (err) {
      setError('Erro ao carregar o resumo da expedição.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-[#181818] px-6 py-10 text-zinc-300 min-h-screen">
      <TitleComponentFixed stringOne="Resumo da Expedição" />

      {/* Filtro */}
      <div className="flex w-full fixed top-[60px] bg-[#181818] pt-6 z-[15] px-6 gap-x-4 items-center">
        {/* Seletor de Projeto */}
        <ProjectSelect onSelectChange={setProjectId} />

        {/* Seletor de Tipo */}
        <select
          id="select-tipo"
          title="Selecione o tipo de grade"
          className="bg-green-800 hover:bg-green-900 text-white font-semibold rounded px-3 py-1 outline-none"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="-1">TODAS</option>
          <option value="1">PEDIDO NORMAL</option>
          <option value="2">REPOSIÇÃO</option>
        </select>

        {/* Botões Buscar e Gerar PDF juntos */}
        <div className="flex gap-3 ml-auto">
          <button
            onClick={handleBuscar}
            className="bg-green-800 hover:bg-green-900 text-white font-semibold px-5 py-1 rounded shadow min-w-[130px]"
          >
            {loading ? 'Carregando...' : 'Buscar'}
          </button>

          <button
            onClick={() => gerarPDFExpedicao(resumo)}
            disabled={loading || resumo.length === 0}
            className="bg-green-800 hover:bg-green-900 text-white font-semibold px-5 py-1 rounded shadow disabled:opacity-50 disabled:cursor-not-allowed min-w-[130px]"
          >
            Gerar PDF
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="mt-48 max-w-7xl mx-auto w-full flex flex-col gap-6">
        {/* Mensagem de Erro */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="overflow-x-auto rounded border border-zinc-700 bg-zinc-900">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-800 text-zinc-400">
              <tr>
                <th className="p-3 border-b border-zinc-700">Projeto</th>
                <th className="p-3 border-b border-zinc-700">Data</th>
                <th className="p-3 border-b border-zinc-700">Item</th>
                <th className="p-3 border-b border-zinc-700">Gênero</th>
                <th className="p-3 border-b border-zinc-700">Tamanho</th>
                <th className="p-3 border-b border-zinc-700 text-right">Previsto</th>
                <th className="p-3 border-b border-zinc-700 text-right">Expedido</th>
              </tr>
            </thead>
            <tbody>
              {!loading && resumo.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-zinc-500">
                    Nenhum dado disponível
                  </td>
                </tr>
              )}

              {resumo.map((grupo, i) =>
                grupo.groupedItems.map((dataGroup, j) =>
                  dataGroup.items.map((row, k) => {
                    const isTotal = row.item === 'Total' || row.item === 'Total Geral';
                    const isTotalGeral = row.item === 'Total Geral';

                    return (
                      <tr
                        key={`${i}-${j}-${k}`}
                        className={`border-b border-zinc-700 ${isTotal
                            ? isTotalGeral
                              ? 'bg-zinc-600 text-white font-bold'
                              : 'bg-zinc-700 text-white font-semibold'
                            : ''
                          }`}
                      >
                        <td className="p-3">{grupo.projectname}</td>
                        <td className="p-3">{row.data || '-'}</td>
                        <td className="p-3">{row.item}</td>
                        <td className="p-3">{row.genero}</td>
                        <td className="p-3">{row.tamanho}</td>
                        <td className="p-3 text-right">{row.previsto.toLocaleString()}</td>
                        <td className="p-3 text-right">{row.expedido.toLocaleString()}</td>
                      </tr>
                    );
                  })
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
