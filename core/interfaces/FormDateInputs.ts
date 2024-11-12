import ItensProjects from "./ItensProject";
import ProjectItems from "./ProjectItems";

export default interface FormDateInputs {
    QUANTIDADECONTABILIZADA: string,
    LEITURADOCODDEBARRAS: string, 
    ITEM_SELECIONADO: ItensProjects | null 
}
