document.addEventListener('DOMContentLoaded', function() {
  // Function to get commands from localStorage
  function getCommandHistory() {
    const history = localStorage.getItem('commandHistory');
    return history ? JSON.parse(history) : [];
  }

  // Function to save command to localStorage
  function saveCommand(command) {
    if (!command || command.trim() === '') return;
    
    let history = getCommandHistory();
    
    // Add new command at the beginning
    history.unshift(command);
    
    // Keep only the last 50 commands
    if (history.length > 50) {
      history = history.slice(0, 50);
    }
    
    // Save back to localStorage
    localStorage.setItem('commandHistory', JSON.stringify(history));
    
    // Update the displayed history
    updateHistoryDisplay();
  }

  // Function to create and update history footer
  function updateHistoryDisplay() {
    // Remove existing footer if present
    const existingFooter = document.getElementById('command-history-footer');
    if (existingFooter) {
      existingFooter.remove();
    }
    
    // Get command history
    const history = getCommandHistory();
    
    // If no history, don't create footer
    if (history.length === 0) return;
    
    // Create footer container
    const footer = document.createElement('div');
    footer.id = 'command-history-footer';
    footer.style.borderTop = '1px solid #ccc';
    footer.style.marginTop = '20px';
    footer.style.padding = '10px';
    
    // Add title
    const title = document.createElement('h3');
    title.textContent = 'Histórico de Comandos';
    title.style.margin = '0 0 10px 0';
    footer.appendChild(title);
    
    // Create list for commands
    const list = document.createElement('ul');
    list.style.listStyle = 'none';
    list.style.padding = '0';
    list.style.margin = '0';
    
    // Add each command to the list
    history.forEach(cmd => {
      const item = document.createElement('li');
      item.style.margin = '5px 0';
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      
      // Command text
      const cmdText = document.createElement('span');
      cmdText.textContent = cmd;
      cmdText.style.marginRight = '10px';
      
      // Copy button
      const copyBtn = document.createElement('button');
      copyBtn.innerHTML = '&#128203;'; // clipboard icon
      copyBtn.title = 'Copiar comando';
      copyBtn.style.cursor = 'pointer';
      copyBtn.style.marginLeft = '5px';
      
      // Add click event to copy the command to input
      copyBtn.addEventListener('click', function() {
        const input = document.querySelector('input[type="text"]');
        if (input) {
          input.value = cmd;
          input.focus();
        }
      });
      
      // Add elements to item
      item.appendChild(cmdText);
      item.appendChild(copyBtn);
      list.appendChild(item);
    });
    
    // Add list to footer
    footer.appendChild(list);
    
    // Add footer to page
    document.body.appendChild(footer);
  }

  // Hook into the existing input button click event
  const existingButton = document.querySelector('button');
  if (existingButton) {
    const originalOnClick = existingButton.onclick;
    existingButton.onclick = function() {
      const input = document.querySelector('input[type="text"]');
      if (input && input.value.trim()) {
        // Save the command to history
        saveCommand(input.value.trim());
      }
      
      // Call the original onclick function
      if (originalOnClick) {
        originalOnClick.apply(this, arguments);
      }
    };
  }
  
  // Initialize by showing existing history
  updateHistoryDisplay();
}); 