#!/bin/bash

# Verificar se o gh CLI está instalado
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI não está instalado. Por favor, instale primeiro."
    echo "Visite: https://cli.github.com/manual/installation"
    exit 1
fi

# Verificar login
echo "Verificando login no GitHub..."
if ! gh auth status &> /dev/null; then
    echo "Por favor, faça login no GitHub primeiro:"
    gh auth login
fi

# Obter o repositório atual
REPO=$(git config --get remote.origin.url | sed 's/.*github.com[:\/]\(.*\)\.git/\1/')

if [ -z "$REPO" ]; then
    echo "Não foi possível determinar o repositório GitHub. Por favor, especifique:"
    read -p "Nome do repositório (formato: usuario/repo): " REPO
fi

echo "Configurando secrets para o repositório: $REPO"

# Carregando variáveis do arquivo .env
if [ -f .env ]; then
    echo "Carregando variáveis do arquivo .env..."
    export $(grep -v '^#' .env | xargs)
else
    echo "Arquivo .env não encontrado. Por favor, crie-o primeiro."
    exit 1
fi

# Configurar secrets no GitHub
echo "Adicionando secrets ao repositório..."

# Firebase API Key
if [ -n "$FIREBASE_API_KEY" ]; then
    echo "Configurando FIREBASE_API_KEY..."
    echo "$FIREBASE_API_KEY" | gh secret set FIREBASE_API_KEY -R "$REPO"
else
    echo "FIREBASE_API_KEY não encontrada no arquivo .env"
fi

# Firebase Auth Domain
if [ -n "$FIREBASE_AUTH_DOMAIN" ]; then
    echo "Configurando FIREBASE_AUTH_DOMAIN..."
    echo "$FIREBASE_AUTH_DOMAIN" | gh secret set FIREBASE_AUTH_DOMAIN -R "$REPO"
else
    echo "FIREBASE_AUTH_DOMAIN não encontrada no arquivo .env"
fi

# Firebase Database URL
if [ -n "$FIREBASE_DATABASE_URL" ]; then
    echo "Configurando FIREBASE_DATABASE_URL..."
    echo "$FIREBASE_DATABASE_URL" | gh secret set FIREBASE_DATABASE_URL -R "$REPO"
else
    echo "FIREBASE_DATABASE_URL não encontrada no arquivo .env"
fi

# Firebase Project ID
if [ -n "$FIREBASE_PROJECT_ID" ]; then
    echo "Configurando FIREBASE_PROJECT_ID..."
    echo "$FIREBASE_PROJECT_ID" | gh secret set FIREBASE_PROJECT_ID -R "$REPO"
else
    echo "FIREBASE_PROJECT_ID não encontrada no arquivo .env"
fi

# Firebase Storage Bucket
if [ -n "$FIREBASE_STORAGE_BUCKET" ]; then
    echo "Configurando FIREBASE_STORAGE_BUCKET..."
    echo "$FIREBASE_STORAGE_BUCKET" | gh secret set FIREBASE_STORAGE_BUCKET -R "$REPO"
else
    echo "FIREBASE_STORAGE_BUCKET não encontrada no arquivo .env"
fi

# Firebase Messaging Sender ID
if [ -n "$FIREBASE_MESSAGING_SENDER_ID" ]; then
    echo "Configurando FIREBASE_MESSAGING_SENDER_ID..."
    echo "$FIREBASE_MESSAGING_SENDER_ID" | gh secret set FIREBASE_MESSAGING_SENDER_ID -R "$REPO"
else
    echo "FIREBASE_MESSAGING_SENDER_ID não encontrada no arquivo .env"
fi

# Firebase App ID
if [ -n "$FIREBASE_APP_ID" ]; then
    echo "Configurando FIREBASE_APP_ID..."
    echo "$FIREBASE_APP_ID" | gh secret set FIREBASE_APP_ID -R "$REPO"
else
    echo "FIREBASE_APP_ID não encontrada no arquivo .env"
fi

echo "Configuração de secrets concluída!"
echo "Para verificar os secrets configurados, visite:"
echo "https://github.com/$REPO/settings/secrets/actions" 