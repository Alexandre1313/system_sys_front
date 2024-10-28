import CaixaItem from "./CaixaItem";
import GradeItem from "./GradeItem";

export default interface Caixa {
    id?: number;
    gradeId: number | null | undefined; // Id da grade
    escolaCaixa: string | null | undefined;
    caixaNumber: string | null | undefined;
    escolaNumber: string;
    projeto: string;
    caixaItem: CaixaItem[]; // Relacionamento com  CaixaItem
    itensGrade: GradeItem[];
    createdAt?: Date;
    updatedAt?: Date;
}
