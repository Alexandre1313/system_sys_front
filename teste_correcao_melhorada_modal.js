// 🧪 TESTE DA CORREÇÃO MELHORADA PARA MODAL
// Este arquivo testa se a correção melhorada resolve o problema do modal

console.log("🔧 TESTE DA CORREÇÃO MELHORADA PARA MODAL");
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
            { id: 1, quantidade: 3, quantidadeExpedida: 0, qtyPCaixa: 0, isCount: true, nome: "Item A" },
            { id: 2, quantidade: 2, quantidadeExpedida: 0, qtyPCaixa: 0, isCount: true, nome: "Item B" }
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
        totalAExpedir: 5 - totalExpedido, // Total da grade: 3+2 = 5
        grade: grade
    };
    
    return escolaGrade;
}

// ✅ FUNÇÃO CORRIGIDA MELHORADA (CÓDIGO APÓS NOVA CORREÇÃO)
function handleEscolaGradeSelecionada_MELHORADA(escolaGrade, formData) {
    return {
        ...formData,
        // ✅ CORREÇÃO MELHORADA: Preservar contabilização local e sincronizar totalAExpedir
        ESCOLA_GRADE: (formData.ESCOLA_GRADE?.totalExpedido ?? 0) > 0 
            ? {
                ...formData.ESCOLA_GRADE,
                // Sincronizar totalAExpedir com o estado atual
                totalAExpedir: (escolaGrade?.totalAExpedir ?? 0) + (formData.ESCOLA_GRADE.totalExpedido - (escolaGrade?.totalExpedido ?? 0))
              }
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

// 🧪 TESTE: DEMONSTRAÇÃO DA CORREÇÃO MELHORADA
console.log("\n🔧 TESTE: DEMONSTRAÇÃO DA CORREÇÃO MELHORADA");
console.log("-" .repeat(50));

let estado = { ...estadoInicial };
let grade = { ...estadoInicial.grade };

console.log("📋 ESTADO INICIAL:");
console.log(`   Grade: ${grade.itensGrade.map(item => `${item.nome}: ${item.quantidadeExpedida}/${item.quantidade}`).join(', ')}`);
console.log(`   Total a expedir: 5 itens`);

// 1. Expedir Item A (3 itens)
console.log("\n1️⃣ EXPEDINDO ITEM A (3 itens)...");
const itemA = grade.itensGrade[0];
estado.formData.ITEM_SELECIONADO = itemA;
const escolaGradeA = abrirTelaExped(itemA, grade, estado.formData);
estado.formData = handleEscolaGradeSelecionada_MELHORADA(escolaGradeA, estado.formData);
console.log(`   ✅ Modal aberto - QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);
console.log(`   📊 ESCOLA_GRADE.totalAExpedir: ${estado.formData.ESCOLA_GRADE.totalAExpedir}`);

estado.formData = processarCodigoDeBarras(estado.formData, 3);
console.log(`   ✅ Item A expedido - QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);
console.log(`   📊 ESCOLA_GRADE.totalAExpedir após expedição: ${estado.formData.ESCOLA_GRADE.totalAExpedir}`);

estado.formData = fecharTelaExped(estado.formData);
console.log(`   ✅ Modal fechado - Estado preservado`);

// 2. Expedir Item B (2 itens) - TESTE DA CORREÇÃO MELHORADA!
console.log("\n2️⃣ EXPEDINDO ITEM B (2 itens) - TESTE DA CORREÇÃO MELHORADA!");
const itemB = grade.itensGrade[1];
estado.formData.ITEM_SELECIONADO = itemB;
const escolaGradeB = abrirTelaExped(itemB, grade, estado.formData);
console.log(`   📊 ANTES da correção melhorada:`);
console.log(`      QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);
console.log(`      ESCOLA_GRADE.totalExpedido: ${estado.formData.ESCOLA_GRADE.totalExpedido}`);
console.log(`      ESCOLA_GRADE.totalAExpedir: ${estado.formData.ESCOLA_GRADE.totalAExpedir}`);
console.log(`      escolaGradeB.totalExpedido: ${escolaGradeB.totalExpedido}`);
console.log(`      escolaGradeB.totalAExpedir: ${escolaGradeB.totalAExpedir}`);

estado.formData = handleEscolaGradeSelecionada_MELHORADA(escolaGradeB, estado.formData);
console.log(`   📊 DEPOIS da correção melhorada:`);
console.log(`      QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);
console.log(`      ESCOLA_GRADE.totalExpedido: ${estado.formData.ESCOLA_GRADE.totalExpedido}`);
console.log(`      ESCOLA_GRADE.totalAExpedir: ${estado.formData.ESCOLA_GRADE.totalAExpedir}`);

estado.formData = processarCodigoDeBarras(estado.formData, 2);
console.log(`   ✅ Item B expedido - QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);
console.log(`   📊 ESCOLA_GRADE.totalAExpedir após expedição: ${estado.formData.ESCOLA_GRADE.totalAExpedir}`);

// 3. Verificar condições para abrir modal
console.log("\n3️⃣ VERIFICANDO CONDIÇÕES PARA ABRIR MODAL...");
console.log(`   📊 ESCOLA_GRADE.totalExpedido: ${estado.formData.ESCOLA_GRADE.totalExpedido}`);
console.log(`   📊 ESCOLA_GRADE.totalAExpedir: ${estado.formData.ESCOLA_GRADE.totalAExpedir}`);
console.log(`   📊 ESCOLA_GRADE.finalizada: ${estado.formData.ESCOLA_GRADE.finalizada}`);
console.log(`   📊 QUANTIDADENACAIXAATUAL: ${estado.formData.QUANTIDADENACAIXAATUAL}`);

// Verificar se modal deve abrir (lógica do GradeComponent)
const modalDeveAbrir = estado.formData.ESCOLA_GRADE?.totalAExpedir === 0 && !estado.formData.ESCOLA_GRADE?.finalizada;
console.log(`   📊 Modal deve abrir (totalAExpedir === 0 && !finalizada): ${modalDeveAbrir}`);

// Verificar se há itens na caixa atual
const temItensNaCaixa = Number(estado.formData.QUANTIDADENACAIXAATUAL) > 0;
console.log(`   📊 Tem itens na caixa atual: ${temItensNaCaixa}`);

if (modalDeveAbrir && temItensNaCaixa) {
    console.log(`   ✅ CORREÇÃO MELHORADA FUNCIONOU! Modal deve abrir.`);
} else {
    console.log(`   ❌ CORREÇÃO MELHORADA FALHOU! Modal não vai abrir:`);
    if (!modalDeveAbrir) {
        console.log(`      - totalAExpedir: ${estado.formData.ESCOLA_GRADE.totalAExpedir} (deveria ser 0)`);
        console.log(`      - finalizada: ${estado.formData.ESCOLA_GRADE.finalizada} (deveria ser false)`);
    }
    if (!temItensNaCaixa) {
        console.log(`      - QUANTIDADENACAIXAATUAL: ${estado.formData.QUANTIDADENACAIXAATUAL} (deveria ser > 0)`);
    }
}

console.log("\n" + "=" .repeat(60));
console.log("🎯 CONCLUSÃO: A correção melhorada sincroniza o totalAExpedir");
console.log("   com o estado local, garantindo que o modal abra corretamente!");
