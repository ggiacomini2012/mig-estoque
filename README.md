# Sistema de Gestão de Estoque MIG

Sistema simples para controle de estoque com funcionalidades para:

- Visualizar estoque por andar e localização
- Adicionar e remover itens em tabelas
- Entrada rápida de produtos através de texto em formato específico
- Edição inline de todos os campos
- Remoção de itens com clique direito
- Salvamento automático no navegador

## Uso

1. Abra o arquivo `index.html` no navegador
2. Use o campo de texto superior para adicionar produtos rapidamente no formato: `A10 203 preta 204 206 208 branco 204`
3. Clique no botão "+" para adicionar linhas individuais nas tabelas
4. Edite diretamente qualquer célula clicando nela
5. Use o clique direito em qualquer célula para remover uma linha inteira
6. Todas as alterações são salvas automaticamente no navegador a cada 2 segundos

## Estrutura

- `index.html` - Estrutura principal da página
- `script.js` - Adiciona IDs a todos os elementos
- `editable.js` - Torna as células editáveis
- `table-editor.js` - Adiciona botões para gerenciar linhas
- `input-parser.js` - Processa entrada de texto para adicionar produtos em massa
- `row-remover.js` - Permite remoção de linhas com clique direito
- `auto-save.js` - Salva automaticamente as alterações no navegador 

## Configuração de Ambiente

Este projeto usa variáveis de ambiente para configuração segura do Firebase. Siga os passos abaixo para configurar seu ambiente:

1. Crie um arquivo `.env` na raiz do projeto baseado no exemplo a seguir:
```
FIREBASE_API_KEY=sua_api_key
FIREBASE_AUTH_DOMAIN=seu_projeto_id.firebaseapp.com
FIREBASE_DATABASE_URL=https://seu_projeto_id-default-rtdb.firebaseio.com
FIREBASE_PROJECT_ID=seu_projeto_id
FIREBASE_STORAGE_BUCKET=seu_projeto_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
FIREBASE_APP_ID=seu_app_id
```

2. Execute o script para gerar a configuração:
```
npm install     # Instala as dependências (primeira vez)
npm run generate-config   # Gera o arquivo firebase-config.js
```

3. Abra o arquivo `index.html` no navegador.

> **IMPORTANTE:** O arquivo `.env` contém informações sensíveis e não deve ser compartilhado ou versionado. Ele já está incluído no `.gitignore`.

### Configuração do Netlify

Para configurar as variáveis de ambiente no Netlify via linha de comando:

1. Instale a CLI do Netlify: `npm install netlify-cli -g`
2. Faça login no Netlify: `netlify login`
3. Crie uma cópia do arquivo de exemplo: `cp env-setup.example.sh env-setup.sh`
4. Edite o arquivo `env-setup.sh` com suas credenciais do Firebase
5. Execute o script: `./env-setup.sh`

> **ATENÇÃO:** O arquivo `env-setup.sh` contém credenciais sensíveis e está configurado para não ser versionado (incluído no `.gitignore`).

### Configuração do GitHub

Para configurar os secrets no GitHub Actions via linha de comando:

1. Instale a CLI do GitHub: `npm install -g gh`
2. Faça login no GitHub: `gh auth login`
3. Certifique-se de que seu arquivo `.env` esteja configurado corretamente
4. Crie uma cópia do arquivo de exemplo: `cp env-setup-github.example.sh env-setup-github.sh`
5. Execute o script: `./env-setup-github.sh`

> **ATENÇÃO:** O arquivo `env-setup-github.sh` contém credenciais sensíveis e está configurado para não ser versionado (incluído no `.gitignore`).

Para mais informações sobre configuração segura, consulte os arquivos:
- [CONFIGURANDO_ENV_NO_GITHUB.md](CONFIGURANDO_ENV_NO_GITHUB.md)
- [CONFIGURANDO_NETLIFY.md](CONFIGURANDO_NETLIFY.md) 