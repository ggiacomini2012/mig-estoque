// Função para buscar itens na tabela
document.addEventListener('DOMContentLoaded', function() {
  // Criar campo de busca e botão
  const header = document.querySelector('h1');
  const searchDiv = document.createElement('div');
  
  const searchInput = document.createElement('input');
  searchInput.setAttribute('type', 'text');
  searchInput.setAttribute('placeholder', 'Digite o código ou cor para buscar');
  
  const resultsDiv = document.createElement('div');
  resultsDiv.id = 'resultados';
  
  searchDiv.appendChild(searchInput);
  header.after(searchDiv);
  searchDiv.after(resultsDiv);

  // Variável para armazenar o timer
  let searchTimer;

  // Função de busca
  function performSearch() {
    const searchInput_value = searchInput.value.trim().toLowerCase();
    if (!searchInput_value) {
      resultsDiv.innerHTML = '';
      return;
    }
    
    // Dividir a entrada em múltiplos termos de busca separados por espaço
    const searchTerms = searchInput_value.split(/\s+/);
    
    resultsDiv.innerHTML = '';
    
    const subtables = document.querySelectorAll('.subtable');
    let found = false;
    
    subtables.forEach(subtable => {
      const rows = subtable.querySelectorAll('tr');
      for (let i = 1; i < rows.length; i++) { // Começar do 1 para pular o cabeçalho
        const cells = rows[i].querySelectorAll('td');
        if (cells.length >= 3) {
          const codigo = cells[1].textContent.toLowerCase();
          const cor = cells[2].textContent.toLowerCase();
          
          // Verificar se algum dos termos de busca corresponde ao código ou cor
          const matches = searchTerms.some(term => 
            codigo.includes(term) || cor.includes(term)
          );
          
          if (matches) {
            found = true;
            // Obter informações da localização
            const mainRow = subtable.closest('tr');
            const andar = mainRow.cells[0].textContent;
            const tamanho = mainRow.cells[1].textContent;
            const coluna = getColuna(subtable);
            
            const resultItem = document.createElement('p');
            resultItem.textContent = `Item encontrado: Andar ${andar}, Tamanho ${tamanho}, Coluna ${coluna}, Código: ${cells[1].textContent}, Cor: ${cells[2].textContent}, Quantidade: ${cells[0].textContent}`;
            resultsDiv.appendChild(resultItem);
          }
        }
      }
    });
    
    if (!found && searchInput_value) {
      const notFoundMsg = document.createElement('p');
      notFoundMsg.textContent = 'Nenhum item encontrado.';
      resultsDiv.appendChild(notFoundMsg);
    }
  }
  
  // Atualiza a busca a cada meio segundo durante a digitação
  searchInput.addEventListener('input', function() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(performSearch, 500); // 500ms = meio segundo
  });
  
  // Determina qual coluna (A, B, C, D) contém a subtabela
  function getColuna(subtable) {
    const mainCell = subtable.closest('td');
    const cellIndex = mainCell.cellIndex;
    
    // Mapeamento de índice para letra (2=A, 3=B, 4=C, 5=D)
    const colunas = ['', '', 'A', 'B', 'C', 'D'];
    return colunas[cellIndex];
  }
}); 