import GradeItem from "./GradeItem";

export default interface FormData {
    QUANTIDADELIDA: string,
    CODDEBARRASLEITURA: string,
    ITEM_SELECIONADO: GradeItem | null
}
