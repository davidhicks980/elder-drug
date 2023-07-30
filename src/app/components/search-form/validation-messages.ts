export const errorValidationMessages: Record<string, string> = {
  duplicate: `Drug has already been entered.`,
  minlength: `Drug names must be at least 3 characters.`,
  maxlength: `Drug names should be fewer than 70 characters.`,
  pattern: `Drug names can only contain letters and numbers.`,
};
export const warningValidationMessages: Record<string, string> = {
  termabsent: `Only drugs from the dropdown menu have guidance.`,
};
