document.addEventListener('DOMContentLoaded', function() {
  const STORAGE_KEY = 'estoque-data-json';
  const mainTable = document.getElementById('estoque-table');
  
  // Função para extrair dados da tabela em formato JSON
  function extractTableData() {
    const tabelaData = [];
    const mainTable = document.getElementById('estoque-table');
    
    if (!mainTable) return tabelaData;
    
    // Pular linha de cabeçalho
    for (let i = 1; i < mainTable.rows.length; i++) {
      const row = mainTable.rows[i];
      const andar = row.cells[0].textContent.trim();
      
      // Processar cada coluna (A, B, C, D)
      for (let colIndex = 2; colIndex <= 5; colIndex++) {
        const colLetter = String.fromCharCode(63 + colIndex); // 65 é 'A', mas começamos na coluna 2
        const cell = row.cells[colIndex];
        const subtable = cell ? cell.querySelector('.subtable') : null;
        
        if (subtable && subtable.rows.length > 1) {
          const itens = [];
          
          // Pular linha de cabeçalho da subtabela
          for (let j = 1; j < subtable.rows.length; j++) {
            const subRow = subtable.rows[j];
            if (subRow.cells.length >= 3) {
              itens.push({
                qtd: parseInt(subRow.cells[0].textContent) || 0,
                cod: subRow.cells[1].textContent.trim(),
                cor: subRow.cells[2].textContent.trim()
              });
            }
          }
          
          if (itens.length > 0) {
            tabelaData.push({
              linha: parseInt(andar) || 0,
              coluna: colLetter,
              itens: itens
            });
          }
        }
      }
    }
    
    return tabelaData;
  }
  
  // Função para atualizar a tabela com dados JSON
  function updateTableFromData(data) {
    if (!Array.isArray(data) || !mainTable) return;
    
    // Limpar subtabelas existentes (mantendo apenas os cabeçalhos)
    const subtables = mainTable.querySelectorAll('.subtable');
    subtables.forEach(table => {
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }
    });
    
    // Importar dados
    data.forEach(item => {
      if (item.linha && item.coluna && item.itens) {
        const colIndex = item.coluna.charCodeAt(0) - 63; // Converter 'A' para índice de coluna
        const rowIndex = item.linha;
        
        // Encontrar a linha correta na tabela
        let targetRow = null;
        
        for (let i = 1; i < mainTable.rows.length; i++) {
          if (mainTable.rows[i].cells[0].textContent.trim() === String(rowIndex)) {
            targetRow = mainTable.rows[i];
            break;
          }
        }
        
        if (targetRow) {
          const subtable = targetRow.cells[colIndex].querySelector('.subtable');
          
          if (subtable) {
            item.itens.forEach(produto => {
              const newRow = subtable.insertRow(-1);
              
              const qtdCell = newRow.insertCell(0);
              const codCell = newRow.insertCell(1);
              const corCell = newRow.insertCell(2);
              
              qtdCell.textContent = produto.qtd;
              codCell.textContent = produto.cod;
              corCell.textContent = produto.cor;
              
              // Manter células editáveis
              qtdCell.setAttribute('contenteditable', 'true');
              codCell.setAttribute('contenteditable', 'true');
              corCell.setAttribute('contenteditable', 'true');
            });
          }
        }
      }
    });
    
    // Reabilitar edição e outros manipuladores de eventos
    document.dispatchEvent(new CustomEvent('tableRestored', { detail: mainTable }));
  }
  
  // Carregar do localStorage se existir
  if (localStorage.getItem(STORAGE_KEY)) {
    try {
      const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
      
      // Notificar antes de restaurar
      document.dispatchEvent(new CustomEvent('beforeTableRestore', { detail: savedData }));
      
      // Atualizar a tabela com os dados salvos
      updateTableFromData(savedData);
      
      console.log('Dados carregados do localStorage (JSON)');
    } catch (e) {
      console.error('Erro ao carregar dados do localStorage:', e);
    }
  }
  
  // Configurar salvamento automático a cada 2 segundos
  setInterval(function() {
    const currentTable = document.getElementById('estoque-table');
    if (currentTable) {
      // Extrair dados em formato JSON
      const tableData = extractTableData();
      
      // Notificar antes de salvar
      document.dispatchEvent(new CustomEvent('beforeTableSave', { detail: tableData }));
      
      // Salvar no localStorage em formato JSON
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tableData));
      console.log('Dados salvos (JSON): ' + new Date().toLocaleTimeString());
    }
  }, 2000);
});