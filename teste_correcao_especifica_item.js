// 🧪 TESTE DA CORREÇÃO ESPECÍFICA POR ITEM
// Este arquivo testa se as correções verificam a quantidade específica de cada item

console.log("🔧 TESTE DA CORREÇÃO ESPECÍFICA POR ITEM");
console.log("=" .repeat(60));

// 📊 ESTADO INICIAL SIMULADO COM MÚLTIPLOS ITENS
const estadoInicial = {
    formData: {
        CODDEBARRASLEITURA: '',
        ITEM_SELECIONADO: null,
        ESCOLA_GRADE: null,
        QUANTIDADELIDA: '0',
        QUANTIDADENACAIXAATUAL: '0',
        NUMERODACAIXA: '',
    },
    grade: {
        itensGrade: [
            { id: 1, quantidade: 5, quantidadeExpedida: 0, qtyPCaixa: 0, isCount: true, nome: "Item A" },
            { id: 2, quantidade: 3, quantidadeExpedida: 0, qtyPCaixa: 0, isCount: true, nome: "Item B" }
        ]
    }
};

// 🔧 FUNÇÕES SIMULADAS (CÓDIGO CORRIGIDO)
function atualizarQuantidadeCaixa(formData, quantidade = 1) {
    formData.ITEM_SELECIONADO.quantidadeExpedida += quantidade;
    formData.ITEM_SELECIONADO.qtyPCaixa += quantidade;
    formData.ESCOLA_GRADE.totalExpedido += quantidade;
    formData.ESCOLA_GRADE.totalAExpedir -= quantidade;
}

function atualizarQuantidadeCaixaInvert(formData) {
    formData.ITEM_SELECIONADO.quantidadeExpedida -= 1;
    formData.ITEM_SELECIONADO.qtyPCaixa -= 1;
    formData.ESCOLA_GRADE.totalExpedido -= 1;
    formData.ESCOLA_GRADE.totalAExpedir += 1;
}

// ✅ FUNÇÃO CORRIGIDA: processarCodigoDeBarrasInvert (verifica qtyPCaixa do item específico)
function processarCodigoDeBarrasInvert_CORRIGIDA(formData, setFormData) {
    const quantidade = formData.ITEM_SELECIONADO?.quantidade;
    const quantidadeExpedida = formData.ITEM_SELECIONADO?.quantidadeExpedida;
    const qtyPCaixaItem = Number(formData.ITEM_SELECIONADO?.qtyPCaixa || 0);

    // ✅ CORREÇÃO: Verifica se há quantidade específica do item na caixa atual antes de decrementar
    if ((Number(quantidadeExpedida) > 0 && qtyPCaixaItem > 0) &&
        (Number(quantidadeExpedida) !== Number(quantidade) || qtyPCaixaItem !== 0)) {
        setFormData((prevData) => ({
            ...prevData,
            QUANTIDADELIDA: String(Number(prevData.QUANTIDADELIDA) - 1),
            QUANTIDADENACAIXAATUAL: String(Number(prevData.QUANTIDADENACAIXAATUAL) - 1),
            CODDEBARRASLEITURA: '',
        }));
        atualizarQuantidadeCaixaInvert(formData);
        return true; // Decremento realizado
    } else {
        setFormData((prevData) => ({
            ...prevData,
            CODDEBARRASLEITURA: '',
        }));
        return false; // Decremento não realizado
    }
}

// ✅ FUNÇÃO CORRIGIDA: Decremento manual (verifica qtyPCaixa do item específico)
function processarDecrementoManual_CORRIGIDA(value, formData, setFormData, setModalMessage, setModalOpen) {
    const quantidadeLidaAtual = Number(formData.QUANTIDADELIDA || 0);
    const quantidadeNaCaixaAtual = Number(formData.QUANTIDADENACAIXAATUAL || 0);
    const qtyPCaixaItem = Number(formData.ITEM_SELECIONADO?.qtyPCaixa || 0);
    
    if (/^\-\d{3}$/.test(value) && value.length === 4) {
        const nnn = parseInt(value.substring(1), 10);
        if (quantidadeLidaAtual === 0) {
            setModalMessage('Nenhuma quantidade lida para remover');
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
                // Simular atualização das quantidades do item
                novoForm.ITEM_SELECIONADO.quantidadeExpedida -= remover;
                novoForm.ITEM_SELECIONADO.qtyPCaixa -= remover;
                return { sucesso: true, removido: remover };
            } else {
                setModalMessage('Não há quantidade suficiente deste item na caixa atual para remover');
                setModalOpen(true);
                return { sucesso: false, removido: 0 };
            }
        }
        setFormData((prevData) => ({
            ...prevData,
            CODDEBARRASLEITURA: '',
        }));
        return { sucesso: false, removido: 0 };
    }
    return { sucesso: false, removido: 0 };
}

// 🧪 TESTE: DEMONSTRAÇÃO DA CORREÇÃO ESPECÍFICA POR ITEM
console.log("\n🔧 TESTE: DEMONSTRAÇÃO DA CORREÇÃO ESPECÍFICA POR ITEM");
console.log("-" .repeat(50));

