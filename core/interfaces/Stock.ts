import Embalagem from "./Embalagem";
import ItensProjects from "./ItensProject";

export default interface Stock {
    embalagemId: number;
    itemTamanhoId: number;
    estoqueId: number;
    quantidade: number;
    userId?: number | undefined;
    selectedtItem: ItensProjects;
    embalagem: Embalagem;
}
