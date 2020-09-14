import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'caseSplit',
})
export class caseSplitPipe implements PipeTransform {
  transform(str: string) {
    if (str && str.length > 0 && str != undefined) {
      const newstr = str.replace(/([A-Z])/g, ' $1').trim();
      return newstr;
    }
  }
}