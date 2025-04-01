# Configurando Deploy no Netlify com GitHub

Este guia explica como configurar o deploy automático do seu projeto de controle de estoque no Netlify, diretamente a partir do seu repositório GitHub.

## O que é o Netlify?

O Netlify é uma plataforma de hospedagem e automação para aplicações web modernas. Ele oferece:
- Deploy contínuo a partir de repositórios Git
- HTTPS automático e gratuito
- CDN global para melhor performance
- Funções serverless para backend leve
- Variáveis de ambiente para configuração do build

## Pré-requisitos

1. Uma conta no [GitHub](https://github.com)
2. Seu projeto já em um repositório GitHub
3. Uma conta no [Netlify](https://netlify.com) (você pode criar uma gratuitamente)

## Passo 1: Preparar seu projeto para deploy

Antes de fazer o deploy, certifique-se de que seu projeto está configurado corretamente:

1. Se estiver usando o Firebase com variáveis de ambiente:
   - Certifique-se de que o arquivo `firebase-config.js` está no `.gitignore`
   - Você irá configurar essas variáveis no Netlify para o processo de build

2. Para sites estáticos (como este projeto), não é necessário um arquivo de configuração especial para o Netlify, mas você pode criar um arquivo `netlify.toml` na raiz do projeto para configurações específicas:

```toml
[build]
  # Diretório a ser publicado (geralmente "." para a raiz do projeto)
  publish = "."
  
  # Comando de build (opcional para sites estáticos simples)
  # command = "npm run build"

# Configuração para páginas de erro (opcional)
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Passo 2: Conectar o Netlify ao GitHub

1. Faça login na sua conta do Netlify
2. Na página inicial do dashboard, clique no botão **"Add new site"** ou **"New site from Git"**
3. Selecione **"GitHub"** como seu provedor Git
4. Autorize o Netlify a acessar sua conta GitHub, se solicitado
5. Selecione o repositório que contém seu projeto de controle de estoque
6. Configure as opções de build:
   - **Branch to deploy**: `main` (ou a branch que você usa para produção)
   - **Build command**: Deixe em branco se for um site estático simples ou use `npm run generate-config && npm run build` se você tiver um processo de build
   - **Publish directory**: `.` (o diretório raiz, onde está seu `index.html`)

7. Clique em **"Deploy site"**

## Passo 3: Configurar variáveis de ambiente para o Firebase

> **IMPORTANTE**: Em aplicações frontend (client-side), as variáveis de ambiente são utilizadas apenas durante o processo de build. O arquivo gerado com as credenciais será acessível no código-fonte que pode ser inspecionado pelo navegador. Esta é uma limitação técnica de todas as aplicações frontend, não apenas do Netlify. Configure corretamente as regras de segurança do Firebase para proteger seus dados.

Para adicionar suas credenciais do Firebase como variáveis de ambiente no Netlify:

1. No dashboard do seu site no Netlify, vá para **"Site settings"**
2. No menu lateral, clique em **"Environment variables"**
3. Clique em **"Add a variable"** para cada uma das variáveis necessárias:

   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_DATABASE_URL`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`

4. Adicione o valor correspondente para cada variável (os mesmos valores do seu arquivo `.env` local)

## Passo 4: Configurar o script de build para usar as variáveis de ambiente

Se o seu site precisa gerar o arquivo `firebase-config.js` durante o deploy, você precisará criar um script de build para o Netlify executar.

1. Crie um arquivo `netlify.toml` se ainda não tiver criado:

```toml
[build]
  publish = "."
  command = "node generate-config.js"
```

2. Certifique-se de que seu script `generate-config.js` está configurado para usar as variáveis de ambiente do Netlify (que são acessíveis diretamente através de `process.env`):

```javascript
// generate-config.js para ambiente Netlify
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

## Passo 5: Acionar um novo deploy

1. Faça push de suas alterações para o GitHub:
```bash
git add .
git commit -m "Configure Netlify deployment"
git push origin main
```

2. O Netlify irá detectar automaticamente as mudanças e iniciar um novo deploy
3. No dashboard do Netlify, você pode acompanhar o progresso do deploy em **"Deploys"**

## Passo 6: Configurar domínio personalizado (opcional)

Se você quiser usar um domínio personalizado em vez do subdomínio fornecido pelo Netlify:

1. No dashboard do seu site, vá para **"Domain settings"**
2. Clique em **"Add custom domain"**
3. Siga as instruções para configurar seu domínio:
   - Você pode comprar um domínio diretamente pelo Netlify
   - Ou usar um domínio que você já possui, configurando os registros DNS

## Segurança em aplicações frontend

Para aplicações frontend com Firebase, é essencial entender:

1. **Limitação técnica**: Qualquer arquivo JavaScript gerado durante o build será enviado ao navegador e poderá ser inspecionado pelo usuário final. Isso significa que as credenciais do Firebase estarão visíveis no código-fonte.

2. **Firebase foi projetado assim**: O Firebase foi criado ciente desta limitação, e por isso a apiKey do Firebase não é uma chave secreta tradicional. Ela identifica seu projeto, mas não autoriza acesso sem autenticação adequada.

3. **Melhores práticas para segurança**:
   - Configure regras de segurança rigorosas no Firebase Database e Storage
   - Implemente autenticação de usuários adequada
   - Restrinja os domínios autorizados no console do Firebase
   - Use o Firebase App Check para verificar a origem das solicitações
   - Para operações realmente sensíveis, considere usar Netlify Functions como backend

## Solução de problemas comuns

### Problema: Falha no build

Se o build falhar, verifique:
1. Os logs de build no Netlify para identificar o erro
2. Se todas as variáveis de ambiente estão configuradas corretamente
3. Se o comando de build está correto no `netlify.toml`

### Problema: Firebase não está conectando

Verifique:
1. Se todas as variáveis de ambiente do Firebase estão configuradas corretamente
2. Se o script `generate-config.js` está gerando o arquivo corretamente
3. O console do navegador para erros específicos

### Problema: Alterações não aparecem após o deploy

Razões possíveis:
1. Cache do navegador - tente limpar o cache ou usar modo anônimo
2. Deploy ainda em andamento - verifique o status no dashboard do Netlify
3. Problemas com o CDN - pode levar alguns minutos para propagar

## Recursos adicionais

- [Documentação oficial do Netlify](https://docs.netlify.com/)
- [Blog do Netlify sobre variáveis de ambiente](https://www.netlify.com/blog/2021/07/12/managing-environment-variables-for-jamstack-sites/)
- [Configurações avançadas de deploy no Netlify](https://docs.netlify.com/configure-builds/file-based-configuration/)
- [Regras de segurança do Firebase](https://firebase.google.com/docs/rules)
- [Firebase App Check](https://firebase.google.com/docs/app-check)

---

Com essa configuração, seu projeto de controle de estoque estará disponível online, com deploy automático a cada vez que você fizer push para o repositório GitHub. Lembre-se de que a segurança principal deve vir das regras do Firebase, não da tentativa de ocultar as credenciais do frontend. 