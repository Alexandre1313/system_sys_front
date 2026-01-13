import CaixaItem from "./CaixaItem";

export default interface CaixaFindItem {
    id?: number;
    gradeId: number;
    escolaCaixa: string;
    escolaNumber: number;
    projeto: string;
    qtyCaixa: number;
    caixaNumber: string;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
    numberJoin: number;
    tipoEmbalagemId: number;
    caixaItem: CaixaItem[];
}
