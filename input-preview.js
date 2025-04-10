document.addEventListener('DOMContentLoaded', function() {
  // Buscar o input criado pelo input-parser.js
  setTimeout(() => {
    // 1. Encontrar o container do input pelo ID
    const inputContainer = document.getElementById('input-parser-container');
    if (!inputContainer) {
        console.log("[Preview Log] Input container (#input-parser-container) not found. Preview not initialized.");
        return;
    }

    // 2. Buscar o input DENTRO do container encontrado
    const input = inputContainer.querySelector('input'); 
    // You might need to make this selector more specific if there are multiple inputs 
    // inside input-parser-container, e.g., inputContainer.querySelector('input[type="text"]')
    
    if (!input) {
        console.log("[Preview Log] Input element not found *inside* #input-parser-container. Preview not initialized.");
        return;
    }
    console.log(`[Preview Log] Found input element inside #${inputContainer.id}.`);

    // Criar elemento de prévia
    const previewContainer = document.createElement('div');
    console.log("[Preview Log] Created previewContainer element (div).");
    previewContainer.classList.add('input-preview-container');
    
    // Não precisamos mais buscar o inputContainer aqui, já temos ele.
    // const inputContainer = document.getElementById('input-parser-container'); 
    
    // Inserir o preview DEPOIS do container do input
    if (inputContainer.parentNode) { // Check only parentNode now
        console.log(`[Preview Log] Found input container's parent (<${inputContainer.parentNode.tagName}>). Attempting to insert previewContainer after the container.`);
        inputContainer.parentNode.insertBefore(previewContainer, inputContainer.nextSibling);
        console.log(`[Preview Log] Appended previewContainer. Parent: <${previewContainer.parentNode.tagName}>. Should be visible after element #${inputContainer.id}.`);
    } else {
        // This case is less likely if inputContainer was found, but keep as fallback
        console.warn("[Preview Log] Could not find input container's parent. Appending previewContainer to <body> as fallback.");
        document.body.appendChild(previewContainer);
        console.log(`[Preview Log] Appended previewContainer to <body>. Parent: <${previewContainer.parentNode.tagName}>. Should be visible at the end of the body.`);
        console.warn("[Preview] Não foi possível encontrar o parentNode do input container, adicionando preview ao final do body.");
    }
    
    // Adicionar evento de entrada no input
    input.addEventListener('input', function() {
      console.log("[Preview Log] Input event triggered.");
      // Limpar prévia anterior
      previewContainer.innerHTML = '';
      console.log("[Preview Log] Cleared previous preview content.");
      
      const fullInputText = input.value.trim();
      if (!fullInputText) {
          console.log("[Preview Log] Input is empty. No preview generated.");
          return;
      }

      // Dividir a entrada completa em comandos individuais pela vírgula
      const allCommands = fullInputText.split(',').map(cmd => cmd.trim()).filter(cmd => cmd);
      console.log(`[Preview Log] Found ${allCommands.length} command(s) separated by commas.`);

      if (allCommands.length === 0) {
          console.log("[Preview Log] No valid commands found after splitting by comma.");
          return;
      }

      // Processar cada comando individualmente
      allCommands.forEach((commandText, commandIndex) => {
          console.log(`[Preview Log] Processing command ${commandIndex + 1}: "${commandText}"`);

          const parts = commandText.split(' ').filter(p => p.trim()); // Filtra partes vazias
          if (parts.length < 2) {
              console.log(`[Preview Log] Command ${commandIndex + 1}: Not enough parts for preview. Skipping.`);
              return; // Pula para o próximo comando no forEach
          }
          
          // --- Criação do Preview para ESTE comando ---
          const commandPreviewContainer = document.createElement('div');
          commandPreviewContainer.classList.add('input-preview-command-section'); // Class for individual command preview
          // Adicionar uma margem inferior para separar visualmente as seções
          // --- REMOVED Inline Styles - Now handled by CSS --- 
          // if (commandIndex < allCommands.length - 1) { 
          //    commandPreviewContainer.style.marginBottom = '10px';
          //    commandPreviewContainer.style.borderBottom = '1px dashed #ddd'; 
          //    commandPreviewContainer.style.paddingBottom = '10px';
          // }

          // Exibir o local do comando
          const location = parts[0];
          const locationText = document.createElement('div');
          console.log(`[Preview Log] Command ${commandIndex + 1}: Created locationText element (div).`);
          locationText.textContent = `Local: ${location}`;
          locationText.classList.add('input-preview-location'); // Re-use existing class
          commandPreviewContainer.appendChild(locationText);
          console.log(`[Preview Log] Command ${commandIndex + 1}: Appended locationText.`);
          
          // Processar produtos no comando
          const products = {};
          let currentColor = '-';
          
          for (let i = 1; i < parts.length; i++) {
            const part = parts[i];
            if (/^\d+$/.test(part)) {
              const code = part;
              const key = `${code}_${currentColor}`;
              if (!products[key]) {
                products[key] = { qty: 1, code: code, color: currentColor };
              } else {
                products[key].qty++;
              }
            } else {
              currentColor = part;
            }
          }
          
          // Check if any products were processed for this command
          if (Object.keys(products).length === 0) {
              console.log(`[Preview Log] Command ${commandIndex + 1}: No valid products found. Only location will be shown.`);
              // Append the container with only the location text
              previewContainer.appendChild(commandPreviewContainer);
              return; // Pula a criação da tabela para este comando
          }

          // Exibir produtos na prévia (Tabela para ESTE comando)
          const previewTable = document.createElement('table');
          console.log(`[Preview Log] Command ${commandIndex + 1}: Created previewTable element (table).`);
          previewTable.classList.add('input-preview-table'); // Re-use existing class
          const headerRow = previewTable.insertRow();
          headerRow.classList.add('input-preview-header-row'); // Re-use existing class

          const headerQty = headerRow.insertCell();
          headerQty.outerHTML = '<th class="input-preview-header-cell input-preview-header-qty">Qtd</th>'; // Re-use existing classes
          const headerCode = headerRow.insertCell();
          headerCode.outerHTML = '<th class="input-preview-header-cell input-preview-header-code">Código</th>'; // Re-use existing classes
          const headerColor = headerRow.insertCell();
          headerColor.outerHTML = '<th class="input-preview-header-cell input-preview-header-color">Cor</th>'; // Re-use existing classes
          console.log(`[Preview Log] Command ${commandIndex + 1}: Created table header.`);

          let rowIndex = 0;
          for (const key in products) {
            const product = products[key];
            const row = previewTable.insertRow();
            row.classList.add('input-preview-data-row'); // Re-use existing class
            
            const qtyCell = row.insertCell();
            qtyCell.textContent = product.qty;
            qtyCell.classList.add('input-preview-data-cell', 'input-preview-data-qty'); // Re-use existing classes
            
            const codeCell = row.insertCell();
            codeCell.textContent = product.code;
            codeCell.classList.add('input-preview-data-cell', 'input-preview-data-code'); // Re-use existing classes
            
            const colorCell = row.insertCell();
            colorCell.textContent = product.color;
            colorCell.classList.add('input-preview-data-cell', 'input-preview-data-color'); // Re-use existing classes
            
            rowIndex++;
          }
          console.log(`[Preview Log] Command ${commandIndex + 1}: Added ${rowIndex} data row(s) to the table.`);
          
          // Adicionar a tabela ao container específico deste comando
          commandPreviewContainer.appendChild(previewTable);
          console.log(`[Preview Log] Command ${commandIndex + 1}: Appended previewTable.`);

          // Adicionar o container deste comando ao container principal da prévia
          previewContainer.appendChild(commandPreviewContainer);
          console.log(`[Preview Log] Command ${commandIndex + 1}: Appended command section to main preview container.`);
      }); // Fim do forEach para cada comando

      if (previewContainer.innerHTML === '') {
          console.log("[Preview Log] No valid commands generated a preview.");
      } else {
          console.log("[Preview Log] Finished processing all commands.");
      }

    });
    console.log("[Preview Log] Added input event listener.");

  }, 100); // Pequeno delay para garantir que o input-parser.js já criou o input
}); 