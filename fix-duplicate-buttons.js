document.addEventListener('DOMContentLoaded', function() {
  // Executar limpeza imediatamente e após restauração
  cleanDuplicateButtons();
  document.addEventListener('tableRestored', cleanDuplicateButtons);
  
  function cleanDuplicateButtons() {
    document.querySelectorAll('.subtable').forEach(table => {
      // Contar divs com botões antes da tabela
      let buttonContainers = [];
      let prev = table.previousElementSibling;
      
      // Coletar todos os contêineres de botões
      while (prev && (prev.querySelector('button'))) {
        buttonContainers.push(prev);
        prev = prev.previousElementSibling;
      }
      
      // Manter apenas o último (mais recente)
      if (buttonContainers.length > 1) {
        buttonContainers.slice(1).forEach(container => container.remove());
      }
    });
  }
}); 