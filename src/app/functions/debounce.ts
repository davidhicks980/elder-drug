export function debounce(fn: (...args) => void, wait: number) {
  let block = false;
  return function () {
    let context = this;
    if (block) return;
    block = true;
    setTimeout(() => {
      fn.apply(context, arguments);
      block = false;
    }, wait);
  };
}
export function debounceOnMicrotask(fn: (...args) => void) {
  let block = false;
  return function () {
    let context = this;
    if (block) return;
    block = true;
    requestAnimationFrame(() => {
      fn.apply(context, arguments);
    });
  };
}
