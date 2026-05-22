// Input Validation Utilities

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

export const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeHTML = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateCSVFormat = (content: string): boolean => {
  const lines = content.split('\n');
  if (lines.length < 2) return false;
  
  const headerCount = lines[0].split(',').length;
  return lines.slice(1).every(line => {
    const fields = line.split(',').length;
    return fields === headerCount || line.trim() === '';
  });
};

export const validateJSONFormat = (content: string): boolean => {
  try {
    JSON.parse(content);
    return true;
  } catch {
    return false;
  }
};

export const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const validateLeadData = (lead: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!lead.companyName || typeof lead.companyName !== 'string') {
    errors.push('Company name is required');
  }

  if (!lead.industry || typeof lead.industry !== 'string') {
    errors.push('Industry is required');
  }

  if (lead.email && !validateEmail(lead.email)) {
    errors.push('Invalid email format');
  }

  if (lead.phone && !validatePhone(lead.phone)) {
    errors.push('Invalid phone format');
  }

  if (lead.website && !validateURL(lead.website)) {
    errors.push('Invalid website URL');
  }

  if (lead.score !== undefined && (typeof lead.score !== 'number' || lead.score < 0 || lead.score > 100)) {
    errors.push('Score must be between 0 and 100');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};
