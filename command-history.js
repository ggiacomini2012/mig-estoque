document.addEventListener('DOMContentLoaded', function() {

  const MAX_HISTORY_ITEMS = 50;
  const INPUT_SELECTOR = '#input-parser-container input[type="text"]';
  const NAV_BAR_SELECTOR = '#main-controls-wrapper';

  // Function to get commands from localStorage
  function getCommandHistory() {
    const history = localStorage.getItem('commandHistory');
    return history ? JSON.parse(history) : [];
  }

  // Function to save command to localStorage
  window.saveCommandToHistory = function(command) {
    if (!command || command.trim() === '') return;
    
    let history = getCommandHistory();
    
    // Remove existing instance of the same command to avoid duplicates near the top
    history = history.filter(item => item !== command);

    // Add new command at the beginning
    history.unshift(command);
    
    // Keep only the last MAX_HISTORY_ITEMS commands
    if (history.length > MAX_HISTORY_ITEMS) {
      history = history.slice(0, MAX_HISTORY_ITEMS);
    }
    
    // Save back to localStorage
    localStorage.setItem('commandHistory', JSON.stringify(history));
    
    // Update the dropdown
    updateHistoryDropdown();
  }

  // Function to create and update history dropdown
  function updateHistoryDropdown() {
    const navBar = document.querySelector(NAV_BAR_SELECTOR);
    if (!navBar) {
      console.error('Navigation bar not found for history dropdown.');
      return;
    }

    // Remove existing dropdown if present
    const existingDropdown = document.getElementById('command-history-dropdown');
    if (existingDropdown) {
      existingDropdown.remove();
    }
    
    const history = getCommandHistory();
    
    // If no history, don't create dropdown
    if (history.length === 0) return;
    
    // Create select element (dropdown)
    const select = document.createElement('select');
    select.id = 'command-history-dropdown';

    // Add a default placeholder option
    const placeholderOption = document.createElement('option');
    placeholderOption.value = "";
    placeholderOption.textContent = "Histórico...";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    select.appendChild(placeholderOption);
    
    // Add each command as an option
    history.forEach(cmd => {
      const option = document.createElement('option');
      option.value = cmd;
      // Truncate long commands for display
      option.textContent = cmd.length > 30 ? cmd.substring(0, 27) + '...' : cmd;
      option.title = cmd; // Show full command on hover
      select.appendChild(option);
    });
    
    // Add event listener to populate input on selection
    select.addEventListener('change', function() {
      const selectedCommand = this.value;
      const input = document.querySelector(INPUT_SELECTOR);
      if (input && selectedCommand) {
        input.value = selectedCommand;
        input.focus();
        // Reset dropdown to placeholder
        this.selectedIndex = 0;
      }
    });
    
    // Append dropdown to the navigation bar
    const cloudButtons = navBar.querySelector('.cloud-sync-buttons');
    if (cloudButtons && cloudButtons.parentNode === navBar) {
      // Insert after cloud buttons if they exist
      cloudButtons.after(select);
    } else {
      // Fallback: append at the end if cloud buttons aren't found directly in navbar
      navBar.appendChild(select);
    }
  }

  // Initial display
  updateHistoryDropdown();

  // Expose globally for other scripts (like input-parser)
  // window.saveCommandToHistory = saveCommand;
  window.updateHistoryDisplay = updateHistoryDropdown; // Expose update function if needed elsewhere

}); 