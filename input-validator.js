document.addEventListener('DOMContentLoaded', function() {
  // Esperar o input ser criado pelo input-parser.js
  setTimeout(() => {
    const input = document.querySelector('input[placeholder*="A1"]');
    if (!input) {
      console.error("[Validador] ERRO: Input não encontrado. Verifique se o input-parser.js está carregado corretamente.");
      return;
    }

    const button = input.nextElementSibling;
    if (!button) {
      console.error("[Validador] ERRO: Botão não encontrado. Verifique se o input-parser.js está criando o botão corretamente.");
      return;
    }
    
    console.log("[Validador] Inicializado com sucesso.");
    
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
      
      const parts = text.split(' ').filter(p => p.trim());
      console.log(`[Validador] Validando entrada: "${text}" (${parts.length} partes)`);
      
      // Verificar se tem pelo menos 3 partes (localização, cor, código)
      if (parts.length < 3) {
        isValid = false;
        errors.push('O input deve ter no mínimo 3 partes: localização (ex: A1), cor e código');
        button.style.display = 'none';
        console.error('[Validador] ERRO: Formato incompleto. Esperado pelo menos 3 partes.');
        console.log('[Validador] SOLUÇÃO: Use o formato "A1 preto 203" (localização + cor + código)');
        return;
      }
      
      // Verificar se o primeiro item tem o formato correto (ex: A10, B5)
      if (!locationPattern.test(parts[0])) {
        isValid = false;
        const msg = `Formato de localização inválido: "${parts[0]}". Deve ser uma letra seguida de 1-2 dígitos (ex: A1, B10)`;
        errors.push(msg);
        console.error(`[Validador] ERRO: ${msg}`);
        console.log('[Validador] SOLUÇÃO: Corrija o formato da localização (ex: A1, B10, C5)');
      }
      
      // Verificar se tem uma cor válida
      if (!/^[A-Za-z]+$/.test(parts[1])) {
        isValid = false;
        const msg = `A cor "${parts[1]}" deve conter apenas letras (ex: preto, vermelho)`;
        errors.push(msg);
        console.error(`[Validador] ERRO: ${msg}`);
        console.log('[Validador] SOLUÇÃO: Utilize apenas letras para a cor');
      }
      
      // Verificar se tem um código válido (exatamente 3 dígitos)
      if (!/^\d{3}$/.test(parts[2])) {
        isValid = false;
        const msg = `O código "${parts[2]}" deve ter exatamente 3 dígitos (ex: 203, 045, 001)`;
        errors.push(msg);
        console.error(`[Validador] ERRO: ${msg}`);
        console.log('[Validador] SOLUÇÃO: Use exatamente 3 dígitos para o código (000-999)');
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
            const msg = `Formato inválido na posição ${i+1}: "${part}" deve ser uma palavra ou código de 3 dígitos`;
            errors.push(msg);
            console.error(`[Validador] ERRO: ${msg}`);
            console.log(`[Validador] SOLUÇÃO: Na posição ${i+1}, utilize uma cor (apenas letras) ou um código (exatamente 3 dígitos)`);
          }
        } else {
          // Esperando um código de exatamente 3 dígitos
          if (!/^\d{3}$/.test(part)) {
            isValid = false;
            const msg = `Formato inválido na posição ${i+1}: "${part}" deve ser um código de 3 dígitos`;
            errors.push(msg);
            console.error(`[Validador] ERRO: ${msg}`);
            console.log(`[Validador] SOLUÇÃO: Na posição ${i+1}, utilize um código numérico com exatamente 3 dígitos (000-999)`);
          }
          // Depois de um código, esperamos uma cor novamente
          expectingColor = true;
        }
      }
      
      // Exibir ou esconder o botão com base na validação
      if (isValid) {
        button.style.display = '';
        console.log('[Validador] Entrada válida!');
      } else {
        button.style.display = 'none';
        console.error('[Validador] Erros de validação:', errors);
        console.log('[Validador] Exemplo correto: "A1 preto 203 branco 102"');
      }
    }
    
    // Adicionar evento para validar o input a cada alteração
    input.addEventListener('input', validateInput);
    
    // Validar o estado inicial
    validateInput();
  }, 300); // Aumentado para 300ms para dar mais tempo para o input-parser.js carregar
}); 