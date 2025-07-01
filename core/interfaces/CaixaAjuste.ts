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
    escola: string,
    escolaNumero: string,
    itens: ItensCaixaAjuste[],
}
