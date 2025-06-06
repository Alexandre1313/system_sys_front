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
        highlight: 'bg-red-100',
        textCyan: 'text-blue-700',
        textPurple: 'text-purple-700',
        textGreen: 'text-green-700',
        textBlue: 'text-blue-700',
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
      };

  return (
    <div className={`w-full px-6 py-4 ${theme.bg} ${theme.text}`}>
      {expedicaoData.map((grade, idx) => {
        const totalQuantidade = grade.tamanhosQuantidades.reduce((sum, i) => sum + i.quantidade, 0);
        const totalPrevisto = grade.tamanhosQuantidades.reduce((sum, i) => sum + i.previsto, 0);
        const faltaExpedir = totalPrevisto - totalQuantidade;
        const colorValue = faltaExpedir > 0 ? 'text-red-500' : 'text-green-500';

        return (
          <div className="mt-6" key={idx}>
            <h4 className="text-md font-semibold mb-3 uppercase">Itens Previstos:</h4>

            <table className={`w-full border-collapse text-sm`}>
              <thead className={`${theme.header}`}>
                <tr>
                  {['Item', 'Gênero', 'Tamanho', 'À Expedir', 'Previsto', 'Expedido', 'Peso Unitário', 'Peso Total'].map((title) => (
                    <th key={title} className={`py-2 px-4 text-left border ${theme.border}`}>
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {grade.tamanhosQuantidades.map((item, index) => {
                  const zebra = index % 2 === 0 ? theme.zebra : '';
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
                  <td className={`py-2 px-4 border ${theme.border}`} colSpan={1}>{`==>==>`}</td>
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
