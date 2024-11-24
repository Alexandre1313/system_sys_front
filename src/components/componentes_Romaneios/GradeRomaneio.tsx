import { GradesRomaneio } from "../../../core"

interface GradeRomaneioProps {
    romaneio: GradesRomaneio;
    printRomaneio?: (etiquetas: GradesRomaneio[]) => JSX.Element;
}

export default function GradeRomaneio(props: GradeRomaneioProps) {
    const textSize = '13px';
    const textColor = 'text-zinc-400';
    const fonte = 'font-semibold';

    const schoolNumber = props.romaneio.numeroEscola;
    const schoolName = props.romaneio.escola;
    const companyName = props.romaneio.company;
    const projectName = props.romaneio.projectname;

    return (
        <div className={`flex w-full justify-start items-center p-1 px-5 rounded-md cursor-pointer
         hover:bg-blue-600 hover:bg-opacity-20`}>
            <div className={`flex justify-start items-center w-[3%]`}>
                <span className={`flex w-auto text-[${textSize}] ${textColor} font-semibold`}>
                    {schoolNumber}
                </span>
            </div>
            <div className={`flex justify-start items-center w-[40%]`}>
                <span className={`flex w-auto text-[${textSize}] ${textColor} ${fonte}`}>
                    {schoolName}
                </span>
            </div>
            <div className={`flex justify-start items-center w-[20%]`}>
                <span className={`flex w-auto text-[${textSize}] ${textColor} ${fonte}`}>
                    {companyName}
                </span>
            </div>
            <div className={`flex justify-start items-center w-[15%]`}>
                <span className={`flex w-auto text-[${textSize}] ${textColor} ${fonte}`}>
                    {projectName}
                </span>
            </div>
            <div className={`flex justify-start items-center w-[15%]`}>
                <span className={`flex w-auto text-[${textSize}] ${textColor} ${fonte}`}>
                    botao
                </span>
            </div>
        </div>
    )
}
