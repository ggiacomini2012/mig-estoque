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