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
          className={`hover:bg-green-600 hover:bg-opacity-10 cursor-pointer`}
        >
          <td
            className={`border ${borderColor} px-4 py-1 text-[${textSize}] ${textColor} ${fonte} text-left w-[5%]`}
          >
            {schoolNumber}
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
            className={`border ${borderColor} px-4 py-1 text-[${textSize}] ${textColor} ${fonte} text-left w-[17%]`}
          >
            {create}
          </td>
          <td
            className={`border ${borderColor} px-4 py-1 text-center w-[7%]`}
          >
            <div className={`flex justify-end items-center gap-y-3 w-full`}>
              {printable ? printTwo(): null}
              {print()}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
