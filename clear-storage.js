document.addEventListener('DOMContentLoaded', function() {
  // Criar o botão para limpar localStorage
  const clearButton = document.createElement('button');
  clearButton.textContent = 'Limpar Dados';
  clearButton.style.position = 'fixed';
  clearButton.style.bottom = '20px';
  clearButton.style.right = '20px';
  clearButton.style.padding = '10px';
  clearButton.style.backgroundColor = '#ff5555';
  clearButton.style.color = 'white';
  clearButton.style.border = 'none';
  clearButton.style.borderRadius = '5px';
  clearButton.style.cursor = 'pointer';
  
  // Adicionar botão ao corpo da página
  document.body.appendChild(clearButton);
  
  // Adicionar evento de clique
  clearButton.addEventListener('click', function() {
    // Solicitar senha
    const senha = prompt('Digite a senha para limpar os dados:');
    
    // Verificar senha
    if (senha === 'bob3000') {
      // Limpar todo o localStorage
      localStorage.clear();
      
      // Limpar todas as subtabelas - Deixar o site como era antes
      const subtables = document.querySelectorAll('.subtable');
      subtables.forEach(table => {
        // Manter apenas a primeira linha (cabeçalho) e remover o resto
        while (table.rows.length > 1) {
          table.deleteRow(1);
        }
      });
      
      // Remover quaisquer elementos adicionados dinamicamente ao DOM
      // como campos de entrada, botões adicionais, etc.
      const inputElements = document.querySelectorAll('input:not([id^="original"])');
      inputElements.forEach(el => el.remove());
      
      // Se houver um campo de entrada de comandos, limpar seu valor
      const commandInput = document.getElementById('comando-input');
      if (commandInput) {
        commandInput.value = '';
      }
      
      // Limpar qualquer preview ou display de dados
      const previewElements = document.querySelectorAll('.preview-item, .preview-container');
      previewElements.forEach(el => el.remove());
      
      // Informar que os dados foram limpos
      alert('Todos os dados foram limpos com sucesso! O site foi restaurado ao estado inicial.');
    } else if (senha !== null) {
      // Senha incorreta
      alert('Senha incorreta. Operação cancelada.');
    }
  });
}); 