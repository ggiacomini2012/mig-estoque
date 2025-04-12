/**
 * Cloud Sync - Funções para sincronização com Firebase
 */
document.addEventListener('DOMContentLoaded', function() {
  // Criar botões de sincronização
  createCloudSyncButtons();
  
  // Inicializar Firebase se estiver disponível
  initializeFirebaseIfAvailable();
});

/**
 * Cria os botões para sincronização com a nuvem
 */
function createCloudSyncButtons() {
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'cloud-sync-buttons';
  
  // Botão para salvar na nuvem
  const saveCloudButton = document.createElement('button');
  saveCloudButton.textContent = '☁️ Salvar na Nuvem';
  saveCloudButton.id = 'btn-save-cloud';
  saveCloudButton.addEventListener('click', saveToCloud);
  
  // Botão para sincronizar da nuvem
  const syncCloudButton = document.createElement('button');
  syncCloudButton.textContent = '⬇️ Sincronizar da Nuvem';
  syncCloudButton.id = 'btn-sync-cloud';
  syncCloudButton.addEventListener('click', syncFromCloud);
  
  // Adicionar botões ao container
  buttonContainer.appendChild(saveCloudButton);
  buttonContainer.appendChild(syncCloudButton);
  
  // Adicionar ao wrapper principal (top bar)
  const mainWrapper = document.getElementById('main-controls-wrapper');
  if (mainWrapper) {
    // Find the action buttons container within the main wrapper
    const actionButtonsContainer = mainWrapper.querySelector('.action-buttons');
    if (actionButtonsContainer) {
      // Append cloud buttons inside the action buttons container
      actionButtonsContainer.appendChild(buttonContainer);
    } else {
      console.error('Action buttons container not found within main wrapper. Appending cloud buttons directly.');
      mainWrapper.appendChild(buttonContainer); // Fallback: append directly to main wrapper
    }
  } else {
    console.error('Main controls wrapper not found. Appending cloud sync buttons to body as fallback.');
    document.body.appendChild(buttonContainer); // Fallback: append to body
  }
}

/**
 * Inicializa Firebase se estiver disponível
 */
function initializeFirebaseIfAvailable() {
  if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
    console.log('Firebase já inicializado e disponível para sincronização');
  } else {
    console.warn('Firebase não disponível. Os botões de sincronização funcionarão quando Firebase for configurado.');
    
    // Adicionar classe visual para indicar que os botões estão desativados
    setTimeout(() => {
      const cloudButtons = document.querySelectorAll('.cloud-sync-buttons button');
      cloudButtons.forEach(btn => btn.classList.add('disabled'));
      
      // Adicionar tooltip explicando como ativar
      cloudButtons.forEach(btn => {
        btn.title = 'Descomente as linhas do Firebase no index.html para ativar esta funcionalidade';
      });
    }, 1000);
  }
}

/**
 * Salva dados para a nuvem (Firebase)
 */
function saveToCloud() {
  // Add password prompt
  const password = prompt("Digite a senha para salvar:");
  if (password !== "bob") {
    alert("Senha incorreta. Operação cancelada.");
    return;
  }
  // End of added password prompt

  if (typeof firebase === 'undefined' || !firebase.apps.length) {
    alert('Firebase não está disponível. Por favor, configure o Firebase primeiro.');
    return;
  }
  
  try {
    // Obter a tabela e convertê-la para JSON
    const table = document.getElementById('estoque-table');
    if (!table) {
      alert('Tabela não encontrada');
      return;
    }
    
    // Obter histórico de comandos
    const commandHistory = window.commandHistory ? window.commandHistory.getHistory() : [];
    
    // Criar objeto com dados para salvar
    const dataToSave = {
      tableData: extractTableDataForCloud(table),
      commandHistory: commandHistory,
      timestamp: Date.now(),
      version: '1.0'
    };
    
    // Referência ao Firebase
    const db = firebase.database();
    const syncRef = db.ref('syncData');
    
    // Log the data being saved
    console.log('Saving data to cloud:', JSON.stringify(dataToSave, null, 2));

    // Salvar no Firebase
    syncRef.set(dataToSave)
      .then(() => {
        console.log('Dados salvos com sucesso no Firebase');
        showSaveSuccess();
      })
      .catch(error => {
        console.error('Erro ao salvar dados no Firebase:', error);
        alert(`Erro ao salvar na nuvem: ${error.message}`);
      });
  } catch (error) {
    console.error('Erro ao preparar dados para Firebase:', error);
    alert(`Erro ao preparar dados: ${error.message}`);
  }
}

