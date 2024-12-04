import CaixaItem from "./CaixaItem";
import GradeItem from "./GradeItem";

export default interface Caixa {
    id?: number;
    gradeId: number | null | undefined; // Id da grade
    escolaCaixa: string;
    caixaNumber: string | null | undefined;
    escolaNumber: string;
    qtyCaixa: number;
    projeto: string;
    userId?: number | undefined;
    caixaItem: CaixaItem[]; // Relacionamento com  CaixaItem
    itensGrade: GradeItem[];
    createdAt?: Date;
    updatedAt?: Date;
}
