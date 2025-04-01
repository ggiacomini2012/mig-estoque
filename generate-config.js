// Script para gerar configuração do Firebase a partir de variáveis de ambiente
require('dotenv').config();
const fs = require('fs');

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
  console.error('Erro: Variáveis de ambiente ausentes no arquivo .env:');
  missingVars.forEach(variable => {
    console.error(`- ${variable}`);
  });
  process.exit(1);
}

// Conteúdo do arquivo de configuração
const fileContent = `// Configuração do Firebase - Gerado automaticamente a partir do .env
// NÃO EDITE ESTE ARQUIVO DIRETAMENTE - Use o arquivo .env
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