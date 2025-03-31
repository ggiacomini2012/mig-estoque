document.addEventListener('DOMContentLoaded', function() {
  // Buscar o input criado pelo input-parser.js
  setTimeout(() => {
    const input = document.querySelector('input[placeholder*="A10"]');
    if (!input) return;
    
    // Criar elemento de prévia
    const previewContainer = document.createElement('div');
    previewContainer.style.margin = '10px 0';
    previewContainer.style.fontFamily = 'monospace';
    document.body.insertBefore(previewContainer, input.parentNode.nextSibling);
    
    // Adicionar evento de entrada no input
    input.addEventListener('input', function() {
      // Limpar prévia anterior
      previewContainer.innerHTML = '';
      
      const text = input.value.trim();
      if (!text) return;
      
      const parts = text.split(' ');
      if (parts.length < 2) return;
      
      // Exibir o local
      const location = parts[0];
      const locationText = document.createElement('div');
      locationText.textContent = `Local: ${location}`;
      previewContainer.appendChild(locationText);
      
      // Processar produtos no input
      const products = {};
      let currentColor = '-';
      
      for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        
        // Se for número, é um código de produto
        if (/^\d+$/.test(part)) {
          const code = part;
          const key = `${code}_${currentColor}`;
          
          // Se o código+cor não existir, criar novo
          if (!products[key]) {
            products[key] = { qty: 1, code: code, color: currentColor };
          } else {
            // Se já existir, apenas incrementar quantidade
            products[key].qty++;
          }
        } else {
          // Se não for número, é uma cor
          currentColor = part;
        }
      }
      
      // Exibir produtos na prévia
      const previewTable = document.createElement('table');
      previewTable.innerHTML = '<tr><th>Qtd</th><th>Código</th><th>Cor</th></tr>';
      
      for (const key in products) {
        const product = products[key];
        const row = document.createElement('tr');
        
        const qtyCell = document.createElement('td');
        qtyCell.textContent = product.qty;
        row.appendChild(qtyCell);
        
        const codeCell = document.createElement('td');
        codeCell.textContent = product.code;
        row.appendChild(codeCell);
        
        const colorCell = document.createElement('td');
        colorCell.textContent = product.color;
        row.appendChild(colorCell);
        
        previewTable.appendChild(row);
      }
      
      previewContainer.appendChild(previewTable);
    });
  }, 100); // Pequeno delay para garantir que o input-parser.js já criou o input
}); 