import Caixa from "./Caixa";
import Company from "./Company";
import Escola from "./Escola";
import GradeItem from "./GradeItem";
import { Status } from "./Status";

export default interface Grade {
    id?: number;
    companyId: number; 
    company?: Company; 
    escolaId: number; // Relacionamento com Escola
    escola?: Escola; // Relacionamento opcional com Escola
    tipo?: string;
    itensGrade?: GradeItem[]; // Relacionamento com os itens dessa grade
    gradeCaixas: Caixa[];
    finalizada?: boolean; // Se a grade foi finalizada ou não
    status?: Status;
    createdAt?: Date;
    updatedAt?: Date;
  }
