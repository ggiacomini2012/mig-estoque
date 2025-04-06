document.addEventListener('DOMContentLoaded', function() {
  renderEstoqueTable();
});

function renderEstoqueTable() {
  // Data structure defining the table layout
  const tableData = [
    { andar: '10', tamanho: 'GG', colunas: ['A', 'B', 'C', 'D'] },
    { andar: '9', tamanho: 'GG', colunas: ['A', 'B', 'C', 'D'] },
    
    { andar: '8', tamanho: 'G', colunas: ['A', 'B', 'C', 'D'] },
    { andar: '7', tamanho: 'G', colunas: ['A', 'B', 'C', 'D'] },
    { andar: '6', tamanho: 'G', colunas: ['A', 'B', 'C', 'D'] },
    
    { andar: '5', tamanho: 'M', colunas: ['A', 'B', 'C', 'D'] },
    { andar: '4', tamanho: 'M', colunas: ['A', 'B', 'C', 'D'] },
    { andar: '3', tamanho: 'M', colunas: ['A', 'B', 'C', 'D'] },
    
    { andar: '2', tamanho: 'P', colunas: ['A', 'B', 'C', 'D'], especial: { coluna: 'D', label: 'XGG/EXG' } },
    { andar: '1', tamanho: 'P', colunas: ['A', 'B', 'C', 'D'], especial: { coluna: 'D', label: 'XGG/EXG' } }
  ];

  // Get container
  const container = document.getElementById('table-container');
  
  // Create table element
  const table = document.createElement('table');
  table.id = 'estoque-table';
  table.setAttribute('border', '1');
  
  // Create table header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  
  ['ANDAR', 'TAMANHO', 'A', 'B', 'C', 'D'].forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // Create table body
  const tbody = document.createElement('tbody');
  
  tableData.forEach(row => {
    const tr = document.createElement('tr');
    tr.id = `andar-${row.andar}-${row.tamanho}`;
    
    // Andar cell
    const andarCell = document.createElement('td');
    andarCell.textContent = row.andar;
    tr.appendChild(andarCell);
    
    // Tamanho cell
    const tamanhoCell = document.createElement('td');
    tamanhoCell.textContent = row.tamanho;
    tr.appendChild(tamanhoCell);
    
    // Column cells with subtables
    row.colunas.forEach(coluna => {
      const colCell = document.createElement('td');
      const colIndex = coluna.charCodeAt(0) - 65; // Convert A->0, B->1, etc.
      
      // Create subtable
      const subtable = document.createElement('table');
      subtable.id = `subtable-${row.andar}-${coluna}`;
      subtable.className = 'subtable';
      subtable.setAttribute('border', '1');
      
      // Create subtable header row
      const subtableRow = document.createElement('tr');
      
      const headers = ['Qtd.', 'COD.', 'COR'];
      
      // Add special column for XGG/EXG if needed
      if (row.especial && row.especial.coluna === coluna) {
        headers.push(row.especial.label);
      }
      
      headers.forEach(header => {
        const subtableTh = document.createElement('td');
        subtableTh.textContent = header;
        subtableRow.appendChild(subtableTh);
      });
      
      subtable.appendChild(subtableRow);
      colCell.appendChild(subtable);
      tr.appendChild(colCell);
    });
    
    tbody.appendChild(tr);
  });
  
  table.appendChild(tbody);
  container.appendChild(table);
  
  // Dispatch event to notify other scripts that the table has been rendered
  document.dispatchEvent(new Event('tableRendered'));
} 