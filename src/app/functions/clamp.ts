/** Clamps a number between zero and a maximum. */
export function clamp(value: number, max: number): number {
  return Math.max(0, Math.min(max, value));
}
