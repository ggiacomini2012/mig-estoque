/**
 * CARREGADOR DO FIREBASE DEBUGGER
 * 
 * INSTRUÇÕES:
 * 1. Abra o site no navegador
 * 2. Pressione F12 para abrir as ferramentas do desenvolvedor
 * 3. Vá para a aba "Console"
 * 4. Cole TODO o conteúdo deste arquivo e pressione Enter
 * 5. O debugger será carregado automaticamente
 */

(function() {
  console.log("Iniciando carregador do Firebase Debugger...");
  
  // Função para carregar o script
  function loadScript(url) {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onload = function() {
      console.log(`Script carregado: ${url}`);
    };
    script.onerror = function() {
      console.error(`Erro ao carregar script: ${url}`);
    };
    document.head.appendChild(script);
  }
  
  // Carregar o script do Firebase Debugger
  // Ajuste o caminho do arquivo conforme necessário
  loadScript('firebase-debug.js');
  
  console.log("Firebase Debugger carregando... Aguarde as mensagens no console.");
})();

// Versão alternativa caso o caminho do arquivo não funcione:
// (Para colar no console caso o método acima falhe)
console.log("Se o script não carregar usando o método acima, cole o conteúdo completo do arquivo firebase-debug.js diretamente no console."); 