document.addEventListener('DOMContentLoaded', function() {
  // Create export button
  const exportButton = document.createElement('button');
  exportButton.textContent = 'Exportar JSON';
  exportButton.style.marginLeft = '10px';
  
  // Create import button
  const importButton = document.createElement('button');
  importButton.textContent = 'Importar JSON';
  importButton.style.marginLeft = '10px';
  
  // Create clear button (moved from clear-data.js)
  const clearButton = document.createElement('button');
  clearButton.textContent = 'Limpar Dados';
  clearButton.style.marginLeft = '10px';
  
  // Criar o container para os botões
  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'action-buttons-container'; // Changed ID for clarity
  buttonContainer.classList.add('action-buttons'); // Adiciona uma classe para estilização
  // Remove inline styles handled by CSS
  // buttonContainer.style.display = 'inline-block'; 
  // buttonContainer.style.marginLeft = '10px';

  // Adicionar botões ao container
  buttonContainer.appendChild(exportButton);
  buttonContainer.appendChild(importButton);
  buttonContainer.appendChild(clearButton); // Add clear button here

  // Adicionar ao wrapper principal
  const mainWrapper = document.getElementById('main-controls-wrapper');
  if (mainWrapper) {
    mainWrapper.appendChild(buttonContainer); // Adiciona o container de botões ao wrapper principal
  } else {
    console.error('Main controls wrapper not found. Appending export/import buttons to body as fallback.');
    const title = document.querySelector('h1'); // Fallback: insert after title
    if(title && title.parentNode) {
      title.parentNode.insertBefore(buttonContainer, title.nextSibling);
    } else {
      document.body.appendChild(buttonContainer);
    }
  }
  
  // Function to extract table data
  function extractTableData() {
    const tabelaData = [];
    const mainTable = document.getElementById('estoque-table');
    
    // Skip header row
    for (let i = 1; i < mainTable.rows.length; i++) {
      const row = mainTable.rows[i];
      const andar = row.cells[0].textContent.trim();
      
      // Process each relevant column (skip floor and assumed 'Feminino' column)
      // Iterate from index 2 up to the last cell
      for (let colIndex = 2; colIndex < row.cells.length; colIndex++) { 
        // Calculate column letter ('A' for index 2, 'B' for 3, etc.)
        const colLetter = String.fromCharCode(65 + (colIndex - 2)); 
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
              linha: parseInt(andar) || 0, // Handles floor '0' correctly
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
                if (item.linha !== undefined && item.coluna && item.itens) { // Check linha is defined (allows 0)
                  // Convert column letter ('A', 'B', ...) back to table cell index (A -> 2, B -> 3, ...)
                  const colIndex = item.coluna.charCodeAt(0) - 65 + 2; 
                  const rowIndex = item.linha; // Keep original linha value
                  
                  // Find the right table row
                  const mainTable = document.getElementById('estoque-table');
                  let targetRow = null;
                  
                  for (let i = 1; i < mainTable.rows.length; i++) {
                    // Use String() to handle potential floor '0' comparison
                    if (mainTable.rows[i].cells[0].textContent.trim() === String(rowIndex)) { 
                      targetRow = mainTable.rows[i];
                      break;
                    }
                  }
                  
                  if (targetRow) {
                    // Check if the calculated colIndex is valid for the row
                    if (colIndex >= 2 && colIndex < targetRow.cells.length) { 
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

  // Clear button click handler (moved from clear-data.js)
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
      
      // Limpar resultados da busca
      const resultsDiv = document.getElementById('resultados');
      if (resultsDiv) {
          resultsDiv.innerHTML = '';
      }

      // Limpar preview do input
      const previewContainer = document.querySelector('.input-preview-container');
      if (previewContainer) {
        previewContainer.innerHTML = '';
      }

      // Limpar input do parser
      const inputParserInput = document.querySelector('#input-parser-container input');
      if (inputParserInput) {
        inputParserInput.value = '';
      }

      alert('Dados limpos com sucesso!');
    }
  };
}); 