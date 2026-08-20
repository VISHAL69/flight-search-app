# Flight Search Application

This is my submission for the "Angular Task – REST API Integration" exercise — a flight search app where you pick a route, dates, and passenger count, search, filter the results, and drill into a flight for more detail.

I've tried to build this the way I'd approach a real feature at work rather than just a demo — typed reactive forms, a proper RxJS pipeline instead of manual subscriptions, and a folder structure that scales past a single feature.

## Setup Instructions

**You'll need:** Node.js 20+ and npm 10+

```bash
git clone <repository-url>
cd flight-search-app
npm install
npm start
```

Then open `http://localhost:4200`. There's nothing else to configure — no `.env` file, no API key — the app talks to a static mock JSON file instead of a real backend (more on that below).

**To build for production:**
```bash
npm run build
```
This drops the build in `dist/flight-search-app`.

## Technologies Used

| Area | Choice |
|---|---|
| Framework | Angular 20 — standalone components, no NgModules |
| Language | TypeScript, strict mode |
| Forms | Reactive Forms, typed controls, cross-field validators |
| Async/State | RxJS — `switchMap`, `combineLatest`, `Subject`/`BehaviorSubject` |
| UI Library | PrimeNG 20 (Aura theme) + PrimeFlex utilities + PrimeIcons |
| Routing | Angular Router, lazy-loaded standalone routes |
| Change Detection | `OnPush` across the board |
| HTTP | `HttpClient` via `provideHttpClient()` |

I went with PrimeNG rather than styling everything by hand mainly for the form controls — a searchable select, a proper date picker, a number stepper — all accessible and tested out of the box, plus PrimeFlex gives me the same utility-class workflow Bootstrap does without dragging in a JS bundle I don't need.

## API Details

There's no real backend here. `FlightService` reads a static JSON file at `public/mock/flights.json` through `HttpClient`, with a small artificial delay (600ms) added on purpose so the loading state is actually visible instead of flashing by instantly. It still goes through the real `HttpClient` + RxJS + error-handling path, so swapping in a real API later is just a URL change, not a rewrite.

The mock data has 20 flights spread across 8 Indian domestic routes — Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, and Goa. The From/To dropdowns, on the other hand, are backed by a bigger airport reference list (30 airports, India plus a handful of major international hubs) — I've explained why those two don't fully overlap in the Assumptions section below.

**What the service exposes:**
- `searchFlights(criteria: SearchCriteria): Observable<Flight[]>` — fetches everything, filters down to matching `from`/`to` codes
- `getFlightById(id: string): Observable<Flight | undefined>` — backs the details page

## Key Implementation Decisions

**Standalone components, lazy-loaded routes.** Both `search` and `flights/:id` load via `loadComponent()` rather than being eagerly bundled — keeps the initial payload smaller and is the direction Angular's pushing over NgModule-based lazy loading anyway.

**The search and filter flow is built on RxJS, not manual `.subscribe()` calls.** Submitting the form pushes a `SearchCriteria` into a `Subject`, which feeds a `switchMap` into the HTTP call — so if you fire off a second search before the first one resolves, the first gets cancelled instead of both racing each other. Filters live in their own `BehaviorSubject` and get combined with the search results via `combineLatest`, which means toggling a filter never re-hits the API — it just re-derives what's visible from data already in hand. Loading/error/success states are modeled directly in that same stream (`startWith`/`catchError`) rather than as separate booleans scattered around, so the UI can't end up in a weird half-loading-half-error state.

**Search state — form values, results, and filters — survives navigating to the details page and back.** This was a deliberate addition: nobody wants to re-pick their route and dates just because they clicked into a flight to check the details. That state now lives in a root-provided service rather than the search page component, so it outlives the page being destroyed when you navigate away, and comes right back when you return.

**Typed reactive forms with validators that actually span fields.** I used `FormBuilder.nonNullable` with explicit generics per control, plus two custom validators — one to stop you picking the same airport twice, another to catch a return date before the departure date — both living at the form-group level since neither makes sense checking a single field in isolation.

**Folder structure is feature-first, and there's a reason for the `data-access` name specifically** — it's meant to signal "the stuff this app talks to and models," not just "misc backend-y things":
```
data-access/
  interface/     → domain interfaces (Flight, SearchCriteria, etc.)
  models/        → static reference data (the airport list)
  services/      → flightService (HTTP), search-flight-service (search/filter orchestration + persisted state)
features/
  components/    → search-form, flight-list, filters-panel
  pages/         → search-page, detail-page
  pipes/         → flight-duration-pipe, stops-severity-pipe
  validators/    → search-form-validator
shared/
  components/    → loading-spinner, error-banner (nothing flight-specific — genuinely reusable UI only)
```
Splitting the service in two — `flightService` for the raw HTTP boundary and `search-flight-service` for orchestration and state — keeps "talk to the API" and "manage what the UI is currently showing" from turning into one bloated file. Anything genuinely reusable across a future feature belongs in `shared/`; everything else stays scoped to `features/`, so the feature could be deleted or pulled into its own library without a scavenger hunt through the rest of the app.

**`OnPush` everywhere**, set as an `angular.json` schematics default rather than something I have to remember per component. Paired with observables through the `async` pipe and never mutating arrays in place, I never needed a manual `markForCheck()` anywhere.

**Details page is a route, not a modal.** Went with `/flights/:id` specifically because the task calls out Angular Routing as something to demonstrate — the flight ID resolves reactively off `ActivatedRoute.paramMap` through a `switchMap`.

## Assumptions Made

- **No real backend** — a static JSON file stands in, which the task explicitly allows ("you may use a public/mock API or create mock JSON data with a local API").
- **The airport dropdown is bigger than what the mock data actually covers.** You can select any of 30 airports, but only the 8 Indian cities have real mock flights between them. Searching a route outside that set correctly shows the "no flights found" empty state rather than erroring — that's intentional, and mirrors what a real search would do for a route with no available flights, not a bug.
- **No login or accounts** — wasn't in scope for this task.
- **Route matching is exact** on IATA code — no fuzzy or partial matching.
- **No automated tests included**, by explicit choice to keep the time box focused on the core implementation.
- **Prices are in INR (₹)** throughout, matching the domestic-route mock data.
