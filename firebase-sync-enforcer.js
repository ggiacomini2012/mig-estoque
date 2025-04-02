/**
 * FIREBASE SYNC ENFORCER
 * 
 * Este script garante que os dados do Firebase sejam sempre
 * aplicados corretamente na tabela, sobrescrevendo quaisquer
 * dados locais que possam estar desatualizados.
 * 
 * Características:
 * - Carrega todos os dados do Firebase na inicialização
 * - Aplica os dados à tabela, sobrescrevendo dados locais
 * - Monitora alterações em tempo real
 * - Verifica periodicamente se há diferenças entre os dados exibidos e os armazenados
 */

(function() {
  // Variáveis globais
  let isEnforcingUpdate = false;
  let lastLoadedData = null;
  let updateQueue = [];
  let syncStatus = {
    lastSync: null,
    pendingUpdates: 0,
    syncErrors: 0
  };
  
  // Esperar que o DOM seja carregado
  document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Firebase Sync Enforcer: Iniciando...');
    
    // Verificar se o Firebase está disponível
    if (typeof firebase === 'undefined' || typeof db === 'undefined' || typeof estoqueRef === 'undefined') {
      console.error('❌ Firebase Sync Enforcer: Firebase não está disponível ou não está configurado corretamente.');
      showSyncError('Firebase não disponível');
      return;
    }
    
    // Adicionar status de sincronização à página
    addSyncStatusIndicator();
    
    // Esperar um pouco para garantir que outros scripts carregaram
    setTimeout(initializeSyncEnforcer, 1000);
  });
  
  // Inicializar o sincronizador
  function initializeSyncEnforcer() {
    console.log('🔄 Firebase Sync Enforcer: Inicializando...');
    
    // Adicionar listeners para alterações no Firebase
    setupFirebaseListeners();
    
    // Carregar os dados iniciais
    loadAllDataFromFirebase();
    
    // Configurar verificação periódica
    setInterval(verifyTableDataMatchesFirebase, 30000); // Verificar a cada 30 segundos
    
    // Monitor de desconexão/reconexão
    db.ref('.info/connected').on('value', function(snap) {
      const connected = snap.val() === true;
      if (connected) {
        console.log('🔄 Firebase Sync Enforcer: Reconectado, recarregando dados...');
        loadAllDataFromFirebase();
      } else {
        console.warn('⚠️ Firebase Sync Enforcer: Desconectado, aguardando reconexão...');
        updateSyncStatus('offline');
      }
    });
  }
  
  // Configurar listeners para alterações no Firebase
  function setupFirebaseListeners() {
    estoqueRef.on('child_changed', function(snapshot) {
      const path = snapshot.key;
      const data = snapshot.val();
      
      console.log(`🔄 Firebase Sync Enforcer: Alteração detectada em ${path}`);
      queueUpdate(path, data);
    });
    
    estoqueRef.on('child_added', function(snapshot) {
      const path = snapshot.key;
      const data = snapshot.val();
      
      console.log(`🔄 Firebase Sync Enforcer: Novo item adicionado em ${path}`);
      queueUpdate(path, data);
    });
  }
  
  // Enfileirar uma atualização 
  function queueUpdate(path, data) {
    updateQueue.push({ path, data });
    syncStatus.pendingUpdates = updateQueue.length;
    
    // Processar a fila se não estiver processando no momento
    if (!isEnforcingUpdate) {
      processUpdateQueue();
    }
  }
  
  // Processar a fila de atualizações
  function processUpdateQueue() {
    if (updateQueue.length === 0) {
      isEnforcingUpdate = false;
      syncStatus.pendingUpdates = 0;
      updateSyncStatus('synced');
      return;
    }
    
    isEnforcingUpdate = true;
    updateSyncStatus('syncing');
    
    const update = updateQueue.shift();
    
    try {
      applyFirebaseDataToTable(update.path, update.data);
      
      // Processar o próximo item na fila após um pequeno atraso
      setTimeout(processUpdateQueue, 100);
    } catch (error) {
      console.error('❌ Firebase Sync Enforcer: Erro ao aplicar atualização', error);
      syncStatus.syncErrors++;
      
      // Continuar processando a fila apesar do erro
      setTimeout(processUpdateQueue, 100);
    }
  }
  
  // Carregar todos os dados do Firebase
  function loadAllDataFromFirebase() {
    console.log('🔄 Firebase Sync Enforcer: Carregando todos os dados do Firebase...');
    updateSyncStatus('loading');
    
    estoqueRef.once('value')
      .then(function(snapshot) {
        const data = snapshot.val();
        if (!data) {
          console.warn('⚠️ Firebase Sync Enforcer: Nenhum dado encontrado no Firebase.');
          updateSyncStatus('empty');
          return;
        }
        
        lastLoadedData = data;
        console.log('✅ Firebase Sync Enforcer: Dados carregados com sucesso!', Object.keys(data).length, 'itens');
        
        // Aplicar todos os dados à tabela
        applyAllFirebaseDataToTable(data);
      })
      .catch(function(error) {
        console.error('❌ Firebase Sync Enforcer: Erro ao carregar dados', error);
        showSyncError('Erro ao carregar dados');
        syncStatus.syncErrors++;
        updateSyncStatus('error');
      });
  }
  
  // Aplicar todos os dados do Firebase à tabela
  function applyAllFirebaseDataToTable(data) {
    isEnforcingUpdate = true;
    updateSyncStatus('applying');
    
    let updateCount = 0;
    const startTime = Date.now();
    
    // Processar cada item nos dados
    for (const path in data) {
      if (data.hasOwnProperty(path)) {
        applyFirebaseDataToTable(path, data[path]);
        updateCount++;
      }
    }
    
    const endTime = Date.now();
    console.log(`✅ Firebase Sync Enforcer: ${updateCount} itens aplicados em ${endTime - startTime}ms`);
    
    isEnforcingUpdate = false;
    syncStatus.lastSync = new Date();
    updateSyncStatus('synced');
  }
  
  // Aplicar um dado específico do Firebase à tabela
  function applyFirebaseDataToTable(path, data) {
    try {
      if (!path || !data || !data.value) {
        console.warn(`⚠️ Firebase Sync Enforcer: Dados inválidos para ${path}`);
        return;
      }
      
      // Parse do caminho (formato: tableId/row/cell)
      const pathParts = path.split('/');
      if (pathParts.length < 3) {
        console.warn(`⚠️ Firebase Sync Enforcer: Formato de caminho inválido: ${path}`);
        return;
      }
      
      const tableId = pathParts[0];
      const rowIndex = parseInt(pathParts[1]);
      const cellIndex = parseInt(pathParts[2]);
      
      // Encontrar a tabela correta
      const table = document.getElementById(tableId);
      if (!table) {
        console.warn(`⚠️ Firebase Sync Enforcer: Tabela não encontrada: ${tableId}`);
        return;
      }
      
      // Obter a célula
      if (!table.rows[rowIndex] || !table.rows[rowIndex].cells[cellIndex]) {
        console.warn(`⚠️ Firebase Sync Enforcer: Célula não encontrada: ${rowIndex}/${cellIndex}`);
        return;
      }
      
      const cell = table.rows[rowIndex].cells[cellIndex];
      const currentValue = cell.innerHTML;
      
      // Comparar valor atual com o valor do Firebase
      if (currentValue !== data.value) {
        console.log(`🔄 Firebase Sync Enforcer: Atualizando célula ${path}`);
        console.log(`   De: "${currentValue}"`);
        console.log(`   Para: "${data.value}"`);
        
        // Flag para evitar loop de atualizações (importante!)
        window.isLocalUpdate = true;
        
        // Atualizar o valor da célula
        cell.innerHTML = data.value;
        
        // Adicionar efeito visual para destacar a célula atualizada
        highlightUpdatedCell(cell);
        
        // Remover a flag
        setTimeout(() => {
          window.isLocalUpdate = false;
        }, 100);
      }
    } catch (error) {
      console.error(`❌ Firebase Sync Enforcer: Erro ao aplicar dados para ${path}`, error);
      throw error;
    }
  }
  
  // Verificar se os dados na tabela correspondem aos dados no Firebase
  function verifyTableDataMatchesFirebase() {
    if (isEnforcingUpdate || !lastLoadedData) return;
    
    console.log('🔄 Firebase Sync Enforcer: Verificando consistência dos dados...');
    
    const table = document.getElementById('estoque-table');
    if (!table) {
      console.warn('⚠️ Firebase Sync Enforcer: Tabela principal não encontrada');
      return;
    }
    
    let mismatches = 0;
    
    // Para cada item nos dados do Firebase
    for (const path in lastLoadedData) {
      if (lastLoadedData.hasOwnProperty(path)) {
        const data = lastLoadedData[path];
        
        try {
          // Parse do caminho
          const pathParts = path.split('/');
          const tableId = pathParts[0];
          const rowIndex = parseInt(pathParts[1]);
          const cellIndex = parseInt(pathParts[2]);
          
          // Verificar apenas para a tabela principal
          if (tableId !== 'estoque-table') continue;
          
          // Obter a célula
          if (!table.rows[rowIndex] || !table.rows[rowIndex].cells[cellIndex]) continue;
          
          const cell = table.rows[rowIndex].cells[cellIndex];
          const currentValue = cell.innerHTML;
          
          // Comparar valor
          if (currentValue !== data.value) {
            console.warn(`⚠️ Firebase Sync Enforcer: Diferença detectada em ${path}`);
            console.log(`   Na tabela: "${currentValue}"`);
            console.log(`   No Firebase: "${data.value}"`);
            
            // Aplicar o valor do Firebase
            queueUpdate(path, data);
            mismatches++;
          }
        } catch (error) {
          console.error(`❌ Firebase Sync Enforcer: Erro ao verificar ${path}`, error);
        }
      }
    }
    
    if (mismatches === 0) {
      console.log('✅ Firebase Sync Enforcer: Tabela consistente com o Firebase');
    } else {
      console.warn(`⚠️ Firebase Sync Enforcer: ${mismatches} inconsistências encontradas e corrigidas`);
    }
  }
  
  // Adicionar indicador de status na página
  function addSyncStatusIndicator() {
    const statusDiv = document.createElement('div');
    statusDiv.id = 'firebase-sync-status';
    statusDiv.style.position = 'fixed';
    statusDiv.style.bottom = '10px';
    statusDiv.style.right = '10px';
    statusDiv.style.backgroundColor = '#f0f0f0';
    statusDiv.style.border = '1px solid #ccc';
    statusDiv.style.padding = '5px 10px';
    statusDiv.style.borderRadius = '4px';
    statusDiv.style.fontSize = '12px';
    statusDiv.style.zIndex = '1000';
    statusDiv.innerHTML = 'Firebase: Iniciando...';
    
    document.body.appendChild(statusDiv);
    
    // Adicionar botão para forçar sincronização
    const syncButton = document.createElement('button');
    syncButton.textContent = '🔄 Forçar Sincronização';
    syncButton.style.marginLeft = '10px';
    syncButton.style.fontSize = '12px';
    syncButton.style.padding = '2px 5px';
    syncButton.style.cursor = 'pointer';
    
    syncButton.addEventListener('click', function() {
      loadAllDataFromFirebase();
    });
    
    statusDiv.appendChild(syncButton);
  }
  
  // Atualizar o indicador de status
  function updateSyncStatus(status) {
    const statusDiv = document.getElementById('firebase-sync-status');
    if (!statusDiv) return;
    
    let statusText = '';
    let statusColor = '';
    
    switch (status) {
      case 'loading':
        statusText = '🔄 Carregando dados...';
        statusColor = '#2196F3';
        break;
      case 'applying':
        statusText = '🔄 Aplicando dados...';
        statusColor = '#2196F3';
        break;
      case 'syncing':
        statusText = `🔄 Sincronizando (${syncStatus.pendingUpdates} pendentes)`;
        statusColor = '#FFC107';
        break;
      case 'synced':
        statusText = '✅ Sincronizado';
        statusColor = '#4CAF50';
        break;
      case 'error':
        statusText = `❌ Erro (${syncStatus.syncErrors})`;
        statusColor = '#F44336';
        break;
      case 'offline':
        statusText = '⚠️ Desconectado';
        statusColor = '#FF9800';
        break;
      case 'empty':
        statusText = '⚠️ Sem dados no Firebase';
        statusColor = '#FF9800';
        break;
      default:
        statusText = '⚠️ Status desconhecido';
        statusColor = '#9E9E9E';
    }
    
    if (syncStatus.lastSync) {
      const time = syncStatus.lastSync.toLocaleTimeString();
      statusText += ` (${time})`;
    }
    
    statusDiv.innerHTML = `Firebase: ${statusText}`;
    statusDiv.style.backgroundColor = statusColor;
    statusDiv.style.color = 'white';
    
    // Readicionar o botão
    const syncButton = document.createElement('button');
    syncButton.textContent = '🔄 Forçar Sincronização';
    syncButton.style.marginLeft = '10px';
    syncButton.style.fontSize = '12px';
    syncButton.style.padding = '2px 5px';
    syncButton.style.cursor = 'pointer';
    
    syncButton.addEventListener('click', function() {
      loadAllDataFromFirebase();
    });
    
    statusDiv.appendChild(syncButton);
  }
  
  // Mostrar erro de sincronização
  function showSyncError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '10px';
    errorDiv.style.left = '50%';
    errorDiv.style.transform = 'translateX(-50%)';
    errorDiv.style.backgroundColor = '#f44336';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '10px 20px';
    errorDiv.style.borderRadius = '4px';
    errorDiv.style.zIndex = '1001';
    errorDiv.textContent = `Erro de sincronização: ${message}`;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
      errorDiv.style.opacity = '0';
      errorDiv.style.transition = 'opacity 0.5s';
      setTimeout(() => {
        errorDiv.remove();
      }, 500);
    }, 5000);
  }
  
  // Destacar célula atualizada com efeito visual
  function highlightUpdatedCell(cell) {
    // Salvar o estilo original
    const originalBackground = cell.style.backgroundColor;
    const originalTransition = cell.style.transition;
    
    // Aplicar destaque
    cell.style.transition = 'background-color 1.5s';
    cell.style.backgroundColor = '#ffff99'; // Amarelo claro
    
    // Reverter após a animação
    setTimeout(() => {
      cell.style.backgroundColor = originalBackground;
      
      // Restaurar após a transição de volta
      setTimeout(() => {
        cell.style.transition = originalTransition;
      }, 1500);
    }, 1500);
  }
})(); 