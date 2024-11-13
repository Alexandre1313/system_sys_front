import ItensProjects from "./ItensProject";

export default interface FormDateInputs {
    QUANTIDADECONTABILIZADA: string,
    LEITURADOCODDEBARRAS: string, 
    ITEM_SELECIONADO: ItensProjects | null,
    PROJETO: string | null | undefined 
}
