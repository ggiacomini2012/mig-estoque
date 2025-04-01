/**
 * MONITOR DO FIREBASE
 * Este script registra no console todas as operações do Firebase
 * para facilitar a depuração de problemas de sincronização.
 */

(function() {
  // Esperar o DOM carregar para garantir que o Firebase está disponível
  document.addEventListener('DOMContentLoaded', function() {
    console.log('🔥 Firebase Monitor iniciado');
    
    // Verificar se o Firebase está disponível
    if (typeof firebase === 'undefined') {
      console.error('❌ Firebase não está disponível na página!');
      return;
    }
    
    // Verificar se as variáveis db e auth existem
    if (typeof db === 'undefined' || typeof auth === 'undefined') {
      console.error('❌ Variáveis db e/ou auth não estão definidas!');
      return;
    }
    
    console.log('✅ Firebase SDK detectado:', firebase.SDK_VERSION);
    
    // Monitorar status de conexão
    db.ref('.info/connected').on('value', function(snap) {
      const connected = snap.val() === true;
      console.log(`🌐 Firebase Conexão: ${connected ? 'ONLINE ✅' : 'OFFLINE ❌'}`);
    });
    
    // Monitorar autenticação
    auth.onAuthStateChanged(function(user) {
      if (user) {
        console.log('👤 Usuário autenticado:', user.uid);
      } else {
        console.log('👤 Usuário não autenticado');
      }
    });
    
    // Monitorar dados do estoque (todas as operações)
    if (typeof estoqueRef !== 'undefined') {
      // Quando um item for adicionado
      estoqueRef.on('child_added', function(snapshot) {
        console.log('📥 ESTOQUE - Item adicionado:', {
          path: snapshot.key,
          data: snapshot.val()
        });
      });
      
      // Quando um item for alterado
      estoqueRef.on('child_changed', function(snapshot) {
        console.log('🔄 ESTOQUE - Item alterado:', {
          path: snapshot.key,
          data: snapshot.val()
        });
      });
      
      // Quando um item for removido
      estoqueRef.on('child_removed', function(snapshot) {
        console.log('🗑️ ESTOQUE - Item removido:', snapshot.key);
      });
    } else {
      console.warn('⚠️ estoqueRef não definido, monitoramento de estoque não disponível');
    }
    
    // Monitorar usuários ativos
    db.ref('users').on('value', function(snapshot) {
      const users = snapshot.val() || {};
      console.log('👥 Usuários ativos:', Object.keys(users).length, users);
    });
    
    // Monitorar presença
    db.ref('presence').on('value', function(snapshot) {
      const presence = snapshot.val() || {};
      console.log('👁️ Presença:', Object.keys(presence).length, presence);
    });
    
    // Substituir o método original de salvar no Firebase para monitorar operações
    if (window.saveToFirebase) {
      const originalSaveToFirebase = window.saveToFirebase;
      
      window.saveToFirebase = function(cell) {
        console.log('💾 Tentando salvar célula:', cell);
        
        // Identificar a célula alterada
        const row = cell.closest('tr');
        const cellIndex = Array.from(row.cells).indexOf(cell);
        const rowIndex = Array.from(row.parentElement.rows).indexOf(row);
        const parentTable = cell.closest('table');
        const tableId = parentTable.id || 'unknown';
        
        console.log(`💾 Detalhes do salvamento: Tabela=${tableId}, Linha=${rowIndex}, Célula=${cellIndex}, Valor="${cell.innerHTML}"`);
        
        // Chamar a função original
        return originalSaveToFirebase.apply(this, arguments);
      };
      
      console.log('✅ Monitoramento de saveToFirebase ativado');
    }
    
    // Adicionar monitor para eventos de input em células da tabela
    document.addEventListener('input', function(e) {
      if (e.target.tagName === 'TD' || e.target.closest('td')) {
        const cell = e.target.tagName === 'TD' ? e.target : e.target.closest('td');
        console.log('⌨️ Input detectado em célula:', {
          elemento: cell,
          valor: cell.textContent || cell.innerHTML
        });
      }
    });
    
    console.log('✅ Firebase Monitor inicializado com sucesso');
  });
})(); 