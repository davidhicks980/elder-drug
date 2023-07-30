export function dedupeByField<T extends {}>(list: T[], field: string | number) {
  let cache = {};
  return list?.filter((item) => {
    if (typeof item[field] === 'string' || typeof item[field] === 'number') {
      if (!cache[item[field] as string | number | symbol]) {
        cache[item[field] as string | number | symbol] = true;
        return item;
      }
    } else {
      throw TypeError('[dedupeByField] dedupe field must be of type string or number');
    }
  });
}
