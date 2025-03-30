document.addEventListener('DOMContentLoaded', function() {
  makeAllCellsEditable();
  
  // Adicionar listener para quando a tabela for restaurada
  document.addEventListener('tableRestored', function() {
    makeAllCellsEditable();
  });
  
  function makeAllCellsEditable() {
    document.querySelectorAll('td').forEach(cell => {
      if (!cell.querySelector('table')) {
        cell.setAttribute('contenteditable', 'true');
        cell.style.cursor = 'pointer';
        
        // Só adicionar evento se ainda não tiver sido adicionado
        if (!cell.hasAttributeListener) {
          cell.addEventListener('focus', () => cell.style.backgroundColor = '#ffffd0');
          cell.addEventListener('blur', function() {
            this.style.backgroundColor = '';
            localStorage.setItem(this.id || `cell-${Math.random()}`, this.textContent);
          });
          cell.hasAttributeListener = true;
        }
      }
    });
  }
}); 