/**
 * Extrai dados da tabela para salvar na nuvem
 * Esta é uma implementação direta que não depende de funções globais
 */
function extractTableDataForCloud(table) {
  // Implementação simples que extrai dados básicos
  const tabelaData = [];
  
  if (!table || !table.rows || table.rows.length === 0) {
    return tabelaData;
  }
  
  // Processar cada linha da tabela (andares 0-10+)
  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i];
    const andar = row.cells[0].textContent.trim(); // Assumes floor number is in the first cell
    
    // Processar colunas A-Z (cellIndex 2 a 27), pulando a coluna 'F' (index 7)
    for (let colIndex = 2; colIndex <= 27; colIndex++) {
      // Skip column 'F' (assumed to be 'Feminino')
      /* // Temporarily removed for testing
      if (colIndex === 7) { 
          continue;
      }
      */

      if (row.cells.length <= colIndex) continue; // Skip if cell doesn't exist
      
      const colLetter = String.fromCharCode(65 + colIndex - 2); // Convert index (2-27) to letter (A-Z)
      const subtable = row.cells[colIndex].querySelector('.subtable');
      
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
            // Use floor number directly (can be '0', '1', ..., '10')
            linha: andar, 
            coluna: colLetter,
            itens: itens
          });
        }
      }
    }
  }
  
  return tabelaData;
}

/**
 * Importa dados da tabela de JSON
 * Essa função usa uma abordagem independente das funções globais
 * NOTE: Assumes floor numbers are strings ('0', '1', etc.) matching cell content
 */
