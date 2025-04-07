import { Caixa, GradesRomaneio } from "../../../core";

interface GradeRomaneioTableProps {
  romaneio: GradesRomaneio[];
  caixas: Caixa[];
  printRomaneio: (romaneios: GradesRomaneio[]) => JSX.Element;
  printEti: (etiquetas: Caixa[]) => JSX.Element;
}

export default function GradeRomaneioTable(props: GradeRomaneioTableProps) {
  const printable = props.romaneio[0].isPrint;

  const textSize = '16px';
  const textColor = `${printable ? 'text-green-500' : 'text-zinc-400'}`;
  const fonte = 'font-semibold';
  const borderColor = 'border-zinc-800';

  const schoolNumber = props.romaneio[0].numeroEscola;
  const schoolName = props.romaneio[0].escola;
  const companyName = props.romaneio[0].company;
  const projectName = props.romaneio[0].projectname;
  const create = props.romaneio[0].create;

  const print = () => { return props.printRomaneio(props.romaneio) }
  const printTwo = () => { return props.printEti(props.caixas) }

  return (
    <table className={`table-auto w-full border-collapse border border-zinc-950`}>
      <tbody>
        <tr
          className={`hover:bg-green-600 hover:bg-opacity-10 cursor-pointer flex items-start w-full`}
        >         
          <td
            className={`border ${borderColor} px-4 py-1 text-[${textSize}] ${textColor} ${fonte} text-left w-[5%]`}
          >
            {schoolNumber}
          </td>
          <td className={`flex justify-start items-end gap-y-3  w-[5%] min-w-[5%]`}>
            {printable ? printTwo() : null}
            {print()}
          </td>
          <td
            className={`border ${borderColor} px-4 py-1 text-[${textSize}] ${textColor} ${fonte} text-left w-[35%]`}
          >
            {schoolName}
          </td>
          <td
            className={`border ${borderColor} px-4 py-1 text-[${textSize}] ${textColor} ${fonte} text-left w-[17%]`}
          >
            {companyName}
          </td>
          <td
            className={`border ${borderColor} px-4 py-1 text-[${textSize}] ${textColor} ${fonte} text-left w-[19%]`}
          >
            {projectName}
          </td>
          <td
            className={`border ${borderColor} px-4 py-1 text-[${textSize}] ${textColor} ${fonte} text-left w-[19%]`}
          >
            {create}
          </td>          
        </tr>
      </tbody>
    </table>
  );
}
