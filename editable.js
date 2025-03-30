document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('td').forEach(cell => {
    if (!cell.querySelector('table')) {
      cell.setAttribute('contenteditable', 'true');
      cell.style.cursor = 'pointer';
      
      cell.addEventListener('focus', () => cell.style.backgroundColor = '#ffffd0');
      cell.addEventListener('blur', function() {
        this.style.backgroundColor = '';
        localStorage.setItem(this.id || `cell-${Math.random()}`, this.textContent);
      });
    }
  });
}); 