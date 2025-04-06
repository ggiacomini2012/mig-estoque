document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit for the input and button to be created by input-parser.js
  setTimeout(() => {
    const input = document.querySelector('input[placeholder*="A10"]');
    const applyButton = document.querySelector('button');
    
    if (!input || !applyButton) {
      console.log('Error: Input or button not found');
      return;
    }
    
    // Function to clean input
    function cleanInput(text) {
      // Remove anything that's not a letter, number or space
      text = text.replace(/[^a-zA-Z0-9\s]/g, '');
      // Replace multiple spaces with a single space
      text = text.replace(/\s+/g, ' ');
      return text;
    }
    
    // Function to validate input format
    function validateInput(text) {
      // Return early if empty
      if (!text) {
        console.log('Empty input');
        return false;
      }
      
      const parts = text.split(' ');
      if (parts.length < 3) {
        console.log('Error: Input must have at least 2 parts');
        return false;
      }
      
      // First part should be a letter followed by number 1-10
      const firstPart = parts[0];
      const firstPartRegex = /^[a-zA-Z][1-9]$|^[a-zA-Z]10$/;
      
      if (!firstPartRegex.test(firstPart)) {
        console.log('Error: First part must be a letter followed by number 1-10');
        return false;
      }
      
      // Remaining parts should alternate between words and 3-digit codes
      let isWordExpected = true;
      
      for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        
        if (isWordExpected) {
          // Should be a word (non-numeric)
          if (/^\d+$/.test(part)) {
            console.log('Error: Expected a word, got a number:', part);
            return false;
          }
        } else {
          // Should be a 3-digit code
          if (!/^\d{3}$/.test(part)) {
            console.log('Error: Expected a 3-digit code, got:', part);
            return false;
          }
        }
        
        isWordExpected = !isWordExpected;
      }
      
      return true;
    }
    
    // Add input event listener
    input.addEventListener('input', function() {
      // Clean the input first
      const cleanedText = cleanInput(input.value);
      
      // Apply the cleaned text back to the input
      if (cleanedText !== input.value) {
        input.value = cleanedText;
      }
      
      const isValid = validateInput(cleanedText);
      
      // Show/hide button based on validation
      applyButton.style.display = isValid ? '' : 'none';
    });
    
  }, 100); // Small delay to ensure input-parser.js has run
}); 