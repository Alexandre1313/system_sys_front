import React, { useState } from 'react';
import { GradeOpenBySchool } from '../../../core';

interface TabelaExpedicaoProps {
  expedicaoData: GradeOpenBySchool[];
}

const TabelaExpedicao: React.FC<TabelaExpedicaoProps> = ({ expedicaoData }) => {
  const [expandedGradeId, setExpandedGradeId] = useState<number | null>(null);

  // Calculando totais para cada grade
  const calculateTotais = (gradeItems: any[]) => {
    const totalQuantidades = gradeItems.reduce(
      (totals, item) => {
        totals.prevista += item.quantidadePrevista;
        totals.expedida += item.quantidadeExpedida;
        totals.restante += item.quantidadeRestante;
        return totals;
      },
      { prevista: 0, expedida: 0, restante: 0 }
    );
    return totalQuantidades;
  };

  // Calculando totais gerais
  const totalGeral = expedicaoData.reduce(
    (totals, grade) => {
      const { prevista, expedida, restante } = calculateTotais(grade.itens);
      totals.prevista += prevista;
      totals.expedida += expedida;
      totals.restante += restante;
      return totals;
    },
    { prevista: 0, expedida: 0, restante: 0 }
  ); 

  return expedicaoData.length > 0 && (
    <div className="p-6 flex flex-col w-full gap-y-1">
      <h1 className="text-3xl font-bold text-center mb-16 text-zinc-500">{expedicaoData[0].projetoName}</h1>

      {/* Tabela de Totais Gerais */}
      <table className="min-w-full sticky top-28 border-collapse border border-zinc-700 mb-8 table-fixed">
        <thead>
          <tr className="bg-[#1f1f1f] text-zinc-500 border-b text-[20px] border-zinc-700">
            <th className="px-4 py-2 text-left border-r border-zinc-700 w-[25%]">Totais Gerais</th>
            <th className="px-4 py-2 text-left border-r border-zinc-700 w-[25%]">{`Previsto`}</th>
            <th className="px-4 py-2 text-left border-r border-zinc-700 w-[25%]">{`Expedido`}</th>
            <th className="px-4 py-2 text-left w-[25%]">{`Restam`}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-zinc-800 text-cyan-500 border-b text-[20px] border-zinc-700">
            <td className="px-4 py-2 text-left text-zinc-500 border-r border-zinc-700 w-[25%]"></td>
            <td className="px-4 py-2 text-left border-r border-zinc-700 w-[25%]">{totalGeral.prevista}</td>
            <td className="px-4 py-2 text-left border-r border-zinc-700 w-[25%]">{totalGeral.expedida}</td>
            <td className="px-4 py-2 text-left w-[25%]">{totalGeral.restante}</td>
          </tr>
        </tbody>
      </table>

      {/* Tabela de Detalhes por Grade */}
      {expedicaoData.map((grade) => {
        const { prevista, expedida, restante } = calculateTotais(grade.itens);

        return (
          <div key={grade.itens[0].gradeId} className="mb-8">
            {/* Tabela com os totais por grade */}
            <table className="min-w-full text-[16px] border-collapse border border-zinc-700 table-fixed">
              <thead>
                <tr className="bg-[#1f1f1f] text-zinc-500 border-b border-zinc-700">
                  <th className="px-4 py-2 text-left border-r border-zinc-700 w-[20%]">Unidade Escolar</th>
                  <th className="px-4 py-2 text-left border-r border-zinc-700 w-[10%]">Grade ID</th>
                  <th className="px-4 py-2 text-left border-r border-zinc-700 w-[25%]">Data / Item</th>
                  <th className="px-4 py-2 text-left border-r border-zinc-700 w-[15%]">Projeto / Tam</th>
                  <th className="px-4 py-2 text-left border-r border-zinc-700 w-[10%]">Prevista</th>
                  <th className="px-4 py-2 text-left border-r border-zinc-700 w-[10%]">Expedido</th>
                  <th className="px-4 py-2 text-left w-[10%]">Restam</th>
                </tr>
              </thead>
              <tbody>
                {/* Linha de Totais da Grade */}
                <tr
                  className="font-semibold text-[15px] bg-zinc-800 text-zinc-300 cursor-pointer"
                  onClick={() => setExpandedGradeId(expandedGradeId === grade.itens[0].gradeId ? null : grade.itens[0].gradeId)}
                >
                  <td className="text-green-600 px-4 py-2 border border-zinc-700 w-[20%]">{grade.escolaNome}</td>
                  <td className="px-4 py-2 border border-zinc-700 w-[10%]">{grade.itens[0].gradeId}</td>
                  <td className="px-4 py-2 border border-zinc-700 w-[25%]">{grade.data}</td>
                  <td className="px-4 py-2 border border-zinc-700 w-[15%]">{grade.projetoName}</td>
                  <td className="px-4 py-2 border border-zinc-700 w-[10%]">{prevista}</td>
                  <td className="px-4 py-2 border border-zinc-700 w-[10%]">{expedida}</td>
                  <td className="px-4 py-2 border border-zinc-700 w-[10%]">{restante}</td>
                </tr>

                {/* Exibindo os itens da grade */}
                {expandedGradeId === grade.itens[0].gradeId && grade.itens.map((item, index) => (
                  <tr key={`${item.gradeId}-${item.tamanho}-${index}`} className="bg-[#1f1f1f] text-zinc-500 text-[14px]">
                    <td className="px-4 py-2 border border-zinc-700 w-[20%]">{grade.escolaNome}</td>
                    <td className="px-4 py-2 border border-zinc-700 w-[10%]">{item.gradeId}</td>
                    <td className="px-4 py-2 border border-zinc-700 w-[25%]">{item.itemNome}</td>
                    <td className="px-4 py-2 border border-zinc-700 w-[15%]">{item.tamanho}</td>
                    <td className="px-4 py-2 border border-zinc-700 w-[10%]">{item.quantidadePrevista}</td>
                    <td className="px-4 py-2 border border-zinc-700 w-[10%]">{item.quantidadeExpedida}</td>
                    <td className="px-4 py-2 border border-zinc-700 w-[10%]">{item.statusExpedicao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default TabelaExpedicao;
