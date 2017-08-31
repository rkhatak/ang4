import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) return value;
    if(typeof value!=='undefined' && value.length>9){
        return value.substr(0, 3) + '-' + value.substr(3, 3) + '-' + value.substr(6,4);
    }
    return value;
  }

}
