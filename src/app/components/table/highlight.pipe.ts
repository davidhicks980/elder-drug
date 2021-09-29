import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(value: string | number, filterString: string): SafeHtml {
    if (filterString?.length) {
      value = typeof value === 'number' ? String(value) : value;
      const filter = RegExp(`(${filterString})`, 'gi');
      console.log(filter);
      if (typeof value === 'string' && filter.test(value)) {
        return this.sanitizer.bypassSecurityTrustHtml(
          value.replace(
            filter,
            '<span style="background-color: #ffe800; font-weight:500">$1</span>'
          )
        );
      }
    }
    return value;
  }
}
