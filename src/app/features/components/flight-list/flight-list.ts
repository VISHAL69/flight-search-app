import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FlightInfo } from '../../../data-access/interface/flight-Info.interface';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { StopsSeverityPipe } from '../../pipes/stops-severity-pipe';
import { FlightDurationPipe } from '../../pipes/flight-duration-pipe';

@Component({
  selector: 'app-flight-list',
  imports: [CardModule, ButtonModule, TagModule, DecimalPipe, StopsSeverityPipe, FlightDurationPipe, DatePipe],
  templateUrl: './flight-list.html',
  styleUrl: './flight-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlightList {
 @Input() flights: FlightInfo[] = [];
  @Output() viewDetails = new EventEmitter<string>();

  stopsLabel(stops: number): string {
    return stops === 0 ? 'Non-stop' : stops === 1 ? '1 stop' : `${stops} stops`;
  }

}