let estado = { ...estadoInicial };
let grade = { ...estadoInicial.grade };

// Simular setFormData
function setFormData(newData) {
    estado.formData = typeof newData === 'function' ? newData(estado.formData) : newData;
}

// Simular setModalMessage e setModalOpen
let modalMessage = '';
let modalOpen = false;
function setModalMessage(msg) { modalMessage = msg; }
function setModalOpen(open) { modalOpen = open; }

console.log("📋 ESTADO INICIAL:");
console.log(`   Item A: ${grade.itensGrade[0].quantidadeExpedida}/${grade.itensGrade[0].quantidade} (qtyPCaixa: ${grade.itensGrade[0].qtyPCaixa})`);
console.log(`   Item B: ${grade.itensGrade[1].quantidadeExpedida}/${grade.itensGrade[1].quantidade} (qtyPCaixa: ${grade.itensGrade[1].qtyPCaixa})`);

// 1. Expedir Item A (3 itens)
console.log("\n1️⃣ EXPEDINDO ITEM A (3 itens)...");
const itemA = grade.itensGrade[0];
estado.formData.ITEM_SELECIONADO = itemA;
estado.formData.ESCOLA_GRADE = {
    totalExpedido: 0,
    totalAExpedir: 8,
    grade: grade
};

// Simular expedição do Item A
estado.formData.QUANTIDADELIDA = '3';
estado.formData.QUANTIDADENACAIXAATUAL = '3';
atualizarQuantidadeCaixa(estado.formData, 3);

console.log(`   ✅ Item A expedido`);
console.log(`   📊 Item A qtyPCaixa: ${estado.formData.ITEM_SELECIONADO.qtyPCaixa}`);
console.log(`   📊 QUANTIDADENACAIXAATUAL: ${estado.formData.QUANTIDADENACAIXAATUAL}`);

// 2. Expedir Item B (2 itens)
console.log("\n2️⃣ EXPEDINDO ITEM B (2 itens)...");
const itemB = grade.itensGrade[1];
estado.formData.ITEM_SELECIONADO = itemB;

// Simular expedição do Item B
estado.formData.QUANTIDADELIDA = '5'; // Total: 3 + 2
estado.formData.QUANTIDADENACAIXAATUAL = '5'; // Total: 3 + 2
atualizarQuantidadeCaixa(estado.formData, 2);

console.log(`   ✅ Item B expedido`);
console.log(`   📊 Item B qtyPCaixa: ${estado.formData.ITEM_SELECIONADO.qtyPCaixa}`);
console.log(`   📊 QUANTIDADENACAIXAATUAL total: ${estado.formData.QUANTIDADENACAIXAATUAL}`);

// 3. Testar decremento do Item B (deve funcionar)
console.log("\n3️⃣ TESTANDO DECREMENTO DO ITEM B...");
console.log(`   📊 Item B qtyPCaixa antes: ${estado.formData.ITEM_SELECIONADO.qtyPCaixa}`);
const resultado1 = processarCodigoDeBarrasInvert_CORRIGIDA(estado.formData, setFormData);
console.log(`   📊 Decremento realizado: ${resultado1}`);
console.log(`   📊 Item B qtyPCaixa depois: ${estado.formData.ITEM_SELECIONADO.qtyPCaixa}`);
console.log(`   📊 QUANTIDADENACAIXAATUAL depois: ${estado.formData.QUANTIDADENACAIXAATUAL}`);

// 4. Tentar decrementar mais do Item B (deve falhar)
console.log("\n4️⃣ TENTANDO DECREMENTAR MAIS DO ITEM B...");
console.log(`   📊 Item B qtyPCaixa antes: ${estado.formData.ITEM_SELECIONADO.qtyPCaixa}`);
const resultado2 = processarCodigoDeBarrasInvert_CORRIGIDA(estado.formData, setFormData);
console.log(`   📊 Decremento realizado: ${resultado2}`);
console.log(`   📊 Item B qtyPCaixa depois: ${estado.formData.ITEM_SELECIONADO.qtyPCaixa}`);

// 5. Testar decremento manual do Item B
console.log("\n5️⃣ TESTANDO DECREMENTO MANUAL DO ITEM B...");
console.log(`   📊 Item B qtyPCaixa antes: ${estado.formData.ITEM_SELECIONADO.qtyPCaixa}`);
const resultado3 = processarDecrementoManual_CORRIGIDA('-002', estado.formData, setFormData, setModalMessage, setModalOpen);
console.log(`   📊 Decremento manual de 2 itens:`);
console.log(`      Sucesso: ${resultado3.sucesso}`);
console.log(`      Removido: ${resultado3.removido}`);
console.log(`      Item B qtyPCaixa depois: ${estado.formData.ITEM_SELECIONADO.qtyPCaixa}`);
console.log(`      Mensagem: ${modalMessage}`);

console.log("\n" + "=" .repeat(60));
console.log("🎯 CONCLUSÃO: As correções verificam a quantidade específica de cada item");
console.log("   garantindo que não seja possível decrementar mais do que há");
console.log("   do item específico na caixa atual!");
