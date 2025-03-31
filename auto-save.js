document.addEventListener('DOMContentLoaded', function() {
  const STORAGE_KEY = 'estoque-html-state';
  const mainTable = document.getElementById('estoque-table');
  
  // Carregar do localStorage se existir
  if (localStorage.getItem(STORAGE_KEY)) {
    try {
      const savedHTML = localStorage.getItem(STORAGE_KEY);
      const tableContainer = mainTable.parentNode;
      const tempDiv = document.createElement('div');
      
      // Substituir a tabela existente pela versão salva
      tempDiv.innerHTML = savedHTML;
      const savedTable = tempDiv.firstElementChild;
      
      // Preservar eventos e funcionalidades após carregar
      document.dispatchEvent(new CustomEvent('beforeTableRestore', { detail: savedTable }));
      
      tableContainer.replaceChild(savedTable, mainTable);
      
      // Reabilitar edição e outros manipuladores de eventos
      document.dispatchEvent(new CustomEvent('tableRestored', { detail: savedTable }));
      
      console.log('Carregado do localStorage');
    } catch (e) {
      console.error('Erro ao carregar do localStorage:', e);
    }
  }
  
  // Configurar salvamento automático a cada 2 segundos
  setInterval(function() {
    const currentTable = document.getElementById('estoque-table');
    if (currentTable) {
      // Salvar o estado antes de alterações
      document.dispatchEvent(new CustomEvent('beforeTableSave', { detail: currentTable }));
      
      localStorage.setItem(STORAGE_KEY, currentTable.outerHTML);
      console.log('Estado salvo: ' + new Date().toLocaleTimeString());
    }
  }, 2000);
}); 