function importTableFromCloud(jsonData) {
  if (!jsonData || !jsonData.tableData) {
    console.error('Formato de dados inválido para importação');
    return false;
  }
  
  try {
    const tabelaData = jsonData.tableData;
    console.log('Checking if tableData is array. Type:', typeof tabelaData, 'Is Array:', Array.isArray(tabelaData), 'Value:', tabelaData); 
    if (!Array.isArray(tabelaData)) {
      console.error('Os dados da tabela não são um array válido');
      return false;
    }
    
    // Limpar as tabelas atuais primeiro
    const subtables = document.querySelectorAll('.subtable');
    subtables.forEach(table => {
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }
    });
    
    // Importar dados
    tabelaData.forEach(item => {
      // Check for required fields
      if (item.linha !== undefined && item.coluna && item.itens) { 
        const colIndex = item.coluna.charCodeAt(0) - 63; // Convert 'A'-'Z' to index 2-27
        const rowIndexStr = String(item.linha); // Ensure floor is treated as string for lookup

        // Check if colIndex is valid (A=2 to Z=27)
        if (colIndex < 2 || colIndex > 27) {
            console.warn(`Invalid column letter '${item.coluna}' found in cloud data. Skipping.`);
            return; 
        }
        
        // Encontrar a linha da tabela correta pelo conteúdo da primeira célula (andar)
        const mainTable = document.getElementById('estoque-table');
        let targetRow = null;
        
        for (let i = 1; i < mainTable.rows.length; i++) {
          if (mainTable.rows[i].cells.length > 0 && mainTable.rows[i].cells[0].textContent.trim() === rowIndexStr) {
            targetRow = mainTable.rows[i];
            break;
          }
        }
        
        if (targetRow) {
          // Check if target cell exists before accessing it
          if (targetRow.cells.length > colIndex) {
              const subtable = targetRow.cells[colIndex].querySelector('.subtable');
              
              if (subtable) {
                item.itens.forEach(produto => {
                  const newRow = subtable.insertRow(-1);
                  
                  const qtdCell = newRow.insertCell(0);
                  const codCell = newRow.insertCell(1);
                  const corCell = newRow.insertCell(2);
                  
                  qtdCell.textContent = produto.qtd || 0; // Default to 0 if undefined
                  codCell.textContent = produto.cod || ''; // Default to empty if undefined
                  corCell.textContent = produto.cor || ''; // Default to empty if undefined
                  
                  // Adicionar atributo contenteditable="true" para cada célula
                  qtdCell.setAttribute('contenteditable', 'true');
                  codCell.setAttribute('contenteditable', 'true');
                  corCell.setAttribute('contenteditable', 'true');
                });
              } else {
                 console.warn(`Subtable not found for row '${rowIndexStr}', column '${item.coluna}' (index ${colIndex}). Skipping item.`);
              }
          } else {
              console.warn(`Target cell index ${colIndex} (column '${item.coluna}') out of bounds for row '${rowIndexStr}'. Skipping item.`);
          }
        } else {
            console.warn(`Target row with floor '${rowIndexStr}' not found in table. Skipping item.`);
        }
      } else {
          console.warn('Skipping item with missing linha, coluna, or itens:', item);
      }
    });
    
    // Atualizar histórico de comandos se disponível
    if (jsonData.commandHistory && Array.isArray(jsonData.commandHistory)) {
      localStorage.setItem('commandHistory', JSON.stringify(jsonData.commandHistory));
      
      // Atualizar exibição do histórico se existir
      if (window.commandHistory && typeof window.commandHistory.updateDisplay === 'function') {
        window.commandHistory.updateDisplay();
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao importar dados da nuvem:', error);
    return false;
  }
}

/**
 * Sincroniza dados da nuvem (Firebase)
 */
function syncFromCloud() {
  if (typeof firebase === 'undefined' || !firebase.apps.length) {
    alert('Firebase não está disponível. Por favor, configure o Firebase primeiro.');
    return;
  }
  
  try {
    // Referência ao Firebase
    const db = firebase.database();
    const syncRef = db.ref('syncData');
    
    // Obter dados
    syncRef.once('value')
      .then(snapshot => {
        const data = snapshot.val();
        if (!data) {
          alert('Nenhum dado encontrado na nuvem');
          return;
        }
        
        // Log the data synced from cloud
        console.log('Data synced from cloud:', JSON.stringify(data, null, 2));

        // Importar dados
        if (importTableFromCloud(data)) {
          showSyncSuccess();
        } else {
          alert('Erro ao importar dados da nuvem: formato inválido');
        }
      })
      .catch(error => {
        console.error('Erro ao sincronizar da nuvem:', error);
        alert(`Erro ao sincronizar: ${error.message}`);
      });
  } catch (error) {
    console.error('Erro ao sincronizar da nuvem:', error);
    alert(`Erro ao sincronizar: ${error.message}`);
  }
}

/**
 * Mostra feedback visual de sucesso ao salvar
 */
function showSaveSuccess() {
  const btn = document.getElementById('btn-save-cloud');
  if (!btn) return;
  
  const originalText = btn.textContent;
  btn.textContent = '✅ Salvo!';
  
  setTimeout(() => {
    btn.textContent = originalText;
  }, 2000);
}

/**
 * Mostra feedback visual de sucesso ao sincronizar
 */
function showSyncSuccess() {
  const btn = document.getElementById('btn-sync-cloud');
  if (!btn) return;
  
  const originalText = btn.textContent;
  btn.textContent = '✅ Sincronizado!';
  
  setTimeout(() => {
    btn.textContent = originalText;
  }, 2000);
} 