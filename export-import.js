document.addEventListener('DOMContentLoaded', function() {
  // Create export button
  const exportButton = document.createElement('button');
  exportButton.textContent = 'Exportar JSON';
  exportButton.style.marginLeft = '10px';
  
  // Create import button
  const importButton = document.createElement('button');
  importButton.textContent = 'Importar JSON';
  importButton.style.marginLeft = '10px';
  
  // Add buttons to DOM next to title
  const title = document.querySelector('h1');
  title.parentNode.insertBefore(importButton, title.nextSibling);
  title.parentNode.insertBefore(exportButton, title.nextSibling);
  
  // Function to extract table data
  function extractTableData() {
    const tabelaData = [];
    const mainTable = document.getElementById('estoque-table');
    
    // Skip header row
    for (let i = 1; i < mainTable.rows.length; i++) {
      const row = mainTable.rows[i];
      const andar = row.cells[0].textContent.trim();
      
      // Process each column (A, B, C, D)
      for (let colIndex = 2; colIndex <= 5; colIndex++) {
        const colLetter = String.fromCharCode(63 + colIndex); // 65 is 'A', but we start at column 2
        const subtable = row.cells[colIndex].querySelector('.subtable');
        
        if (subtable && subtable.rows.length > 1) {
          const itens = [];
          
          // Skip header row of subtable
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
  
  // Function to get command history
  function getCommandHistory() {
    const history = localStorage.getItem('commandHistory');
    return history ? JSON.parse(history) : [];
  }
  
  // Export button click handler
  exportButton.onclick = function() {
    try {
      const exportData = {
        tabela: extractTableData(),
        historicoDeComandos: getCommandHistory()
      };
      
      // Create download link
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "estoque-export-" + new Date().toISOString().slice(0, 10) + ".json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      
      alert('Dados exportados com sucesso!');
    } catch (e) {
      console.error('Erro ao exportar dados:', e);
      alert('Erro ao exportar dados: ' + e.message);
    }
  };
  
  // Import button click handler
  importButton.onclick = function() {
    // Create file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    fileInput.onchange = function(e) {
      const file = e.target.files[0];
      if (!file) {
        fileInput.remove();
        return;
      }
      
      const reader = new FileReader();
      reader.onload = function(event) {
        try {
          const importData = JSON.parse(event.target.result);
          
          if (confirm('Tem certeza que deseja importar estes dados? Os dados atuais serão substituídos.')) {
            // Import table data
            if (importData.tabela && Array.isArray(importData.tabela)) {
              // Clear current table data first
              const subtables = document.querySelectorAll('.subtable');
              subtables.forEach(table => {
                while (table.rows.length > 1) {
                  table.deleteRow(1);
                }
              });
              
              // Import data
              importData.tabela.forEach(item => {
                if (item.linha && item.coluna && item.itens) {
                  const colIndex = item.coluna.charCodeAt(0) - 63; // Convert 'A' to column index
                  const rowIndex = item.linha;
                  
                  // Find the right table row
                  const mainTable = document.getElementById('estoque-table');
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
                      });
                    }
                  }
                }
              });
            }
            
            // Import command history
            if (importData.historicoDeComandos && Array.isArray(importData.historicoDeComandos)) {
              localStorage.setItem('commandHistory', JSON.stringify(importData.historicoDeComandos));
              
              // Update command history display if it exists
              if (typeof updateHistoryDisplay === 'function') {
                updateHistoryDisplay();
              } else {
                // Trigger page reload to update history display
                setTimeout(() => {
                  location.reload();
                }, 500);
              }
            }
            
            alert('Dados importados com sucesso!');
          }
        } catch (e) {
          console.error('Erro ao importar dados:', e);
          alert('Erro ao importar dados: ' + e.message);
        }
        
        fileInput.remove();
      };
      
      reader.readAsText(file);
    };
    
    fileInput.click();
  };
}); 