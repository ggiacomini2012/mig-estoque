document.addEventListener('DOMContentLoaded', function() {
  // A tabela já tem ID definido no HTML
  // const mainTable = document.querySelector('table');
  // mainTable.id = 'estoque-table';
  
  // Pré-dimensionar a tabela para evitar layout shifts
  const mainTable = document.getElementById('estoque-table');
  if (mainTable) {
    // Garantir que as dimensões da tabela sejam calculadas antecipadamente
    mainTable.style.tableLayout = 'fixed';
    mainTable.style.width = '100%';
  }
  
  // Add IDs to all andar rows
  const andarRows = mainTable.querySelectorAll('tbody > tr');
  andarRows.forEach((row, index) => {
    const andar = row.cells[0].textContent.trim();
    const tamanho = row.cells[1].textContent.trim();
    row.id = `andar-${andar}-${tamanho}`;
    
    // Add IDs to all subtables
    const subtables = row.querySelectorAll('.subtable');
    subtables.forEach((subtable, colIndex) => {
      const colLetter = String.fromCharCode(65 + colIndex); // A, B, C, D
      subtable.id = `subtable-${andar}-${colLetter}`;
      
      // Garantir que as dimensões das subtabelas sejam fixas
      subtable.style.tableLayout = 'fixed';
      subtable.style.width = '100%';
      
      // Add IDs to all slots in subtables
      // const slots = subtable.querySelectorAll('tr');
      // slots.forEach(slot => {
      //   const slotCells = slot.querySelectorAll('td');
      //   const slotNumber = slotCells[0].textContent.trim();
      //   const slotId = slotCells[1].textContent.trim();
      //   const slotSize = slotCells[2].textContent.trim();
        
      //   slot.id = `slot-${slotId}`;
      //   slotCells[0].id = `slot-${slotId}-number`;
      //   slotCells[1].id = `slot-${slotId}-code`;
      //   slotCells[2].id = `slot-${slotId}-size`;
      // });
    });
  });
  
  console.log('All IDs have been added to the table elements');
}); 