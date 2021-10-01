import { Subject } from 'rxjs';

import { ScrollDirection } from './layout.component';

export function scrollDirectionCb(subject: Subject<ScrollDirection>) {
  let previousY = 0;
  return (entries: IntersectionObserverEntry[]) => {
    console.log(entries);
    const direction =
      entries[0].boundingClientRect.y < previousY ? ScrollDirection.DOWN : ScrollDirection.UP;
    subject.next(direction);
    previousY = entries[0].boundingClientRect.y;
  };
}
