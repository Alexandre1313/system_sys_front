'use client'

import Link from 'next/link';
import { GradesRomaneio } from '../../../core';
import { converPercentualFormat, convertMilharFormat, convertMilharFormatKG } from '../../../core/utils/tools';

interface GradeFilterTableProps {
  expedicaoData: GradesRomaneio[];
  staticColors: boolean; // true = tema claro, false = tema escuro
  status: string;
  selectedGrades: number[];
  handleSelect: (id: number) => void;
}

export default function GradesFilterTable({ expedicaoData, staticColors, status, selectedGrades, handleSelect }: GradeFilterTableProps) {
  const theme = staticColors
    ? {
      bg: 'bg-white',
      text: 'text-black',
      border: 'border-gray-400',
      header: 'bg-gray-100 text-black',
      zebra: 'bg-gray-50',
      highlight: 'bg-cyan-400 bg-opacity-[0.07]',
      textCyan: 'text-black',
      bgColorValueP: 'bg-gradient-to-r from-red-500/20 to-transparent',
      bgColorValueE: 'bg-gradient-to-l from-emerald-500/20 to-transparent',
      textPurple: 'text-purple-700',
      textGreen: 'text-black',
      textBlue: 'text-blue-700',
      nadie: '',
      colorText: 'text-slate-700',
      colorBG: 'bg-gray-100 text-zinc-500',
      colorDivResuls: 'border-zinc-900 bg-[#E3E3E4] bg-opacity-[1]',

    }
    : {
      bg: 'bg-[#181818]',
      text: 'text-zinc-300',
      border: 'border-zinc-700',
      header: 'bg-zinc-800 text-zinc-400',
      zebra: 'bg-zinc-700 bg-opacity-30',
      highlight: 'bg-zinc-400 bg-opacity-[0.07]',
      textCyan: 'text-white',
      bgColorValueP: 'bg-gradient-to-r from-red-500/20 to-transparent',
      bgColorValueE: 'bg-gradient-to-l from-emerald-500/20 to-transparent',
      textPurple: 'text-purple-400',
      textGreen: 'text-white',
      textBlue: 'text-blue-400',
      nadie: '',
      colorText: 'text-slate-500',
      colorBG: 'bg-zinc-800 text-zinc-500',
      colorDivResuls: 'border-zinc-900 bg-[#1E1E1F] bg-opacity-[1]',
    };

  return (
    <div className={`flex flex-col gap-y-6 w-full px-2 py-4 ${theme.bg} ${theme.text}`}>
      {expedicaoData.map((grade) => {
        const totalQuantidade = grade.tamanhosQuantidades.reduce((sum, i) => sum + i.quantidade, 0);
        const totalPrevisto = grade.tamanhosQuantidades.reduce((sum, i) => sum + i.previsto, 0);
        const totalPesoAfer = grade.tamanhosQuantidades.reduce((sum, i) => sum + (i.peso ?? 0) * (i.quantidade ?? 0), 0);
        const faltaExpedir = totalPrevisto - totalQuantidade;
        const percentualConcluido = converPercentualFormat((totalQuantidade / totalPrevisto) * 100);
        const isSelected = selectedGrades.includes(grade.id); // <- aqui!

        const colorValue = faltaExpedir > 0 ? 'text-white font-extralight text-[16px] bg-zinc-600 bg-opacity-50' : 'text-white font-extralight text-[16px] bg-zinc-600 bg-opacity-50';

        const colorStatus = grade.status === 'DESPACHADA' ? 'text-blue-500 font-normal pl-2' : grade.status === 'EXPEDIDA' ? 'text-emerald-500 font-normal pl-2' : 'text-slate-400 font-normal pl-2';

        const colorChecked = grade.status === 'EXPEDIDA' ? 'border-green-500' : grade.status === 'DESPACHADA' ? 'border-blue-500' : 'border-slate-500';

        return (
          <div className={`flex flex-col w-full gap-x-2 border border-slate-800`} key={grade.id}>
            <div className={`${theme.colorText} ${theme.colorDivResuls} flex w-full gap-x-2 border-l border-r border-t border-slate-600 px-4 pt-2 pb-3`}>

              {(status === 'EXPEDIDA' || status === 'PRONTA') && (
                <div className="flex items-center justify-center w-[24px] h-[24px] mr-4">
                  <label className="relative cursor-pointer z-[0]">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelect(grade.id)}
                      className="sr-only peer"
                    />
                    <div
                      className={`w-6 h-6 rounded-sm border-2 ${colorChecked} flex items-center justify-center`}
                    >
                      <svg
                        className="w-4 h-4 text-green-400 opacity-1 peer-checked:opacity-100 transition-opacity duration-200"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 111.414-1.414L8.414 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </label>
                </div>
              )}

              <div className={`flex flex-col flex-1 gap-x-1`}>
                <h4 className="text-md font-semibold uppercase">Projeto: <span className={`text-cyan-500 font-light pl-2`}>{grade.projectname}</span></h4>
                <h4 className="text-md font-semibold uppercase">Unidade escolar: <span className={`text-cyan-500 font-light pl-2`}>{grade.escola}</span></h4>
                <h4 className={`text-md font-semibold uppercase`}>Status: <span className={`${colorStatus}`}>{grade.status}</span><span className={`text-red-600 pl-2 font-light`}> {grade.tipo ? 'R' : ''}</span></h4>
              </div>
              <div className={`flex flex-col flex-1 gap-x-1 border-l border-slate-600 pl-3`}>
                <h4 className="text-md font-semibold uppercase">Empresa: <span className={`text-cyan-500 font-light pl-2`}>{grade.company}</span></h4>
                {status === 'PRONTA' && (
                  <Link href={`/expedition/${grade.escolaId}`} target="_blank">
                    <h4 className="text-md font-semibold uppercase cursor-pointer">Nº da escola: <span className={`text-cyan-500 font-light pl-2`}>{grade.numeroEscola}</span></h4>
                  </Link>
                )}
                {status !== 'PRONTA' && (
                  <h4 className="text-md font-semibold uppercase">Nº da escola: <span className={`text-cyan-500 font-light pl-2`}>{grade.numeroEscola}</span></h4>
                )}
                <h4 className="text-md font-semibold uppercase">Nº Join: <span className={`text-cyan-500 font-light pl-2`}>{grade.numberJoin}</span></h4>
              </div>
              <div className={`flex flex-col flex-1 gap-x-1 border-l border-slate-600 pl-3`}>
                <h4 className="text-md font-semibold uppercase">Grade ID: <span className={`text-cyan-500 font-light pl-2`}>{grade.id}</span></h4>
                <h4 className="text-md font-semibold uppercase">Último Update: <span className={`text-cyan-500 font-light pl-2`}>{grade.update}</span></h4>
                <Link href={`/caixas_por_grade/${grade.id}`} target="_blank">
                  <h4 className="text-md font-semibold uppercase">Qty de volumes: <span className={`text-red-500 font-light pl-2`}>{grade.caixas.length}</span></h4>
                </Link>
                <h4 className="text-md font-semibold uppercase">Concluído: <span className={`text-yellow-500 font-light pl-2`}>{percentualConcluido}</span></h4>
              </div>
            </div>
            <table className={`w-full table-fixed border-collapse text-sm`}>
              <thead className={`${theme.header} text-[15px]`}>
                <tr>
                  {['Item', 'Gênero', 'Tam', 'Previsto', 'Expedido', 'À Expedir', 'Peso Unitário', 'Peso Total'].map((title, index) => {
                    const widthClasses = [
                      'w-[24%] text-left', // Item
                      'w-[12%] text-left', // Gênero
                      'w-[6%] text-left', // Tamanho                    
                      'w-[9%] text-left', // Previsto
                      'w-[9%] text-right', // Expedido
                      'w-[12%] text-left', // À Expedir
                      'w-[14%] text-left', // Peso Unitário
                      'w-[14%] text-left', // Peso Total
                    ];
                    return (
                      <th
                        key={title}
                        className={`py-2 px-4 border ${theme.border} ${widthClasses[index]}`}
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
                      <td className={`py-2 px-4 uppercase border ${theme.border} ${theme.header}`}>{item.tamanho}</td>                     
                      <td className={`py-2 px-4 border ${theme.textPurple} ${theme.border}`}>
                        {convertMilharFormat(item.previsto)}
                      </td>
                      <td className={`py-2 px-4 border text-right ${theme.textGreen} ${theme.border} ${(item.previsto === item.quantidade) ? theme.bgColorValueE : ''}`}>
                        <span className={`${(item.previsto === item.quantidade) ? 'text-emerald-500' : ''}`}>
                          {convertMilharFormat(item.quantidade)}
                        </span>
                      </td>
                       <td className={`py-2 px-4 border  ${theme.textCyan} ${theme.border} ${(item.previsto - item.quantidade > 0) ? theme.bgColorValueP : ''}`}>
                        <span className={`${(item.previsto - item.quantidade > 0) ? 'text-red-500' : ''}`}>
                          {convertMilharFormat(item.previsto - item.quantidade)}
                        </span>
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
                  <td className={`py-2 px-4 border ${theme.border} ${colorValue}`}>{convertMilharFormat(totalPrevisto)}</td>
                  <td className={`py-2 px-4 border text-right ${theme.border} ${colorValue}`}>{convertMilharFormat(totalQuantidade)}</td>
                  <td className={`py-2 px-4 border ${theme.border} ${colorValue}`}>{convertMilharFormat(faltaExpedir)}</td>
                  <td className={`py-2 px-4 border ${theme.border} ${colorValue}`}></td>
                  <td className={`py-2 px-4 border ${theme.border} ${colorValue}`}>{convertMilharFormatKG(totalPesoAfer ?? 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
