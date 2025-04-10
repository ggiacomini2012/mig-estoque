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
      const fullInputText = input.value.trim();
      let overallIsValid = true;
      let allErrors = [];

      if (!fullInputText) {
        button.style.display = 'none';
        return;
      }

      // Dividir a entrada completa em comandos individuais pela vírgula
      const commands = fullInputText.split(',').map(cmd => cmd.trim()).filter(cmd => cmd);
      
      if (commands.length === 0 && fullInputText.length > 0) {
        // Input has content but it's only commas/whitespace
        overallIsValid = false;
        allErrors.push("Entrada inválida. Use vírgulas para separar comandos completos (ex: A1 cor 123, B2 cor 456)");
      }

      // Validar cada comando individualmente
      for (let cmdIndex = 0; cmdIndex < commands.length; cmdIndex++) {
          const commandText = commands[cmdIndex];
          let commandIsValid = true;
          let commandErrors = [];
          const parts = commandText.split(' ').filter(p => p.trim());
          console.log(`[Validador] Validando comando #${cmdIndex + 1}: "${commandText}" (${parts.length} partes)`);

          // Verificar se tem pelo menos 3 partes (localização, cor, código)
          if (parts.length < 3) {
              commandIsValid = false;
              commandErrors.push(`Comando #${cmdIndex + 1} incompleto. Mínimo 3 partes (localização, cor, código)`);
              console.error(`[Validador] ERRO [Cmd ${cmdIndex + 1}]: Formato incompleto.`);
          }

          if (commandIsValid) {
              // Verificar se o primeiro item tem o formato correto (ex: A10, B5)
              if (!locationPattern.test(parts[0])) {
                  commandIsValid = false;
                  const msg = `Comando #${cmdIndex + 1}: Localização inválida "${parts[0]}" (ex: A1, B10)`;
                  commandErrors.push(msg);
                  console.error(`[Validador] ERRO [Cmd ${cmdIndex + 1}]: ${msg}`);
              }
              
              // Verificar se tem uma cor válida como segunda parte
              if (!/^[A-Za-z]+$/.test(parts[1])) {
                  commandIsValid = false;
                  const msg = `Comando #${cmdIndex + 1}: Cor inválida "${parts[1]}" (deve ser palavra)`;
                  commandErrors.push(msg);
                  console.error(`[Validador] ERRO [Cmd ${cmdIndex + 1}]: ${msg}`);
              }
              
              // Verificar se tem um código válido (exatamente 3 dígitos) como terceira parte
              if (!/^\d{3}$/.test(parts[2])) {
                  commandIsValid = false;
                  const msg = `Comando #${cmdIndex + 1}: Código inválido "${parts[2]}" (deve ter 3 dígitos)`;
                  commandErrors.push(msg);
                  console.error(`[Validador] ERRO [Cmd ${cmdIndex + 1}]: ${msg}`);
              }
          }

          // Verificar as partes adicionais (a partir da 4ª parte)
          if (commandIsValid) {
               for (let i = 3; i < parts.length; i++) {
                  const currentPart = parts[i];
                  const isCurrentPartColor = /^[A-Za-z]+$/.test(currentPart);
                  const isCurrentPartCode = /^\d{3}$/.test(currentPart);

                  // Check if current part is neither a valid color nor a valid code
                  if (!isCurrentPartColor && !isCurrentPartCode) {
                      commandIsValid = false;
                      const msg = `Comando #${cmdIndex + 1}: Parte inválida na posição ${i + 1} "${currentPart}" (deve ser cor ou código)`;
                      commandErrors.push(msg);
                      console.error(`[Validador] ERRO [Cmd ${cmdIndex + 1}]: ${msg}`);
                      break; // Exit loop for this command
                  }
                  
                  // (Optional stricter check: ensure alternation - uncomment if needed)
                  /* 
                  const previousPart = parts[i - 1];
                  const isPreviousPartColor = /^[A-Za-z]+$/.test(previousPart);
                  const isPreviousPartCode = /^\d{3}$/.test(previousPart);
                  if ((isCurrentPartColor && isPreviousPartColor) || (isCurrentPartCode && isPreviousPartCode)) {
                       commandIsValid = false;
                       const msg = `Comando #${cmdIndex+1}: Sequência inválida ${parts[i-1]} -> ${currentPart}`;
                       commandErrors.push(msg);
                       console.error(`[Validador] ERRO [Cmd ${cmdIndex + 1}]: ${msg}`);
                       break;
                  }
                   */
              }
          }

          if (!commandIsValid) {
              overallIsValid = false;
              allErrors.push(...commandErrors);
              // Não paramos no primeiro erro, continuamos validando outros comandos
          }
      } // Fim do loop de comandos

      // Exibir ou esconder o botão com base na validação GERAL
      if (overallIsValid) {
        button.style.display = '';
        console.log('[Validador] Todos os comandos são válidos!');
      } else {
        button.style.display = 'none';
        console.error('[Validador] Erros de validação encontrados:', allErrors);
        // O exemplo correto agora depende, talvez remover ou generalizar
        console.log('[Validador] Exemplo: "A1 preto 203, B2 azul 005"'); 
      }
    }
    
    // Adicionar evento para validar o input a cada alteração
    input.addEventListener('input', validateInput);
    
    // Validar o estado inicial
    validateInput();
  }, 300); // Aumentado para 300ms para dar mais tempo para o input-parser.js carregar
}); 