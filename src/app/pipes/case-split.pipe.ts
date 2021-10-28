import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitcase',
})
export class CaseSplitPipe implements PipeTransform {
  transform(str: string) {
    if (str) {
      const newstr = str.replace(/([A-Z])/g, ' $1').trim();
      return newstr;
    }
  }
}
