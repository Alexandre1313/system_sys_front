// 🧪 TESTE DAS CORREÇÕES DE DECREMENTO
// Este arquivo testa se as correções impedem decrementar mais do que há na caixa

console.log("🔧 TESTE DAS CORREÇÕES DE DECREMENTO");
console.log("=" .repeat(60));

// 📊 ESTADO INICIAL SIMULADO
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
            { id: 1, quantidade: 5, quantidadeExpedida: 0, qtyPCaixa: 0, isCount: true, nome: "Item A" }
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

function atualizarQuantidadeCaixaNnnInvert(formData, nnn) {
    formData.ITEM_SELECIONADO.quantidadeExpedida -= nnn;
    formData.ITEM_SELECIONADO.qtyPCaixa -= nnn;
    formData.ESCOLA_GRADE.totalExpedido -= nnn;
    formData.ESCOLA_GRADE.totalAExpedir += nnn;
}

// ✅ FUNÇÃO CORRIGIDA: processarCodigoDeBarrasInvert
function processarCodigoDeBarrasInvert_CORRIGIDA(formData, setFormData) {
    const quantidade = formData.ITEM_SELECIONADO?.quantidade;
    const quantidadeExpedida = formData.ITEM_SELECIONADO?.quantidadeExpedida;
    const quantidadeNaCaixaAtual = Number(formData.QUANTIDADENACAIXAATUAL || 0);

    // ✅ CORREÇÃO: Verifica se há quantidade na caixa atual antes de decrementar
    if ((Number(quantidadeExpedida) > 0 && quantidadeNaCaixaAtual > 0) &&
        (Number(quantidadeExpedida) !== Number(quantidade) || quantidadeNaCaixaAtual !== 0)) {
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

// ✅ FUNÇÃO CORRIGIDA: Decremento manual (ex: -050)
function processarDecrementoManual_CORRIGIDA(value, formData, setFormData, setModalMessage, setModalOpen) {
    const quantidadeLidaAtual = Number(formData.QUANTIDADELIDA || 0);
    const quantidadeNaCaixaAtual = Number(formData.QUANTIDADENACAIXAATUAL || 0);
    
    if (/^\-\d{3}$/.test(value) && value.length === 4) {
        const nnn = parseInt(value.substring(1), 10);
        if (quantidadeLidaAtual === 0) {
            setModalMessage('Nenhuma quantidade lida para remover');
            setModalOpen(true);
        } else {
            // ✅ CORREÇÃO: Garantir que não decremente mais do que há na caixa atual
            const remover = Math.min(nnn, quantidadeLidaAtual, quantidadeNaCaixaAtual);
            if (remover > 0) {
                const novoForm = {
                    ...formData,
                    QUANTIDADELIDA: String(quantidadeLidaAtual - remover),
                    QUANTIDADENACAIXAATUAL: String(quantidadeNaCaixaAtual - remover),
                    CODDEBARRASLEITURA: '',
                };
                setFormData(novoForm);
                atualizarQuantidadeCaixaNnnInvert(novoForm, remover);
                return { sucesso: true, removido: remover };
            } else {
                setModalMessage('Não há quantidade suficiente na caixa atual para remover');
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

// 🧪 TESTE: DEMONSTRAÇÃO DAS CORREÇÕES
console.log("\n🔧 TESTE: DEMONSTRAÇÃO DAS CORREÇÕES");
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
console.log(`   Item A: ${grade.itensGrade[0].quantidadeExpedida}/${grade.itensGrade[0].quantidade}`);
console.log(`   QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);
console.log(`   QUANTIDADENACAIXAATUAL: ${estado.formData.QUANTIDADENACAIXAATUAL}`);

// 1. Expedir 3 itens
console.log("\n1️⃣ EXPEDINDO 3 ITENS...");
const item = grade.itensGrade[0];
estado.formData.ITEM_SELECIONADO = item;
estado.formData.ESCOLA_GRADE = {
    totalExpedido: 0,
    totalAExpedir: 5,
    grade: grade
};

// Simular expedição
estado.formData.QUANTIDADELIDA = '3';
estado.formData.QUANTIDADENACAIXAATUAL = '3';
atualizarQuantidadeCaixa(estado.formData, 3);

console.log(`   ✅ 3 itens expedidos`);
console.log(`   📊 QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);
console.log(`   📊 QUANTIDADENACAIXAATUAL: ${estado.formData.QUANTIDADENACAIXAATUAL}`);
console.log(`   📊 Item A quantidadeExpedida: ${estado.formData.ITEM_SELECIONADO.quantidadeExpedida}`);

// 2. Testar decremento normal (deve funcionar)
console.log("\n2️⃣ TESTANDO DECREMENTO NORMAL...");
const resultado1 = processarCodigoDeBarrasInvert_CORRIGIDA(estado.formData, setFormData);
console.log(`   📊 Decremento realizado: ${resultado1}`);
console.log(`   📊 QUANTIDADELIDA após decremento: ${estado.formData.QUANTIDADELIDA}`);
console.log(`   📊 QUANTIDADENACAIXAATUAL após decremento: ${estado.formData.QUANTIDADENACAIXAATUAL}`);

// 3. Testar decremento quando não há mais na caixa atual
console.log("\n3️⃣ TESTANDO DECREMENTO QUANDO NÃO HÁ MAIS NA CAIXA...");
estado.formData.QUANTIDADENACAIXAATUAL = '0'; // Simular caixa vazia
const resultado2 = processarCodigoDeBarrasInvert_CORRIGIDA(estado.formData, setFormData);
console.log(`   📊 Decremento realizado: ${resultado2}`);
console.log(`   📊 QUANTIDADELIDA após tentativa: ${estado.formData.QUANTIDADELIDA}`);
console.log(`   📊 QUANTIDADENACAIXAATUAL após tentativa: ${estado.formData.QUANTIDADENACAIXAATUAL}`);

// 4. Restaurar quantidade na caixa e testar decremento manual
console.log("\n4️⃣ TESTANDO DECREMENTO MANUAL...");
estado.formData.QUANTIDADENACAIXAATUAL = '2'; // Restaurar quantidade na caixa
console.log(`   📊 QUANTIDADENACAIXAATUAL restaurada: ${estado.formData.QUANTIDADENACAIXAATUAL}`);

// Testar decremento manual de 1 item (deve funcionar)
const resultado3 = processarDecrementoManual_CORRIGIDA('-001', estado.formData, setFormData, setModalMessage, setModalOpen);
console.log(`   📊 Decremento manual de 1 item:`);
console.log(`      Sucesso: ${resultado3.sucesso}`);
console.log(`      Removido: ${resultado3.removido}`);
console.log(`      QUANTIDADENACAIXAATUAL: ${estado.formData.QUANTIDADENACAIXAATUAL}`);

// Testar decremento manual de mais do que há na caixa
const resultado4 = processarDecrementoManual_CORRIGIDA('-010', estado.formData, setFormData, setModalMessage, setModalOpen);
console.log(`   📊 Decremento manual de 10 itens (mais do que há na caixa):`);
console.log(`      Sucesso: ${resultado4.sucesso}`);
console.log(`      Removido: ${resultado4.removido}`);
console.log(`      Mensagem: ${modalMessage}`);
console.log(`      QUANTIDADENACAIXAATUAL: ${estado.formData.QUANTIDADENACAIXAATUAL}`);

console.log("\n" + "=" .repeat(60));
console.log("🎯 CONCLUSÃO: As correções impedem decrementar mais do que há na caixa");
console.log("   garantindo que QUANTIDADENACAIXAATUAL nunca fique negativo!");
