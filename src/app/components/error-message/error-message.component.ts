import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { matFormFieldAnimations } from '@angular/material/form-field';
import { BehaviorSubject, Observable } from 'rxjs';

export enum ErrorType {
  WARNING = 'warn',
  ERROR = 'error',
  NONE = 'none',
}
type ErrorState = {
  name: string;
  message: string;
  type: ErrorType;
};

@Component({
  selector: 'elder-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [matFormFieldAnimations.transitionMessages],
})
export class ErrorMessageComponent {
  private nullError = { type: ErrorType.NONE, message: '', name: 'nullError' };
  private errors_: Record<string, string>;
  private messageSource: BehaviorSubject<ErrorState>;
  @HostBinding('class.is-warning') get isWarning() {
    return this.messageSource.value.type === ErrorType.WARNING;
  }
  @HostBinding('class.is-error') get isError() {
    return this.messageSource.value.type === ErrorType.ERROR;
  }
  @Input() showIcon: boolean = false;
  @Input() errorMessages: Record<string, string> = {};
  @Input() warningMessages: Record<string, string> = {};
  @Input()
  get errors(): Record<string, string> {
    return this.errors_;
  }
  set errors(value: Record<string, string> | undefined) {
    if (value) {
      this.errors_ = value;
      this.displayMessage(this.errors_);
    } else {
      this.displayMessage(this.nullError);
    }
  }
  message$: Observable<ErrorState>;

  get isShown() {
    return this.messageSource.value.type != ErrorType.NONE;
  }
  ngOnDestroy() {
    this.messageSource.complete();
  }
  displayMessage(errors: Record<string, string>) {
    const errorList = Array.from(Object.entries(errors));
    if (errorList?.length) {
      const [name] = errorList[0];
      let type = ErrorType.ERROR,
        message = '';
      if (this.errorMessages[name]) {
        type = ErrorType.ERROR;
        message = this.errorMessages[name];
      } else if (this.warningMessages[name]) {
        type = ErrorType.WARNING;
        message = this.warningMessages[name];
      } else {
        type = ErrorType.NONE;
      }
      this.messageSource.next({ name, message, type });
    }
  }
  constructor() {
    this.messageSource = new BehaviorSubject({
      name: '',
      message: '',
      type: ErrorType.ERROR,
    });
    this.message$ = this.messageSource.asObservable();
  }
}
