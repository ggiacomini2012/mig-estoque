document.addEventListener('DOMContentLoaded', function() {
  const STORAGE_KEY = 'estoque-html-state';
  const mainTable = document.querySelector('table');
  
  // Carregar do localStorage se existir
  if (localStorage.getItem(STORAGE_KEY)) {
    try {
      const savedHTML = localStorage.getItem(STORAGE_KEY);
      const tableContainer = mainTable.parentNode;
      const tempDiv = document.createElement('div');
      
      // Substituir a tabela existente pela versão salva
      tempDiv.innerHTML = savedHTML;
      tableContainer.replaceChild(tempDiv.firstElementChild, mainTable);
      
      console.log('Carregado do localStorage');
    } catch (e) {
      console.error('Erro ao carregar do localStorage:', e);
    }
  }
  
  // Configurar salvamento automático a cada 2 segundos
  setInterval(function() {
    const currentTable = document.querySelector('table');
    if (currentTable) {
      localStorage.setItem(STORAGE_KEY, currentTable.outerHTML);
      console.log('Estado salvo: ' + new Date().toLocaleTimeString());
    }
  }, 2000);
}); 