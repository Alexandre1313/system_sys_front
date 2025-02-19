import { useMemo } from 'react';
import { GradesRomaneio } from '../../../core';

interface GradeFilterProps {
  expedicaoData: GradesRomaneio[];
}

export default function GradesFilter({ expedicaoData }: GradeFilterProps) {
  const groupedByStatus = useMemo(() => {
    return expedicaoData.reduce((acc, grade) => {
      if (!acc[grade.status]) acc[grade.status] = [];
      acc[grade.status].push(grade);
      return acc;
    }, {} as Record<string, GradesRomaneio[]>);
  }, [expedicaoData]);

  // Cores mais suaves para as bordas conforme status (opacidade reduzida)
  const statusBorders: any = {
    EXPEDIDA: 'border-green-600',
    DESPACHADA: 'border-blue-500',
    PRONTA: 'border-gray-500',
    IMPRESSA: 'border-purple-400',
    TODAS: 'border-pink-500',
  };

  // Fundo com transparência mínima e bordas mais suaves
  const statusBackgrounds: any = {
    EXPEDIDA: 'bg-green-600 bg-opacity-[1%]',  
    DESPACHADA: 'bg-blue-600 bg-opacity-[1%]', 
    PRONTA: 'bg-gray-300 bg-opacity-[1%]', 
    IMPRESSA: 'bg-purple-600 bg-opacity-[1%]', 
    TODAS: 'bg-gray-800 bg-opacity-[1%]', 
  };

  return (
    <div className="w-full px-6 py-4 bg-[#181818]">
      {Object.entries(groupedByStatus).map(([status, grades]) => {
        const totalItens = grades.reduce(
          (sum, grade) => sum + grade.tamanhosQuantidades.reduce((acc, item) => acc + item.quantidade, 0),
          0
        );
        const totalCaixas = grades.reduce((sum, grade) => sum + grade.caixas.length, 0);

        return (
          <div
            key={status}
            className={`mb-10 p-6 border ${statusBorders[status] || 'border-gray-600'} rounded-lg ${statusBackgrounds[status]} border-opacity-40`} 
          >
            <h2 className="text-3xl font-semibold text-yellow-700 mb-4 uppercase">{`STATUS: ${status}`}</h2>
            {grades.map((grade) => {
              const totalQuantidade = grade.tamanhosQuantidades.reduce((sum, item) => sum + item.quantidade, 0);
              return (
                <div
                  key={grade.id}
                  className={`mb-6 p-4 border ${statusBorders[status] || 'border-gray-400'} rounded-md ${statusBackgrounds[status]} border-opacity-40`}
                >
                  <h3 className="text-2xl font-semibold text-teal-700 uppercase">
                    {`PROJETO: ${grade.projectname} - ${grade.company}`}
                  </h3>
                  <p className="text-green-600 uppercase text-xl">Escola: {grade.escola} (Nº {grade.numeroEscola})</p>
                  <p className="text-green-600 uppercase text-xl">Número Join: {grade.numberJoin}</p>
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-zinc-300 mb-2 uppercase">Itens Expedidos:</h4>
                    <table className="w-full text-zinc-400 border-collapse">
                      <thead>
                        <tr className={`border-b ${statusBorders[status]} border-opacity-30`}>
                          <th className="py-2 px-4 text-left uppercase w-[25%]">Item</th>
                          <th className="py-2 px-4 text-left uppercase w-[25%]">Gênero</th>
                          <th className="py-2 px-4 text-left uppercase w-[25%]">Tamanho</th>
                          <th className="py-2 px-4 text-left uppercase w-[25%]">Quantidade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grade.tamanhosQuantidades.map((item, index) => (
                          <tr key={index} className={`border-b ${statusBorders[status]} border-opacity-30`}>
                            <td className="py-2 px-4 uppercase text-left">{item.item}</td>
                            <td className="py-2 px-4 uppercase text-left">{item.genero}</td>
                            <td className="py-2 px-4 uppercase text-left">{item.tamanho}</td>
                            <td className="py-2 px-4 uppercase text-left">{item.quantidade}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-teal-400 mt-2 uppercase">
                    Total de itens da grade: <span className="font-normal text-xl">{totalQuantidade}</span>
                  </p>
                  <p className="text-teal-400 uppercase">
                    Número de caixas: <span className="font-normal text-xl">{grade.caixas.length}</span>
                  </p>
                </div>
              );
            })}
            <div className="text-right text-teal-500 font-semibold uppercase">
              <p className="text-lg">Total de itens do grupo: <span className="font-bold text-xl">{totalItens}</span></p>
              <p className="text-lg">Total de caixas: <span className="font-bold text-xl">{totalCaixas}</span></p>
            </div>
          </div>
        );
      })}
      <div className="text-center text-zinc-300 text-3xl font-bold mt-10 uppercase">
        <p>Total Geral de Itens: {expedicaoData.reduce((sum, grade) => sum + grade.tamanhosQuantidades.reduce((acc, item) => acc + item.quantidade, 0), 0)}</p>
        <p>Total Geral de Caixas: {expedicaoData.reduce((sum, grade) => sum + grade.caixas.length, 0)}</p>
      </div>
    </div>
  );
}
