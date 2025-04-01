document.addEventListener('DOMContentLoaded', function() {
  // Verificar se o Firebase foi inicializado corretamente
  if (typeof db === 'undefined' || typeof auth === 'undefined') {
    console.error('Firebase não está inicializado corretamente. Verifique se firebase-config.js foi carregado.');
    // Adicionar uma mensagem de erro visível para o usuário
    const errorMsg = document.createElement('div');
    errorMsg.style.color = 'red';
    errorMsg.style.padding = '10px';
    errorMsg.style.margin = '10px';
    errorMsg.style.backgroundColor = '#ffeeee';
    errorMsg.style.border = '1px solid red';
    errorMsg.textContent = 'Erro: Firebase não inicializado corretamente. O rastreamento de presença está desativado.';
    document.body.prepend(errorMsg);
    return; // Interromper a execução do script
  }

  // Referência para o nó de presença no Firebase
  const presenceRef = db.ref('presence');
  let currentUser = null;
  
  // Obter o usuário atual
  auth.onAuthStateChanged((user) => {
    if (user) {
      currentUser = user;
      
      // Limpar presença do usuário quando desconectar
      presenceRef.child(currentUser.uid).onDisconnect().remove();
      
      // Criar indicador de status de conexão
      const connectionStatus = document.createElement('div');
      connectionStatus.id = 'connection-status';
      connectionStatus.className = 'connection-status';
      document.body.appendChild(connectionStatus);
      
      // Monitorar status de conexão
      db.ref('.info/connected').on('value', (snap) => {
        if (snap.val() === true) {
          connectionStatus.textContent = 'Conectado';
          connectionStatus.className = 'connection-status online';
        } else {
          connectionStatus.textContent = 'Desconectado';
          connectionStatus.className = 'connection-status offline';
        }
      });
    }
  });
  
  // Rastrear quando o usuário começa a editar uma célula
  document.addEventListener('focusin', function(e) {
    if (!currentUser) return;
    
    const cell = e.target.closest('td');
    if (!cell) return;
    
    // Identificar a célula
    const row = cell.closest('tr');
    const cellIndex = Array.from(row.cells).indexOf(cell);
    const rowIndex = Array.from(row.parentElement.rows).indexOf(row);
    const tableId = cell.closest('table').id || 'unknown';
    
    // Caminho para a célula
    const cellPath = `${tableId}/${rowIndex}/${cellIndex}`;
    
    // Registrar presença
    presenceRef.child(currentUser.uid).set({
      userId: currentUser.uid.substring(0, 6),
      cellPath: cellPath,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });
    
    // Marcar célula como sendo editada por este usuário
    cell.classList.add('cell-being-edited');
    cell.setAttribute('data-editor', currentUser.uid.substring(0, 6));
  });
  
  // Quando o usuário terminar de editar
  document.addEventListener('focusout', function(e) {
    if (!currentUser) return;
    
    const cell = e.target.closest('td');
    if (!cell) return;
    
    // Remover presença
    presenceRef.child(currentUser.uid).remove();
    
    // Remover marcação da célula
    cell.classList.remove('cell-being-edited');
    cell.removeAttribute('data-editor');
  });
  
  // Escutar alterações de presença
  presenceRef.on('value', function(snapshot) {
    const presenceData = snapshot.val() || {};
    
    // Limpar todas as marcações de células
    document.querySelectorAll('.cell-being-edited').forEach(cell => {
      cell.classList.remove('cell-being-edited');
      cell.removeAttribute('data-editor');
    });
    
    // Aplicar marcações atuais
    Object.entries(presenceData).forEach(([userId, data]) => {
      // Ignorar este usuário
      if (currentUser && userId === currentUser.uid) return;
      
      const cellPath = data.cellPath;
      const [tableId, rowIndex, cellIndex] = cellPath.split('/');
      
      const table = document.getElementById(tableId);
      if (!table) return;
      
      const row = table.rows[parseInt(rowIndex)];
      if (!row) return;
      
      const cell = row.cells[parseInt(cellIndex)];
      if (!cell) return;
      
      // Marcar célula como sendo editada por outro usuário
      cell.classList.add('cell-being-edited');
      cell.setAttribute('data-editor', data.userId);
    });
  });
}); 