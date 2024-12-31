import { Embalagem, FormDateInputs, ItensProjects, Stock } from "../interfaces";
import Caixa from "../interfaces/Caixa";
import CaixaItem from "../interfaces/CaixaItem";

const atualizarQuantidadeCaixa = (formData: any) => {
    formData.ITEM_SELECIONADO.quantidadeExpedida += 1
    formData.ITEM_SELECIONADO.qtyPCaixa += 1
    formData.ESCOLA_GRADE.totalExpedido += 1
    formData.ESCOLA_GRADE.totalAExpedir -= 1
}

const atualizarQuantidadeCaixaInvert = (formData: any) => {
    formData.ITEM_SELECIONADO.quantidadeExpedida -= 1
    formData.ITEM_SELECIONADO.qtyPCaixa -= 1
    formData.ESCOLA_GRADE.totalExpedido -= 1
    formData.ESCOLA_GRADE.totalAExpedir += 1
}

const atualizarQuantidadeCaixaNnn = (formData: any, nnn: number) => {
    formData.ITEM_SELECIONADO.quantidadeExpedida += nnn
    formData.ITEM_SELECIONADO.qtyPCaixa += nnn
    formData.ESCOLA_GRADE.totalExpedido += nnn
    formData.ESCOLA_GRADE.totalAExpedir -= nnn
}

const processarCodigoDeBarrasInvert = (
    formData: any,
    setFormData: (data: any) => void,
) => {
    const quantidade = formData.ITEM_SELECIONADO?.quantidade;
    const quantidadeExpedida = formData.ITEM_SELECIONADO?.quantidadeExpedida;

    // Verifica se a quantidade lida não ultrapassa a quantidade permitida
    if ((Number(quantidadeExpedida) > 0 && Number(formData.QUANTIDADENACAIXAATUAL) !== 0) &&
        (Number(quantidadeExpedida) !== Number(quantidade) || Number(formData.QUANTIDADENACAIXAATUAL) !== 0)) {
        setFormData((prevData: any) => ({
            ...prevData,
            QUANTIDADELIDA: String(Number(prevData.QUANTIDADELIDA) - 1), // decrementa QUANTIDADELIDA
            QUANTIDADENACAIXAATUAL: String(Number(prevData.QUANTIDADENACAIXAATUAL) - 1),
            CODDEBARRASLEITURA: '',
        }));
        atualizarQuantidadeCaixaInvert(formData)
    } else {
        setFormData((prevData: any) => ({
            ...prevData,
            CODDEBARRASLEITURA: '',
            // limpa o campo aqui
        }));
    }
};

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

    if (value.length === 5 && value != '99999') {
        if (value === itemCodigo) {
            // Verifica se a quantidade lida não ultrapassa a quantidade permitida
            if (Number(quantidade) !== Number(quantidadeExpedida)) {
                setFormData((prevData: any) => ({
                    ...prevData,
                    QUANTIDADELIDA: String(Number(prevData.QUANTIDADELIDA) + 1), // Incrementa QUANTIDADELIDA
                    QUANTIDADENACAIXAATUAL: String(Number(prevData.QUANTIDADENACAIXAATUAL) + 1),
                    CODDEBARRASLEITURA: '',
                }));
                atualizarQuantidadeCaixa(formData)
                if (formData.ESCOLA_GRADE.totalAExpedir === 0) {
                    OpenModalGerarCaixa()
                }
            } else {
                // Se a quantidade exceder, exibe a mensagem no modal
                setModalMessage('Quantidade já atendida para a grade em questão');
                setModalOpen(true);
                setFormData((prevData: any) => ({
                    ...prevData,
                    CODDEBARRASLEITURA: '',
                    // limpa o campo aqui
                }));
            }
        } else {
            // Se o código não corresponder, podemos exibir uma mensagem no modal
            setModalMessage('Código de barras não pertence ao item em questão, por favor verifique');
            setModalOpen(true);
            setFormData((prevData: any) => ({
                ...prevData,
                CODDEBARRASLEITURA: '',
                // limpa o campo aqui
            }));
        }
    } else {
        if (value.length === 8 && value.substring(0, 5) === '99999') {
            let nnn = parseInt(value.substring(5));
            if (Number(quantidade) !== Number(quantidadeExpedida)) {
                if(nnn > (Number(quantidade) - Number(quantidadeExpedida))){
                    nnn = (Number(quantidade) - Number(quantidadeExpedida));
                }
                setFormData((prevData: any) => ({
                    ...prevData,
                    QUANTIDADELIDA: String(Number(prevData.QUANTIDADELIDA) + nnn), // Incrementa QUANTIDADELIDA
                    QUANTIDADENACAIXAATUAL: String(Number(prevData.QUANTIDADENACAIXAATUAL) + nnn),
                    CODDEBARRASLEITURA: '',
                }));
                atualizarQuantidadeCaixaNnn(formData, nnn)
                if (formData.ESCOLA_GRADE.totalAExpedir === 0) {
                    OpenModalGerarCaixa()
                }
            } else {
                // Se a quantidade exceder, exibe a mensagem no modal
                setModalMessage('Quantidade já atendida para a grade em questão');
                setModalOpen(true);
                setFormData((prevData: any) => ({
                    ...prevData,
                    CODDEBARRASLEITURA: '',
                    // limpa o campo aqui
                }));
            }
        }
    }
};

function criarCaixa(formData: any, id: any): Caixa | null {
    const { ESCOLA_GRADE, NUMERODACAIXA } = formData;
    console.log(formData)
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
        console.log(itemGrade)
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
    console.log(formData)
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
                setModalMessage('Código de barras inválido para o item em questão, verifique');
                setModalOpenCodeInvalid(true);
                setFormData((prevData: any) => ({
                    ...prevData,
                    LEITURADOCODDEBARRAS: '',
                    // limpa o campo aqui
                }));
            }
        } else {
            // Se a embalagem nao estiver setada
            setModalMessage('Por favor, selecione o embalador');
            setModalOpenCodeInvalid(true);
            setFormData((prevData: any) => ({
                ...prevData,
                LEITURADOCODDEBARRAS: '',
                // limpa o campo aqui
            }));
        }
    }
};

function objectsStockEmbs(embalagenid: number, formdata: FormDateInputs,
    selectedItem: ItensProjects, embalagem: Embalagem, id: any): Stock {
    const stock: Stock = {
        embalagemId: embalagenid,
        itemTamanhoId: selectedItem.id,
        estoqueId: selectedItem.estoqueId,
        quantidade: parseInt(formdata.QUANTIDADECONTABILIZADA, 10),
        userId: id,
        selectedtItem: selectedItem,
        embalagem: embalagem,
    }
    return stock;
}

export { criarCaixa, objectsStockEmbs, processarCodigoDeBarras, processarCodigoDeBarrasInvert, processarQtdParaEstoque };

