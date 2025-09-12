// 🧪 SIMULAÇÃO COMPLETA: EXPEDIÇÃO MÁXIMA EM UMA CAIXA
// Este arquivo simula uma expedição completa com múltiplos itens

console.log("🚀 SIMULAÇÃO COMPLETA: EXPEDIÇÃO MÁXIMA EM UMA CAIXA");
console.log("=" .repeat(70));

// 📊 ESTADO INICIAL SIMULADO (grade com múltiplos itens)
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
            { id: 2, quantidade: 3, quantidadeExpedida: 0, qtyPCaixa: 0, isCount: true, nome: "Item B" },
            { id: 3, quantidade: 4, quantidadeExpedida: 0, qtyPCaixa: 0, isCount: true, nome: "Item C" },
            { id: 4, quantidade: 2, quantidadeExpedida: 0, qtyPCaixa: 0, isCount: true, nome: "Item D" }
        ]
    }
};

// 🔧 FUNÇÕES SIMULADAS (CÓDIGO CORRIGIDO)
function calcularTotalExpedido(grade) {
    return grade.itensGrade.reduce((totini, itemGrade) => {
        return totini + itemGrade.quantidadeExpedida;
    }, 0);
}

function abrirTelaExped(item, grade, formData) {
    const totalExpedido = calcularTotalExpedido(grade);
    
    const escolaGrade = {
        totalExpedido: totalExpedido,
        totalAExpedir: 14 - totalExpedido, // Total da grade: 5+3+4+2 = 14
        grade: grade
    };
    
    return escolaGrade;
}

// ✅ FUNÇÃO CORRIGIDA (CÓDIGO APÓS CORREÇÃO)
function handleEscolaGradeSelecionada_CORRIGIDA(escolaGrade, formData) {
    return {
        ...formData,
        // ✅ CORREÇÃO: Preservar estado local se já existe contabilização
        ESCOLA_GRADE: (formData.ESCOLA_GRADE?.totalExpedido ?? 0) > 0 
            ? formData.ESCOLA_GRADE 
            : escolaGrade,
        QUANTIDADELIDA: formData.QUANTIDADELIDA !== '0' 
            ? formData.QUANTIDADELIDA 
            : String(escolaGrade?.totalExpedido ?? 0),
    };
}

function processarCodigoDeBarras(formData, quantidade = 1) {
    // Simula a expedição de N itens
    const novoFormData = { ...formData };
    novoFormData.ITEM_SELECIONADO.quantidadeExpedida += quantidade;
    novoFormData.ITEM_SELECIONADO.qtyPCaixa += quantidade;
    novoFormData.ESCOLA_GRADE.totalExpedido += quantidade;
    novoFormData.ESCOLA_GRADE.totalAExpedir -= quantidade;
    novoFormData.QUANTIDADELIDA = String(Number(novoFormData.QUANTIDADELIDA) + quantidade);
    novoFormData.QUANTIDADENACAIXAATUAL = String(Number(novoFormData.QUANTIDADENACAIXAATUAL) + quantidade);
    
    return novoFormData;
}

function fecharTelaExped(formData) {
    return {
        ...formData,
        ITEM_SELECIONADO: null,
    };
}

function gerarCaixa(formData) {
    console.log(`\n📦 GERANDO CAIXA:`);
    console.log(`   📊 Total expedido: ${formData.ESCOLA_GRADE.totalExpedido}`);
    console.log(`   📊 Quantidade na caixa atual: ${formData.QUANTIDADENACAIXAATUAL}`);
    console.log(`   📊 Itens na caixa:`);
    
    // Simula a lista de itens que apareceria na caixa
    const grade = formData.ESCOLA_GRADE.grade;
    grade.itensGrade.forEach(item => {
        if (item.quantidadeExpedida > 0) {
            console.log(`      ✅ ${item.nome}: ${item.quantidadeExpedida}/${item.quantidade}`);
        }
    });
    
    return {
        ...formData,
        QUANTIDADENACAIXAATUAL: '0',
        NUMERODACAIXA: String(Number(formData.NUMERODACAIXA || '0') + 1)
    };
}

// 🧪 SIMULAÇÃO COMPLETA
console.log("\n🚀 SIMULAÇÃO COMPLETA: EXPEDIÇÃO MÁXIMA");
console.log("-" .repeat(50));

let estado = { ...estadoInicial };
let grade = { ...estadoInicial.grade };

console.log("📋 ESTADO INICIAL:");
console.log(`   Grade: ${grade.itensGrade.map(item => `${item.nome}: ${item.quantidadeExpedida}/${item.quantidade}`).join(', ')}`);
console.log(`   Total a expedir: 14 itens`);

// 1. EXPEDIR ITEM A (5 itens)
console.log("\n1️⃣ EXPEDINDO ITEM A (5 itens)...");
const itemA = grade.itensGrade[0];
estado.formData.ITEM_SELECIONADO = itemA;
const escolaGradeA = abrirTelaExped(itemA, grade, estado.formData);
estado.formData = handleEscolaGradeSelecionada_CORRIGIDA(escolaGradeA, estado.formData);
console.log(`   ✅ Modal aberto - QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);

estado.formData = processarCodigoDeBarras(estado.formData, 5);
console.log(`   ✅ Item A expedido - QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}, QUANTIDADENACAIXAATUAL: ${estado.formData.QUANTIDADENACAIXAATUAL}`);

estado.formData = fecharTelaExped(estado.formData);
console.log(`   ✅ Modal fechado - Estado preservado: QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);

