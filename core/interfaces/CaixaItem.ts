export default interface CaixaItem {
    id?: number;
    caixaId: number; // Id da caixa
    itemName: string; 
    itemGenero: string;
    itemTam: string;
    itemQty: number;
    createdAt?: Date;
    updatedAt?: Date;
}
