import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SearchCriteria } from '../interface/airports.interface';
import { delay, map, Observable } from 'rxjs';
import { FlightInfo } from '../interface/flight-Info.interface';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
   private readonly http = inject(HttpClient);
  private readonly mockDataUrl = 'mock/flights.json';


   searchFlights(criteria: SearchCriteria): Observable<FlightInfo[]> {
    return this.http.get<FlightInfo[]>(this.mockDataUrl).pipe(
      delay(600),
      map((flights) => flights.filter((flight) => this.matchesRoute(flight, criteria)))
    );
  }

  getFlightById(id: string): Observable<FlightInfo | undefined> {
    return this.http
      .get<FlightInfo[]>(this.mockDataUrl)
      .pipe(map((flights) => flights.find((flight) => flight.id === id)));
  }

  private matchesRoute(flight: FlightInfo, criteria: SearchCriteria): boolean {
    const fromMatches = flight.from.toLowerCase() === criteria.from.toLowerCase();
    const toMatches = flight.to.toLowerCase() === criteria.to.toLowerCase();
    console.log(fromMatches && toMatches);
    
    return fromMatches && toMatches;
  }
}
