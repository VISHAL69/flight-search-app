import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, Observable, of, startWith, switchMap } from 'rxjs';
import { RequestState } from '../../../data-access/interface/airports.interface';
import { FlightInfo } from '../../../data-access/interface/flight-Info.interface';
import { FlightService } from '../../../data-access/service/flight.service';
import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ErrorBanner } from '../../../shared/components/error-banner/error-banner';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { FlightDurationPipe } from '../../pipes/flight-duration-pipe';
import { StopsSeverityPipe } from '../../pipes/stops-severity-pipe';

interface DetailsViewModel {
  state: RequestState;
  flight: FlightInfo | null;
}

@Component({
  selector: 'app-detail-page',
  imports: [AsyncPipe, DecimalPipe, CardModule, ButtonModule, TagModule ,ErrorBanner, LoadingSpinner, StopsSeverityPipe, FlightDurationPipe, DatePipe],
  templateUrl: './detail-page.html',
  styleUrl: './detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailPage {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly flightService = inject(FlightService);

readonly viewModel$ :Observable<DetailsViewModel> = this.getFlightDetails()

  getFlightDetails(){
    return this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id') ?? '';
      return this.flightService.getFlightById(id).pipe(
        map((flight) => ({ state: 'success', flight: flight ?? null }) as DetailsViewModel),
        startWith({ state: 'loading', flight: null } as DetailsViewModel),
        catchError(() => of({ state: 'error', flight: null } as DetailsViewModel))
      );
    })
  );

  }

  formatDateTime(iso: string): string {
    return new Date(iso).toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  stopsLabel(stops: number): string {
    return stops === 0 ? 'Non-stop' : `${stops} stop(s)`;
  }


  goBack(): void {
    this.router.navigate(['/search']);
  }

}
