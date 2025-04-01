// Script para gerar configuração do Firebase a partir de variáveis de ambiente
// No ambiente Netlify, as variáveis vêm diretamente de process.env
// Em ambiente local, carregamos do arquivo .env
try {
  require('dotenv').config();
} catch (error) {
  console.log('Executando sem dotenv, provavelmente em ambiente Netlify');
}

const fs = require('fs');

// Verificar se está rodando no Netlify
const isNetlify = process.env.NETLIFY === 'true';
if (isNetlify) {
  console.log('Detectado ambiente Netlify: gerando firebase-config.js com variáveis de ambiente do Netlify');
} else {
  console.log('Ambiente local: gerando firebase-config.js com variáveis do arquivo .env');
}

// Obter as variáveis de ambiente
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Verificar se todas as variáveis necessárias estão definidas
const missingVars = Object.entries(firebaseConfig)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.warn('Aviso: Algumas variáveis de ambiente estão ausentes:');
  missingVars.forEach(variable => {
    console.warn(`- ${variable}`);
  });
  console.warn('O script continuará, mas algumas funcionalidades do Firebase podem não funcionar corretamente.');
  // Não interrompemos a execução, mesmo com variáveis faltando
}

// Conteúdo do arquivo de configuração
const fileContent = `// Configuração do Firebase - Gerado automaticamente pelo script
// NÃO EDITE ESTE ARQUIVO DIRETAMENTE - Use variáveis de ambiente
const firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

// Referência para a tabela de estoque no banco de dados
const estoqueRef = db.ref('estoque');`;

// Escrever o arquivo
fs.writeFileSync('firebase-config.js', fileContent);
console.log('Arquivo firebase-config.js gerado com sucesso!'); 