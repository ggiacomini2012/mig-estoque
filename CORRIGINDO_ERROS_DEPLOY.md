# Correção de Erros no Deploy - migestoque.netlify.app

Este documento explica os erros encontrados no deploy do site migestoque.netlify.app e como corrigi-los.

## Erros Identificados

Ao acessar o site, os seguintes erros são exibidos no console:

1. **Erro 404 ao carregar firebase-config.js**:
   ```
   GET https://migestoque.netlify.app/firebase-config.js net::ERR_ABORTED 404 (Not Found)
   ```

2. **Erros de referência não definida**:
   ```
   Uncaught ReferenceError: db is not defined
   Uncaught ReferenceError: auth is not defined
   ```

## Causas dos Erros

Estes erros estão ocorrendo pelas seguintes razões:

1. **Arquivo `firebase-config.js` ausente**: Este arquivo não está sendo enviado para o Netlify porque:
   - Está incluído no `.gitignore` por razões de segurança
   - Não está sendo gerado durante o processo de build no Netlify

2. **Variáveis `db` e `auth` não definidas**: Estas variáveis são definidas no arquivo `firebase-config.js` que está faltando, por isso estão sendo referenciadas antes de serem definidas.

## Soluções

### Solução 1: Configurar o Script de Build no Netlify

Esta é a abordagem recomendada, pois mantém as credenciais seguras.

1. **Configure um Script de Build para o Netlify**:
   - Crie um arquivo `netlify.toml` na raiz do projeto:

   ```toml
   [build]
     publish = "."
     command = "node generate-config.js"
   ```

2. **Certifique-se que o script `generate-config.js` esteja adaptado para o ambiente Netlify**:
   - Ele deve usar as variáveis de ambiente configuradas no Netlify em vez do arquivo `.env`
   - Exemplo:

   ```javascript
   // generate-config.js
   const fs = require('fs');

   const firebaseConfig = {
     apiKey: process.env.FIREBASE_API_KEY,
     authDomain: process.env.FIREBASE_AUTH_DOMAIN,
     databaseURL: process.env.FIREBASE_DATABASE_URL,
     projectId: process.env.FIREBASE_PROJECT_ID,
     storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
     messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
     appId: process.env.FIREBASE_APP_ID
   };

   // Conteúdo do arquivo de configuração
   const fileContent = `// Configuração do Firebase - Gerado automaticamente pelo Netlify
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
   ```

3. **Verifique se todas as variáveis de ambiente estão configuradas no Netlify**:
   - Você já configurou as variáveis usando o script `env-setup-netlify.sh`
   - Confirme via `netlify env:list` 

4. **Detalhes adicionais para o arquivo de build**:
   - Certifique-se de que o Node.js está instalado na sua conta do Netlify (geralmente já está)
   - Verifique se o package.json inclui dotenv como dependência

### Solução 2: Ordem de Carregamento dos Scripts

Se mesmo após gerar o arquivo de configuração os erros persistirem, verifique a ordem de carregamento dos scripts no `index.html`:

```html
<!-- Scripts do Firebase -->
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"></script>

<!-- Configuração do Firebase - DEVE vir ANTES dos scripts que o utilizam -->
<script src="firebase-config.js"></script>

<!-- Outros scripts que dependem do Firebase -->
<script src="realtime-sync.js"></script>
<script src="presence-tracker.js"></script>
<script src="auth.js"></script>
```

### Solução 3: Verificação Condicional

Como último recurso, você pode modificar seus scripts para verificar se as variáveis existem antes de usá-las:

```javascript
// No início do realtime-sync.js
document.addEventListener('DOMContentLoaded', function() {
  // Verificar se o Firebase está inicializado
  if (typeof db === 'undefined' || typeof auth === 'undefined') {
    console.error('Firebase não está inicializado. Verifique se firebase-config.js está carregado.');
    return;
  }
  
  // Resto do código...
});
```

Aplique a mesma lógica para os arquivos `presence-tracker.js` e `auth.js`.

## Passos para Implementar a Solução

1. **Crie o arquivo `netlify.toml`** na raiz do projeto

2. **Modifique o arquivo `generate-config.js`** para usar variáveis de ambiente

3. **Faça um novo deploy**:
   ```bash
   git add netlify.toml
   git commit -m "chore(deploy): adiciona configuração de build para o Netlify"
   git push
   ```

4. **Verifique o deploy no painel do Netlify** para confirmar se o script de build foi executado corretamente

5. **Teste o site** para verificar se os erros foram resolvidos

## Problemas Adicionais

Se após implementar as soluções acima os erros persistirem, verifique:

1. **Logs de build do Netlify**: Para ver se o arquivo `firebase-config.js` está sendo gerado corretamente

2. **Console do navegador**: Para identificar se surgiram novos erros

3. **Regras do Firebase**: Certifique-se de que as regras de segurança do Firebase permitem conexões do domínio `migestoque.netlify.app` 