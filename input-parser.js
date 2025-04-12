document.addEventListener('DOMContentLoaded', function() {
  // Criar elementos de UI
  const container = document.createElement('div');
  container.id = 'input-parser-container';
  const input = document.createElement('input');
  const button = document.createElement('button');
  
  // Configurar elementos
  input.type = 'text';
  input.placeholder = 'A1 preto 203 branco 102 vermelho 054';
  input.style.width = '400px';
  button.textContent = 'Aplicar';
  
  // Adicionar ao DOM
  container.appendChild(input);
  container.appendChild(button);
  document.body.insertBefore(container, document.body.firstChild);
  
  // Adicionar handler de evento
  button.onclick = function() {
    const fullInputText = input.value.trim();
    console.log("=====================================================");
    console.log("[Parser] INÍCIO DO PROCESSAMENTO GERAL");
    console.log("=====================================================");
    console.log("[Parser] Input Completo Recebido:", fullInputText);
    
    if (!fullInputText) {
      console.error("[Parser] ERRO GERAL: Texto de entrada vazio.");
      alert("Por favor, digite um ou mais comandos válidos. Exemplo: A1 preto 203, B2 azul 005");
      return;
    }

    // Dividir a entrada completa em comandos individuais pela vírgula
    const commands = fullInputText.split(',').map(cmd => cmd.trim()).filter(cmd => cmd);
    console.log(`[Parser] INFO: ${commands.length} comando(s) detectado(s):`, commands);

    // Objeto para acumular todas as atualizações de todas as tabelas
    const allTableUpdates = {}; // Estrutura: { 'andar-coluna': { 'codigo_cor': { qty, code, color } } }
    let hasErrors = false;

    // Processar cada comando individualmente
    for (const commandText of commands) {
        console.log("-----------------------------------------------------");
        console.log(`[Parser] Processando comando individual: "${commandText}"`);
        console.log("-----------------------------------------------------");

        const parts = commandText.split(' ').filter(p => p.trim()); // Filtra partes vazias
        
        if (parts.length < 3) { // Mudado de < 2 para < 3 (loc, cor, codigo)
            console.error(`[Parser] ERRO no comando "${commandText}": Formato inválido. Mínimo de 3 partes (localização, cor, código).`);
            alert(`Erro no comando "${commandText}": Formato inválido. Exemplo: A1 preto 203`);
            hasErrors = true;
            continue; // Pula para o próximo comando
        }

        // --- Extração e Validação da Localização ---
        const location = parts[0];
        const locationMatch = location.match(/^([A-Za-z])([0-9]{1,2})$/);
        if (!locationMatch) {
            console.error(`[Parser] ERRO no comando "${commandText}": Localização "${location}" inválida. Formato: Letra+Número(s) (ex: A1, B10).`);
            alert(`Erro no comando "${commandText}": Localização "${location}" inválida.`);
            hasErrors = true;
            continue;
        }
        const colLetter = locationMatch[1].toUpperCase();
        const andar = locationMatch[2];
        const tableKey = `${andar}-${colLetter}`; // Chave única para a subtabela
        
        console.log(`[Parser] ETAPA 1/4: Localização: Coluna ${colLetter}, Andar ${andar}`);

        // --- Inicialização da estrutura de atualização para esta tabela (se não existir) ---
        if (!allTableUpdates[tableKey]) {
            allTableUpdates[tableKey] = { 
                targetTable: null, // Será preenchido depois
                existingProducts: {} 
            };
            console.log(`[Parser] INFO: Criando estrutura de atualização para ${tableKey}`);
        }

        // --- Processamento de Cores e Códigos --- 
        let currentColor = '-'; // Cor padrão inicial
        let productCountInCommand = 0;
        let firstColorSet = false;
        
        console.log("[Parser] Iniciando processamento de cores e códigos...");
        for (let i = 1; i < parts.length; i++) {
            const part = parts[i];
            
            if (/^\d{3}$/.test(part)) {
                // É um código
                const code = part;
                if (!firstColorSet) {
                    console.error(`[Parser] ERRO no comando "${commandText}": Código "${code}" encontrado antes da primeira cor.`);
                    alert(`Erro no comando "${commandText}": Código "${code}" inválido antes da primeira cor.`);
                    hasErrors = true;
                    break; // Interrompe processamento deste comando
                }
                const productKey = `${code}_${currentColor}`;
                console.log(`[Parser] INFO: Processando código: ${code}, cor atual: ${currentColor}`);
                
                // Inicializa se não existir no acumulador
                if (!allTableUpdates[tableKey].existingProducts[productKey]) {
                    allTableUpdates[tableKey].existingProducts[productKey] = { qty: 0, code: code, color: currentColor };
                }
                // Incrementa quantidade
                allTableUpdates[tableKey].existingProducts[productKey].qty++;
                console.log(`[Parser] INFO: Quantidade acumulada para ${productKey} em ${tableKey}: ${allTableUpdates[tableKey].existingProducts[productKey].qty}`);
                productCountInCommand++;

            } else if (/^[A-Za-z]+$/.test(part)) {
                // É uma cor
                currentColor = part.toLowerCase();
                firstColorSet = true;
                console.log(`[Parser] INFO: Nova cor definida: ${currentColor}`);
            } else if (/^\d+$/.test(part)) {
                 // Número, mas não 3 dígitos
                 console.error(`[Parser] ERRO no comando "${commandText}": Código "${part}" inválido. Deve ter 3 dígitos.`);
                 alert(`Erro no comando "${commandText}": Código "${part}" inválido. Use 3 dígitos (ex: 005).`);
                 hasErrors = true;
                 break;
            } else {
                 // Inválido
                 console.error(`[Parser] ERRO no comando "${commandText}": Parte "${part}" inválida. Deve ser cor (letras) ou código (3 dígitos).`);
                 alert(`Erro no comando "${commandText}": Parte "${part}" inválida.`);
                 hasErrors = true;
                 break;
            }
        }
        
        if (hasErrors) continue; // Se houve erro neste comando, vai para o próximo

        if (productCountInCommand === 0) {
            console.warn(`[Parser] ALERTA no comando "${commandText}": Nenhum código de produto válido encontrado.`);
            // Não consideramos isso um erro fatal, pode ser apenas um comando de definição de cor?
            // alert(`Atenção no comando "${commandText}": Nenhum código de produto encontrado.`);
        }
        console.log(`[Parser] FIM Processamento comando individual: "${commandText}"`);
    } // Fim do loop de comandos individuais

    // --- Se houveram erros em algum comando, não aplicar nada --- 
    if (hasErrors) {
        console.error("[Parser] ERRO GERAL: Um ou mais comandos continham erros. Nenhuma alteração foi aplicada.");
        alert("Um ou mais comandos continham erros. Verifique o console para detalhes. Nenhuma alteração foi aplicada.");
        return;
    }

    // --- Aplicação das Atualizações Acumuladas --- 
    console.log("=====================================================");
    console.log("[Parser] INÍCIO DA APLICAÇÃO DAS ATUALIZAÇÕES");
    console.log("=====================================================");
    
    const allRows = document.querySelectorAll('#estoque-table tbody tr'); // Busca tabela principal pelo ID
    if (!allRows || allRows.length === 0) {
        console.error("[Parser] ERRO FATAL: Tabela principal #estoque-table não encontrada ou vazia.");
        alert("Erro crítico: Tabela principal não encontrada. A página pode não ter carregado corretamente.");
        return;
    }
    
    let totalProdutosAtualizados = 0;
    
    // Iterar sobre cada subtabela que precisa ser atualizada
    for (const tableKey in allTableUpdates) {
        const [andar, colLetter] = tableKey.split('-');
        const updateData = allTableUpdates[tableKey];
        
        console.log(`-----------------------------------------------------`);
        console.log(`[Parser] Aplicando atualizações para ${colLetter}${andar} (Chave: ${tableKey})`);
        console.log(`-----------------------------------------------------`);

        // --- Encontrar a Linha (Andar) --- 
        const row = Array.from(allRows).find(r => r.cells.length > 0 && r.cells[0].textContent.trim() === andar);
        if (!row) {
            console.error(`[Parser] ERRO ao aplicar: Andar ${andar} não encontrado na tabela principal.`);
            alert(`Erro ao aplicar atualizações: Andar ${andar} não encontrado.`);
            hasErrors = true; // Marca erro para não limpar input/salvar histórico
            continue; // Pula para a próxima tabela
        }
        console.log(`[Parser] SUCESSO: Linha do andar ${andar} encontrada.`);

        // --- Encontrar o Índice da Coluna DINAMICAMENTE ---
        let colIndex = -1;
        // Assume header is the first row in the thead of the main table
        const headerRow = document.querySelector('#estoque-table thead tr'); 
        if (headerRow) {
            // Find the index of the cell whose text content matches the column letter
            for (let i = 0; i < headerRow.cells.length; i++) {
                // Compare header text (trimmed, uppercase) with the target column letter
                if (headerRow.cells[i].textContent.trim().toUpperCase() === colLetter) {
                    colIndex = i;
                    break; // Found the index, stop searching
                }
            }
        } else {
             // Critical error if the header row itself cannot be found
             console.error(`[Parser] ERRO CRÍTICO: Não foi possível encontrar a linha de cabeçalho (thead tr) em #estoque-table.`);
             alert(`Erro crítico: Cabeçalho da tabela principal (#estoque-table thead tr) não encontrado. A estrutura da página pode estar incorreta.`);
             hasErrors = true; // Mark error to prevent further processing for this update
             continue; // Skip to the next tableKey update
        }

        // Check if the column letter was actually found in the header
        if (colIndex === -1) {
             console.error(`[Parser] ERRO ao aplicar para ${colLetter}${andar}: Coluna "${colLetter}" não encontrada no cabeçalho da tabela #estoque-table.`);
             alert(`Erro ao aplicar atualizações para ${colLetter}${andar}: Coluna "${colLetter}" não existe no cabeçalho da tabela.`);
             hasErrors = true;
             continue; // Skip to the next tableKey update
        }
        console.log(`[Parser] INFO: Índice da coluna ${colLetter} encontrado dinamicamente no cabeçalho: ${colIndex}`);

        // --- Encontrar a Célula (Coluna) usando o índice correto --- 
        const targetCell = row.cells[colIndex]; // Use the dynamically found index

        if (!targetCell) {
            // This error could happen if the data row 'tr' has fewer 'td' cells than the header row 'th' cells.
            console.error(`[Parser] ERRO ao aplicar para ${colLetter}${andar}: Célula no índice ${colIndex} não encontrada na linha do andar ${andar}. A linha parece ter menos colunas que o cabeçalho.`);
            alert(`Erro ao aplicar atualizações para ${colLetter}${andar}: Estrutura da linha inválida no andar ${andar}.`);
            hasErrors = true;
            continue;
        }
         console.log(`[Parser] SUCESSO: Célula ${colLetter}${andar} (índice ${colIndex}) encontrada.`);

        // --- Encontrar a Subtabela --- 
        let targetTable = updateData.targetTable; // Reutiliza se já encontrada
        if (!targetTable) {
            targetTable = targetCell.querySelector('.subtable');
            // Tenta buscar por ID se não achar pela classe na célula
            if (!targetTable) {
                const expectedId = `subtable-${andar}-${colLetter}`;
                targetTable = document.querySelector(`#${expectedId}`);
                 if (targetTable) {
                     console.log(`[Parser] INFO: Subtabela ${expectedId} encontrada por ID fora da célula esperada.`);
                 }
            }
            // Tentativa específica A1
            if (!targetTable && colLetter === 'A' && andar === '1') {
                targetTable = document.querySelector('#subtable-1-A');
                 if (targetTable) {
                     console.log(`[Parser] INFO: Subtabela #subtable-1-A encontrada especificamente.`);
                 }
            }

            if (!targetTable) {
                console.error(`[Parser] ERRO ao aplicar: Subtabela não encontrada na célula ${colLetter}${andar}. Verifique a estrutura HTML.`);
                alert(`Erro ao aplicar atualizações: Subtabela não encontrada em ${colLetter}${andar}.`);
                hasErrors = true;
                continue;
            }
            updateData.targetTable = targetTable; // Armazena para referência futura (se necessário)
        }
        console.log(`[Parser] SUCESSO: Subtabela encontrada (ID: ${targetTable.id || 'sem id'})`);

        // --- Carregar Produtos Existentes DA TABELA ATUAL (antes de limpar) --- 
        const productsCurrentlyInTable = {};
        for (let i = 1; i < targetTable.rows.length; i++) {
            const r = targetTable.rows[i];
            if (r.cells.length >= 3) {
                const qty = parseInt(r.cells[0].textContent) || 0;
                const code = r.cells[1].textContent.trim();
                const color = r.cells[2].textContent.trim();
                if (qty > 0 && code && color) {
                     const key = `${code}_${color}`;
                     productsCurrentlyInTable[key] = { qty: qty, code: code, color: color };
                     console.log(`[Parser] INFO: Produto existente na TABELA ${colLetter}${andar} carregado: ${qty}x ${code} (${color})`);
                }
            }
        }

        // --- Mesclar Produtos Existentes com Novos --- 
        const finalProducts = { ...productsCurrentlyInTable }; // Começa com o que já estava lá
        for (const key in updateData.existingProducts) {
            const newProduct = updateData.existingProducts[key];
            if (finalProducts[key]) {
                finalProducts[key].qty += newProduct.qty; // Soma quantidades se já existe
                console.log(`[Parser] INFO: Mesclado ${key}: Quantidade final ${finalProducts[key].qty}`);
            } else {
                finalProducts[key] = { ...newProduct }; // Adiciona novo produto
                 console.log(`[Parser] INFO: Adicionado ${key}: Quantidade ${finalProducts[key].qty}`);
            }
        }

        // --- Limpar e Reescrever a Subtabela --- 
        console.log(`[Parser] INFO: Limpando e reescrevendo a subtabela ${colLetter}${andar}...`);
        // Limpar subtabela (exceto cabeçalho)
        while (targetTable.rows.length > 1) {
            targetTable.deleteRow(1);
        }

        // Adicionar produtos finais à subtabela
        let produtosAdicionadosNestaTabela = 0;
        for (const key in finalProducts) {
            if (finalProducts[key].qty <= 0) continue; // Não adiciona se quantidade for 0 ou menos

            const newRow = targetTable.insertRow();
            const product = finalProducts[key];

            const qtdCell = newRow.insertCell();
            qtdCell.textContent = product.qty;
            qtdCell.setAttribute('contenteditable', 'true');

            const codCell = newRow.insertCell();
            codCell.textContent = product.code;
            codCell.setAttribute('contenteditable', 'true');

            const corCell = newRow.insertCell();
            corCell.textContent = product.color;
            corCell.setAttribute('contenteditable', 'true');
            
            produtosAdicionadosNestaTabela++;
        }
        totalProdutosAtualizados += produtosAdicionadosNestaTabela;
        console.log(`[Parser] SUCESSO: ${produtosAdicionadosNestaTabela} produtos atualizados na subtabela ${colLetter}${andar}`);

    } // Fim do loop de aplicação por tabela

    // --- Finalização e Limpeza --- 
    if (!hasErrors) {
        console.log("=====================================================");
        console.log("[Parser] PROCESSAMENTO GERAL CONCLUÍDO COM SUCESSO");
        console.log("=====================================================");
        
        // Limpar o conteúdo do input-preview
        const previewContainer = document.querySelector('.input-preview-container');
        if (previewContainer) {
            previewContainer.innerHTML = ''; // Limpa o conteúdo
            console.log("[Parser] INFO: Limpando o conteúdo do container de preview.");
        } else {
            console.warn("[Parser] ALERTA: Container de preview (.input-preview-container) não encontrado para limpar.");
        }

        // Adicionar ao histórico de comandos
        try {
            if (typeof saveCommandToHistory === 'function') {
                saveCommandToHistory(fullInputText); // Salva o comando completo original
                console.log("[Parser] INFO: Comando completo salvo no histórico via função saveCommandToHistory");
            } else {
                // Fallback para localStorage
                const historico = JSON.parse(localStorage.getItem('commandHistory') || '[]')
                historico.unshift(fullInputText)
                while (historico.length > 50) { historico.pop() }
                localStorage.setItem('commandHistory', JSON.stringify(historico))
                console.log('[Parser] INFO: Comando salvo no histórico via localStorage (fallback)')
            }
        } catch (e) {
          console.error("[Parser] ERRO ao salvar no histórico:", e);
        }
        
        // Limpar input após processamento SÓ SE NÃO HOUVE ERROS
        input.value = '';
        
        // Disparar evento para auto-save, se necessário
        if (typeof triggerAutoSave === 'function') {
            triggerAutoSave('Input Parser Update');
        } else if (window.dispatchEvent) {
            // Fallback genérico
            window.dispatchEvent(new CustomEvent('tableDataChanged'));
        }
        
    } else {
        console.error("[Parser] Processamento geral concluído com ERROS. Algumas atualizações podem não ter sido aplicadas. Verifique os logs acima.");
        alert("Processamento concluído com erros. Verifique o console (F12) para mais detalhes.");
    }

    console.log("=====================================================");
    console.log("[Parser] FIM DO PROCESSAMENTO GERAL");
    console.log("=====================================================");

  };
}); 