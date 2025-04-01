document.addEventListener('DOMContentLoaded', function() {
  const allTds = document.querySelectorAll('td');
  allTds.forEach(td => {
    if (td.querySelector('table')) {
      td.classList.add('each-macro-cell');
    }
  });
}); 