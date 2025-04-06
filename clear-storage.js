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
      
      // Informar que os dados foram limpos
      alert('Todos os dados foram limpos com sucesso!');
      
      // Recarregar a página para refletir as mudanças
      location.reload();
    } else if (senha !== null) {
      // Senha incorreta
      alert('Senha incorreta. Operação cancelada.');
    }
  });
}); 