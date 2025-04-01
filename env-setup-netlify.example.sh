#!/bin/bash

# Verificar se está logado no Netlify
echo "Verificando login no Netlify..."
netlify status

# Adicionar variáveis de ambiente no Netlify
echo "Adicionando variáveis de ambiente no Netlify..."
netlify env:set FIREBASE_API_KEY "SUA_API_KEY"
netlify env:set FIREBASE_AUTH_DOMAIN "SEU_PROJETO_ID.firebaseapp.com"
netlify env:set FIREBASE_DATABASE_URL "https://SEU_PROJETO_ID-default-rtdb.firebaseio.com"
netlify env:set FIREBASE_PROJECT_ID "SEU_PROJETO_ID"
netlify env:set FIREBASE_STORAGE_BUCKET "SEU_PROJETO_ID.appspot.com"
netlify env:set FIREBASE_MESSAGING_SENDER_ID "SEU_MESSAGING_SENDER_ID"
netlify env:set FIREBASE_APP_ID "SEU_APP_ID"

echo "Variáveis de ambiente configuradas com sucesso!" 