import termExistsInDatabase from './absent-term.validator';
import uniqueTerms from './duplicate.validator';
import maxArrayLength from './limit-term-count.validator';

export const CustomValidators = {
  sync: {
    maxArrayLength,
    uniqueTerms,
  },
  async: {
    termExistsInDatabase,
  },
};
