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
    
    const parts = text.split(/\s+/);
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
        
        // Criar uma chave única combinando código e cor
        const key = `${part}-${color}`;
        
        // Incrementar quantidade ou criar novo
        if (!products[key]) {
          products[key] = { 
            code: part,
            qty: 1, 
            color: color 
          };
        } else {
          products[key].qty++;
        }
      }
    }
    
    // Ordenar produtos por código e cor
    const sortedProducts = Object.values(products).sort((a, b) => {
      if (a.code !== b.code) {
        return a.code.localeCompare(b.code);
      }
      return a.color.localeCompare(b.color);
    });

    // Gerar tabela
    targetTable.innerHTML = '';
    const table = document.createElement('table');
    
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Código', 'Quantidade', 'Cor', 'Ações'].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    const tbody = document.createElement('tbody');
    sortedProducts.forEach(product => {
      const tr = document.createElement('tr');
      
      const codCell = document.createElement('td');
      codCell.textContent = product.code;
      codCell.setAttribute('contenteditable', true);
      
      const qtyCell = document.createElement('td');
      qtyCell.textContent = product.qty;
      qtyCell.setAttribute('contenteditable', true);
      
      const colorCell = document.createElement('td');
      colorCell.textContent = product.color;
      colorCell.setAttribute('contenteditable', true);
      
      const actionsCell = document.createElement('td');
      
      tr.appendChild(codCell);
      tr.appendChild(qtyCell);
      tr.appendChild(colorCell);
      tr.appendChild(actionsCell);
      tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    targetTable.appendChild(table);
    
    // Limpar input após processamento
    input.value = '';
  };
}); 