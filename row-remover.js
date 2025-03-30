document.addEventListener('DOMContentLoaded', function() {
  // Adicionar evento de contexto (clique direito) a todas células em subtabelas
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