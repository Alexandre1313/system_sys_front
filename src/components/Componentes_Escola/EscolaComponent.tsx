import { Escola } from "../../../core"

export interface EscolaComponentProps {
    escola: Escola;
}

export default function EscolaComponent({ escola }: EscolaComponentProps){
    return (
        <div className="flex items-center justify-start ">{escola.nome}</div>
    )
}