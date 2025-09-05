import { Embalagem, FormDateInputs, ItensProjects, Stock, Usuarios } from "../interfaces";
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

/*const atualizarQuantidadeCaixaNnnInvert = (formData: any, nnn: number) => {
    formData.ITEM_SELECIONADO.quantidadeExpedida -= nnn;
    formData.ITEM_SELECIONADO.qtyPCaixa -= nnn;
    formData.ESCOLA_GRADE.totalExpedido -= nnn;
    formData.ESCOLA_GRADE.totalAExpedir += nnn;
};*/

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
    user: Usuarios | null,
    setFormData: (data: any) => void,
    setModalMessage: (message: string) => void,
    setModalOpen: (open: boolean) => void,
    OpenModalGerarCaixa: () => void 
) => {
    // Aceita apenas caracteres válidos: números, + e -
    if (!/^[0-9+\-]*$/.test(value)) return;    

    if (formData.CODDEBARRASLEITURA === value) return;

    const itemCodigo = formData.ITEM_SELECIONADO?.itemTamanho?.barcode?.codigo;
    const quantidade = Number(formData.ITEM_SELECIONADO?.quantidade || 0);
    const quantidadeExpedida = Number(formData.ITEM_SELECIONADO?.quantidadeExpedida || 0);
    const quantidadeLidaAtual = Number(formData.QUANTIDADELIDA || 0);
    const quantidadeNaCaixaAtual = Number(formData.QUANTIDADENACAIXAATUAL || 0);

    setFormData((prevData: any) => ({
        ...prevData,
        CODDEBARRASLEITURA: value,
    }));

    // 1. Código de barras normal (5 dígitos)
    if (value.length === 5 && value !== '99999') {
        if (value === itemCodigo) {
            if (quantidade !== quantidadeExpedida) {
                const novoForm = {
                    ...formData,
                    QUANTIDADELIDA: String(quantidadeLidaAtual + 1),
                    QUANTIDADENACAIXAATUAL: String(quantidadeNaCaixaAtual + 1),
                    CODDEBARRASLEITURA: '',
                };
                setFormData(novoForm);
                atualizarQuantidadeCaixa(novoForm);
                if (formData.ESCOLA_GRADE.totalAExpedir === 0) {
                    OpenModalGerarCaixa();
                }
            } else {
                setModalMessage('Quantidade já atendida para o item de grade em questão');
                setModalOpen(true);
                setFormData((prevData: any) => ({
                    ...prevData,
                    CODDEBARRASLEITURA: '',
                }));
            }
        } else {
            setModalMessage('Código de barras não pertence ao item em questão, por favor verifique');
            setModalOpen(true);
            setFormData((prevData: any) => ({
                ...prevData,
                CODDEBARRASLEITURA: '',
            }));
        }
        return;
    }

    // 2. Entrada manual para adicionar quantidade (somente com 4 caracteres, ex: +005)
    if (/^\+\d{3}$/.test(value) && value.length === 4 && user?.id) {
        let nnn = parseInt(value.substring(1), 10);
        if (quantidade !== quantidadeExpedida) {
            if (nnn > (quantidade - quantidadeExpedida)) {
                nnn = quantidade - quantidadeExpedida;
            }
            const novoForm = {
                ...formData,
                QUANTIDADELIDA: String(quantidadeLidaAtual + nnn),
                QUANTIDADENACAIXAATUAL: String(quantidadeNaCaixaAtual + nnn),
                CODDEBARRASLEITURA: '',
            };
            setFormData(novoForm);
            atualizarQuantidadeCaixaNnn(novoForm, nnn);
            if (formData.ESCOLA_GRADE.totalAExpedir === 0) {
                OpenModalGerarCaixa();
            }
        } else {
            setModalMessage('Quantidade já atendida para o item de grade em questão');
            setModalOpen(true);
            setFormData((prevData: any) => ({
                ...prevData,
                CODDEBARRASLEITURA: '',
            }));
        }
        return;
    }

    // 3. Entrada manual para remover quantidade (somente com 4 caracteres, ex: -050)
    /*if (/^\-\d{3}$/.test(value) && value.length === 4 && user?.id) {
        const nnn = parseInt(value.substring(1), 10);
        if (quantidadeLidaAtual === 0) {
            setModalMessage('Nenhuma quantidade lida para remover');
            setModalOpen(true);
        } else {
            const remover = Math.min(nnn, quantidadeLidaAtual, quantidadeNaCaixaAtual);
            const novoForm = {
                ...formData,
                QUANTIDADELIDA: String(quantidadeLidaAtual - remover),
                QUANTIDADENACAIXAATUAL: String(quantidadeNaCaixaAtual - remover),
                CODDEBARRASLEITURA: '',
            };
            setFormData(novoForm);
            atualizarQuantidadeCaixaNnnInvert(novoForm, remover);
        }
        return;
    }*/

    // 4. Código especial 99999XYZ (expedição manual com código especial)
    if (/^99999\d{3}$/.test(value) && value.length === 8 && user?.id) {
        let nnn = parseInt(value.substring(5), 10);
        if (quantidade !== quantidadeExpedida) {
            if (nnn > (quantidade - quantidadeExpedida)) {
                nnn = quantidade - quantidadeExpedida;
            }
            const novoForm = {
                ...formData,
                QUANTIDADELIDA: String(quantidadeLidaAtual + nnn),
                QUANTIDADENACAIXAATUAL: String(quantidadeNaCaixaAtual + nnn),
                CODDEBARRASLEITURA: '',
            };
            setFormData(novoForm);
            atualizarQuantidadeCaixaNnn(novoForm, nnn);
            if (formData.ESCOLA_GRADE.totalAExpedir === 0) {
                OpenModalGerarCaixa();
            }
        } else {
            setModalMessage('Quantidade já atendida para a grade em questão');
            setModalOpen(true);
            setFormData((prevData: any) => ({
                ...prevData,
                CODDEBARRASLEITURA: '',
            }));
        }
    }
};

function criarCaixa(formData: any, id: any): Caixa | null {
    const { ESCOLA_GRADE, NUMERODACAIXA } = formData;
    // Informações para a caixa
    const caixa: Caixa = {
        gradeId: ESCOLA_GRADE.gradeId,
        escolaNumber: ESCOLA_GRADE.numeroEscola,
        numberJoin: ESCOLA_GRADE.numberJoin,
        projeto: ESCOLA_GRADE.projeto,
        escolaCaixa: ESCOLA_GRADE.nomeEscola,
        qtyCaixa: 0,
        tipoEmbalagemId: 1,
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
    user: Usuarios | null,
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

    if (value.length === 5 && value != '99999') {
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
    } else {
        if (value.length === 9 && value.substring(0, 5) === '99999' && user?.id === 1) {
            let nnn = parseInt(value.substring(5));
            if (selectedEmbalagem) {
                setFormData((prevData: any) => ({
                    ...prevData,
                    QUANTIDADECONTABILIZADA: String(Number(prevData.QUANTIDADECONTABILIZADA) + nnn), 
                    LEITURADOCODDEBARRAS: '',
                }));
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
