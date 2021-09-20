import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
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
})
export class ErrorMessageComponent {
  private _errors: Record<string, string>;
  @HostBinding('class.is-warning') get isWarning() {
    return this.messageSource.value.type === ErrorType.WARNING;
  }
  @HostBinding('class.is-error') get isError() {
    return this.messageSource.value.type === ErrorType.ERROR;
  }
  @Input('show-icon') showIcon: boolean = false;
  @Input('error-messages') errorMessages: Record<string, string> = {};
  @Input('warning-messages') warningMessages: Record<string, string> = {};
  @Input()
  get errors(): Record<string, string> {
    return this._errors;
  }
  set errors(value: Record<string, string> | undefined) {
    console.log(value);
    if (value) {
      this._errors = value;
      this.displayMessage(this._errors);
    } else {
      this.displayMessage(this._nullError);
    }
  }
  private _nullError = { type: ErrorType.NONE, message: '', name: 'nullError' };
  messageSource: BehaviorSubject<ErrorState>;
  message$: Observable<ErrorState>;
  noErrors: boolean;

  get isShown() {
    return this.messageSource.value.type != ErrorType.NONE;
  }
  ngOnDestroy() {
    this.messageSource.complete();
  }
  displayMessage(errors: Record<string, string>) {
    const errorArr = Array.from(Object.entries(errors));
    if (errorArr?.length) {
      const [name] = errorArr[0];
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
    this.messageSource.subscribe(console.log);
  }
}
