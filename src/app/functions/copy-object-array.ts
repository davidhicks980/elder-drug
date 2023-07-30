export function copyObjectArray<T extends {}>(array: T[]) {
  return array.map((item) => ({ ...item }));
}
