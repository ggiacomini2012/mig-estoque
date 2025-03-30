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
    
    // Agrupar códigos e suas quantidades
    const products = {};
    
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      
      // Se for número, é um código de produto
      if (/^\d+$/.test(part)) {
        // Verificar se o próximo item é uma cor
        const hasColor = i + 1 < parts.length && !/^\d+$/.test(parts[i + 1]);
        const color = hasColor ? parts[i + 1] : '-';
        
        // Incrementar quantidade ou criar novo
        if (!products[part]) {
          products[part] = { qty: 1, color: color };
        } else {
          products[part].qty++;
          // Manter a cor se já existir uma que não seja '-'
          if (color !== '-' && products[part].color === '-') {
            products[part].color = color;
          }
        }
      }
    }
    
    // Adicionar produtos à tabela
    for (const code in products) {
      // Adicionar nova linha
      const newRow = targetTable.insertRow();
      
      // Células: Qtd, COD, COR
      const qtdCell = newRow.insertCell();
      qtdCell.textContent = products[code].qty;
      qtdCell.setAttribute('contenteditable', 'true');
      
      const codCell = newRow.insertCell();
      codCell.textContent = code;
      codCell.setAttribute('contenteditable', 'true');
      
      const corCell = newRow.insertCell();
      corCell.textContent = products[code].color;
      corCell.setAttribute('contenteditable', 'true');
    }
    
    // Limpar input após processamento
    input.value = '';
  };
}); 