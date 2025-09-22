import { Embalagem, FormDateInputs, ItensProjects, Stock, Usuarios } from "../interfaces";
import Caixa from "../interfaces/Caixa";
import CaixaItem from "../interfaces/CaixaItem";

const atualizarQuantidadeCaixa = (formData: any, setFormData: (data: any) => void) => {
    setFormData((prevData: any) => {
        const newData = { ...prevData };
        newData.ITEM_SELECIONADO = { ...newData.ITEM_SELECIONADO };
        newData.ESCOLA_GRADE = { ...newData.ESCOLA_GRADE };
        newData.ESCOLA_GRADE.grade = { ...newData.ESCOLA_GRADE.grade };
        newData.ESCOLA_GRADE.grade.itensGrade = [...newData.ESCOLA_GRADE.grade.itensGrade];

        // Encontrar e atualizar o item específico
        const itemIndex = newData.ESCOLA_GRADE.grade.itensGrade.findIndex((item: any) =>
            item.id === newData.ITEM_SELECIONADO.id
        );

        if (itemIndex !== -1) {
            newData.ESCOLA_GRADE.grade.itensGrade[itemIndex] = {
                ...newData.ESCOLA_GRADE.grade.itensGrade[itemIndex],
                quantidadeExpedida: newData.ESCOLA_GRADE.grade.itensGrade[itemIndex].quantidadeExpedida + 1,
                qtyPCaixa: newData.ESCOLA_GRADE.grade.itensGrade[itemIndex].qtyPCaixa + 1
            };

            // ✅ CORREÇÃO: ITEM_SELECIONADO deve ser uma referência ao item atualizado na grade
            newData.ITEM_SELECIONADO = { ...newData.ESCOLA_GRADE.grade.itensGrade[itemIndex] };
        }

        newData.ESCOLA_GRADE.totalExpedido += 1;
        newData.ESCOLA_GRADE.totalAExpedir -= 1;

        return newData;
    });
}

const atualizarQuantidadeCaixaNnn = (formData: any, nnn: number, setFormData: (data: any) => void) => {
    setFormData((prevData: any) => {
        const newData = { ...prevData };
        newData.ITEM_SELECIONADO = { ...newData.ITEM_SELECIONADO };
        newData.ESCOLA_GRADE = { ...newData.ESCOLA_GRADE };
        newData.ESCOLA_GRADE.grade = { ...newData.ESCOLA_GRADE.grade };
        newData.ESCOLA_GRADE.grade.itensGrade = [...newData.ESCOLA_GRADE.grade.itensGrade];

        // Encontrar e atualizar o item específico
        const itemIndex = newData.ESCOLA_GRADE.grade.itensGrade.findIndex((item: any) =>
            item.id === newData.ITEM_SELECIONADO.id
        );

        if (itemIndex !== -1) {
            newData.ESCOLA_GRADE.grade.itensGrade[itemIndex] = {
                ...newData.ESCOLA_GRADE.grade.itensGrade[itemIndex],
                quantidadeExpedida: newData.ESCOLA_GRADE.grade.itensGrade[itemIndex].quantidadeExpedida + nnn,
                qtyPCaixa: newData.ESCOLA_GRADE.grade.itensGrade[itemIndex].qtyPCaixa + nnn
            };

            // ✅ CORREÇÃO: ITEM_SELECIONADO deve ser uma referência ao item atualizado na grade
            newData.ITEM_SELECIONADO = { ...newData.ESCOLA_GRADE.grade.itensGrade[itemIndex] };
        }

        newData.ESCOLA_GRADE.totalExpedido += nnn;
        newData.ESCOLA_GRADE.totalAExpedir -= nnn;

        return newData;
    });
}

