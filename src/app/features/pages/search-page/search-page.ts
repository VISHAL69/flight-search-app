import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SearchForms } from '../../components/search-forms/search-forms';
import { FilterCriteria, SearchCriteria } from '../../../data-access/interface/airports.interface';
import { SearchFlightService } from '../../../data-access/service/search-flight.service';
import { Router } from '@angular/router';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { FlightList } from '../../components/flight-list/flight-list';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { ErrorBanner } from '../../../shared/components/error-banner/error-banner';
import { FilterPanel } from '../../components/filter-panel/filter-panel';

@Component({
  selector: 'app-search-page',
  imports: [SearchForms, AsyncPipe, FlightList, ErrorBanner, LoadingSpinner, FilterPanel], 
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPage {

  private readonly state = inject(SearchFlightService);
  private readonly router = inject(Router);

  readonly viewModel$ = this.state.viewModel$;
  readonly initialFilters: FilterCriteria = this.state.currentFilters;

  onSearch(formPayload: SearchCriteria){
    console.log(formPayload);
    
    this.state.search(formPayload);
  }

  onFiltersChange(filters: FilterCriteria): void {
    this.state.updateFilters(filters);
  }

  onViewDetails(flightId: string): void {
    this.router.navigate(['/flights', flightId]);
  }
}
