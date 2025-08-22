import CaixaItem from "./CaixaItem";
import Grade from "./Grade";
import GradeItem from "./GradeItem";
import TipoEmbalagem from "./TipoEmbalagem";

export default interface Caixa {
    id?: number;
    gradeId: number | null | undefined; // Id da grade
    escolaCaixa: string;
    caixaNumber: string | null | undefined;
    escolaNumber: string;  
    numberJoin: string;
    qtyCaixa: number;
    projeto: string;
    userId?: number | undefined;   
    usuario?: string;    
    tipoEmbalagemId?: number;
    tipoEmbalagem?: TipoEmbalagem;
    caixaItem: CaixaItem[]; // Relacionamento com  CaixaItem
    itensGrade: GradeItem[];
    createdAt?: Date;
    updatedAt?: Date;
    grade?: Grade;
}
