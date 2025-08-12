#!/bin/bash

APP_DIR="/home/xandy/projects/front_end/system-ventura"
SERVICE_NAME="frontend.service"

echo "➡️  Entrando no diretório do app..."
cd "$APP_DIR" || exit 1

# Descomente para instalar dependências só quando precisar
# echo "📦 Instalando dependências..."
# npm install

echo "🏗️  Rodando build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build feito com sucesso."
    echo "♻️  Reiniciando serviço..."
    sudo systemctl daemon-reload
    sudo systemctl restart "$SERVICE_NAME"
    echo "✅ System listening in http://192.168.1.169:3000 port 3000."
else
    echo "❌ Erro no build. Serviço não foi reiniciado."
    exit 1
fi
