# Configuração do Firebase para o Sistema de Estoque em Tempo Real

Este guia explica como configurar o Firebase para o sistema de controle de estoque colaborativo.

## Passo 1: Criar uma conta no Firebase

1. Acesse [firebase.google.com](https://firebase.google.com/) e faça login com sua conta Google
2. Clique em "Ir para o console"
3. Clique em "Adicionar projeto"
4. Dê um nome para o projeto (ex: "controle-estoque")
5. Siga os passos de configuração (pode desativar o Google Analytics se desejar)
6. Aguarde a criação do projeto e clique em "Continuar"

## Passo 2: Configurar o Realtime Database

1. No menu à esquerda, clique em "Realtime Database"
2. Clique em "Criar banco de dados"
3. Escolha a região mais próxima de você
4. Comece no modo de teste (para desenvolvimento)
5. Clique em "Ativar"

## Passo 3: Configurar Autenticação

1. No menu à esquerda, clique em "Authentication"
2. Em "Sign-in method", clique em "Anônimo"
3. Ative a opção "Anônimo" e clique em "Salvar"

## Passo 4: Obter as credenciais de configuração

1. Na visão geral do projeto, clique no ícone da Web (</>) para adicionar um app da Web
2. Dê um nome para o app (ex: "controle-estoque-web")
3. Não é necessário configurar Firebase Hosting agora, então clique em "Registrar app"
4. Você verá um bloco de código com as credenciais do Firebase - copie o objeto `firebaseConfig`

## Passo 5: Atualizar o arquivo firebase-config.js

1. Abra o arquivo `firebase-config.js` em seu projeto
2. Substitua o objeto `firebaseConfig` pelo que você copiou no passo anterior:

```javascript
// Configuração do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJECT_ID.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJECT_ID.appspot.com",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID",
  databaseURL: "https://SEU_PROJECT_ID-default-rtdb.firebaseio.com"
};
```

## Passo 6: Configurar regras de segurança (opcional, mas recomendado para produção)

1. No menu à esquerda, clique em "Realtime Database"
2. Vá para a aba "Regras"
3. Atualize as regras para controlar o acesso aos dados (exemplo básico):

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "users": {
      "$uid": {
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

## Passo 7: Testar a conexão

1. Abra seu projeto em um navegador
2. Abra o console do navegador (F12)
3. Verifique se não há erros de conexão com o Firebase
4. Teste a edição de células na tabela - os dados devem ser salvos no Firebase
5. Abra o site em outra janela ou dispositivo para verificar a sincronização em tempo real

## Solução de problemas

- Se os dados não estiverem sincronizando, verifique a conexão com o Firebase no console do navegador
- Certifique-se de que a estrutura do banco de dados corresponde ao esperado pelo código
- Verifique se o Firebase Realtime Database está ativado e configurado corretamente
- Certifique-se de que as regras de segurança não estão bloqueando o acesso aos dados

## Próximos passos

- Configure o Firebase Hosting para hospedar seu aplicativo na nuvem
- Implemente autenticação mais robusta (e-mail/senha, Google, etc.)
- Configure backups regulares do banco de dados 