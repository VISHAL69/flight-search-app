import { inject, Injectable } from '@angular/core';
import { FlightService } from './flight.service';
import { FilterCriteria, RawSearchResult, SearchCriteria, SearchFormValue, SearchViewModel } from '../interface/airports.interface';
import { BehaviorSubject, catchError, combineLatest, map, of, shareReplay, startWith, Subject, switchMap } from 'rxjs';
import { DEFAULT_SEARCH_FORM_VALUE, NO_FILTERS } from '../models/flight-form-default-data.constants';
import { FlightInfo } from '../interface/flight-Info.interface';

@Injectable({
  providedIn: 'root',
})
export class SearchFlightService {
  private readonly flightService = inject(FlightService);
  formValue: SearchFormValue = DEFAULT_SEARCH_FORM_VALUE;
    
  private readonly searchSubject = new Subject<SearchCriteria>();
  private readonly filtersSubject = new BehaviorSubject<FilterCriteria>(NO_FILTERS);


  private readonly searchResult$ = this.searchSubject.pipe(
    switchMap((criteria) =>
      this.flightService.searchFlights(criteria).pipe(
        map((flights): RawSearchResult => ({ state: 'success', flights })),
        startWith<RawSearchResult>({ state: 'loading', flights: [] }),
        catchError(() => of<RawSearchResult>({ state: 'error', flights: [] }))
      )
    ),
    startWith<RawSearchResult>({ state: 'idle', flights: [] }),
    shareReplay(1)
  );

   readonly viewModel$ = combineLatest([this.searchResult$, this.filtersSubject]).pipe(
    map(
      ([result, filters]): SearchViewModel => ({
        state: result.state,
        flights: this.applyFilters(result.flights, filters),
        allFlights: result.flights,
      })
    ),
    shareReplay(1)
  );
  
   search(criteria: SearchCriteria): void {
    // this.lastCriteria = criteria;
    this.filtersSubject.next(NO_FILTERS);
    this.searchSubject.next(criteria);
  }

   updateFilters(filters: FilterCriteria): void {
    this.filtersSubject.next(filters);
  }

   private applyFilters(flights: FlightInfo[], filters: FilterCriteria): FlightInfo[] {
    return flights.filter((flight) => {
      const priceOk = filters.maxPrice === null || flight.price <= filters.maxPrice;
      const stopsOk = filters.stops.length === 0 || filters.stops.includes(flight.stops);
      const airlineOk = filters.airlines.length === 0 || filters.airlines.includes(flight.airline);
      return priceOk && stopsOk && airlineOk;
    });
  }

   get currentFilters(): FilterCriteria {
    return this.filtersSubject.value;
  }
}


