document.addEventListener('DOMContentLoaded', function() {
  // Apply subtle hover effects to buttons
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', createRippleEffect);
  });

  // Add focus indicators to interactive elements
  enhanceInputFocus();
  
  // Add subtle parallax effect to tables
  addTableParallax();
  
  // Enhance editable cells with visual indicators
  enhanceEditableCells();
  
  // Add minimal loading transitions
  addLoadingTransitions();
});

// Create ripple effect on button click
function createRippleEffect(e) {
  const button = e.currentTarget;
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.classList.add('ripple');
  
  const existingRipple = button.querySelector('.ripple');
  if (existingRipple) {
    existingRipple.remove();
  }
  
  button.appendChild(ripple);
  
  // Add ripple styles if not already in document
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      button { position: relative; overflow: hidden; }
      .ripple {
        position: absolute;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      }
      @keyframes ripple {
        to { transform: scale(2); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

// Enhance input focus with subtle highlight effects
function enhanceInputFocus() {
  const inputs = document.querySelectorAll('input, [contenteditable="true"]');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.closest('div, td')?.classList.add('focused-parent');
    });
    
    input.addEventListener('blur', () => {
      input.closest('div, td')?.classList.remove('focused-parent');
    });
  });
  
  // Add focus styles
  if (!document.getElementById('focus-style')) {
    const style = document.createElement('style');
    style.id = 'focus-style';
    style.textContent = `
      .focused-parent {
        box-shadow: 0 0 0 2px rgba(42, 42, 42, 0.15);
        transition: box-shadow 0.3s ease;
      }
    `;
    document.head.appendChild(style);
  }
}

// Add subtle parallax effect to tables
function addTableParallax() {
  const table = document.querySelector('table');
  if (!table) return;
  
  document.addEventListener('mousemove', e => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    // Subtle shadow movement based on mouse position
    const shadowX = 20 * (0.5 - mouseX);
    const shadowY = 20 * (0.5 - mouseY);
    table.style.boxShadow = `
      ${shadowX}px ${shadowY}px 30px rgba(0, 0, 0, 0.25),
      0 1px 0 rgba(255, 255, 255, 0.2) inset
    `;
  });
}

// Enhance editable cells with visual indicators
function enhanceEditableCells() {
  const editableCells = document.querySelectorAll('[contenteditable="true"]');
  
  editableCells.forEach(cell => {
    // Add edit indicator
    const indicator = document.createElement('span');
    indicator.classList.add('edit-indicator');
    cell.appendChild(indicator);
    
    // Show clear visual feedback when cell content changes
    const originalContent = cell.textContent;
    cell.addEventListener('input', () => {
      if (cell.textContent !== originalContent) {
        cell.classList.add('content-changed');
      } else {
        cell.classList.remove('content-changed');
      }
    });
    
    // Auto-select all text when focused
    cell.addEventListener('focus', () => {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(cell);
      selection.removeAllRanges();
      selection.addRange(range);
    });
  });
  
  // Add indicator styles
  if (!document.getElementById('edit-indicator-style')) {
    const style = document.createElement('style');
    style.id = 'edit-indicator-style';
    style.textContent = `
      [contenteditable="true"] {
        position: relative;
      }
      .edit-indicator {
        position: absolute;
        top: 0;
        right: 0;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 8px 8px 0;
        border-color: transparent rgba(42, 42, 42, 0.3) transparent transparent;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      [contenteditable="true"]:hover .edit-indicator {
        opacity: 1;
      }
      .content-changed {
        background-color: rgba(240, 240, 240, 0.5);
      }
    `;
    document.head.appendChild(style);
  }
}

// Add minimal loading transitions
function addLoadingTransitions() {
  const mainElements = document.querySelectorAll('table, h1, div:first-of-type');
  
  // Stagger animations for a more professional effect
  mainElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.animation = `fadeIn 0.4s ease-out ${index * 0.15}s forwards`;
  });
  
  // Add animation styles if not present
  if (!document.getElementById('loading-style')) {
    const style = document.createElement('style');
    style.id = 'loading-style';
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }
} 