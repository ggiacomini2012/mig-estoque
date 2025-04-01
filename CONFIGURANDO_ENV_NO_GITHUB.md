# Configurando Variáveis de Ambiente Seguras no GitHub

Este guia explica como configurar e usar variáveis de ambiente seguras para armazenar credenciais sensíveis em projetos GitHub, especificamente para as configurações do Firebase.

## Por que usar variáveis de ambiente?

Armazenar chaves de API, senhas e outras credenciais diretamente no código é uma prática insegura, pois:

1. As credenciais ficam expostas no histórico de commits do repositório
2. Qualquer pessoa com acesso ao repositório pode ver e usar suas credenciais
3. Dificulta a manutenção e atualização das credenciais

## Usando Secrets do GitHub para repositórios públicos ou privados

### Configuração no GitHub

1. Acesse seu repositório no GitHub
2. Vá para **Settings** (Configurações) > **Secrets and variables** > **Actions**
3. Clique em **New repository secret**
4. Adicione seus segredos do Firebase com nomes descritivos:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `FIREBASE_DATABASE_URL`

### Usando os secrets em GitHub Actions

```yaml
name: Build and Deploy
on:
  push:
    branches:
      - main
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Create Firebase Config
        run: |
          echo "// Configuração gerada durante o build" > firebase-config.js
          echo "const firebaseConfig = {" >> firebase-config.js
          echo "  apiKey: \"${{ secrets.FIREBASE_API_KEY }}\"," >> firebase-config.js
          echo "  authDomain: \"${{ secrets.FIREBASE_AUTH_DOMAIN }}\"," >> firebase-config.js
          echo "  databaseURL: \"${{ secrets.FIREBASE_DATABASE_URL }}\"," >> firebase-config.js
          echo "  projectId: \"${{ secrets.FIREBASE_PROJECT_ID }}\"," >> firebase-config.js
          echo "  storageBucket: \"${{ secrets.FIREBASE_STORAGE_BUCKET }}\"," >> firebase-config.js
          echo "  messagingSenderId: \"${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}\"," >> firebase-config.js
          echo "  appId: \"${{ secrets.FIREBASE_APP_ID }}\"" >> firebase-config.js
          echo "};" >> firebase-config.js
          echo "firebase.initializeApp(firebaseConfig);" >> firebase-config.js
          echo "const db = firebase.database();" >> firebase-config.js
          echo "const auth = firebase.auth();" >> firebase-config.js
          echo "const estoqueRef = db.ref('estoque');" >> firebase-config.js
```

## Usando variáveis de ambiente para desenvolvimento local

### Opção 1: Arquivo .env (não versionado)

1. Crie um arquivo `.env` na raiz do projeto (assegure-se de que ele esteja no `.gitignore`)
2. Adicione suas variáveis:

```
FIREBASE_API_KEY=seu_valor_aqui
FIREBASE_AUTH_DOMAIN=seu_valor_aqui
FIREBASE_DATABASE_URL=seu_valor_aqui
FIREBASE_PROJECT_ID=seu_valor_aqui
FIREBASE_STORAGE_BUCKET=seu_valor_aqui
FIREBASE_MESSAGING_SENDER_ID=seu_valor_aqui
FIREBASE_APP_ID=seu_valor_aqui
```

3. Use um pacote como `dotenv` para carregar estas variáveis

### Opção 2: Usando um script de ambiente

Crie um script que gere o arquivo de configuração dinamicamente:

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

const fileContent = `
// Configuração gerada automaticamente
const firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

// Referência para a tabela de estoque no banco de dados
const estoqueRef = db.ref('estoque');
`;

fs.writeFileSync('firebase-config.js', fileContent);
console.log('Arquivo de configuração gerado!');
```

## Modificando o código para usar variáveis de ambiente no frontend (navegador)

Para aplicações web, você pode injetar as variáveis durante o build usando ferramentas como Webpack, ou criar um endpoint seguro no backend que forneça essas configurações:

### Exemplo com Webpack e dotenv

1. Instale as dependências necessárias:
```
npm install dotenv-webpack --save-dev
```

2. Configure o webpack.config.js:
```javascript
const Dotenv = require('dotenv-webpack');

module.exports = {
  // ... outras configurações
  plugins: [
    new Dotenv()
  ]
};
```

3. No seu código, acesse as variáveis usando `process.env`:
```javascript
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  // ... outras configurações
};
```

## Melhores Práticas

1. **Nunca comite credenciais reais** - Mesmo que remova depois, elas continuarão no histórico
2. **Use nomes claros para suas variáveis** - Para evitar confusão
3. **Limites de acesso** - Restrinja o acesso às credenciais apenas para quem precisa
4. **Rotação de chaves** - Mude periodicamente suas chaves e segredos
5. **Valores diferentes por ambiente** - Use configurações diferentes para desenvolvimento, testes e produção

## Recursos Adicionais

- [Documentação de GitHub Secrets](https://docs.github.com/pt/actions/security-guides/encrypted-secrets)
- [Documentação do Firebase sobre variáveis de ambiente](https://firebase.google.com/docs/functions/config-env)
- [Artigo sobre segurança em aplicações web](https://owasp.org/www-project-top-ten/) 