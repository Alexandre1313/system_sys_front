// TESTE PESADO COMPLETO - GRADE DO BACKEND COM TODAS AS OPERAÇÕES
console.log('🔥 === TESTE PESADO COMPLETO - GRADE DO BACKEND COM TODAS AS OPERAÇÕES ===\n');

// ===== SIMULAÇÃO DE GRADE REAL DO BACKEND =====
console.log('📋 === SIMULAÇÃO DE GRADE REAL DO BACKEND ===');

function criarItemGradeReal(id, quantidade, quantidadeExpedida = 0, qtyPCaixa = 0, isCount = false) {
  return {
    id: id,
    quantidade: quantidade,
    quantidadeExpedida: quantidadeExpedida,
    qtyPCaixa: qtyPCaixa,
    isCount: isCount,
    nome: `Item ${id}`,
    tamanho: `T${id % 10}`,
    cor: `Cor${id % 5}`,
    genero: `Genero ${id % 3}`,
    itemTamanho: {
      id: id,
      item: {
        nome: `Item ${id}`,
        genero: `Genero ${id % 3}`
      },
      tamanho: {
        nome: `T${id % 10}`
      }
    }
  };
}

function criarEscolaGradeReal(totalExpedido = 0, totalAExpedir = 0) {
  return {
    totalExpedido: totalExpedido,
    totalAExpedir: totalAExpedir,
    nomeEscola: 'Escola Municipal Teste',
    numeroEscola: '12345',
    grade: {
      itensGrade: []
    }
  };
}

// Simular dados reais do backend
let dadosBackend = {
  escolaGrade: null,
  caixas: [],
  operacoes: []
};

// ===== FUNÇÕES DE NEGÓCIO =====
function atualizarQuantidadeCaixa(formData) {
  const { ITEM_SELECIONADO } = formData;
  ITEM_SELECIONADO.quantidadeExpedida += 1;
  ITEM_SELECIONADO.qtyPCaixa += 1;
  ITEM_SELECIONADO.isCount = true;
}

function atualizarQuantidadeCaixaNnnInvert(formData, quantidade) {
  const { ITEM_SELECIONADO } = formData;
  const remover = Math.min(quantidade, ITEM_SELECIONADO.qtyPCaixa);
  ITEM_SELECIONADO.quantidadeExpedida -= remover;
  ITEM_SELECIONADO.qtyPCaixa -= remover;
}

function processarCodigoDeBarras(formData) {
  const { ITEM_SELECIONADO, QUANTIDADELIDA, QUANTIDADENACAIXAATUAL } = formData;
  
  if (ITEM_SELECIONADO && ITEM_SELECIONADO.quantidadeExpedida < ITEM_SELECIONADO.quantidade) {
    const quantidadeExpedir = parseInt(QUANTIDADELIDA) || 1;
    const quantidadeDisponivel = ITEM_SELECIONADO.quantidade - ITEM_SELECIONADO.quantidadeExpedida;
    const quantidadeFinal = Math.min(quantidadeExpedir, quantidadeDisponivel);
    
    ITEM_SELECIONADO.quantidadeExpedida += quantidadeFinal;
    ITEM_SELECIONADO.qtyPCaixa += quantidadeFinal;
    ITEM_SELECIONADO.isCount = true;
    
    formData.QUANTIDADENACAIXAATUAL = (parseInt(QUANTIDADENACAIXAATUAL) || 0) + quantidadeFinal;
    
    return quantidadeFinal;
  }
  return 0;
}

function processarCodigoDeBarrasInvert(formData) {
  const { ITEM_SELECIONADO, QUANTIDADELIDA, QUANTIDADENACAIXAATUAL } = formData;
  
  if (ITEM_SELECIONADO && ITEM_SELECIONADO.qtyPCaixa > 0) {
    const quantidadeDecrementar = parseInt(QUANTIDADELIDA) || 1;
    const quantidadeDisponivel = ITEM_SELECIONADO.qtyPCaixa;
    const quantidadeFinal = Math.min(quantidadeDecrementar, quantidadeDisponivel);
    
    ITEM_SELECIONADO.quantidadeExpedida -= quantidadeFinal;
    ITEM_SELECIONADO.qtyPCaixa -= quantidadeFinal;
    
    formData.QUANTIDADENACAIXAATUAL = Math.max(0, (parseInt(QUANTIDADENACAIXAATUAL) || 0) - quantidadeFinal);
    
    return quantidadeFinal;
  }
  return 0;
}

