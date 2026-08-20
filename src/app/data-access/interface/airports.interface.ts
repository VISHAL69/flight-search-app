import { FlightInfo } from "./flight-Info.interface";

export interface Airport {
  id: number;
  iataCode: string;   // e.g. 'BOM' — unique, good as the ngValue / option value
  name: string;       // full airport name
  city: string;
  country: string;
  countryCode: string; // ISO 3166-1 alpha-2
  timezone: string;    // IANA tz
}

export interface SearchCriteria {
  from: string;
  to: string;
  departureDate: string;
  returnDate: string | null;
  passengers: number;
}

export interface FilterCriteria {
  maxPrice: number | null;
  stops: number[];
  airlines: string[];
}

export interface SearchFormValue {
  from: string | null;
  to: string | null;
  departureDate: Date | null;
  returnDate: Date | null;
  passengers: number;
}

export type RequestState = 'idle' | 'loading' | 'success' | 'error';


export interface RawSearchResult {
  state: RequestState;
  flights: FlightInfo[];
}

export interface SearchViewModel {
  state: RequestState;
  flights: FlightInfo[];
  allFlights: FlightInfo[];
}