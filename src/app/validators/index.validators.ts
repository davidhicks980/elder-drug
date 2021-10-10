import termExistsInDatabase from './absent-term.validator';
import { uniqueArrayTerm, uniqueTerms } from './duplicate.validator';
import maxArrayLength from './limit-term-count.validator';

export const CustomValidators = {
  sync: {
    maxArrayLength,
    uniqueTerms,
    uniqueArrayTerm,
  },
  async: {
    termExistsInDatabase,
  },
};