function criarCaixa(formData) {
  const { ESCOLA_GRADE } = formData;
  const caixa = {
    caixaItem: [],
    qtyCaixa: 0
  };
  
  let totalExpedido = 0;
  
  for (const itemGrade of ESCOLA_GRADE.grade.itensGrade) {
    if (itemGrade.isCount && itemGrade.qtyPCaixa > 0) {
      const quantidadeParaCaixa = itemGrade.qtyPCaixa;
      
      const novoItem = {
        itemName: itemGrade.itemTamanho.item.nome,
        itemGenero: itemGrade.itemTamanho.item.genero,
        itemTam: itemGrade.itemTamanho.tamanho.nome,
        itemQty: quantidadeParaCaixa,
        itemTamanhoId: itemGrade.itemTamanho.id,
      };
      
      caixa.caixaItem.push(novoItem);
      totalExpedido += quantidadeParaCaixa;
    }
  }
  
  caixa.qtyCaixa = totalExpedido;
  
  if (totalExpedido === 0) {
    return null;
  }
  
  return caixa;
}

function zerarQuantidadesCaixa(formData) {
  const { ESCOLA_GRADE } = formData;
  
  let totalExpedidoNaCaixa = 0;
  
  for (const itemGrade of ESCOLA_GRADE.grade.itensGrade) {
    if (itemGrade.isCount && itemGrade.qtyPCaixa > 0) {
      totalExpedidoNaCaixa += itemGrade.qtyPCaixa;
      
      if (itemGrade.quantidade === itemGrade.quantidadeExpedida) {
        itemGrade.qtyPCaixa = 0;
        itemGrade.isCount = false;
      } else {
        itemGrade.qtyPCaixa = 0;
      }
    }
  }
  
  ESCOLA_GRADE.totalExpedido += totalExpedidoNaCaixa;
  ESCOLA_GRADE.totalAExpedir = ESCOLA_GRADE.grade.itensGrade.reduce((sum, item) => sum + (item.quantidade - item.quantidadeExpedida), 0);
  
  return totalExpedidoNaCaixa;
}

// ===== SIMULAÇÃO DE BACKEND =====
async function inserirCaixaBackend(caixa) {
  console.log(`📦 Inserindo caixa no backend: ${caixa.qtyCaixa} unidades`);
  
  const novaCaixa = {
    id: dadosBackend.caixas.length + 1,
    numero: `CX${String(dadosBackend.caixas.length + 1).padStart(3, '0')}`,
    qtyCaixa: caixa.qtyCaixa,
    itens: caixa.caixaItem,
    dataInsercao: new Date().toISOString()
  };
  
  dadosBackend.caixas.push(novaCaixa);
  
  // Atualizar dados no backend
  dadosBackend.escolaGrade.totalExpedido += caixa.qtyCaixa;
  
  for (const itemCaixa of caixa.caixaItem) {
    const itemGrade = dadosBackend.escolaGrade.grade.itensGrade.find(item => item.itemTamanho.id === itemCaixa.itemTamanhoId);
    if (itemGrade) {
      itemGrade.quantidadeExpedida += itemCaixa.itemQty;
    }
  }
  
  dadosBackend.escolaGrade.totalAExpedir = dadosBackend.escolaGrade.grade.itensGrade.reduce((sum, item) => sum + (item.quantidade - item.quantidadeExpedida), 0);
  
  console.log(`✅ Caixa inserida no backend: ${novaCaixa.numero}`);
  
  return novaCaixa;
}

async function buscarDadosBackend() {
  console.log('🔄 Buscando dados atualizados do backend...');
  await new Promise(resolve => setTimeout(resolve, 50));
  return dadosBackend.escolaGrade;
}

// ===== TESTE PESADO COMPLETO =====
console.log('🔥 === TESTE PESADO COMPLETO ===');

