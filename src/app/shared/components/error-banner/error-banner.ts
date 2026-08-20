import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-error-banner',
  imports: [MessageModule, ButtonModule],
  templateUrl: './error-banner.html',
  styleUrl: './error-banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class ErrorBanner {
 @Input() message = 'Something went wrong. Please try again.';
  @Output() retry = new EventEmitter<void>();
}
