import ItensCaixaAjuste from "./ItensCaixaAjuste";

export default interface CaixaAjuste {
    id: number,
    gradeId: number,
    status: string,
    caixaNumber: string,
    qtyCaixa: number,
    createdAt: string,
    updatedAt: string,
    projeto: string,
    projetoId: number;
    escola: string,
    escolaNumero: string,
    escolaId: number,
    itens: ItensCaixaAjuste[],
}
