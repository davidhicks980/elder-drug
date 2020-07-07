import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toString',
})
export class ToStringPipe implements PipeTransform {
  transform(field: any) {
    if (Number.isInteger(field) === true && field != undefined) {
      return field.toString();
    } else {
      return field;
    }
  }
}
