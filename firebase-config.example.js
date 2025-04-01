// Configuração do Firebase - ARQUIVO DE EXEMPLO
// Para configurar o Firebase:
// 1. Copie este arquivo para "firebase-config.js"
// 2. Substitua os valores de exemplo abaixo pelas suas credenciais do Firebase
// 3. Certifique-se de não commitar o arquivo firebase-config.js (ele deve estar no .gitignore)

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

// Referência para a tabela de estoque no banco de dados
const estoqueRef = db.ref('estoque'); 