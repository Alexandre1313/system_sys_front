import CaixaItem from "./CaixaItem";

export default interface Caixa {
    id?: number;
    gradeId: number; // Id da grade
    escolaCaixa: string;
    caixaNumber: number;
    caixaItem: CaixaItem[]; // Relacionamento com  CaixaItem
    createdAt?: Date;
    updatedAt?: Date;
}