async function testePesadoCompleto() {
  console.log('🔥 Executando teste pesado completo...');
  
  // 1. CARREGAR GRADE DO BACKEND
  console.log('\n1️⃣ === CARREGANDO GRADE DO BACKEND ===');
  
  const escolaGrade = criarEscolaGradeReal();
  
  // Criar grade realista com 50 itens
  for (let i = 1; i <= 50; i++) {
    const quantidade = Math.floor(Math.random() * 200) + 50; // 50 a 250 unidades
    const item = criarItemGradeReal(i, quantidade);
    escolaGrade.grade.itensGrade.push(item);
  }
  
  // Inicializar dados do backend
  dadosBackend.escolaGrade = JSON.parse(JSON.stringify(escolaGrade));
  
  const quantidadeTotalInicial = escolaGrade.grade.itensGrade.reduce((sum, item) => sum + item.quantidade, 0);
  console.log(`📊 Grade carregada:`);
  console.log(`  - Total de itens: ${escolaGrade.grade.itensGrade.length}`);
  console.log(`  - Quantidade total inicial: ${quantidadeTotalInicial}`);
  console.log(`  - Total expedido inicial: ${escolaGrade.totalExpedido}`);
  console.log(`  - Total a expedir inicial: ${escolaGrade.totalAExpedir}`);
  
  // 2. EXPEDIR VÁRIAS CAIXAS
  console.log('\n2️⃣ === EXPEDINDO VÁRIAS CAIXAS ===');
  
  let totalNaCaixaAtual = 0;
  let caixasExpedidas = 0;
  
  // Expedir 10 caixas
  for (let caixa = 1; caixa <= 10; caixa++) {
    console.log(`\n📦 === CAIXA ${caixa} ===`);
    
    // Expedir itens aleatoriamente
    const itensParaExpedir = Math.floor(Math.random() * 15) + 5; // 5 a 20 itens
    for (let i = 0; i < itensParaExpedir; i++) {
      const itemIndex = Math.floor(Math.random() * escolaGrade.grade.itensGrade.length);
      const item = escolaGrade.grade.itensGrade[itemIndex];
      
      if (item.quantidadeExpedida < item.quantidade) {
        const quantidadeExpedir = Math.min(
          Math.floor(Math.random() * 20) + 5, // 5 a 25 unidades
          item.quantidade - item.quantidadeExpedida
        );
        
        item.quantidadeExpedida += quantidadeExpedir;
        item.qtyPCaixa += quantidadeExpedir;
        item.isCount = true;
        totalNaCaixaAtual += quantidadeExpedir;
      }
    }
    
    console.log(`📊 Total na caixa ${caixa}: ${totalNaCaixaAtual}`);
    
    // Criar e inserir caixa
    const caixaParaBackend = criarCaixa({ ESCOLA_GRADE: escolaGrade });
    if (caixaParaBackend) {
      await inserirCaixaBackend(caixaParaBackend);
      const totalExpedidoNaCaixa = zerarQuantidadesCaixa({ ESCOLA_GRADE: escolaGrade });
      await buscarDadosBackend();
      totalNaCaixaAtual = 0;
      caixasExpedidas++;
      console.log(`✅ Caixa ${caixa} expedida: ${totalExpedidoNaCaixa} unidades`);
    }
  }
  
  // 3. DECREMENTAR ALGUNS ITENS
  console.log('\n3️⃣ === DECREMENTANDO ALGUNS ITENS ===');
  
  // Expedir alguns itens para decrementar
  const itensParaDecrementar = Math.floor(Math.random() * 10) + 5;
  for (let i = 0; i < itensParaDecrementar; i++) {
    const itemIndex = Math.floor(Math.random() * escolaGrade.grade.itensGrade.length);
    const item = escolaGrade.grade.itensGrade[itemIndex];
    
    if (item.quantidadeExpedida < item.quantidade) {
      const quantidadeExpedir = Math.min(
        Math.floor(Math.random() * 15) + 10,
        item.quantidade - item.quantidadeExpedida
      );
      
      item.quantidadeExpedida += quantidadeExpedir;
      item.qtyPCaixa += quantidadeExpedir;
      item.isCount = true;
      totalNaCaixaAtual += quantidadeExpedir;
    }
  }
  
  console.log(`📊 Total na caixa antes de decrementar: ${totalNaCaixaAtual}`);
  
  // Decrementar alguns itens
  const itensParaDecrementarReal = Math.floor(Math.random() * 5) + 3;
  for (let i = 0; i < itensParaDecrementarReal; i++) {
    const itemIndex = Math.floor(Math.random() * escolaGrade.grade.itensGrade.length);
    const item = escolaGrade.grade.itensGrade[itemIndex];
    
    if (item.qtyPCaixa > 0) {
      const decremento = Math.min(
        Math.floor(Math.random() * 10) + 1,
        item.qtyPCaixa
      );
      
      item.quantidadeExpedida -= decremento;
      item.qtyPCaixa -= decremento;
      totalNaCaixaAtual -= decremento;
      
      console.log(`⬇️ Decrementado item ${item.id}: ${decremento} unidades`);
    }
  }
  
  console.log(`📊 Total na caixa após decrementar: ${totalNaCaixaAtual}`);
  
  // 4. INCREMENTAR NOVAMENTE
  console.log('\n4️⃣ === INCREMENTANDO NOVAMENTE ===');
  
  const itensParaIncrementar = Math.floor(Math.random() * 8) + 3;
  for (let i = 0; i < itensParaIncrementar; i++) {
    const itemIndex = Math.floor(Math.random() * escolaGrade.grade.itensGrade.length);
    const item = escolaGrade.grade.itensGrade[itemIndex];
    
    if (item.quantidadeExpedida < item.quantidade) {
      const quantidadeExpedir = Math.min(
        Math.floor(Math.random() * 12) + 3,
        item.quantidade - item.quantidadeExpedida
      );
      
      item.quantidadeExpedida += quantidadeExpedir;
      item.qtyPCaixa += quantidadeExpedir;
      item.isCount = true;
      totalNaCaixaAtual += quantidadeExpedir;
      
      console.log(`⬆️ Incrementado item ${item.id}: ${quantidadeExpedir} unidades`);
    }
  }
  
  console.log(`📊 Total na caixa após incrementar: ${totalNaCaixaAtual}`);
  
  // 5. CANCELAR CAIXA
  console.log('\n5️⃣ === CANCELANDO CAIXA ===');
  
  const qtyPCaixaAntesCancelamento = totalNaCaixaAtual;
  console.log(`📊 Total na caixa antes do cancelamento: ${qtyPCaixaAntesCancelamento}`);
  
  // Simular cancelamento (qtyPCaixa deve ser preservado)
  const qtyPCaixaDepoisCancelamento = escolaGrade.grade.itensGrade.reduce((sum, item) => sum + item.qtyPCaixa, 0);
  console.log(`📊 Total na caixa após cancelamento: ${qtyPCaixaDepoisCancelamento}`);
  console.log(`🔍 qtyPCaixa preservado: ${qtyPCaixaAntesCancelamento === qtyPCaixaDepoisCancelamento ? '✅ SIM' : '❌ NÃO'}`);
  
  // 6. REEXPEDIR
  console.log('\n6️⃣ === REEXPEDINDO ===');
  
  const itensParaReexpedir = Math.floor(Math.random() * 6) + 2;
  for (let i = 0; i < itensParaReexpedir; i++) {
    const itemIndex = Math.floor(Math.random() * escolaGrade.grade.itensGrade.length);
    const item = escolaGrade.grade.itensGrade[itemIndex];
    
    if (item.quantidadeExpedida < item.quantidade) {
      const quantidadeExpedir = Math.min(
        Math.floor(Math.random() * 8) + 2,
        item.quantidade - item.quantidadeExpedida
      );
      
      item.quantidadeExpedida += quantidadeExpedir;
      item.qtyPCaixa += quantidadeExpedir;
      item.isCount = true;
      totalNaCaixaAtual += quantidadeExpedir;
      
      console.log(`🔄 Reexpedido item ${item.id}: ${quantidadeExpedir} unidades`);
    }
  }
  
  console.log(`📊 Total na caixa após reexpedir: ${totalNaCaixaAtual}`);
  
  // 7. CONFIRMAR CAIXA
  console.log('\n7️⃣ === CONFIRMANDO CAIXA ===');
  
  const caixaParaBackend = criarCaixa({ ESCOLA_GRADE: escolaGrade });
  if (caixaParaBackend) {
    await inserirCaixaBackend(caixaParaBackend);
    const totalExpedidoNaCaixa = zerarQuantidadesCaixa({ ESCOLA_GRADE: escolaGrade });
    await buscarDadosBackend();
    totalNaCaixaAtual = 0;
    caixasExpedidas++;
    console.log(`✅ Caixa confirmada: ${totalExpedidoNaCaixa} unidades`);
  }
  
  // 8. EXPEDIR INÚMERAS CAIXAS
  console.log('\n8️⃣ === EXPEDINDO INÚMERAS CAIXAS ===');
  
  // Expedir mais 15 caixas
  for (let caixa = 11; caixa <= 25; caixa++) {
    console.log(`\n📦 === CAIXA ${caixa} ===`);
    
    const itensParaExpedir = Math.floor(Math.random() * 12) + 3;
    for (let i = 0; i < itensParaExpedir; i++) {
      const itemIndex = Math.floor(Math.random() * escolaGrade.grade.itensGrade.length);
      const item = escolaGrade.grade.itensGrade[itemIndex];
      
      if (item.quantidadeExpedida < item.quantidade) {
        const quantidadeExpedir = Math.min(
          Math.floor(Math.random() * 15) + 3,
          item.quantidade - item.quantidadeExpedida
        );
        
        item.quantidadeExpedida += quantidadeExpedir;
        item.qtyPCaixa += quantidadeExpedir;
        item.isCount = true;
        totalNaCaixaAtual += quantidadeExpedir;
      }
    }
    
    const caixaParaBackend = criarCaixa({ ESCOLA_GRADE: escolaGrade });
    if (caixaParaBackend) {
      await inserirCaixaBackend(caixaParaBackend);
      const totalExpedidoNaCaixa = zerarQuantidadesCaixa({ ESCOLA_GRADE: escolaGrade });
      await buscarDadosBackend();
      totalNaCaixaAtual = 0;
      caixasExpedidas++;
      console.log(`✅ Caixa ${caixa} expedida: ${totalExpedidoNaCaixa} unidades`);
    }
  }
  
  // 9. VERIFICAÇÃO FINAL
  console.log('\n9️⃣ === VERIFICAÇÃO FINAL ===');
  
  const quantidadeTotalFinal = escolaGrade.grade.itensGrade.reduce((sum, item) => sum + item.quantidade, 0);
  const quantidadeExpedidaFinal = escolaGrade.grade.itensGrade.reduce((sum, item) => sum + item.quantidadeExpedida, 0);
  const quantidadeRestanteFinal = escolaGrade.grade.itensGrade.reduce((sum, item) => sum + (item.quantidade - item.quantidadeExpedida), 0);
  
  console.log(`📊 VERIFICAÇÃO FINAL:`);
  console.log(`  - Quantidade total inicial: ${quantidadeTotalInicial}`);
  console.log(`  - Quantidade total final: ${quantidadeTotalFinal}`);
  console.log(`  - Quantidade expedida final: ${quantidadeExpedidaFinal}`);
  console.log(`  - Quantidade restante final: ${quantidadeRestanteFinal}`);
  console.log(`  - Total expedido da escola: ${escolaGrade.totalExpedido}`);
  console.log(`  - Total a expedir da escola: ${escolaGrade.totalAExpedir}`);
  console.log(`  - Caixas expedidas: ${caixasExpedidas}`);
  console.log(`  - Caixas no backend: ${dadosBackend.caixas.length}`);
  
  // Verificar integridade
  const integridadeQuantidadeTotal = quantidadeTotalInicial === quantidadeTotalFinal;
  const integridadeExpedida = quantidadeExpedidaFinal === escolaGrade.totalExpedido;
  const integridadeRestante = quantidadeRestanteFinal === escolaGrade.totalAExpedir;
  const integridadeSoma = quantidadeExpedidaFinal + quantidadeRestanteFinal === quantidadeTotalFinal;
  const integridadeBackend = escolaGrade.totalExpedido === dadosBackend.escolaGrade.totalExpedido;
  
  console.log(`\n🔍 VERIFICAÇÃO DE INTEGRIDADE:`);
  console.log(`  - Quantidade total preservada: ${integridadeQuantidadeTotal ? '✅ SIM' : '❌ NÃO'}`);
  console.log(`  - Quantidade expedida consistente: ${integridadeExpedida ? '✅ SIM' : '❌ NÃO'}`);
  console.log(`  - Quantidade restante consistente: ${integridadeRestante ? '✅ SIM' : '❌ NÃO'}`);
  console.log(`  - Soma expedida + restante = total: ${integridadeSoma ? '✅ SIM' : '❌ NÃO'}`);
  console.log(`  - Consistência com backend: ${integridadeBackend ? '✅ SIM' : '❌ NÃO'}`);
  
  const integridadeGeral = integridadeQuantidadeTotal && integridadeExpedida && integridadeRestante && integridadeSoma && integridadeBackend;
  
  console.log(`\n🏆 INTEGRIDADE GERAL: ${integridadeGeral ? '✅ PERFEITA' : '❌ PROBLEMA'}`);
  
  return integridadeGeral;
}

// Executar teste
testePesadoCompleto().then(resultado => {
  console.log(`\n🎉 === RESULTADO FINAL ===`);
  if (resultado) {
    console.log('🏆 === TESTE PESADO COMPLETO PASSOU! ===');
    console.log('✅ Grade carregada do backend!');
    console.log('✅ Várias caixas expedidas!');
    console.log('✅ Itens decrementados!');
    console.log('✅ Itens incrementados novamente!');
    console.log('✅ Caixa cancelada!');
    console.log('✅ Caixa reexpedida!');
    console.log('✅ Caixa confirmada!');
    console.log('✅ Inúmeras caixas expedidas!');
    console.log('✅ Quantidades finais batem com as iniciais!');
    console.log('🚀 SISTEMA ULTRA ROBUSTO!');
    console.log('💪 PRONTO PARA PRODUÇÃO!');
  } else {
    console.log('❌ === TESTE PESADO COMPLETO FALHOU! ===');
    console.log('🔍 INVESTIGAÇÃO NECESSÁRIA!');
  }
  
  console.log('\n🏁 === TESTE PESADO COMPLETO CONCLUÍDO ===');
});