const atualizarQuantidadeCaixaNnnInvert = (formData: any, nnn: number, setFormData: (data: any) => void) => {
    setFormData((prevData: any) => {
        const newData = { ...prevData };
        newData.ITEM_SELECIONADO = { ...newData.ITEM_SELECIONADO };
        newData.ESCOLA_GRADE = { ...newData.ESCOLA_GRADE };
        newData.ESCOLA_GRADE.grade = { ...newData.ESCOLA_GRADE.grade };
        newData.ESCOLA_GRADE.grade.itensGrade = [...newData.ESCOLA_GRADE.grade.itensGrade];

        // Encontrar e atualizar o item específico
        const itemIndex = newData.ESCOLA_GRADE.grade.itensGrade.findIndex((item: any) =>
            item.id === newData.ITEM_SELECIONADO.id
        );

        if (itemIndex !== -1) {
            newData.ESCOLA_GRADE.grade.itensGrade[itemIndex] = {
                ...newData.ESCOLA_GRADE.grade.itensGrade[itemIndex],
                quantidadeExpedida: newData.ESCOLA_GRADE.grade.itensGrade[itemIndex].quantidadeExpedida - nnn,
                qtyPCaixa: newData.ESCOLA_GRADE.grade.itensGrade[itemIndex].qtyPCaixa - nnn
            };

            // ✅ CORREÇÃO: ITEM_SELECIONADO deve ser uma referência ao item atualizado na grade
            newData.ITEM_SELECIONADO = { ...newData.ESCOLA_GRADE.grade.itensGrade[itemIndex] };
        }

        newData.ESCOLA_GRADE.totalExpedido -= nnn;

        // ✅ CORREÇÃO CRÍTICA: Recalcular totalAExpedir baseado na diferença real
        newData.ESCOLA_GRADE.totalAExpedir = newData.ESCOLA_GRADE.grade.itensGrade.reduce((sum: number, item: any) => {
            return sum + (item.quantidade - item.quantidadeExpedida);
        }, 0);

        return newData;
    });
};

// ✅ FUNÇÃO HELPER: Calcula totalAExpedir após incremento/decremento
const calcularTotalAExpedirAposIncremento = (itensGrade: any[], itemId: number, incremento: number) => {
    return itensGrade.reduce((sum: number, item: any) => {
        const quantidadeExpedidaFutura = item.id === itemId 
            ? item.quantidadeExpedida + incremento 
            : item.quantidadeExpedida;
        return sum + (item.quantidade - quantidadeExpedidaFutura);
    }, 0);
};

const processarCodigoDeBarrasInvert = (
    formData: any,
    setFormData: (data: any) => void,
) => {
    const qtyPCaixaItem = Number(formData.ITEM_SELECIONADO?.qtyPCaixa || 0);
    const quantidadeLidaAtual = Number(formData.QUANTIDADELIDA || 0);
    const quantidadeNaCaixaAtual = Number(formData.QUANTIDADENACAIXAATUAL || 0);

    // ✅ CORREÇÃO CRÍTICA: Só permite decrementar se há quantidade na caixa atual
    if (qtyPCaixaItem > 0 && quantidadeLidaAtual > 0 && quantidadeNaCaixaAtual > 0) {
        setFormData((prevData: any) => ({
            ...prevData,
            QUANTIDADELIDA: String(quantidadeLidaAtual - 1), // decrementa QUANTIDADELIDA
            QUANTIDADENACAIXAATUAL: String(quantidadeNaCaixaAtual - 1),
            CODDEBARRASLEITURA: '',
        }));
        atualizarQuantidadeCaixaNnnInvert(formData, 1, setFormData)
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
                atualizarQuantidadeCaixa(novoForm, setFormData);
                
                // ✅ Modal será aberto via useEffect no componente quando totalAExpedir === 0
            } else {
                setModalMessage('Quantidade já atendida para o item em questão!');
                setModalOpen(true);
                setFormData((prevData: any) => ({
                    ...prevData,
                    CODDEBARRASLEITURA: '',
                }));
            }
        } else {
            setModalMessage('Código de barras não pertence ao item em questão, por favor verifique!');
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
            atualizarQuantidadeCaixaNnn(novoForm, nnn, setFormData);
            
            // ✅ Modal será aberto via useEffect no componente quando totalAExpedir === 0
        } else {
            setModalMessage('Quantidade já atendida para o item em questão!');
            setModalOpen(true);
            setFormData((prevData: any) => ({
                ...prevData,
                CODDEBARRASLEITURA: '',
            }));
        }
        return;
    }

    // 3. Entrada manual para remover quantidade (somente com 4 caracteres, ex: -050)
    if (/^\-\d{3}$/.test(value) && value.length === 4 && user?.id) {
        const nnn = parseInt(value.substring(1), 10);
        const qtyPCaixaItem = Number(formData.ITEM_SELECIONADO?.qtyPCaixa || 0);

        // ✅ CORREÇÃO CRÍTICA: Verificar se há quantidade na caixa atual ANTES de qualquer decremento
        if (qtyPCaixaItem === 0) {
            setModalMessage('Não é possível decrementar!');
            setModalOpen(true);
            setFormData((prevData: any) => ({
                ...prevData,
                CODDEBARRASLEITURA: '',
            }));
            return;
        }

        if (quantidadeLidaAtual === 0) {
            setModalMessage('Nenhuma quantidade lida para remover deste item!');
            setModalOpen(true);
        } else {
            // ✅ CORREÇÃO: Garantir que não decremente mais do que há do item específico na caixa atual
            const remover = Math.min(nnn, quantidadeLidaAtual, qtyPCaixaItem);
            if (remover > 0) {
                const novoForm = {
                    ...formData,
                    QUANTIDADELIDA: String(quantidadeLidaAtual - remover),
                    QUANTIDADENACAIXAATUAL: String(quantidadeNaCaixaAtual - remover),
                    CODDEBARRASLEITURA: '',
                };
                setFormData(novoForm);
                atualizarQuantidadeCaixaNnnInvert(novoForm, remover, setFormData);
            } else {
                setModalMessage('Não há quantidade suficiente deste item na caixa atual para remover!');
                setModalOpen(true);
            }
        }
        setFormData((prevData: any) => ({
            ...prevData,
            CODDEBARRASLEITURA: '',
        }));
        return;
    }

    //echo

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
            atualizarQuantidadeCaixaNnn(novoForm, nnn, setFormData);
            
            // ✅ Modal será aberto via useEffect no componente quando totalAExpedir === 0
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
                }
            }
        }
    }
    caixa.qtyCaixa = totalExpedido;
    // Se não houve expedição de itens, retorne null
    if (totalExpedido === 0) {
        return null;
    }
    return caixa; // Retorna a caixa PENDENTE para inserção no banco
}

