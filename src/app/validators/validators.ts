import termExistsInDatabase from './term-exists.validator';
import { uniqueArrayTerm, uniqueTerms } from './unique-term.validator';
import maxArrayLength from './max-array-length.validator';

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
