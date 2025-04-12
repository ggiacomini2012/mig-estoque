document.addEventListener('DOMContentLoaded', function() {
  renderEstoqueTable();
});

function renderEstoqueTable() {
  // Data structure defining the table layout
  const tableData = [
    { andar: '10', tamanho: 'GG', colunas: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] },
    { andar: '9', tamanho: 'GG', colunas: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] },
    
    { andar: '8', tamanho: 'G', colunas: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] },
    { andar: '7', tamanho: 'G', colunas: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] },
    { andar: '6', tamanho: 'G', colunas: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] },
    
    { andar: '5', tamanho: 'M', colunas: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] },
    { andar: '4', tamanho: 'M', colunas: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] },
    { andar: '3', tamanho: 'M', colunas: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] },
    
    { andar: '2', tamanho: 'P', colunas: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'], especial: { coluna: 'D', label: 'XGG/EXG' } },
    { andar: '1', tamanho: 'P', colunas: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'], especial: { coluna: 'D', label: 'XGG/EXG' } },
    { andar: '0', tamanho: 'CAIXAS', colunas: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27'] }
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
  
  const headers = ['ANDAR', 'TAMANHO', 'A', 'B', 'C', 'D', 'FEMININO', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  
  headers.forEach(header => {
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
    
    // Iterate through defined headers to ensure consistent column structure
    headers.forEach(header => {
      const td = document.createElement('td');

      if (header === 'ANDAR') {
        td.textContent = row.andar;
      } else if (header === 'TAMANHO') {
        td.textContent = row.tamanho;
      } else if (header === 'FEMININO') {
        // FEMININO column shows the same as TAMANHO, except for 0
        if (row.andar !== '0') {
            td.textContent = row.tamanho;
        } else {
            td.textContent = ''; // Empty for 0 row
        }
      } else {
        // Handle A-Z columns and 0 numeric columns
        if (row.andar !== '0') {
          // For floors 1-10, check if the column exists in row.colunas (A-Z)
          if (row.colunas.includes(header)) {
            // Create subtable for letter columns
            const subtable = document.createElement('table');
            subtable.id = `subtable-${row.andar}-${header}`;
            subtable.className = 'subtable';
            subtable.setAttribute('border', '1');

            const subtableRow = document.createElement('tr');
            const subHeaders = ['Qtd.', 'COD.', 'COR'];

            if (row.especial && row.especial.coluna === header) {
              subHeaders.push(row.especial.label);
            }

            subHeaders.forEach((subHeader, index) => {
              const subtableTh = document.createElement('td');
              subtableTh.textContent = subHeader;
              subtableTh.classList.add('sortable-header');
              subtableTh.dataset.colIndex = index;
              subtableTh.dataset.sortType = (subHeader === 'Qtd.') ? 'numeric' : 'text';
              subtableTh.style.cursor = 'pointer';
              subtableRow.appendChild(subtableTh);
            });

            subtable.appendChild(subtableRow);
            td.appendChild(subtable);
          } else {
            // If column doesn't exist for this row (shouldn't happen with current data)
            td.textContent = '';
          }
        } else {
          // For 0 row, map letter headers (A-Z) to numeric columns (1-26)
          if (header >= 'A' && header <= 'Z') {
            const zeroColNum = (header.charCodeAt(0) - 'A'.charCodeAt(0) + 1).toString();
            if (row.colunas.includes(zeroColNum)) {
              // Create subtable for this 0 numeric column
              const subtable = document.createElement('table');
              subtable.id = `subtable-${row.andar}-${zeroColNum}`; // Use 0 number in ID
              subtable.className = 'subtable';
              subtable.setAttribute('border', '1');

              const subtableRow = document.createElement('tr');
              const subHeaders = ['Qtd.', 'COD.', 'COR']; // 0 uses standard subheaders

              subHeaders.forEach((subHeader, index) => {
                const subtableTh = document.createElement('td');
                subtableTh.textContent = subHeader;
                subtableTh.classList.add('sortable-header');
                subtableTh.dataset.colIndex = index;
                subtableTh.dataset.sortType = (subHeader === 'Qtd.') ? 'numeric' : 'text';
                subtableTh.style.cursor = 'pointer';
                subtableRow.appendChild(subtableTh);
              });

              subtable.appendChild(subtableRow);
              td.appendChild(subtable);
            } else {
              // Corresponding 0 column number doesn't exist in row.colunas
              td.textContent = '';
            }
          } else {
            // Handles headers like ANDAR, TAMANHO, FEMININO which are processed earlier
            // or any unexpected headers. Ensure non-mapped cells are empty.
             if (header !== 'ANDAR' && header !== 'TAMANHO' && header !== 'FEMININO') {
               td.textContent = '';
             }
          }
        }
      }
      tr.appendChild(td);
    });
    
    tbody.appendChild(tr);
  });
  
  table.appendChild(tbody);
  container.appendChild(table);
  
  // Dispatch event to notify other scripts that the table has been rendered
  document.dispatchEvent(new Event('tableRendered'));
} 