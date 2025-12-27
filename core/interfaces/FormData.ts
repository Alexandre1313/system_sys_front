import EscolaGrade from "./EscolaGrade";
import GradeItem from "./GradeItem";

export default interface FormData {
    TOTALLIDODAGRADE: string,
    TOTALNACAIXAATUAL: string,
    CODDEBARRASLEITURA: string,
    ITEM_SELECIONADO: GradeItem | null,
    ESCOLA_GRADE: EscolaGrade | null,
    NUMERODACAIXA: string
}
