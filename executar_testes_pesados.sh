#!/bin/bash

echo "🧪 EXECUTANDO BATERIA COMPLETA DE TESTES PESADOS E INSANOS"
echo "=========================================================="

echo ""
echo "📋 Carregando funções base..."
node teste_pesado_base.js

echo ""
echo "🧪 Executando Teste 1: Operações Complexas..."
node teste_pesado_1.js

echo ""
echo "🧪 Executando Teste 2: Múltiplas Caixas..."
node teste_pesado_2.js

echo ""
echo "🧪 Executando Teste 3: Edge Cases..."
node teste_pesado_3.js

echo ""
echo "🧪 Executando Teste 4: Consistência de Quantidades..."
node teste_pesado_4.js

echo ""
echo "🧪 Executando Teste 5: Performance e Stress..."
node teste_pesado_5.js

echo ""
echo "🎉 BATERIA DE TESTES CONCLUÍDA!"
echo "=========================================================="