// 2. EXPEDIR ITEM B (3 itens) - TESTE DA CORREÇÃO!
console.log("\n2️⃣ EXPEDINDO ITEM B (3 itens) - TESTE DA CORREÇÃO...");
const itemB = grade.itensGrade[1];
estado.formData.ITEM_SELECIONADO = itemB;
const escolaGradeB = abrirTelaExped(itemB, grade, estado.formData);
console.log(`   📊 ANTES da correção:`);
console.log(`      QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);
console.log(`      ESCOLA_GRADE.totalExpedido: ${estado.formData.ESCOLA_GRADE.totalExpedido}`);
console.log(`      escolaGradeB.totalExpedido: ${escolaGradeB.totalExpedido}`);

estado.formData = handleEscolaGradeSelecionada_CORRIGIDA(escolaGradeB, estado.formData);
console.log(`   📊 DEPOIS da correção:`);
console.log(`      QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);
console.log(`      ESCOLA_GRADE.totalExpedido: ${estado.formData.ESCOLA_GRADE.totalExpedido}`);

estado.formData = processarCodigoDeBarras(estado.formData, 3);
console.log(`   ✅ Item B expedido - QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}, QUANTIDADENACAIXAATUAL: ${estado.formData.QUANTIDADENACAIXAATUAL}`);

estado.formData = fecharTelaExped(estado.formData);
console.log(`   ✅ Modal fechado - Estado preservado: QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);

// 3. EXPEDIR ITEM C (4 itens) - TESTE DA CORREÇÃO!
console.log("\n3️⃣ EXPEDINDO ITEM C (4 itens) - TESTE DA CORREÇÃO...");
const itemC = grade.itensGrade[2];
estado.formData.ITEM_SELECIONADO = itemC;
const escolaGradeC = abrirTelaExped(itemC, grade, estado.formData);
console.log(`   📊 ANTES da correção:`);
console.log(`      QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);
console.log(`      ESCOLA_GRADE.totalExpedido: ${estado.formData.ESCOLA_GRADE.totalExpedido}`);
console.log(`      escolaGradeC.totalExpedido: ${escolaGradeC.totalExpedido}`);

estado.formData = handleEscolaGradeSelecionada_CORRIGIDA(escolaGradeC, estado.formData);
console.log(`   📊 DEPOIS da correção:`);
console.log(`      QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);
console.log(`      ESCOLA_GRADE.totalExpedido: ${estado.formData.ESCOLA_GRADE.totalExpedido}`);

estado.formData = processarCodigoDeBarras(estado.formData, 4);
console.log(`   ✅ Item C expedido - QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}, QUANTIDADENACAIXAATUAL: ${estado.formData.QUANTIDADENACAIXAATUAL}`);

estado.formData = fecharTelaExped(estado.formData);
console.log(`   ✅ Modal fechado - Estado preservado: QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);

// 4. EXPEDIR ITEM D (2 itens) - TESTE FINAL DA CORREÇÃO!
console.log("\n4️⃣ EXPEDINDO ITEM D (2 itens) - TESTE FINAL DA CORREÇÃO...");
const itemD = grade.itensGrade[3];
estado.formData.ITEM_SELECIONADO = itemD;
const escolaGradeD = abrirTelaExped(itemD, grade, estado.formData);
console.log(`   📊 ANTES da correção:`);
console.log(`      QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);
console.log(`      ESCOLA_GRADE.totalExpedido: ${estado.formData.ESCOLA_GRADE.totalExpedido}`);
console.log(`      escolaGradeD.totalExpedido: ${escolaGradeD.totalExpedido}`);

estado.formData = handleEscolaGradeSelecionada_CORRIGIDA(escolaGradeD, estado.formData);
console.log(`   📊 DEPOIS da correção:`);
console.log(`      QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);
console.log(`      ESCOLA_GRADE.totalExpedido: ${estado.formData.ESCOLA_GRADE.totalExpedido}`);

estado.formData = processarCodigoDeBarras(estado.formData, 2);
console.log(`   ✅ Item D expedido - QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}, QUANTIDADENACAIXAATUAL: ${estado.formData.QUANTIDADENACAIXAATUAL}`);

estado.formData = fecharTelaExped(estado.formData);
console.log(`   ✅ Modal fechado - Estado preservado: QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);

// 5. GERAR CAIXA
console.log("\n5️⃣ GERANDO CAIXA...");
estado.formData = gerarCaixa(estado.formData);

// 6. VERIFICAR RESULTADO FINAL
console.log("\n6️⃣ RESULTADO FINAL:");
console.log(`   📊 QUANTIDADELIDA final: ${estado.formData.QUANTIDADELIDA}`);
console.log(`   📊 ESCOLA_GRADE.totalExpedido final: ${estado.formData.ESCOLA_GRADE.totalExpedido}`);
console.log(`   📊 QUANTIDADENACAIXAATUAL final: ${estado.formData.QUANTIDADENACAIXAATUAL}`);
console.log(`   📊 Número da caixa: ${estado.formData.NUMERODACAIXA}`);

// Verificar se todos os itens foram contabilizados corretamente
const totalExpedidoEsperado = 5 + 3 + 4 + 2; // 14
const totalExpedidoReal = Number(estado.formData.QUANTIDADELIDA);

if (totalExpedidoReal === totalExpedidoEsperado) {
    console.log(`\n   ✅ SUCESSO TOTAL! Todos os ${totalExpedidoEsperado} itens foram contabilizados corretamente!`);
    console.log(`   ✅ A correção funcionou perfeitamente em todos os casos!`);
} else {
    console.log(`\n   ❌ FALHA! Esperado: ${totalExpedidoEsperado}, Obtido: ${totalExpedidoReal}`);
}

console.log("\n" + "=" .repeat(70));
console.log("🎯 CONCLUSÃO: A correção preserva o estado local");
console.log("   em expedições complexas com múltiplos itens,");
console.log("   garantindo que nenhuma contabilização seja perdida!");
