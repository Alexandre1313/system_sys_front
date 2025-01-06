import Link from "next/link";
import Projeto from "../../../core/interfaces/Projeto";

interface ProjetoComponentNewProps {
    projeto: Projeto; // Define que você espera um objeto Projeto
}

export default function ProjetoComponentNew({ projeto }: ProjetoComponentNewProps) {
    return (
        <Link href={`/escolas/${projeto.id}`} target={'_SELF'} className={`flex w-full lg:w-[30%]
         text-teal-700 hover:text-white transition-colors duration-500`}>
            <div className="flex border rounded-lg border-gray-800 shadow hover:border-gray-700 transition-colors duration-700
             transform lg:transition-transform lg:duration-300 hover:-translate-y-2 w-full">               
                <div className="flex items-center justify-center lg:p-4 p-4 w-full">
                    <span className="flex text-center text-[17px] font-bold">{projeto.nome}</span>                   
                </div>
            </div>
        </Link>
    )
}
