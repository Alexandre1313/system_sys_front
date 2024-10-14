import Link from "next/link"
import Projeto from "../../../core/interfaces/Projeto"
import { convertSPTime } from "../../../core/utils/tools"
import Image from "next/image"

interface ProjetoComponentProps {
    projeto: Projeto; // Define que você espera um objeto Projeto
}

export default function ProjetoComponent({ projeto }: ProjetoComponentProps) {
    return (
        <Link href={"/"}>
            <div className="flexColCS border border-gray-800">
                <Image
                    src={projeto.url}
                    alt={`bandeira de ${projeto.nome}`}
                    width={200}
                    height={200}
                />
                <span>{projeto.nome}</span>
                <span>{projeto.descricao}</span>
                <span>{`Cadastrado em: ${convertSPTime(projeto.createdAt)}`}</span>
            </div>
        </Link>
    )
}
