document.addEventListener('DOMContentLoaded', function() {
  // Usando event delegation para o evento de contexto (clique direito)
  // Isso já funciona mesmo após a tabela ser restaurada, pois o listener é no document
  document.addEventListener('contextmenu', function(e) {
    const cell = e.target.closest('td');
    if (!cell) return;
    
    const row = cell.closest('tr');
    const table = cell.closest('.subtable');
    
    // Verificar se é uma célula dentro de uma subtable
    if (row && table && table.closest('td')) {
      e.preventDefault();
      
      // Verificar se não é a linha de cabeçalho
      if (row.rowIndex > 0) {
        if (confirm('Deseja remover esta linha?')) {
          row.remove();
        }
      }
    }
  });
}); 