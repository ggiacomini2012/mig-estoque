document.addEventListener('DOMContentLoaded', function() {
  // Esperar o input ser criado pelo input-parser.js
  setTimeout(() => {
    const input = document.querySelector('input[placeholder*="A10"]');
    const button = input ? input.nextElementSibling : null;
    
    if (!input || !button) return;
    
    // Definir padrões de validação
    const locationPattern = /^[A-Za-z][0-9]{1,2}$/;
    
    // Função de validação
    function validateInput() {
      const text = input.value.trim();
      let isValid = true;
      let errors = [];
      
      if (!text) {
        button.style.display = 'none';
        return;
      }
      
      const parts = text.split(' ');
      
      // Verificar se tem pelo menos 3 partes (localização, cor, código)
      if (parts.length < 3) {
        isValid = false;
        errors.push('O input deve ter no mínimo 3 partes: localização (ex: A10), cor e código de 3 dígitos');
        button.style.display = 'none';
        console.log('Erros de validação:', errors);
        return;
      }
      
      // Verificar se o primeiro item tem o formato correto (ex: A10, B5)
      if (!locationPattern.test(parts[0])) {
        isValid = false;
        errors.push('Formato de localização inválido. Deve ser uma letra seguida de 1-2 dígitos (ex: A10)');
      }
      
      // Verificar se tem uma cor válida
      if (!/^[A-Za-z]+$/.test(parts[1])) {
        isValid = false;
        errors.push(`A segunda parte "${parts[1]}" deve ser uma palavra (cor)`);
      }
      
      // Verificar se tem um código válido
      if (!/^\d{3}$/.test(parts[2])) {
        isValid = false;
        errors.push(`A terceira parte "${parts[2]}" deve ser um código de 3 dígitos`);
      }
      
      // Verificar as partes adicionais após as 3 obrigatórias
      let expectingColor = true;
      
      for (let i = 3; i < parts.length; i++) {
        const part = parts[i];
        
        if (expectingColor) {
          // Esperando uma cor (palavra) ou um código
          if (/^\d{3}$/.test(part)) {
            // Se for um código, não esperamos mais uma cor
            expectingColor = false;
          } else if (!/^[A-Za-z]+$/.test(part)) {
            // Se não for uma palavra, é inválido
            isValid = false;
            errors.push(`Formato inválido na posição ${i+1}: "${part}" deve ser uma palavra ou código de 3 dígitos`);
          }
        } else {
          // Esperando um código de 3 dígitos
          if (!/^\d{3}$/.test(part)) {
            isValid = false;
            errors.push(`Formato inválido na posição ${i+1}: "${part}" deve ser um código de 3 dígitos`);
          }
          // Depois de um código, esperamos uma cor novamente
          expectingColor = true;
        }
      }
      
      // Exibir ou esconder o botão com base na validação
      if (isValid) {
        button.style.display = '';
      } else {
        button.style.display = 'none';
        console.log('Erros de validação:', errors);
      }
    }
    
    // Adicionar evento para validar o input a cada alteração
    input.addEventListener('input', validateInput);
    
    // Validar o estado inicial
    validateInput();
  }, 100);
}); 