import { Embalagem, FormDateInputs, ItensProjects, Stock } from "../interfaces";
import Caixa from "../interfaces/Caixa";
import CaixaItem from "../interfaces/CaixaItem";

const atualizarQuantidadeCaixa = (formData: any) => {
    formData.ITEM_SELECIONADO.quantidadeExpedida += 1
    formData.ITEM_SELECIONADO.qtyPCaixa += 1
    formData.ESCOLA_GRADE.totalExpedido += 1
    formData.ESCOLA_GRADE.totalAExpedir -= 1
}

const processarCodigoDeBarras = (
    value: string,
    formData: any,
    setFormData: (data: any) => void,
    setModalMessage: (message: string) => void,
    setModalOpen: (open: boolean) => void,
    OpenModalGerarCaixa: () => void
) => {
    // Verifica se o valor contém apenas números (0-9)
    const isNumeric = /^[0-9]*$/.test(value);

    // Se o valor não for numérico, mantém o campo com o valor digitado
    if (!isNumeric) {
        // Não alterar o estado para limpar o campo
        return; // Sai da função, nada mais é executado
    }

    const itemCodigo = formData.ITEM_SELECIONADO?.itemTamanho?.barcode?.codigo;
    const quantidade = formData.ITEM_SELECIONADO?.quantidade;
    const quantidadeExpedida = formData.ITEM_SELECIONADO?.quantidadeExpedida;

    // Atualiza o CODDEBARRASLEITURA com o valor digitado
    setFormData((prevData: any) => ({
        ...prevData,
        CODDEBARRASLEITURA: value, // Sempre atualiza para o valor digitado
    }));

    if (value.length === 5) {
        if (value === itemCodigo) {
            // Verifica se a quantidade lida não ultrapassa a quantidade permitida
            if (Number(quantidade) !== Number(quantidadeExpedida)) {
                setFormData((prevData: any) => ({
                    ...prevData,
                    QUANTIDADELIDA: String(Number(prevData.QUANTIDADELIDA) + 1), // Incrementa QUANTIDADELIDA
                    CODDEBARRASLEITURA: '',
                }));
                atualizarQuantidadeCaixa(formData)
                if (formData.ESCOLA_GRADE.totalAExpedir === 0) {
                    OpenModalGerarCaixa()
                }
            } else {
                // Se a quantidade exceder, exibe a mensagem no modal
                setModalMessage('Quantidade excedida');
                setModalOpen(true);
                setFormData((prevData: any) => ({
                    ...prevData,
                    CODDEBARRASLEITURA: '',
                    // limpa o campo aqui
                }));
            }
        } else {
            // Se o código não corresponder, podemos exibir uma mensagem no modal
            setModalMessage('Código de barras inválido');
            setModalOpen(true);
            setFormData((prevData: any) => ({
                ...prevData,
                CODDEBARRASLEITURA: '',
                // limpa o campo aqui
            }));
        }
    }
};

