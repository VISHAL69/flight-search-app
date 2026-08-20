import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stopsSeverity'
})
export class StopsSeverityPipe implements PipeTransform {

  transform(stops: number): 'success' | 'warn' | 'danger' {
    if (stops === 0) return 'success';
    if (stops === 1) return 'warn';
    return 'danger';
  }

}
