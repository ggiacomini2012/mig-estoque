/**
 * SCRIPT DE DIAGNÓSTICO DO FIREBASE
 * 
 * Este script é injetado automaticamente na página e não requer alteração do HTML.
 * Ele monitora todas as operações do Firebase e fornece logs detalhados.
 * 
 * Para desativar, acesse o console e digite: window.disableFirebaseDebug = true;
 */

(function() {
  console.log("%c FIREBASE DEBUGGER INICIADO ", "background: #ffcc00; color: black; font-weight: bold;");
  
  // Aguardar que a página seja totalmente carregada
  window.addEventListener('load', function() {
    setTimeout(initializeDebugger, 1000); // Esperar 1 segundo após o carregamento
  });
  
  function initializeDebugger() {
    // Verificar se o Firebase está disponível
    if (typeof firebase === 'undefined') {
      console.error("Firebase não está disponível na página!");
      return;
    }
    
    console.log("%c Firebase detectado! ", "background: #4CAF50; color: white;");
    console.log("Firebase SDK:", firebase.SDK_VERSION);
    
    // Verificar se db e auth estão disponíveis
    if (typeof db === 'undefined') {
      console.error("Variável db não está definida! Verificando firebase.database()...");
      if (firebase.database) {
        console.log("Firebase Database está disponível, mas db não está definido");
      } else {
        console.error("Firebase Database não está disponível!");
      }
    } else {
      console.log("Objeto db encontrado:", db);
      monitorDatabase();
    }
    
    if (typeof auth === 'undefined') {
      console.error("Variável auth não está definida! Verificando firebase.auth()...");
      if (firebase.auth) {
        console.log("Firebase Auth está disponível, mas auth não está definido");
      } else {
        console.error("Firebase Auth não está disponível!");
      }
    } else {
      console.log("Objeto auth encontrado:", auth);
      monitorAuth();
    }
    
    // Verificar a configuração do Firebase
    console.log("Configuração do Firebase:", getFirebaseConfig());
    
    // Adicionar funções de diagnóstico ao window
    window.testFirebase = function() {
      testFirebaseSave();
    };
    
    // Monitorar eventos de input na tabela
    monitorTableInputs();
  }
  
  function monitorDatabase() {
    if (!db) return;
    
    try {
      // Monitor de conexão
      db.ref('.info/connected').on('value', function(snap) {
        const connected = snap.val() === true;
        console.log(`%c Conexão Firebase: ${connected ? 'ONLINE ✓' : 'OFFLINE ✗'} `, 
                   `background: ${connected ? '#4CAF50' : '#F44336'}; color: white; font-weight: bold;`);
      });
      
      // Monitor para o nó de estoque
      if (typeof estoqueRef !== 'undefined') {
        console.log("Monitorando nó de estoque:", estoqueRef.toString());
        
        estoqueRef.on('child_added', function(snap) {
          console.log("ESTOQUE - Novo item adicionado:", snap.key, snap.val());
        });
        
        estoqueRef.on('child_changed', function(snap) {
          console.log("ESTOQUE - Item alterado:", snap.key, snap.val());
        });
        
        estoqueRef.on('child_removed', function(snap) {
          console.log("ESTOQUE - Item removido:", snap.key);
        });
      } else {
        console.warn("estoqueRef não definido, criando monitor genérico");
        
        // Tentar monitorar todo o banco
        db.ref().on('value', function(snap) {
          console.log("DB ATUALIZADO:", snap.val());
        });
      }
    } catch (error) {
      console.error("Erro ao configurar monitores do Firebase:", error);
    }
  }
  
  function monitorAuth() {
    if (!auth) return;
    
    auth.onAuthStateChanged(function(user) {
      if (user) {
        console.log("Usuário autenticado:", user.uid);
      } else {
        console.log("Usuário não autenticado");
      }
    });
  }
  
  function monitorTableInputs() {
    const table = document.getElementById('estoque-table');
    
    if (!table) {
      console.error("Tabela com ID 'estoque-table' não encontrada!");
      
      // Listar todas as tabelas na página
      const tables = document.getElementsByTagName('table');
      console.log(`Encontradas ${tables.length} tabelas na página:`);
      
      for (let i = 0; i < tables.length; i++) {
        console.log(`Tabela ${i}:`, tables[i].id || '(sem ID)', tables[i]);
      }
      
      return;
    }
    
    console.log("Monitorando inputs na tabela:", table);
    
    // Interceptar eventos de input na tabela
    table.addEventListener('input', function(e) {
      console.log("Input detectado na tabela:", e.target);
      console.log("Valor do input:", e.target.textContent || e.target.value);
      
      // Verificar eventos de sincronização
      setTimeout(function() {
        if (window.isLocalUpdate) {
          console.log("isLocalUpdate está definido como:", window.isLocalUpdate);
        }
      }, 100);
    });
  }
  
  function testFirebaseSave() {
    if (!db) {
      console.error("Firebase Database não disponível para teste!");
      return;
    }
    
    const testRef = db.ref('__test__');
    const testData = {
      value: "Teste manual via debugger",
      timestamp: firebase.database.ServerValue.TIMESTAMP
    };
    
    console.log("Tentando salvar dados de teste no Firebase:", testData);
    
    testRef.set(testData)
      .then(function() {
        console.log("%c Teste salvo com sucesso! ", "background: #4CAF50; color: white;");
        
        // Ler de volta para confirmar
        return testRef.once('value');
      })
      .then(function(snap) {
        console.log("Dados lidos de volta:", snap.val());
      })
      .catch(function(error) {
        console.error("Erro ao salvar teste:", error);
        console.log("Verifique as regras de segurança e credenciais do Firebase");
      });
  }
  
  function getFirebaseConfig() {
    // Tentar encontrar a configuração do Firebase
    try {
      if (typeof firebaseConfig !== 'undefined') {
        // Mascarar chaves sensíveis para exibição
        const config = {...firebaseConfig};
        
        if (config.apiKey) {
          config.apiKey = `${config.apiKey.substring(0, 4)}...${config.apiKey.substring(config.apiKey.length - 4)}`;
        }
        
        if (config.appId) {
          config.appId = `${config.appId.substring(0, 4)}...${config.appId.substring(config.appId.length - 4)}`;
        }
        
        return config;
      } else {
        return "firebaseConfig não encontrado";
      }
    } catch (e) {
      return "Erro ao acessar firebaseConfig";
    }
  }
  
  // Auto-injetar o código para executar o teste do Firebase após 3 segundos
  setTimeout(function() {
    console.log("%c Executando teste automático do Firebase em 3 segundos... ", "background: #2196F3; color: white;");
    setTimeout(testFirebaseSave, 3000);
  }, 2000);
  
})();

// Carregar o script automaticamente
(function injectScript() {
  console.log("Firebase debugger carregado. Digite window.testFirebase() no console para testar o salvamento.");
})(); 