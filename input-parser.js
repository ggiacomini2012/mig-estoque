document.addEventListener('DOMContentLoaded', function() {
  // Criar elementos de UI
  const container = document.createElement('div');
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
    const text = input.value.trim();
    console.log("-----------------------------------------------------");
    console.log("[Parser] Iniciando processamento da entrada:", text);
    console.log("-----------------------------------------------------");
    
    if (!text) {
      console.error("[Parser] ERRO: Texto de entrada vazio. Por favor, digite um comando válido.");
      alert("Por favor, digite um comando válido. Exemplo: A1 preto 203");
      return;
    }
    
    const parts = text.split(' ');
    if (parts.length < 2) {
      console.error("[Parser] ERRO: Formato inválido. O comando deve conter pelo menos localização e cor/código. Exemplo: A1 preto 203");
      alert("Formato inválido. O comando deve conter pelo menos localização e cor/código. Exemplo: A1 preto 203");
      return;
    }
    
    // Extrair localização (ex: A10)
    const location = parts[0];
    const colLetter = location.charAt(0).toUpperCase();
    const andar = location.substring(1);
    
    console.log(`[Parser] ETAPA 1/4: Localização identificada: coluna ${colLetter}, andar ${andar}`);
    
    // Estrutura de logging dos passos de localização
    console.log("[Parser] ETAPA 2/4: Iniciando busca pela linha (andar) na tabela principal...");
    
    // Log de todas as linhas disponíveis
    const allRows = document.querySelectorAll('tbody tr');
    console.log(`[Parser] INFO: Tabela principal tem ${allRows.length} linhas.`);
    
    const andaresDisponiveis = Array.from(allRows).map(r => {
      if (r.cells.length > 0) return r.cells[0].textContent.trim();
      return "célula vazia";
    }).join(', ');
    console.log(`[Parser] INFO: Andares disponíveis: [${andaresDisponiveis}]`);
    
    // Encontrar tabela correta - primeiro a linha (andar)
    console.log("[Parser] DEBUG: Estrutura completa da tabela:");
    console.log("[Parser] DEBUG: Número total de linhas na tabela:", allRows.length);
    
    // Mostrar a estrutura de todas as linhas para depuração
    Array.from(allRows).forEach((r, index) => {
      if (r.cells.length > 0) {
        const primeiraColuna = r.cells[0].textContent.trim();
        const subtablesNessaLinha = Array.from(r.querySelectorAll('.subtable')).map(st => st.id || 'sem-id');
        console.log(`[Parser] DEBUG: Linha ${index}: Primeira coluna="${primeiraColuna}", Subtabelas=${JSON.stringify(subtablesNessaLinha)}`);
      }
    });
    
    const row = Array.from(allRows).find(r => {
      if (r.cells.length === 0) {
        console.log(`[Parser] INFO: Linha ignorada - sem células`);
        return false;
      }
      const rowAndar = r.cells[0].textContent.trim();
      console.log(`[Parser] INFO: Comparando andar '${andar}' com linha que contém '${rowAndar}'`);
      return rowAndar === andar;
    });
    
    if (!row) {
      console.error(`[Parser] ERRO: Andar ${andar} não encontrado na tabela. Verifique se o número é correto.`);
      console.log(`[Parser] SOLUÇÃO: Use um dos andares disponíveis: [${andaresDisponiveis}]`);
      alert(`Andar ${andar} não encontrado na tabela. Andares disponíveis: ${andaresDisponiveis}`);
      return;
    }
    
    console.log(`[Parser] SUCESSO: Andar ${andar} encontrado na tabela.`);
    console.log(`[Parser] ETAPA 3/4: Buscando coluna ${colLetter} na linha do andar ${andar}...`);
    
    // Agora buscar a coluna correta
    const colIndex = colLetter.charCodeAt(0) - 64 + 1; // A=2, B=3, etc.
    console.log(`[Parser] INFO: Letra ${colLetter} convertida para índice ${colIndex} (offset +1 para andar/tamanho)`);
    console.log(`[Parser] INFO: Linha encontrada tem ${row.cells.length} células disponíveis.`);
    
    // Debug específico para o caso a1 vs a2
    if (colLetter === 'A' && (andar === '1' || andar === '2')) {
      console.log("[Parser] DEBUG: Caso específico A1/A2 detectado, analisando em detalhe...");
      
      // Listar todas as células desta linha com índices
      for (let i = 0; i < row.cells.length; i++) {
        const cell = row.cells[i];
        const temSubtabela = cell.querySelector('.subtable') !== null;
        const idSubtabela = cell.querySelector('.subtable')?.id || 'nenhuma';
        console.log(`[Parser] DEBUG: Célula[${i}]: Tem subtabela=${temSubtabela}, ID=${idSubtabela}, HTML=${cell.innerHTML.substring(0, 50)}...`);
      }
      
      // Tentar localizar explicitamente as subtabelas para A1 e A2
      const todosSubtables = document.querySelectorAll('.subtable');
      console.log(`[Parser] DEBUG: Total de subtabelas na página: ${todosSubtables.length}`);
      
      const subtableA1 = document.querySelector('#subtable-1-A');
      const subtableA2 = document.querySelector('#subtable-2-A');
      
      console.log(`[Parser] DEBUG: #subtable-1-A encontrado: ${subtableA1 !== null}`);
      console.log(`[Parser] DEBUG: #subtable-2-A encontrado: ${subtableA2 !== null}`);
      
      if (subtableA1) {
        const trA1 = subtableA1.closest('tr');
        const tdA1 = subtableA1.closest('td');
        console.log(`[Parser] DEBUG: #subtable-1-A está em uma TR: ${trA1 !== null}`);
        console.log(`[Parser] DEBUG: #subtable-1-A está em uma TD: ${tdA1 !== null}`);
        if (trA1) {
          console.log(`[Parser] DEBUG: TR de #subtable-1-A tem primeira célula com texto: ${trA1.cells[0]?.textContent || 'sem texto'}`);
        }
      }
    }
    
    // Listar colunas disponíveis
    const colunasDisponiveis = [];
    for (let i = 2; i < row.cells.length; i++) {
      const letraColuna = String.fromCharCode(64 + (i - 1));
      colunasDisponiveis.push(letraColuna);
    }
    console.log(`[Parser] INFO: Colunas disponíveis: [${colunasDisponiveis.join(', ')}]`);
    
    const targetCell = row.cells[colIndex];
    if (!targetCell) {
      console.error(`[Parser] ERRO: Coluna ${colLetter} não encontrada. Índice calculado: ${colIndex}, Total de colunas: ${row.cells.length}`);
      console.log(`[Parser] DETALHE: As colunas A, B, C... começam no índice 2 (após andar e tamanho).`);
      console.log(`[Parser] SOLUÇÃO: Use uma das colunas disponíveis: [${colunasDisponiveis.join(', ')}]`);
      alert(`Coluna ${colLetter} não encontrada na tabela. Colunas disponíveis: ${colunasDisponiveis.join(', ')}`);
      return;
    }
    
    console.log(`[Parser] SUCESSO: Coluna ${colLetter} encontrada na linha do andar ${andar}.`);
    console.log(`[Parser] ETAPA 4/4: Buscando subtabela na célula ${colLetter}${andar}...`);
    
    // Agora buscar a subtabela
    console.log(`[Parser] INFO: Conteúdo HTML da célula: ${targetCell.innerHTML.length} caracteres`);
    console.log(`[Parser] INFO: Procurando elementos '.subtable' dentro da célula...`);
    
    // Tenta buscar a subtabela pelo seletor normal
    let targetTable = targetCell.querySelector('.subtable');
    
    // Se não encontrar, tenta uma abordagem alternativa baseada no ID esperado
    if (!targetTable) {
      console.log(`[Parser] INFO: Tentando abordagem alternativa para encontrar a subtabela...`);
      
      // Tenta encontrar por ID específico (subtable-[ANDAR]-[COLUNA])
      const expectedId = `subtable-${andar}-${colLetter}`;
      console.log(`[Parser] INFO: Buscando subtabela pelo ID específico: ${expectedId}`);
      
      // Busca em toda a página, não apenas na célula atual
      targetTable = document.querySelector(`#${expectedId}`);
      
      if (targetTable) {
        console.log(`[Parser] SUCESSO: Subtabela encontrada pelo ID específico: ${expectedId}`);
        
        // Verificar se a tabela está realmente na célula esperada
        const parentTd = targetTable.closest('td');
        if (parentTd !== targetCell) {
          console.warn(`[Parser] ALERTA: A subtabela encontrada não está na célula esperada ${colLetter}${andar}.`);
          console.log(`[Parser] INFO: Verificando se o posicionamento da subtabela é coerente com a estrutura esperada...`);
        }
      }
    }
    
    // Adicionar diagnóstico específico para o caso a1
    if (colLetter === 'A' && andar === '1' && !targetTable) {
      console.log("[Parser] SOLUÇÃO ESPECÍFICA: Tentando resolver o caso especial de A1...");
      
      // Tentativa específica para A1 - usar o seletor ID diretamente
      const a1SpecificTable = document.querySelector('#subtable-1-A');
      
      if (a1SpecificTable) {
        console.log("[Parser] INFO: Encontrada tabela com ID #subtable-1-A - verificando estrutura");
        
        // Verificar se tem a estrutura esperada
        const temCabecalho = a1SpecificTable.rows.length > 0;
        const temColunas = temCabecalho && a1SpecificTable.rows[0].cells.length >= 3;
        
        if (temCabecalho && temColunas) {
          console.log("[Parser] SUCESSO: Subtabela A1 encontrada por ID e tem estrutura válida. Usando esta tabela.");
          targetTable = a1SpecificTable;
        }
      } else {
        console.error("[Parser] ERRO: Não foi possível encontrar tabela com ID #subtable-1-A mesmo com busca específica.");
        console.log("[Parser] DIAGNÓSTICO AVANÇADO: Os IDs das subtabelas não seguem o padrão esperado ou há um erro na estrutura HTML.");
      }
    }
    
    if (!targetTable) {
      const cellHasTable = targetCell.querySelector('table') !== null;
      const cellHasAnyContent = targetCell.textContent.trim().length > 0;
      
      console.error(`[Parser] ERRO: Subtabela não encontrada na célula ${colLetter}${andar}.`);
      console.log(`[Parser] DETALHE: Célula ${cellHasAnyContent ? 'contém' : 'não contém'} algum texto.`);
      console.log(`[Parser] DETALHE: Célula ${cellHasTable ? 'contém' : 'não contém'} uma tabela, mas ${cellHasTable ? 'não tem' : 'falta'} a classe '.subtable'.`);
      console.log(`[Parser] DETALHE: Primeiros 100 caracteres da célula: ${targetCell.innerHTML.substring(0, 100)}...`);
      
      let solucao = "Verifique se a estrutura da tabela está correta e se existem subtabelas definidas.";
      if (!cellHasTable && !cellHasAnyContent) {
        solucao = "Esta célula está vazia. Adicione uma subtabela primeiro usando o editor de tabela.";
      } else if (!cellHasTable) {
        solucao = "Esta célula contém texto, mas não contém uma tabela. Limpe o conteúdo e adicione uma subtabela.";
      } else if (cellHasTable) {
        solucao = "Esta célula contém uma tabela, mas falta a classe 'subtable'. Verifique a estrutura HTML.";
      }
      
      console.log(`[Parser] SOLUÇÃO: ${solucao}`);
      alert(`Não foi possível encontrar uma subtabela na célula ${colLetter}${andar}. ${solucao}`);
      return;
    }
    
    console.log(`[Parser] SUCESSO: Subtabela encontrada na célula ${colLetter}${andar}. ID: ${targetTable.id || 'sem id'}`);
    console.log(`[Parser] INFO: A subtabela tem ${targetTable.rows.length} linhas.`);
    
    // Verificar se já existem produtos na tabela e adicioná-los ao objeto de produtos
    const existingProducts = {};
    
    // Pular a primeira linha (cabeçalho)
    for (let i = 1; i < targetTable.rows.length; i++) {
      const row = targetTable.rows[i];
      if (row.cells.length >= 3) {
        const qty = parseInt(row.cells[0].textContent) || 0;
        const code = row.cells[1].textContent.trim();
        const color = row.cells[2].textContent.trim();
        const key = `${code}_${color}`;
        
        existingProducts[key] = {
          qty: qty,
          code: code,
          color: color
        };
        console.log(`[Parser] INFO: Produto existente carregado: ${qty}x ${code} (${color})`);
      }
    }
    
    // Agrupar códigos e suas quantidades
    let currentColor = '-';
    let productCount = 0;
    
    console.log("[Parser] Iniciando processamento dos produtos no comando...");
    
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i].trim();
      if (!part) continue; // Ignorar partes vazias
      
      // Se for número de exatamente 3 dígitos, é um código de produto
      if (/^\d{3}$/.test(part)) {
        const code = part;
        const key = `${code}_${currentColor}`;
        
        console.log(`[Parser] INFO: Processando código: ${code}, cor atual: ${currentColor}`);
        
        // Se o código+cor não existir, criar novo
        if (!existingProducts[key]) {
          existingProducts[key] = { qty: 1, code: code, color: currentColor };
          console.log(`[Parser] INFO: Novo produto: ${code} (${currentColor})`);
        } else {
          // Se já existir, apenas incrementar quantidade
          existingProducts[key].qty++;
          console.log(`[Parser] INFO: Incrementado produto existente: ${existingProducts[key].qty}x ${code} (${currentColor})`);
        }
        productCount++;
      } else if (/^\d+$/.test(part)) {
        // Se for um número, mas não tiver 3 dígitos, avisar
        console.error(`[Parser] ERRO: Código "${part}" inválido. Os códigos devem ter exatamente 3 dígitos.`);
        console.log(`[Parser] SOLUÇÃO: Use zeros à esquerda para códigos com menos de 3 dígitos. Ex: "${part.padStart(3, '0')}"`);
        alert(`Código "${part}" inválido. Os códigos devem ter exatamente 3 dígitos. Use zeros à esquerda se necessário (ex: 001, 052).`);
        return;
      } else {
        // Se não for número, é uma cor
        currentColor = part.toLowerCase();
        console.log(`[Parser] INFO: Nova cor definida: ${currentColor}`);
      }
    }
    
    if (productCount === 0) {
      console.warn("[Parser] ALERTA: Nenhum código de produto válido encontrado no comando. Verifique se o formato está correto.");
      console.log("[Parser] SOLUÇÃO: O comando deve incluir pelo menos um código de 3 dígitos após a cor.");
      alert("Nenhum código de produto válido encontrado. Formato esperado: [Localização] [Cor] [Código de 3 dígitos] ...");
      return;
    }
    
    console.log("[Parser] Atualizando tabela com os produtos processados...");
    
    // Limpar a tabela existente (exceto o cabeçalho)
    while (targetTable.rows.length > 1) {
      targetTable.deleteRow(1);
    }
    
    // Adicionar produtos à tabela
    let produtosAdicionados = 0;
    for (const key in existingProducts) {
      // Adicionar nova linha
      const newRow = targetTable.insertRow();
      
      // Células: Qtd, COD, COR
      const qtdCell = newRow.insertCell();
      qtdCell.textContent = existingProducts[key].qty;
      qtdCell.setAttribute('contenteditable', 'true');
      
      const codCell = newRow.insertCell();
      codCell.textContent = existingProducts[key].code;
      codCell.setAttribute('contenteditable', 'true');
      
      const corCell = newRow.insertCell();
      corCell.textContent = existingProducts[key].color;
      corCell.setAttribute('contenteditable', 'true');
      
      produtosAdicionados++;
    }
    
    console.log(`[Parser] SUCESSO: Total de ${produtosAdicionados} produtos adicionados/atualizados na tabela ${colLetter}${andar}`);
    
    // Salvar comando no histórico se existir
    try {
      if (typeof saveCommandToHistory === 'function') {
        saveCommandToHistory(text);
        console.log("[Parser] INFO: Comando salvo no histórico via função saveCommandToHistory");
      } else {
        // Armazenar no localStorage diretamente
        const historicoDeComandos = JSON.parse(localStorage.getItem('commandHistory') || '[]');
        historicoDeComandos.unshift(text); // Adicionar ao início
        
        // Manter apenas os últimos 50 comandos
        while (historicoDeComandos.length > 50) {
          historicoDeComandos.pop();
        }
        
        localStorage.setItem('commandHistory', JSON.stringify(historicoDeComandos));
        console.log("[Parser] INFO: Comando salvo no histórico via localStorage");
      }
    } catch (e) {
      console.error("[Parser] ERRO ao salvar no histórico:", e);
    }
    
    console.log("-----------------------------------------------------");
    console.log("[Parser] Processamento concluído com sucesso!");
    console.log("-----------------------------------------------------");
    
    // Limpar input após processamento
    input.value = '';
  };
}); 