import { FilterCriteria, SearchFormValue } from "../interface/airports.interface";

export const NO_FILTERS: FilterCriteria = { maxPrice: null, airlines: [], stops: [] };

export const DEFAULT_SEARCH_FORM_VALUE: SearchFormValue = {
  from: null,
  to: null,
  departureDate: null,
  returnDate: null,
  passengers: 1,
};