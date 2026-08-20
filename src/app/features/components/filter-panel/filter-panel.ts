import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { FilterCriteria } from '../../../data-access/interface/airports.interface';
import { FlightInfo } from '../../../data-access/interface/flight-Info.interface';

@Component({
  selector: 'app-filter-panel',
  imports: [
    FormsModule,
    CardModule,
    CheckboxModule,
    InputNumberModule,
    ButtonModule,
    DividerModule,
  ],
  templateUrl: './filter-panel.html',
  styleUrl: './filter-panel.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class FilterPanel {
  @Input({ required: true }) flights: FlightInfo[] = [];
  @Input() initialFilters: FilterCriteria | null = null;
  @Output() filtersChange = new EventEmitter<FilterCriteria>();

  maxPrice: number | null = null;
  selectedAirlines: string[] = [];
  selectedStops: number[] = [];
  readonly stopOptions = [0, 1, 2];
  availableAirlines: string[] = [];


   ngOnChanges(changes: SimpleChanges): void {
    this.availableAirlines = [...new Set(this.flights.map((flight) => flight.airline))].sort();

    if (changes['flights']) {
      if (changes['flights'].firstChange) {
        // this.restoreInitialFilters();
      } else {
        this.resetSelections();
      }
    }
  }

   onPriceChange(value: number | null): void {
    this.maxPrice = value;
    this.emitChange();
  }

  onAirlineToggle(airline: string, checked: boolean): void {
    this.selectedAirlines = checked
      ? [...this.selectedAirlines, airline]
      : this.selectedAirlines.filter((item) => item !== airline);
    this.emitChange();
  }

  onStopToggle(stops: number, checked: boolean): void {
    this.selectedStops = checked
      ? [...this.selectedStops, stops]
      : this.selectedStops.filter((item) => item !== stops);
    this.emitChange();
  }

 stopLabel(stops: number): string {
    return stops === 0 ? 'Non-stop' : stops === 1 ? '1 stop' : `${stops} stops`;
  }

   onReset(): void {
    this.resetSelections();
    this.emitChange();
  }

  private resetSelections(): void {
    this.maxPrice = null;
    this.selectedAirlines = [];
    this.selectedStops = [];
  }

  private emitChange(): void {
    this.filtersChange.emit({
      maxPrice: this.maxPrice,
      airlines: this.selectedAirlines,
      stops: this.selectedStops,
    });
  }
}
