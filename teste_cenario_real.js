// 🧪 SIMULAÇÃO DETALHADA DO CENÁRIO REAL
// Este arquivo simula exatamente o que acontece na sua aplicação

console.log("🎯 SIMULAÇÃO DETALHADA DO CENÁRIO REAL");
console.log("=" .repeat(60));

// 📊 ESTADO INICIAL SIMULADO (como na sua aplicação)
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
            { id: 1, quantidade: 10, quantidadeExpedida: 0, qtyPCaixa: 0, isCount: true },
            { id: 2, quantidade: 5, quantidadeExpedida: 0, qtyPCaixa: 0, isCount: true },
            { id: 3, quantidade: 8, quantidadeExpedida: 0, qtyPCaixa: 0, isCount: true }
        ]
    }
};

// 🔧 FUNÇÕES SIMULADAS (CÓDIGO ATUAL COM BUG)
function calcularTotalExpedido(grade) {
    return grade.itensGrade.reduce((totini, itemGrade) => {
        return totini + itemGrade.quantidadeExpedida;
    }, 0);
}

function abrirTelaExped(item, grade, formData) {
    const totalExpedido = calcularTotalExpedido(grade);
    
    const escolaGrade = {
        totalExpedido: totalExpedido,
        totalAExpedir: 23 - totalExpedido,
        grade: grade
    };
    
    return escolaGrade;
}

function handleEscolaGradeSelecionada(escolaGrade, formData) {
    return {
        ...formData,
        QUANTIDADELIDA: String(escolaGrade?.totalExpedido),
        ESCOLA_GRADE: escolaGrade,
    };
}

function processarCodigoDeBarras(formData, itemId) {
    // Simula a expedição de 1 item
    const novoFormData = { ...formData };
    novoFormData.ITEM_SELECIONADO.quantidadeExpedida += 1;
    novoFormData.ITEM_SELECIONADO.qtyPCaixa += 1;
    novoFormData.ESCOLA_GRADE.totalExpedido += 1;
    novoFormData.ESCOLA_GRADE.totalAExpedir -= 1;
    novoFormData.QUANTIDADELIDA = String(Number(novoFormData.QUANTIDADELIDA) + 1);
    novoFormData.QUANTIDADENACAIXAATUAL = String(Number(novoFormData.QUANTIDADENACAIXAATUAL) + 1);
    
    return novoFormData;
}

function fecharTelaExped(formData) {
    // Simula o fechamento do modal de expedição
    return {
        ...formData,
        ITEM_SELECIONADO: null,
        // QUANTIDADELIDA e ESCOLA_GRADE são preservados
    };
}

// 🧪 TESTE: CENÁRIO REAL COM BUG INTERMITENTE
console.log("\n🎯 TESTE: CENÁRIO REAL COM BUG INTERMITENTE");
console.log("-" .repeat(50));

let estado = { ...estadoInicial };
let grade = { ...estadoInicial.grade };

console.log("📋 ESTADO INICIAL:");
console.log(`   Grade: ${grade.itensGrade.map(item => `Item ${item.id}: ${item.quantidadeExpedida}/${item.quantidade}`).join(', ')}`);
console.log(`   formData.QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);

// 1. Selecionar Item 1
console.log("\n1️⃣ SELECIONANDO ITEM 1...");
const item1 = grade.itensGrade[0];
estado.formData.ITEM_SELECIONADO = item1;
const escolaGrade1 = abrirTelaExped(item1, grade, estado.formData);
estado.formData = handleEscolaGradeSelecionada(escolaGrade1, estado.formData);
console.log(`   ✅ Modal de expedição aberto`);
console.log(`   📊 QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);
console.log(`   📊 totalExpedido: ${escolaGrade1.totalExpedido}`);

// 2. Expedir Item 1
console.log("\n2️⃣ EXPEDINDO ITEM 1...");
estado.formData = processarCodigoDeBarras(estado.formData, 1);
console.log(`   ✅ Item 1 expedido com sucesso`);
console.log(`   📊 QUANTIDADELIDA após expedição: ${estado.formData.QUANTIDADELIDA}`);
console.log(`   📊 totalExpedido após expedição: ${estado.formData.ESCOLA_GRADE.totalExpedido}`);
console.log(`   📊 QUANTIDADENACAIXAATUAL: ${estado.formData.QUANTIDADENACAIXAATUAL}`);

// 3. Fechar modal de expedição
console.log("\n3️⃣ FECHANDO MODAL DE EXPEDIÇÃO...");
estado.formData = fecharTelaExped(estado.formData);
console.log(`   ✅ Modal fechado`);
console.log(`   📊 QUANTIDADELIDA preservada: ${estado.formData.QUANTIDADELIDA}`);
console.log(`   📊 ESCOLA_GRADE preservada: ${estado.formData.ESCOLA_GRADE.totalExpedido}`);

// 4. Simular delay do SWR (às vezes sincroniza, às vezes não)
const swrSincronizado = Math.random() > 0.5; // 50% de chance
console.log(`\n4️⃣ SWR ${swrSincronizado ? 'SINCRONIZADO' : 'NÃO SINCRONIZADO'}...`);

if (swrSincronizado) {
    // SWR sincronizado - atualiza a grade
    grade.itensGrade[0].quantidadeExpedida = 1;
    console.log(`   ✅ Grade atualizada: Item 1 quantidadeExpedida = ${grade.itensGrade[0].quantidadeExpedida}`);
} else {
    // SWR não sincronizado - grade permanece antiga
    console.log(`   ❌ Grade desatualizada: Item 1 quantidadeExpedida = ${grade.itensGrade[0].quantidadeExpedida}`);
}

// 5. Selecionar Item 2
console.log("\n5️⃣ SELECIONANDO ITEM 2...");
const item2 = grade.itensGrade[1];
estado.formData.ITEM_SELECIONADO = item2;
const escolaGrade2 = abrirTelaExped(item2, grade, estado.formData);
estado.formData = handleEscolaGradeSelecionada(escolaGrade2, estado.formData);
console.log(`   ✅ Modal de expedição aberto`);
console.log(`   📊 QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);
console.log(`   📊 totalExpedido: ${escolaGrade2.totalExpedido}`);

// 6. Verificar resultado
console.log("\n6️⃣ RESULTADO:");
if (estado.formData.QUANTIDADELIDA === '1') {
    console.log(`   ✅ SUCESSO! Contabilização preservada`);
    console.log(`   📊 QUANTIDADELIDA final: ${estado.formData.QUANTIDADELIDA}`);
} else {
    console.log(`   ❌ BUG! Contabilização perdida`);
    console.log(`   📊 QUANTIDADELIDA final: ${estado.formData.QUANTIDADELIDA}`);
    console.log(`   📊 Esperado: 1, Obtido: ${estado.formData.QUANTIDADELIDA}`);
}

console.log("\n" + "=" .repeat(60));
console.log("🎯 CONCLUSÃO: O bug é intermitente porque depende do timing");
console.log("   entre as atualizações do SWR e as mudanças locais.");
