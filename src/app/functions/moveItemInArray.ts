import { clamp } from './clamp';

/**
 * Same as Google's function, except returns a copy. Moves an item one index in an array to another.
 *
 * @param array Array in which to move the item.
 * @param fromIndex Starting index of the item.
 * @param toIndex Index to which the item should be moved.
 */
export function moveItemInCopiedArray<T extends { position: number }>(
  array: T[],
  fromIndex: number,
  toIndex: number
): T[] {
  const from = clamp(fromIndex, array.length - 1);
  const to = clamp(toIndex, array.length - 1);
  let copy = array.map((item) => ({ ...item }));
  if (from === to) {
    return;
  }
  const target = array[to];
  const delta = to < from ? -1 : 1;
  for (let i = from; i !== to; i += delta) {
    copy[i].position = array[i].position + delta;
  }
  copy[to] = target;
  return copy;
}
