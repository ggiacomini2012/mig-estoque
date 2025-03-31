document.addEventListener('DOMContentLoaded', function() {
  // Criar elementos de UI
  const container = document.createElement('div');
  const input = document.createElement('input');
  const button = document.createElement('button');
  
  // Configurar elementos
  input.type = 'text';
  input.placeholder = 'A10 203 preta 204 206 208 branco 204';
  input.style.width = '400px';
  button.textContent = 'Aplicar';
  
  // Adicionar ao DOM
  container.appendChild(input);
  container.appendChild(button);
  document.body.insertBefore(container, document.body.firstChild);
  
  // Adicionar handler de evento
  button.onclick = function() {
    const text = input.value.trim();
    if (!text) return;
    
    const parts = text.split(' ');
    if (parts.length < 2) return;
    
    // Extrair localização (ex: A10)
    const location = parts[0];
    const colLetter = location.charAt(0).toUpperCase();
    const andar = location.substring(1);
    
    // Encontrar tabela correta
    const row = Array.from(document.querySelectorAll('tbody tr')).find(r => 
      r.cells[0].textContent.trim() === andar);
    if (!row) return;
    
    const colIndex = colLetter.charCodeAt(0) - 64 + 1; // A=2, B=3, etc.
    const targetCell = row.cells[colIndex];
    if (!targetCell) return;
    
    const targetTable = targetCell.querySelector('.subtable');
    if (!targetTable) return;
    
    // Verificar se já existem produtos na tabela e adicioná-los ao objeto de produtos
    const existingProducts = {};
    
    // Pular a primeira linha (cabeçalho)
    for (let i = 1; i < targetTable.rows.length; i++) {
      const row = targetTable.rows[i];
      if (row.cells.length >= 3) {
        const qty = parseInt(row.cells[0].textContent) || 0;
        const code = row.cells[1].textContent;
        const color = row.cells[2].textContent;
        const key = `${code}_${color}`;
        
        existingProducts[key] = {
          qty: qty,
          code: code,
          color: color
        };
      }
    }
    
    // Agrupar códigos e suas quantidades
    let currentColor = '-';
    
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      
      // Se for número, é um código de produto
      if (/^\d+$/.test(part)) {
        const code = part;
        const key = `${code}_${currentColor}`;
        
        // Se o código+cor não existir, criar novo
        if (!existingProducts[key]) {
          existingProducts[key] = { qty: 1, code: code, color: currentColor };
        } else {
          // Se já existir, apenas incrementar quantidade
          existingProducts[key].qty++;
        }
      } else {
        // Se não for número, é uma cor
        currentColor = part;
      }
    }
    
    // Limpar a tabela existente (exceto o cabeçalho)
    while (targetTable.rows.length > 1) {
      targetTable.deleteRow(1);
    }
    
    // Adicionar produtos à tabela
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
    }
    
    // Limpar input após processamento
    input.value = '';
  };
}); 