// 🧪 TESTE DA CORREÇÃO DO BUG
// Este arquivo testa se a correção implementada resolve o problema

console.log("🔧 TESTE DA CORREÇÃO DO BUG");
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
            { id: 1, quantidade: 10, quantidadeExpedida: 0, qtyPCaixa: 0, isCount: true },
            { id: 2, quantidade: 5, quantidadeExpedida: 0, qtyPCaixa: 0, isCount: true },
            { id: 3, quantidade: 8, quantidadeExpedida: 0, qtyPCaixa: 0, isCount: true }
        ]
    }
};

// 🔧 FUNÇÕES SIMULADAS
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

// ✅ FUNÇÃO CORRIGIDA (CÓDIGO APÓS CORREÇÃO)
function handleEscolaGradeSelecionada_CORRIGIDA(escolaGrade, formData) {
    return {
        ...formData,
        // ✅ CORREÇÃO: Preservar estado local se já existe contabilização
        ESCOLA_GRADE: formData.ESCOLA_GRADE?.totalExpedido > 0 
            ? formData.ESCOLA_GRADE 
            : escolaGrade,
        QUANTIDADELIDA: formData.QUANTIDADELIDA !== '0' 
            ? formData.QUANTIDADELIDA 
            : String(escolaGrade?.totalExpedido),
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
    return {
        ...formData,
        ITEM_SELECIONADO: null,
    };
}

// 🧪 TESTE: DEMONSTRAÇÃO DA CORREÇÃO
console.log("\n🔧 TESTE: DEMONSTRAÇÃO DA CORREÇÃO");
console.log("-" .repeat(50));

let estado = { ...estadoInicial };
let grade = { ...estadoInicial.grade };

console.log("📋 ESTADO INICIAL:");
console.log(`   Grade: ${grade.itensGrade.map(item => `Item ${item.id}: ${item.quantidadeExpedida}/${item.quantidade}`).join(', ')}`);
console.log(`   formData.QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);
console.log(`   formData.QUANTIDADENACAIXAATUAL: ${estado.formData.QUANTIDADENACAIXAATUAL}`);

// 1. Selecionar Item 1
console.log("\n1️⃣ SELECIONANDO ITEM 1...");
const item1 = grade.itensGrade[0];
estado.formData.ITEM_SELECIONADO = item1;
const escolaGrade1 = abrirTelaExped(item1, grade, estado.formData);
estado.formData = handleEscolaGradeSelecionada_CORRIGIDA(escolaGrade1, estado.formData);
console.log(`   ✅ Modal de expedição aberto`);
console.log(`   📊 QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);
console.log(`   📊 QUANTIDADENACAIXAATUAL: ${estado.formData.QUANTIDADENACAIXAATUAL}`);
console.log(`   📊 totalExpedido: ${escolaGrade1.totalExpedido}`);

// 2. Expedir Item 1
console.log("\n2️⃣ EXPEDINDO ITEM 1...");
estado.formData = processarCodigoDeBarras(estado.formData, 1);
console.log(`   ✅ Item 1 expedido com sucesso`);
console.log(`   📊 QUANTIDADELIDA após expedição: ${estado.formData.QUANTIDADELIDA}`);
console.log(`   📊 QUANTIDADENACAIXAATUAL após expedição: ${estado.formData.QUANTIDADENACAIXAATUAL}`);
console.log(`   📊 totalExpedido após expedição: ${estado.formData.ESCOLA_GRADE.totalExpedido}`);
console.log(`   📊 Item 1 quantidadeExpedida: ${estado.formData.ITEM_SELECIONADO.quantidadeExpedida}`);

// 3. Fechar modal de expedição
console.log("\n3️⃣ FECHANDO MODAL DE EXPEDIÇÃO...");
estado.formData = fecharTelaExped(estado.formData);
console.log(`   ✅ Modal fechado`);
console.log(`   📊 QUANTIDADELIDA preservada: ${estado.formData.QUANTIDADELIDA}`);
console.log(`   📊 QUANTIDADENACAIXAATUAL preservada: ${estado.formData.QUANTIDADENACAIXAATUAL}`);
console.log(`   📊 ESCOLA_GRADE preservada: ${estado.formData.ESCOLA_GRADE.totalExpedido}`);

// 4. IMPORTANTE: A grade NÃO foi atualizada (como acontece na sua aplicação)
console.log("\n4️⃣ GRADE NÃO ATUALIZADA (como na sua aplicação)...");
console.log(`   📊 Grade ainda mostra: Item 1 quantidadeExpedida = ${grade.itensGrade[0].quantidadeExpedida}`);
console.log(`   📊 Mas formData tem: QUANTIDADELIDA = ${estado.formData.QUANTIDADELIDA}`);

// 5. Selecionar Item 2 (TESTE DA CORREÇÃO!)
console.log("\n5️⃣ SELECIONANDO ITEM 2...");
const item2 = grade.itensGrade[1];
estado.formData.ITEM_SELECIONADO = item2;
const escolaGrade2 = abrirTelaExped(item2, grade, estado.formData);
console.log(`   📊 ANTES de handleEscolaGradeSelecionada_CORRIGIDA:`);
console.log(`      QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);
console.log(`      QUANTIDADENACAIXAATUAL: ${estado.formData.QUANTIDADENACAIXAATUAL}`);
console.log(`      ESCOLA_GRADE.totalExpedido: ${estado.formData.ESCOLA_GRADE.totalExpedido}`);
console.log(`      escolaGrade2.totalExpedido: ${escolaGrade2.totalExpedido}`);

estado.formData = handleEscolaGradeSelecionada_CORRIGIDA(escolaGrade2, estado.formData);
console.log(`   📊 DEPOIS de handleEscolaGradeSelecionada_CORRIGIDA:`);
console.log(`      QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);
console.log(`      QUANTIDADENACAIXAATUAL: ${estado.formData.QUANTIDADENACAIXAATUAL}`);
console.log(`      ESCOLA_GRADE.totalExpedido: ${estado.formData.ESCOLA_GRADE.totalExpedido}`);

// 6. Verificar resultado
console.log("\n6️⃣ RESULTADO:");
if (estado.formData.QUANTIDADELIDA === '1') {
    console.log(`   ✅ CORREÇÃO FUNCIONOU! Contabilização preservada`);
    console.log(`   📊 QUANTIDADELIDA final: ${estado.formData.QUANTIDADELIDA}`);
    console.log(`   📊 ESCOLA_GRADE.totalExpedido final: ${estado.formData.ESCOLA_GRADE.totalExpedido}`);
} else {
    console.log(`   ❌ CORREÇÃO FALHOU! Contabilização perdida`);
    console.log(`   📊 QUANTIDADELIDA final: ${estado.formData.QUANTIDADELIDA}`);
    console.log(`   📊 Esperado: 1, Obtido: ${estado.formData.QUANTIDADELIDA}`);
}

console.log("\n" + "=" .repeat(60));
console.log("🎯 CONCLUSÃO: A correção preserva o estado local");
console.log("   quando já existe contabilização, evitando que");
console.log("   dados da grade desatualizada sobrescrevam o estado!");
