export function parseNameFromEmail(email: string): string {
    if (!email || !email.includes('@')) {
      return '';
    }
  
    // Extract the part before the @ symbol
    const localPart = email.split('@')[0];
  
    // Handle different email formats
    let nameParts: string[];
  
    // Check for periods (e.g., john.doe@example.com)
    if (localPart.includes('.')) {
      nameParts = localPart.split('.');
    }
    // Check for underscores (e.g., john_doe@example.com)
    else if (localPart.includes('_')) {
      nameParts = localPart.split('_');
    }
    // Check for hyphens (e.g., john-doe@example.com)
    else if (localPart.includes('-')) {
      nameParts = localPart.split('-');
    }
    // Handle numeric suffixes (e.g., johndoe123@example.com)
    else {
      // Remove any numeric characters from the end
      const cleanedPart = localPart.replace(/\d+$/, '');
      
      // Try to split by capital letters (e.g., JohnDoe@example.com)
      if (/[A-Z]/.test(cleanedPart) && cleanedPart !== cleanedPart.toUpperCase()) {
        nameParts = cleanedPart
          .replace(/([A-Z])/g, ' $1')  // Add space before capitals
          .trim()                      // Remove leading space
          .split(' ');
      } else {
        // If no other patterns match, just use the cleaned local part as a single name
        nameParts = [cleanedPart];
      }
    }
  
    // Capitalize each part and join with a space
    return nameParts
      .filter(part => part.length > 0)  // Remove empty parts
      .map(part => 
        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      )
      .join(' ');
  }
  