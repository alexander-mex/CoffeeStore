export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Пароль має бути не менше 8 символів");
  }

  if (!/[a-zA-Z]/.test(password)) {
    errors.push("Пароль має містити хоча б одну літеру");
  }

  if (!/\d/.test(password)) {
    errors.push("Пароль має містити хоча б одну цифру");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Пароль має містити хоча б один спеціальний символ");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
