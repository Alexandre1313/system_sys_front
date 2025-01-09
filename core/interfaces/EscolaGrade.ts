import Grade from "./Grade";

export default interface EscolaGrade {
    nomeEscola?: string,
    numeroEscola?: string,
    numberJoin: string,
    projeto: string | undefined,
    idEscola?: number | undefined,
    gradeId?: number | undefined,   
    totalAExpedir?: number,
    finalizada?: boolean,
    totalExpedido?: number,
    grade: Grade | undefined
}