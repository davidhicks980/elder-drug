import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  bypassSanitize(text: string) {
    return this.sanitizer.bypassSecurityTrustHtml(text);
  }
  highlightString = '<span style="background-color: #ffe800; font-weight:500">$1</span>';
  transform(value: string | number, filterString: string): SafeHtml {
    if (filterString?.length) {
      value = typeof value === 'number' ? String(value) : value;
      const filter = RegExp(`(${filterString})`, 'gi');
      if (typeof value === 'string' && filter.test(value)) {
        return this.bypassSanitize(value.replace(filter, this.highlightString));
      }
    }
    return value;
  }
}
