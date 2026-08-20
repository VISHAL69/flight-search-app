import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, Output } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AIRPORTS } from '../../../data-access/models/flights-dropdown-data.constants';
import { SearchCriteria } from '../../../data-access/interface/airports.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchFlightService } from '../../../data-access/service/search-flight.service';
import { Subject, takeUntil } from 'rxjs';
import { differentAirportsValidator, returnAfterDepartureValidator } from '../../validators/search-form-validators';
@Component({
  selector: 'app-search-forms',
  imports: [
    ReactiveFormsModule,
    SelectModule,
    DatePickerModule,
    InputNumberModule,
    ButtonModule,
    MessageModule,
  ],
  templateUrl: './search-forms.html',
  styleUrl: './search-forms.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchForms {
  @Output() search = new EventEmitter<SearchCriteria>();
  private readonly stateService = inject(SearchFlightService);


  readonly cityOptions = AIRPORTS;
  private readonly fb = new FormBuilder();
  private destroy$ = new Subject<void>();
  
  readonly form = this.fb.group(
    {
      from: this.fb.control<string | null>(null, [Validators.required]),
      to: this.fb.control<string | null>(null, [Validators.required]),
      departureDate: this.fb.control<Date | null>(new Date(), [Validators.required]),
      returnDate: this.fb.control<Date | null>(null),
      passengers: this.fb.control(1, [Validators.required, Validators.min(1), Validators.max(9)]),
    },
    {
      validators: [
        differentAirportsValidator('from', 'to'),
        returnAfterDepartureValidator('departureDate', 'returnDate'),
      ],
    }
  );

  createPayload() {
    const value = this.form.value;
    return {
      from: (value.from ?? '').toUpperCase(),
      to: (value.to ?? '').toUpperCase(),
      departureDate: this.toIsoDate(value.departureDate) ?? '',
      returnDate: this.toIsoDate(value.returnDate),
      passengers: Number(value.passengers),
    };
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.search.emit(this.createPayload());
  }

  private toIsoDate(date: Date | null | undefined): string | null {
    if (!date) {
      return null;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  }

  maintainFormState() {
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.stateService.formValue = {
        from: value.from ?? null,
        to: value.to ?? null,
        departureDate: value.departureDate ?? null,
        returnDate: value.returnDate ?? null,
        passengers: value.passengers ?? 1,
      };
    });
  }

  ngOnInit() {
    this.form.patchValue(this.stateService.formValue);
    this.maintainFormState();
  }

   ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete(); // Cleans up the subject itself
  }
}
