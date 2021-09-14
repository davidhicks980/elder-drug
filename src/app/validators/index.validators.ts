import maxArrayLength from './limit-term-count.validator';
import uniqueTerms from './prevent-duplicates.validator';
import termExistsInDatabase from './term-in-db.validator';

export const CustomValidators = {
  sync: {
    maxArrayLength,
    uniqueTerms,
  },
  async: {
    termExistsInDatabase,
  },
};
