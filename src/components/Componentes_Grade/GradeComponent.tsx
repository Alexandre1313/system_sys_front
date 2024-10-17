import { Grade } from "../../../core"

export interface GradeComponentProps {
    grade: Grade
}

export default function GradeComponent({ grade }: GradeComponentProps) {
    // Verifica se `grade` e `itensGrade` existem
    if (!grade || !grade.itensGrade) return <div>Nenhuma grade encontrada.</div>;

    // Calcula o total de quantidades somando os itensGrade
    const total = grade.itensGrade.reduce((totini, itemGrade) => {
        return totini + itemGrade.quantidade; // Soma as quantidades corretamente
    }, 0);

    return (
        <div>
            <h2>Total de Itens na Grade: {total}</h2>
            {grade.itensGrade.map((itemGrade, index) => {
                let item = itemGrade?.itemTamanho?.item; // Acessa o item
                let tamanho = itemGrade?.itemTamanho?.tamanho; // Acessa o tamanho
                let quantidade = itemGrade.quantidade; // Quantidade na grade
                let estoque = itemGrade?.itemTamanho?.estoque?.quantidade; // Estoque disponível

                return (
                    <div key={index}>
                        <p>Item: {item?.nome}</p>
                        <p>Tamanho: {tamanho?.nome}</p>
                        <p>Quantidade: {quantidade}</p>
                        <p>Em Estoque: {estoque}</p>
                        <hr />
                    </div>
                );
            })}
        </div>
    );
}
