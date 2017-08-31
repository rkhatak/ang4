import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl'
})
export class SafePipe implements PipeTransform {
constructor(public sanitizer: DomSanitizer) {}
  transform(value: string, args: string[]): any {
    if (!value) return value;
    return this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }

}