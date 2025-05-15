export type ValidationRule = {
  test: (value: any) => boolean;
  message: string;
};

export type ValidationRules = {
  [key: string]: ValidationRule[];
};

export const validateField = (value: any, rules: ValidationRule[]): string | null => {
  for (const rule of rules) {
    if (!rule.test(value)) {
      return rule.message;
    }
  }
  return null;
};

export const commonValidationRules = {
  required: {
    test: (value: any) => value !== undefined && value !== null && value !== '',
    message: 'Ce champ est requis',
  },
  email: {
    test: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Adresse email invalide',
  },
  minLength: (min: number): ValidationRule => ({
    test: (value: string) => value.length >= min,
    message: `Minimum ${min} caractères requis`,
  }),
  maxLength: (max: number): ValidationRule => ({
    test: (value: string) => value.length <= max,
    message: `Maximum ${max} caractères autorisés`,
  }),
  numeric: {
    test: (value: string) => /^\d+$/.test(value),
    message: 'Seuls les chiffres sont autorisés',
  },
  price: {
    test: (value: number) => value > 0 && /^\d+(\.\d{1,2})?$/.test(value.toString()),
    message: 'Prix invalide',
  },
};