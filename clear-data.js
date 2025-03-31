document.addEventListener('DOMContentLoaded', function() {
  // Criar botão limpar
  const clearButton = document.createElement('button');
  clearButton.textContent = 'Limpar Dados';
  clearButton.style.marginLeft = '10px';
  
  // Adicionar ao DOM próximo ao título
  const title = document.querySelector('h1');
  title.parentNode.insertBefore(clearButton, title.nextSibling);
  
  // Handler de evento para limpar dados
  clearButton.onclick = function() {
    if (confirm('Tem certeza que deseja limpar todos os dados?')) {
      // Limpar localStorage
      localStorage.clear();
      
      // Limpar tabelas - manter apenas cabeçalhos
      const subtables = document.querySelectorAll('.subtable');
      subtables.forEach(table => {
        // Manter apenas a primeira linha (cabeçalho)
        while (table.rows.length > 1) {
          table.deleteRow(1);
        }
      });
      
      alert('Dados limpos com sucesso!');
    }
  };
}); 