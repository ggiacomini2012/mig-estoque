document.addEventListener('DOMContentLoaded', function() {
  // Add controls to each subtable
  document.querySelectorAll('.subtable').forEach(table => {
    // Create control container
    const controls = document.createElement('div');
    
    // Add button
    const addBtn = document.createElement('button');
    addBtn.textContent = '+';
    addBtn.onclick = () => {
      // Get parent cell info to generate proper code
      const parentCell = table.closest('td');
      const andarRow = parentCell.parentElement;
      const andar = andarRow.cells[0].textContent.trim();
      const parentIndex = Array.from(andarRow.cells).indexOf(parentCell);
      const colLetter = String.fromCharCode(64 + (parentIndex - 1)); // A=1, B=2, etc. (offset by 2 for andar and tamanho cols)
      
      // Generate next row code
      const nextNum = table.rows.length;
      const code = `${andar}${colLetter}${nextNum.toString().padStart(2, '0')}`;
      
      // Create new row
      const newRow = table.insertRow();
      
      // Add cells: Qtd, COD, COR
      const qtdCell = newRow.insertCell();
      qtdCell.textContent = '1';
      qtdCell.setAttribute('contenteditable', 'true');
      
      const codCell = newRow.insertCell();
      codCell.textContent = code;
      codCell.setAttribute('contenteditable', 'true');
      
      const corCell = newRow.insertCell();
      corCell.textContent = '-';
      corCell.setAttribute('contenteditable', 'true');
    };
    
    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = '-';
    removeBtn.onclick = () => {
      if (table.rows.length > 1) {
        table.deleteRow(table.rows.length - 1);
      }
    };
    
    // Add buttons to controls
    controls.appendChild(addBtn);
    controls.appendChild(removeBtn);
    
    // Add controls before table
    table.parentNode.insertBefore(controls, table);
  });
}); 