// Função que cria a caixa
function criarCaixa(formData: any, id: any): Caixa | null {
    const { ESCOLA_GRADE, NUMERODACAIXA } = formData;

    // Informações para a caixa
    const caixa: Caixa = {
        gradeId: ESCOLA_GRADE.gradeId,
        escolaNumber: ESCOLA_GRADE.numeroEscola,
        projeto: ESCOLA_GRADE.projeto,
        escolaCaixa: ESCOLA_GRADE.nomeEscola,
        qtyCaixa: 0,
        caixaNumber: NUMERODACAIXA,
        itensGrade: ESCOLA_GRADE.grade.itensGrade,
        userId: id,
        caixaItem: [],
    };

    let totalExpedido = 0;

    // Percorre os itens da grade
    for (const itemGrade of ESCOLA_GRADE.grade.itensGrade) {
        // Verifica se o item deve ser contado
        if (itemGrade.isCount) {
            const quantidadeParaCaixa = itemGrade.qtyPCaixa; // Pega a quantidade da caixa
            // Se a quantidade expedida for igual à quantidade total
            if (itemGrade.quantidade === itemGrade.quantidadeExpedida) {
                // Adiciona o item à caixa
                if (quantidadeParaCaixa > 0) {
                    const novoItem: CaixaItem = {
                        itemName: itemGrade?.itemTamanho?.item.nome,
                        itemGenero: itemGrade.itemTamanho.item.genero,
                        itemTam: itemGrade.itemTamanho.tamanho.nome,
                        itemQty: quantidadeParaCaixa,
                        itemTamanhoId: itemGrade.itemTamanho.id,
                    };
                    // Adiciona ao caixa
                    caixa.caixaItem.push(novoItem);
                    totalExpedido += quantidadeParaCaixa;
                }
                // Zera qtyPCaixa e marca isCount como false
                itemGrade.qtyPCaixa = 0;
                itemGrade.isCount = false; // Item não deve ser contado em futuras caixas
            } else {
                // Se não igualou, mas ainda tem quantidade para caixa, adiciona
                if (quantidadeParaCaixa > 0) {
                    const novoItem: CaixaItem = {
                        itemName: itemGrade.itemTamanho.item.nome,
                        itemGenero: itemGrade.itemTamanho.item.genero,
                        itemTam: itemGrade.itemTamanho.tamanho.nome,
                        itemQty: quantidadeParaCaixa,
                        itemTamanhoId: itemGrade.itemTamanho.id,
                    };
                    // Adiciona ao caixa
                    caixa.caixaItem.push(novoItem);
                    totalExpedido += quantidadeParaCaixa;
                    // Zera qtyPCaixa
                    itemGrade.qtyPCaixa = 0;
                }
            }
        }
    }
    caixa.qtyCaixa = totalExpedido;

    // Se não houve expedição de itens, retorne null
    if (totalExpedido === 0) {
        return null;
    }
    return caixa; // Retorna a caixa pronta para inserção no banco
}

const processarQtdParaEstoque = (
    value: string,
    formData: any,
    selectedEmbalagem: Embalagem | null | undefined,
    setFormData: (data: any) => void,
    setModalMessage: (message: string) => void,
    setModalOpenCodeInvalid: (open: boolean) => void,
) => {
    // Verifica se o valor contém apenas números (0-9)
    const isNumeric = /^[0-9]*$/.test(value);

    // Se o valor não for numérico, mantém o campo com o valor digitado
    if (!isNumeric) {
        // Não alterar o estado para limpar o campo
        return; // Sai da função, nada mais é executado
    }

    const itemCodigo = formData.ITEM_SELECIONADO?.barcode;

    // Atualiza o CODDEBARRASLEITURA com o valor digitado
    setFormData((prevData: any) => ({
        ...prevData,
        LEITURADOCODDEBARRAS: value, // Sempre atualiza para o valor digitado
    }));

    if (value.length === 5) {
        if (selectedEmbalagem) {
            if (value === itemCodigo) {
                setFormData((prevData: any) => ({
                    ...prevData,
                    QUANTIDADECONTABILIZADA: String(Number(prevData.QUANTIDADECONTABILIZADA) + 1), // Incrementa QUANTIDADELIDA
                    LEITURADOCODDEBARRAS: '',
                }));
            } else {
                // Se o código não corresponder, podemos exibir uma mensagem no modal
                setModalMessage('Código de barras inválido');
                setModalOpenCodeInvalid(true);
                setFormData((prevData: any) => ({
                    ...prevData,
                    LEITURADOCODDEBARRAS: '',
                    // limpa o campo aqui
                }));
            }
        } else {
            // Se a embalagem nao estiver setada
            setModalMessage('Selecione o embalador');
            setModalOpenCodeInvalid(true);
            setFormData((prevData: any) => ({
                ...prevData,
                LEITURADOCODDEBARRAS: '',
                // limpa o campo aqui
            }));
        }
    }
};

function objectsStockEmbs( embalagenid: number, formdata: FormDateInputs, 
    selectedItem: ItensProjects, embalagem: Embalagem, userId: number ): Stock{
    const stock: Stock = {
        embalagemId: embalagenid,
        itemTamanhoId: selectedItem.id,
        estoqueId: selectedItem.estoqueId,
        quantidade: parseInt(formdata.QUANTIDADECONTABILIZADA, 10),
        userId: userId,
        selectedtItem: selectedItem,
        embalagem: embalagem,
    }
    return stock;
}

export { processarCodigoDeBarras, criarCaixa, processarQtdParaEstoque, objectsStockEmbs }
