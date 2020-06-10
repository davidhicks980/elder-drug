import { PipeTransform, Pipe } from '@angular/core';
@Pipe({ name: 'CaseSplit' })
export class CaseSplitPipe implements PipeTransform {
  transform(str: string) {
    let newstr = str.replace(/([A-Z])/g, ' $1').trim();
    return newstr;
  }
}
