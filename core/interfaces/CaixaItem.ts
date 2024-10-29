export default interface CaixaItem {
    id?: number;
    caixaId?: number; // Id da caixa
    itemName: string | undefined; 
    itemGenero: string;
    itemTam: string;
    itemQty: number;
    createdAt?: Date;
    updatedAt?: Date;
    itemTamanhoId: number;
}
