export const buildThresholdArray = (size: number) =>
  [...Array(size)].map((_, i) => (1 / size) * i);
