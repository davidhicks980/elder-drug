import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appendunit',
})
export class AppendPipe implements PipeTransform {
  transform(value: any, appendage: string) {
    if (appendage) {
      return `${value} ${appendage}`;
    } else {
      return value;
    }
  }
}
