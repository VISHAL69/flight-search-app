import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'flightDuration'
})
export class FlightDurationPipe implements PipeTransform {

   transform(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

}
