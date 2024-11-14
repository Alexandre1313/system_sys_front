import Embalagem from "./Embalagem";
import ItensProjects from "./ItensProject";

export default interface Stock {
    embalagemId: number;
    itemTamanhoid: number;
    estoqueId: number;
    quantidade: number;
    selectedtItem: ItensProjects;
    embalagem: Embalagem;
}
