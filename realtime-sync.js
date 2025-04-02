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
    errorMsg.textContent = 'Erro: Firebase não inicializado corretamente. O sincronismo em tempo real está desativado.';
    document.body.prepend(errorMsg);
    return; // Interromper a execução do script
  }

  const mainTable = document.getElementById('estoque-table');
  let isLocalUpdate = false;
  let currentUser = null;
  
  // Status de conexão para mostrar quando usuários estão online
  const statusRef = db.ref('.info/connected');
  
  // Iniciar o login anônimo para identificar usuários
  auth.signInAnonymously()
    .then((userCredential) => {
      currentUser = userCredential.user;
      
      // Criar ou atualizar entrada do usuário no banco
      db.ref('users/' + currentUser.uid).set({
        online: true,
        lastActive: firebase.database.ServerValue.TIMESTAMP,
        id: currentUser.uid.substring(0, 6)
      });
      
      // Adicionar este usuário à lista de usuários ativos
      db.ref('activeUsers/' + currentUser.uid).onDisconnect().remove();
      db.ref('activeUsers/' + currentUser.uid).set(true);
      
      // Quando o usuário sair
      db.ref('users/' + currentUser.uid).onDisconnect().update({
        online: false,
        lastActive: firebase.database.ServerValue.TIMESTAMP
      });
      
      console.log('Usuário conectado:', currentUser.uid.substring(0, 6));
    })
    .catch((error) => {
      console.error('Erro de autenticação:', error);
    });
  
  // Criar indicador de usuários online
  const userIndicator = document.createElement('div');
  userIndicator.id = 'user-indicator';
  userIndicator.className = 'user-indicator';
  document.body.appendChild(userIndicator);
  
  // Mostrar usuários online
  db.ref('activeUsers').on('value', (snapshot) => {
    const users = snapshot.val() || {};
    const userCount = Object.keys(users).length;
    
    userIndicator.textContent = `${userCount} usuário${userCount !== 1 ? 's' : ''} online`;
  });
  
  // Função para salvar alterações para o Firebase
  function saveToFirebase(cell) {
    if (!mainTable || isLocalUpdate) return;
    
    console.log("Tentando salvar célula no Firebase:", cell);
    
    // Identificar a célula alterada
    const row = cell.closest('tr');
    const cellIndex = Array.from(row.cells).indexOf(cell);
    const rowIndex = Array.from(row.parentElement.rows).indexOf(row);
    
    // Obter o ID da tabela ou subtabela
    let tableId;
    const parentTable = cell.closest('table');
    tableId = parentTable.id || 'unknown';
    
    console.log(`Salvando dados: Tabela=${tableId}, Linha=${rowIndex}, Célula=${cellIndex}, Valor=${cell.innerHTML}`);
    
    // Criar caminho no banco de dados
    const path = `${tableId}/${rowIndex}/${cellIndex}`;
    
    // Salvar no Firebase com informações do usuário
    estoqueRef.child(path).set({
      value: cell.innerHTML,
      updatedBy: currentUser ? currentUser.uid.substring(0, 6) : 'unknown',
      timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
      console.log("Dados salvos com sucesso no Firebase:", path);
    }).catch(error => {
      console.error("Erro ao salvar no Firebase:", error);
    });
  }
  
  // Expor a função saveToFirebase globalmente para que outros componentes possam usá-la
  window.saveToFirebase = saveToFirebase;
  
  // Também expor a variável isLocalUpdate para controle de ciclo de atualização
  window.setIsLocalUpdate = function(value) {
    isLocalUpdate = value;
  };
  
  window.getIsLocalUpdate = function() {
    return isLocalUpdate;
  };
  
  // Escutar alterações em todas as células da tabela
  document.addEventListener('input', function(e) {
    console.log("Evento de input detectado:", e.target);
    if (e.target.tagName === 'TD' || e.target.closest('td')) {
      const cell = e.target.tagName === 'TD' ? e.target : e.target.closest('td');
      console.log("Célula detectada para salvar:", cell);
      saveToFirebase(cell);
    }
  });
  
  // Escutar atualizações do Firebase
  estoqueRef.on('child_changed', function(snapshot) {
    const data = snapshot.val();
    const path = snapshot.key.split('/');
    
    if (!data || !path || path.length < 3) return;
    
    const tableId = path[0];
    const rowIndex = parseInt(path[1]);
    const cellIndex = parseInt(path[2]);
    
    // Encontrar a tabela correta
    const table = document.getElementById(tableId);
    if (!table) return;
    
    // Atualizar a célula se existir
    if (table.rows[rowIndex] && table.rows[rowIndex].cells[cellIndex]) {
      isLocalUpdate = true;
      window.isLocalUpdate = true; // Para compatibilidade com outros componentes
      
      const cell = table.rows[rowIndex].cells[cellIndex];
      const oldValue = cell.innerHTML;
      const newValue = data.value;
      
      // Só atualizar se os valores forem diferentes
      if (oldValue !== newValue) {
        cell.innerHTML = newValue;
        
        // Destacar a célula que foi alterada por outro usuário
        if (data.updatedBy !== (currentUser ? currentUser.uid.substring(0, 6) : 'unknown')) {
          cell.classList.add('remote-change');
          setTimeout(() => {
            cell.classList.remove('remote-change');
          }, 2000);
        }
      }
      
      setTimeout(() => {
        isLocalUpdate = false;
        window.isLocalUpdate = false; // Para compatibilidade com outros componentes
      }, 100);
    }
  });
  
  // Inicializar dados do Firebase na primeira carga
  estoqueRef.once('value', function(snapshot) {
    const data = snapshot.val();
    if (!data) {
      // Se não houver dados no Firebase, inicializar com a tabela atual
      if (mainTable) {
        // Converter a tabela atual para o formato do Firebase
        const tableData = {};
        
        // Processar todas as linhas e células
        Array.from(mainTable.rows).forEach((row, rowIndex) => {
          Array.from(row.cells).forEach((cell, cellIndex) => {
            const path = `${mainTable.id}/${rowIndex}/${cellIndex}`;
            tableData[path] = {
              value: cell.innerHTML,
              updatedBy: currentUser ? currentUser.uid.substring(0, 6) : 'system',
              timestamp: firebase.database.ServerValue.TIMESTAMP
            };
          });
        });
        
        // Salvar no Firebase
        estoqueRef.set(tableData);
      }
    }
  });
}); 