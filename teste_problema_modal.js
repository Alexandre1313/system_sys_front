// 🧪 TESTE DO PROBLEMA COM MODAL DE ENCERRAR CAIXA
// Este arquivo demonstra o problema com a abertura do modal

console.log("🚨 TESTE DO PROBLEMA COM MODAL DE ENCERRAR CAIXA");
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
            { id: 1, quantidade: 2, quantidadeExpedida: 0, qtyPCaixa: 0, isCount: true, nome: "Item A" },
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
        totalAExpedir: 4 - totalExpedido, // Total da grade: 2+2 = 4
        grade: grade
    };
    
    return escolaGrade;
}

// ✅ FUNÇÃO CORRIGIDA (CÓDIGO ATUAL)
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

function verificarModalDeveAbrir(formData) {
    // Simula a lógica que verifica se deve abrir o modal
    return formData.ESCOLA_GRADE?.totalAExpedir === 0;
}

// 🧪 TESTE: DEMONSTRAÇÃO DO PROBLEMA
console.log("\n🚨 TESTE: DEMONSTRAÇÃO DO PROBLEMA");
console.log("-" .repeat(50));

let estado = { ...estadoInicial };
let grade = { ...estadoInicial.grade };

console.log("📋 ESTADO INICIAL:");
console.log(`   Grade: ${grade.itensGrade.map(item => `${item.nome}: ${item.quantidadeExpedida}/${item.quantidade}`).join(', ')}`);
console.log(`   Total a expedir: 4 itens`);

// 1. Expedir Item A (2 itens)
console.log("\n1️⃣ EXPEDINDO ITEM A (2 itens)...");
const itemA = grade.itensGrade[0];
estado.formData.ITEM_SELECIONADO = itemA;
const escolaGradeA = abrirTelaExped(itemA, grade, estado.formData);
estado.formData = handleEscolaGradeSelecionada_CORRIGIDA(escolaGradeA, estado.formData);
console.log(`   ✅ Modal aberto - QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);
console.log(`   📊 ESCOLA_GRADE.totalAExpedir: ${estado.formData.ESCOLA_GRADE.totalAExpedir}`);

estado.formData = processarCodigoDeBarras(estado.formData, 2);
console.log(`   ✅ Item A expedido - QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);
console.log(`   📊 ESCOLA_GRADE.totalAExpedir após expedição: ${estado.formData.ESCOLA_GRADE.totalAExpedir}`);

estado.formData = fecharTelaExped(estado.formData);
console.log(`   ✅ Modal fechado - Estado preservado`);

// 2. Expedir Item B (2 itens) - PROBLEMA AQUI!
console.log("\n2️⃣ EXPEDINDO ITEM B (2 itens) - PROBLEMA AQUI!");
const itemB = grade.itensGrade[1];
estado.formData.ITEM_SELECIONADO = itemB;
const escolaGradeB = abrirTelaExped(itemB, grade, estado.formData);
console.log(`   📊 ANTES da correção:`);
console.log(`      QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);
console.log(`      ESCOLA_GRADE.totalAExpedir: ${estado.formData.ESCOLA_GRADE.totalAExpedir}`);
console.log(`      escolaGradeB.totalAExpedir: ${escolaGradeB.totalAExpedir}`);

estado.formData = handleEscolaGradeSelecionada_CORRIGIDA(escolaGradeB, estado.formData);
console.log(`   📊 DEPOIS da correção:`);
console.log(`      QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);
console.log(`      ESCOLA_GRADE.totalAExpedir: ${estado.formData.ESCOLA_GRADE.totalAExpedir}`);

estado.formData = processarCodigoDeBarras(estado.formData, 2);
console.log(`   ✅ Item B expedido - QUANTIDADELIDA: ${estado.formData.QUANTIDADELIDA}`);
console.log(`   📊 ESCOLA_GRADE.totalAExpedir após expedição: ${estado.formData.ESCOLA_GRADE.totalAExpedir}`);

// 3. Verificar se modal deve abrir
console.log("\n3️⃣ VERIFICANDO SE MODAL DEVE ABRIR...");
const modalDeveAbrir = verificarModalDeveAbrir(estado.formData);
console.log(`   📊 ESCOLA_GRADE.totalAExpedir: ${estado.formData.ESCOLA_GRADE.totalAExpedir}`);
console.log(`   📊 Modal deve abrir: ${modalDeveAbrir}`);

if (modalDeveAbrir) {
    console.log(`   ✅ MODAL DEVE ABRIR! Grade finalizada.`);
} else {
    console.log(`   ❌ PROBLEMA! Modal não vai abrir porque totalAExpedir não está correto.`);
    console.log(`   ❌ Esperado: 0, Obtido: ${estado.formData.ESCOLA_GRADE.totalAExpedir}`);
}

console.log("\n" + "=" .repeat(60));
console.log("🎯 CONCLUSÃO: O problema está na preservação do ESCOLA_GRADE");
console.log("   que mantém o totalAExpedir antigo, impedindo que o modal");
console.log("   seja aberto quando a grade está realmente finalizada!");
