// CivicCare encryption utilities - demo purposes only
export function encryptPassword(password: string): string {
  // Simple placeholder encryption (demo only)
  return btoa(password);
}

export function validatePassword(password: string): boolean {
  // Basic password validation
  return password.length >= 6;
}

export function validateAadhaar(aadhaar: string): boolean {
  // Basic Aadhaar validation (demo purposes)
  return /^\d{12}$/.test(aadhaar.replace(/\s/g, ''));
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return /^\d{10}$/.test(phone.replace(/\D/g, ''));
}