'use client'

import { GradesRomaneio } from '../../../core';
import { convertMilharFormat, convertMilharFormatKG } from '../../../core/utils/tools';

interface GradeFilterTableProps {
  expedicaoData: GradesRomaneio[];
  staticColors: boolean; // true = tema claro, false = tema escuro
}

export default function GradesFilterTable({ expedicaoData, staticColors }: GradeFilterTableProps) {
  const theme = staticColors
    ? {
      bg: 'bg-white',
      text: 'text-black',
      border: 'border-gray-400',
      header: 'bg-gray-100 text-black',
      zebra: 'bg-gray-50',
      highlight: 'bg-cyan-400 bg-opacity-[0.07]',
      textCyan: 'text-blue-700',
      textPurple: 'text-purple-700',
      textGreen: 'text-green-700',
      textBlue: 'text-blue-700',
      nadie: '',
      colorText: 'text-slate-700',
    }
    : {
      bg: 'bg-[#181818]',
      text: 'text-zinc-300',
      border: 'border-zinc-700',
      header: 'bg-zinc-800 text-zinc-200',
      zebra: 'bg-zinc-700 bg-opacity-30',
      highlight: 'bg-zinc-400 bg-opacity-[0.07]',
      textCyan: 'text-cyan-400',
      textPurple: 'text-purple-400',
      textGreen: 'text-green-400',
      textBlue: 'text-blue-400',
      nadie: '',
      colorText: 'text-slate-400',
    };

  return (
    <div className={`flex flex-col gap-y-4 w-full px-6 py-4 ${theme.bg} ${theme.text}`}>
      {expedicaoData.map((grade) => {
        const totalQuantidade = grade.tamanhosQuantidades.reduce((sum, i) => sum + i.quantidade, 0);
        const totalPrevisto = grade.tamanhosQuantidades.reduce((sum, i) => sum + i.previsto, 0);
        const faltaExpedir = totalPrevisto - totalQuantidade;
        const colorValue = faltaExpedir > 0 ? 'text-red-500' : 'text-green-500';

        return (
          <div className={`flex flex-col w-full gap-x-2 border border-slate-600`} key={grade.id}>
            <div className={`${theme.colorText} flex w-full gap-x-2 border-l border-r border-t border-slate-600 px-4 pt-2 pb-3`}>
              <div className={`flex flex-col w-1/3 gap-x-1`}>
                <h4 className="text-md font-semibold uppercase">Projeto: <span>{grade.projectname}</span></h4>
                <h4 className="text-md font-semibold uppercase">Unidade escolar: <span>{grade.escola}</span></h4>                
              </div>
              <div className={`flex flex-col w-1/3 gap-x-1 border-l border-slate-600 pl-3`}>
                <h4 className="text-md font-semibold uppercase">Empresa: <span>{grade.company}</span></h4>
                <h4 className="text-md font-semibold uppercase">Nº da escola: <span>{grade.numeroEscola}</span></h4>   
                <h4 className="text-md font-semibold uppercase">Nº Join: <span>{grade.numberJoin}</span></h4>     
              </div>
               <div className={`flex flex-col w-1/3 gap-x-1 border-l border-slate-600 pl-3`}>
                <h4 className="text-md font-semibold uppercase">Grade ID: <span>{grade.id}</span></h4>
                <h4 className="text-md font-semibold uppercase">Último Update: <span>{grade.update}</span></h4>     
                <h4 className="text-md font-semibold uppercase">Qty de volumes: <span>{grade.caixas.length}</span></h4>  
              </div>
            </div>
            <table className={`w-full table-fixed border-collapse text-sm`}>
              <thead className={`${theme.header} text-[15px]`}>
                <tr>
                  {['Item', 'Gênero', 'Tam', 'À Expedir', 'Previsto', 'Expedido', 'Peso Unitário', 'Peso Total'].map((title, index) => {
                    const widthClasses = [
                      'w-[24%]', // Item
                      'w-[12%]', // Gênero
                      'w-[6%]', // Tamanho
                      'w-[12%]', // À Expedir
                      'w-[9%]', // Previsto
                      'w-[9%]', // Expedido
                      'w-[14%]', // Peso Unitário
                      'w-[14%]', // Peso Total
                    ];
                    return (
                      <th
                        key={title}
                        className={`py-2 px-4 text-left border ${theme.border} ${widthClasses[index]}`}
                      >
                        {title}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {grade.tamanhosQuantidades.map((item, index) => {
                  const zebra = index % 2 === 0 ? theme.nadie : '';
                  const highlight = item.previsto > item.quantidade ? theme.highlight : '';

                  return (
                    <tr key={index} className={`${theme.border} border ${zebra} ${highlight}`}>
                      <td className={`py-2 px-4 uppercase border ${theme.border}`}>{item.item}</td>
                      <td className={`py-2 px-4 uppercase border ${theme.border}`}>{item.genero}</td>
                      <td className={`py-2 px-4 uppercase border ${theme.border}`}>{item.tamanho}</td>
                      <td className={`py-2 px-4 border ${theme.textCyan} ${theme.border}`}>
                        {convertMilharFormat(item.previsto - item.quantidade)}
                      </td>
                      <td className={`py-2 px-4 border ${theme.textPurple} ${theme.border}`}>
                        {convertMilharFormat(item.previsto)}
                      </td>
                      <td className={`py-2 px-4 border ${theme.textGreen} ${theme.border}`}>
                        {convertMilharFormat(item.quantidade)}
                      </td>
                      <td className={`py-2 px-4 border ${theme.textBlue} ${theme.border}`}>
                        {convertMilharFormatKG(item.peso ?? 0)}
                      </td>
                      <td className={`py-2 px-4 border ${theme.textBlue} ${theme.border}`}>
                        {convertMilharFormatKG((item.peso ?? 0) * item.quantidade)}
                      </td>
                    </tr>
                  );
                })}

                <tr className={`font-bold ${theme.header}`}>
                  <td className={`py-2 px-4 border ${theme.border}`}></td>
                  <td className={`py-2 px-4 border ${theme.border}`}>TOTAIS</td>
                  <td className={`py-2 px-4 border ${theme.border}`} colSpan={1}>{`==>`}</td>
                  <td className={`py-2 px-4 border ${theme.border} ${colorValue}`}>
                    {convertMilharFormat(faltaExpedir)}
                  </td>
                  <td className={`py-2 px-4 border ${theme.border}`}>{convertMilharFormat(totalPrevisto)}</td>
                  <td className={`py-2 px-4 border ${theme.border}`}>{convertMilharFormat(totalQuantidade)}</td>
                  <td className={`py-2 px-4 border ${theme.border}`}></td>
                  <td className={`py-2 px-4 border ${theme.border}`}>
                    {convertMilharFormatKG(grade.peso ?? 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
