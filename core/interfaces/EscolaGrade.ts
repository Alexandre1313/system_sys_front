import Grade from "./Grade";

export default interface EscolaGrade {
    nomeEscola?: string,
    numeroEscola?: string,
    projeto: string | undefined,
    idEscola?: number | undefined,
    gradeId?: number | undefined,   
    totalAExpedir?: number,
    totalExpedido?: number,
    grade: Grade | undefined
}