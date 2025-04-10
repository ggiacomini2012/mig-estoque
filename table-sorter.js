document.addEventListener('tableRendered', () => {
    const tableContainer = document.getElementById('table-container');

    if (!tableContainer) {
        console.error("Table container not found!");
        return;
    }

    // Use event delegation on the container
    tableContainer.addEventListener('click', (event) => {
        const header = event.target.closest('.sortable-header');

        if (!header) {
            return; // Click wasn't on a sortable header
        }

        const subtable = header.closest('table.subtable');
        if (!subtable) {
            console.error("Subtable not found for the clicked header.");
            return;
        }

        const colIndex = parseInt(header.dataset.colIndex, 10);
        const sortType = header.dataset.sortType; // 'numeric' or 'text'

        // Get all data rows (skip the header row, which is the first child)
        const rows = Array.from(subtable.querySelectorAll('tr:not(:first-child)'));

        // Sort the rows
        rows.sort((rowA, rowB) => {
            const cellA = rowA.cells[colIndex]?.textContent || '';
            const cellB = rowB.cells[colIndex]?.textContent || '';

            if (sortType === 'numeric') {
                const numA = parseFloat(cellA) || 0; // Default to 0 if not a number
                const numB = parseFloat(cellB) || 0;
                return numA - numB;
            } else {
                // Basic text comparison
                return cellA.localeCompare(cellB);
            }
        });

        // Re-append sorted rows (this automatically removes them from their old positions)
        rows.forEach(row => subtable.appendChild(row));

        console.log(`Sorted subtable ${subtable.id} by column ${colIndex} (${sortType})`);
    });
}); 