// ✅ NOVA FUNÇÃO: Zerar quantidades APÓS confirmar a caixa
function zerarQuantidadesCaixa(formData: any): void {
    const { ESCOLA_GRADE } = formData;

    // Calcular total expedido na caixa atual (qtyPCaixa)
    let totalExpedidoNaCaixa = 0;

    // Percorre os itens da grade para zerar qtyPCaixa e calcular total
    for (const itemGrade of ESCOLA_GRADE.grade.itensGrade) {
        if (itemGrade.isCount && itemGrade.qtyPCaixa > 0) {
            // Adicionar ao total expedido na caixa
            totalExpedidoNaCaixa += itemGrade.qtyPCaixa;

            // ✅ CORREÇÃO CRÍTICA: Sempre zerar qtyPCaixa, mas manter isCount para permitir futuras expedições
            itemGrade.qtyPCaixa = 0;

            // ✅ CORREÇÃO: Só definir isCount = false se o item estiver REALMENTE completo
            // Isso permite que itens sejam reexpedidos em futuras caixas
            if (itemGrade.quantidade === itemGrade.quantidadeExpedida) {
                itemGrade.isCount = false; // Item completamente expedido
            }
            // Se não está completo, mantém isCount = true para permitir futuras expedições
        }
    }

    // ✅ CORREÇÃO CRÍTICA: Zerar apenas os campos relacionados à caixa atual
    // QUANTIDADELIDA deve manter o valor da quantidade total expedida da grade
    formData.QUANTIDADENACAIXAATUAL = '0';
    if (formData.ITEM_SELECIONADO) {
        formData.ITEM_SELECIONADO.qtyPCaixa = 0;
    }

    // ✅ CORREÇÃO: Atualizar QUANTIDADELIDA com o novo total expedido
    formData.QUANTIDADELIDA = String(ESCOLA_GRADE.totalExpedido);

    // ✅ CORREÇÃO: NÃO somar totalExpedidoNaCaixa ao totalExpedido
    // O totalExpedido já está correto porque as funções de expedição atualizam quantidadeExpedida

    // Atualizar totalAExpedir da escola
    ESCOLA_GRADE.totalAExpedir = ESCOLA_GRADE.grade.itensGrade.reduce((sum: number, item: any) => sum + (item.quantidade - item.quantidadeExpedida), 0);

    // ✅ CORREÇÃO: Recalcular totalExpedido baseado na quantidadeExpedida real
    ESCOLA_GRADE.totalExpedido = ESCOLA_GRADE.grade.itensGrade.reduce((sum: number, item: any) => sum + item.quantidadeExpedida, 0);
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
                    QUANTIDADECONTABILIZADA: String(Number(prevData.QUANTIDADECONTABILIZADA) + 1),
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
                    QUANTIDADECONTABILIZADA: String(Number(prevData.QUANTIDADECONTABILIZADA) + nnn), // Incrementa QUANTIDADELIDA
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

export { criarCaixa, zerarQuantidadesCaixa, objectsStockEmbs, processarCodigoDeBarras, processarCodigoDeBarrasInvert, processarQtdParaEstoque };
